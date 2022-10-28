let sunshine			= '#FFDC00';
let rescueorange		= '#EA5405';
let ceruleanblue		= '#008DB7';
let forestleaf			= '#008554';
let peleskyblue			= '#C2E5F9';

let powerFlag			= false;
let tool0Flag			= false;
let bedFlag				= false;
let fanFlag				= false;
let toolTempFlag		= false;
let bedTempFlag			= false;
let submenuToggle		= false;
let windowSize			= 2;
let maxWindowSize		= 3;
let panelPosition		= 1;
let maxPanelPosition	= 4;
let panel2Array			= [1, 2];
let panel4Array			= [1, 2, 3, 4];
let intervalID			= undefined;
let fileIntervalID		= undefined;
let toolTempValue		= 0;
let bedTempValue		= 0;

let windowList			= [null, 'main-window-ctrl', 'file-window-ctrl', 'manu-window-ctrl', 'temp-window-ctrl'];

let baseURL				= 'http://192.168.0.14/';
let apiKey				= '241B873D3FF8408FB95E1DB8510F81CC';

let client = new OctoPrintClient({
	baseurl:	'http://192.168.0.14/',
	apikey:		'241B873D3FF8408FB95E1DB8510F81CC'
});

let $$$ = new logMan(true, false);

if(windowSize == 1) {
	window.resizeTo(400, 240);
	$$$.message('Window size is 400 x 240', LOWDEBUG, 'null');
} else if(windowSize == 2) {
	window.resizeTo(800, 240);
	$$$.message('Window size is 800 x 240', LOWDEBUG, 'null');
} else if(windowSize == 3) {
	window.resizeTo(800, 480);
	$$$.message('Window size is 800 x 480', LOWDEBUG, 'null');
}

/**
 * file list process
 */
let fileInfoContainar;
function getFilelist() {
	$$$.message('Call REST api', DEBUG, 'getFilelist');
	$.get('http://192.168.0.14/api/files?apikey=241B873D3FF8408FB95E1DB8510F81CC')
		.done(function(data){
			fileInfoContainar = data;
			$('#file-list-ctrl').html('');
			for(var i=0; i<data.files.length; i++) {
				var element = document.createElement('div');
					element.innerHTML = 
						'<div class="display-name" onclick="displayClick(' + i + ')">' + data.files[i].display + '</div>' +
						'<div class="left-btn file-list-icon-download" onclick="downloadClick(' + i + ')"><span class="glyphicon glyphicon glyphicon-download-alt"></span></div>' +
						'<div class="middle-btn file-list-icon-level-up" onclick="levelupClick(' + i + ')"><span class="glyphicon glyphicon glyphicon-level-up"></span></div>' +
						'<div class="middle-btn file-list-icon-trash" onclick="trashClick(' + i + ')"><span class="glyphicon glyphicon glyphicon-trash"></span></div>' +
						'<div class="middle-btn file-list-icon-open" onclick="openClick(' + i + ')"><span class="glyphicon glyphicon glyphicon-folder-open"></span></div>' +
						'<div class="right-btn file-list-icon-print" onclick="printClick(' + i + ')"><span class="glyphicon glyphicon glyphicon-print"></span></div>';
						$('#file-list-ctrl').append(element);
			}
			$('.file-list-icon-open').css({color: peleskyblue});
			$$$.message('Change css(peleskyblue) file-list-icon-open', DEBUG, '$function');
			$('.file-list-icon-print').css({color: peleskyblue});
			$$$.message('Change css(peleskyblue) file-list-icon-print', DEBUG, '$function');
		})
}
getFilelist();
function displayClick(e) {
	function calculateTime(t) {
		let time, temp;
		temp = Math.floor(t / 3600);
		time = temp + 'h';
		t = t - (temp * 3600);
		$$$.message('Calculation hour. quotient is ' + temp + '. surplus is ' + t, DEBUG, 'calculateTime');
		temp = Math.floor(t / 60);
		$$$.message('Calculation minutes. quotient is ' + temp + '. surplus is ' + (t - (temp * 60)), DEBUG, 'calculateTime');
		time = time + temp + 'm' + Math.floor((t - (temp * 60))*100)/100 + 's';
		return time;
	}
	function detectName() {
		var name = '';
		for(var i=0;i<fileInfoContainar.files[e].display.split('.').length - 1;i++) {
			if(i > 0) name += '.';
			name += fileInfoContainar.files[e].display.split('.')[i];
		}
		$$$.message('Detect display name', DEBUG, 'displayClick');
		return name;
	}
	function calculateFilament(f) {
		var length,temp;
		temp = Math.floor(f / 1000);
		f = f - (temp * 1000);
		length = temp + 'm';
		$$$.message('Calculation meter. quotient is ' + temp + '. surplus is ' + f, DEBUG, 'calculateFilament');
		temp = Math.floor(f / 10);
		f = f - (temp * 10);
		length = length + temp + 'cm';
		$$$.message('Calculation centimeter. quotient is ' + temp + '. surplus is ' + f, DEBUG, 'calculateFilament');
		length = length + Math.floor(f * 100) / 100 + 'mm';
		return length;
	}
	$$$.message('Name tag click', DEBUG, 'displayClick');
	$('#information-panel-ctrl').html(
		'<div class="title">' + detectName() + '</h3>'+
		'<hr>' +
		'<table class="information-table">' +
		'<tr><td>Type:</td><td>' + fileInfoContainar.files[e].display.split('.')[fileInfoContainar.files[e].display.split('.').length-1] + '</td></tr>' +
		'<tr><td>Time:</td><td>' + calculateTime(fileInfoContainar.files[e].gcodeAnalysis.estimatedPrintTime) + '</td></tr>' +
		'<tr><td colspan="2">Filament:</td></tr>' +
		'<tr><td colspan="2" class="right">' + calculateFilament(fileInfoContainar.files[e].gcodeAnalysis.filament.tool0.length) + '</td></tr>' +
		'<th>Size:</th>' +
		'<tr><td colspan=2 class="right">' +
		Math.floor(fileInfoContainar.files[e].gcodeAnalysis.dimensions.width*100)/100 + 'x' +
		Math.floor(fileInfoContainar.files[e].gcodeAnalysis.dimensions.depth*100)/100 + 'x' +
		Math.floor(fileInfoContainar.files[e].gcodeAnalysis.dimensions.height*100)/100 + ' mm' +
		'</td></tr>' +
		'</table>'
	);
	$$$.message('Generate innerHTML(information-panel)', DEBUG, 'displayClick');
}
function downloadClick(e) {
	function changeStream(data) {
			$$$.message('Start encording ', DEBUG, 'downloadClick')
			var length = data.length;
		var result = new Uint8Array(length);
		for(var i=0; i<length; i++)
			result[i] = data[i].charCodeAt(0);
		return result;
	}
	$$$.message('Click the download icon in Listing ' + e, DEBUG, 'downloadClick');
	client.files.download('local', fileInfoContainar.files[e].path)
		.done(function(data){
			$$$.message('Download ' + fileInfoContainar.files[e].display, DEBUG, 'downloadClick')
			var stream = new Uint8Array(changeStream(data));
			var element = document.createElement('a');
			element.href = URL.createObjectURL(new Blob([stream.subarray(0, stream.length)], {type: 'text/.gcode'}));
			element.download = '';
			element.click();
			URL.revokeObjectURL(element.href);
			$$$.message('Delete temporary files', DEBUG, 'downloadClick')
		})
}
function trashClick(e) {
	$$$.message('Click the trash icon in listing ' + e, DEBUG, 'trashClick');
	var f = fileInfoContainar.files[e].path;
	client.files.delete('local', f);
	$$$.message('Delete ' + f, INFO, 'trashClick');
	getFilelist();
}
function openClick(e) {
	$$$.message('Click the open icon in listing ' + e, DEBUG, 'openClick');
	if(!powerFlag) {
		$$$.message('This button is not active(icon-open-' + e + ')', DEBUG, 'openClick');
		return;
	} else {
		client.files.select('local', fileInfoContainar.files[e].path);
		$$$.message('Set ' + fileInfoContainar.files[e].display + ' to print', DEBUG, 'openClick');
	}
}
function printClick(e) {
	$$$.message('Click the print icon in listing ' + e, DEBUG, 'printClick');
	$.get('http://192.168.0.14/api/job?apikey=241B873D3FF8408FB95E1DB8510F81CC')
		.done(function(data){
			if(data.state.toLowerCase() != 'printing' && powerFlag) {
				client.files.select('local', fileInfoContainar.files[e].path, true);
				$$$.message('Start printing ' + fileInfoContainar.files[e].display, INFO, 'printClick');
			} else {
				if(!powerFlag) $$$.message('This button is not active(icon-print-' + e + ')', DEBUG, 'printClick');
				else if(data.state.toLowerCase() == 'printing') $$$.message('Unable to operate buttons because printing is in progress', INFO, 'printClick');
				return;
			}
		})
		.fail(function(){
			$$$.message('Printer not found', ERROR, '$printClick');
		});
}
function levelupClick(e) {
	$$$.message('Click the level-up icon in listing ' + e, DEBUG, 'levelupClick');
	$('#file-notice-ctrl').css({visibility: 'visible'});
}
/**
 * getPrinterFullSate()
 */
function getPrinterFullState() {
	function bedTempertureCheck(response) {
		$$$.message('Target temperature check(bed)', LOWDEBUG, 'bedTemperatureCheck');
		if('bed' in response.temperature) {
			if(response.temperature.bed.target <=0) {
				if($('#bed-target-text').text() == 'N/A') return false;
				else {
					$$$.message('Update bed target temperature value and icon color(off)', DEBUG, 'bedTemperatureCheck');
					$('#bed-target-text').text('N/A');
					$('#bed-icon').css({color: sunshine});
				}
			} else {
				var now = $('#bed-target-text').text();
				if(now != (response.temperature.bed.target + 'C')) {
					$$$.message('Update bed target temperature value and icon color(on)', DEBUG, 'bedTemperatureCheck');
					$('#bed-target-text').text(response.temperature.bed.target + 'C');
					$('#bed-icon').css({color: rescueorange});
				}
			}
		}
	}
	function tool0TemperatureCheck(response) {
		$$$.message('Target temperature check(tool0)', LOWDEBUG, 'tool0TemperatureCheck');
		if('tool0' in response.temperature) {
			if(response.temperature.tool0.target <=0) {
				if($('#tool-target-text').text() == 'N/A') return false;
				else {
					$$$.message('Update tool0 temperature value and icon color(off)', DEBUG, 'tool0TemperatureCheck');
					$('#tool-target-text').text('N/A');
					$('#tool-icon').css({color: sunshine});
				}
			} else {
				var now = $('#tool-target-text').text();
				if(now != (response.temperature.tool0.target + 'C')) {
					$$$.message('Update tool0 target temperature value and icon color(on)', DEBUG, 'bedTemperatureCheck');
					$('#tool-target-text').text(response.temperature.tool0.target + 'C');
					$('#tool-icon').css({color: rescueorange});
				}
			}
		}
	}
	function jobNameCheck(response) {
		function getTime(time) {
			let result		= '';
			let printTime	= time;
			let hour		= Math.floor(printTime / 3600);
			if(hour > 0) {
				result = result + hour + 'h';
				printTime = printTime - (hour * 3600);
			}
			let minute = Math.floor(printTime / 60);
			if(minute > 0) {
				result = result + minute + 'm';
				printTime = printTime - (minute * 60);
			}
			return result + printTime + 's'
		}
		$.get('http://192.168.0.14/api/job?apikey=241B873D3FF8408FB95E1DB8510F81CC')
			.done(function(data){
				if(data.job.file.name != null)
					if($('#jobname').text() != data.job.file.name) {
						$$$.message('Update job name', INFO, 'jobNameCheck');
						$('#jobname').text(data.job.file.name);
					}
				if(data.state.toLowerCase() == 'printing') {
					if((Math.floor(data.progress.completion * 100) / 100) != $('#progressbar-one').text()) {
						$$$.message('Update progress bar position', LOWINFO, 'jobNameCheck');
						$('#complete-text').text(Math.floor(data.progress.completion * 100) / 100 + '%');
						$('#progressbar-one').css({width: Math.floor(data.progress.completion) + '%'});
					}
					$$$.message('Update printer information', LOWINFO, 'jobNameCheck');
					$('#print-title-text').text('printing');
					$('#print-icon').css({color: rescueorange});
					$$$.message('Update print time', LOWINFO, 'jobNameCheck');
					$('#printtime-text').text(getTime(data.progress.printTime));
					$$$.message('Update print time left', LOWINFO, 'jobNameCheck');
					if(getTime(data.progress.printTimeLeft) != 'nulls')
						$('#printtimeleft-text').text(getTime(data.progress.printTimeLeft));
				} else if($('#print-title-text').text() != 'print') {
					$$$.message('Reset job status', INFO, 'jobNameCheck');
					$('#print-title-text').text('print');
					$('#print-icon').css({color: sunshine});
					$('#complete-text').text('0%');
					$('#progressbar-one').css({width: '0%'});
					$('#printtime-text').text('0s');
					$('#printtimeleft-text').text('0s');
				}
			})
	}
	if(client == undefined) {
		$('.alert-text').text('hoge');
		return false;
	}

	client.printer.getFullState()
		.done(function(response){
			$$$.message('Update tool0 temperature value', LOWDEBUG, 'getFullState');
			if('tool0' in response.temperature)
				$('#tool-text').text(response.temperature.tool0.actual+'C');
			$$$.message('Update bed temperature value', LOWDEBUG, 'getFullState');
			if('bed' in response.temperature)
				$('#bed-text').text(response.temperature.bed.actual+'C');

			tool0TemperatureCheck(response);
			bedTempertureCheck(response);
			jobNameCheck();
		}).fail(function(response){});
}
/**
 * resetMonitorText()
 */
function resetMonitorText() {
	$$$.message('Set tool text and icon to default', DEBUG, 'resetMonitorText');
	$('#tool-text').text('N/A');
	$('#tool-target-text').text('N/A');
	$('#too-icon').css({color: sunshine});

	$$$.message('Set bed text and icon to default', DEBUG, 'resetMonitorText');
	$('#bed-text').text('N/A');
	$('#bed-target-text').text('N/A');
	$('#bed-icon').css({color: sunshine});

	$$$.message('set fan text and icon to default', DEBUG, 'resetMonitorText');
	$('#fan-text').text('0%');
	$('#fan-icon').css({color: sunshine});
}
/**
 * postProcess()
 */
function postProcess() {
	$$$.message('Start Function', DEBUG, 'postProcess');
	if(powerFlag) {
		client.printerprofiles.get('_default')
			.done(function(response){
				switch(response.model.toUpperCase().match('MARLIN')[0]) {
					case 'MARLIN':
						client.control.sendGcode('M107');
						$$$.message('Stop fan(speed 0%)', DEBUG, 'postProcess');
						break;
				}
			})
		$$$.message('Execute heart down process', DEBUG, 'postProcess');
		client.printer.setToolTargetTemperatures({'tool0': 0});
		$('#tool-on-sw-btn').css({color: sunshine});
		$('#tool-icon').css({color:sunshine});
	}
}
/**
 * upload test code
 */
function upload(elem) {
	var apikey = '241B873D3FF8408FB95E1DB8510F81CC';
	var form = new FormData();
	form.append('file', elem.files[0]);
	form.append('select', false);
	form.append('print', false);

	var settings = {
		async:			true,
		url:			'http://192.168.0.14/api/files/local',
		method:			'POST',
		headers:		{
			'x-api-key':		apikey,
			'cache-control':	'no-cache',
		},
		processData:	false,
		contentType:	false,
		mimeType:		'multipart/form-data',
		data:			form
	}
	$.ajax(settings).done(function(response){
		getFilelist();
	});
}

$(function(){
	if(client == undefined) {
		$('.alert-text').text('Failed to create OctoPrint object')
		$('.alert-panel').css({visibility: 'visible'});
	}
	
	$('#progressbar-one').addClass('progress-bar-forestleaf');
	triggerWindowSizeChange();
	/**
	 * Power button click event
	 */
	$('#power-btn').click(function(){
		if(toolTempFlag || bedTempFlag) {
			$$$.message('power-btn operation prohibited (under toolTempFlag control)', DEBUG, 'power-btn.click');
			return;
		}
		if(powerFlag) {
			$$$.message('Click powerbtn(on>off)', DEBUG, '$power-btn.click');
			postProcess();
			client.connection.disconnect()
				.done(function(response){
					$$$.message('Disconnect success', INFO, '$power-btn.click')
					client.browser.logout()
						.done(function(response){
							$$$.message('Logout success', INFO, '$power-btn.click');
							$('.nav-off').css({color: sunshine});
							clearInterval(intervalID);
							resetMonitorText();
							powerFlag = false;
							$$$.message('Change powerFlag. value is ' + powerFlag, DEBUG, '$power-btn.click');
							$('.file-list-icon-open').css({color: peleskyblue});
							$$$.message('Change css(peleskyblue) file-list-icon-open', DEBUG, '$power-btn.click');
							$('.file-list-icon-print').css({color: peleskyblue});
							$$$.message('Change css(peleskyblue) file-list-icon-print', DEBUG, '$power-btn.click');
						}).fail(function(response){
							$$$.message('Logout failure', ERROR, '$power-btn.click');
						});
				}).fail(function(response){
					$$$.error('Disconnect failure', ERROR , '$power-btn.click');
					$('.alert-text').text('Error: Failed to disconnect to printer');
					$('#alert-pnl').css({visibility: 'visible'});
				})
		} else {
			$$$.message('Click powerbtn(off>on)', DEBUG), '$power-btn.click';
			client.browser.login('mozukuSu', 'ooxot8795SH', true)
				.done(function(response){
					$$$.message('Login success', INFO, '$power-btn.click');
					client.connection.connect({
						port:			'/dev/ttyACM0',
						baudrate:		115200,
						printerProfile:	'_default',
						save:			true,
						autoconnect:	false
					}).done(function(response){
						$$$.message('Connection success', INFO, '$power-btn.click');
						$('.nav-off').css({color: rescueorange});
						powerFlag = true;
						$$$.message('Change powerFlag. value is ' + powerFlag, DEBUG, '$power-btn.click');
						intervalID = setInterval(getPrinterFullState, 1000);
						$('.file-list-icon-open').css({color: sunshine});
						$$$.message('Change css(sunshine) file-list-icon-open', DEBUG, '$power-btn.click');
						$('.file-list-icon-print').css({color: sunshine});
						$$$.message('Change css(sunshine) file-list-icon-print', DEBUG, '$power-btn.click');
					}).fail(function(response){
						$$$.message('Connection failure', ERROR, '$power-btn.click');
						$('.alert-text').text('Error: Failed to connect to printer');
						$('#alert-pnl').css({visibility: 'visible'});
					});
				}).fail(function(response){
					$$$.message('Login failure', ERROR, '$power-btn.click');
					$('.alert-text').text('Error: Failed to login to octoprint server');
					$('#alert-pnl').css({visibility: 'visible'});
				});
		}
	});
	/**
	 * Sub menu button click event
	 */
	$('#submenu-btn').click(function(){
		if(toolTempFlag || bedTempFlag) {
			$$$.message('submenu-btn operation prohibited (under toolTempFlag control)', DEBUG, 'submenu-btn.click');
			return;
		}
		$$$.message('Click submen ctrl btn', DEBUG, '$submenu-btn');
		if(submenuToggle) {
			$$$.message('Hide submenu', INFO, '$submenu-btn');
			$('.nav-submenu').css({right: '-285px'});
			submenuToggle = false;
		} else {
			$$$.message('Show submenu', INFO, '$submenu-btn');
			$('.nav-submenu').css({right: '0px'});
			submenuToggle = true;
		}
	});
	/**
	 * Fullscreen button click event
	 */
	$('#fullscreen-btn').click(function(){
		if(toolTempFlag || bedTempFlag) {
			$$$.message('fullscreen-btn operation prohibited (under toolTempFlag control)', DEBUG, 'fullscreen-btn.click');
			return;
		}
		$$$.message('Click fullscreen btn', DEBUG, '$fullscreen-btn');
		windowSize++;
		triggerWindowSizeChange();
	});
	function triggerWindowSizeChange() {
		function modeTreeTriangleSet(){
			$$$.message('Call modeTreeTriangleSet', DEBUG, 'modeTreeTriangleSet');
			$('.' + windowList[panel4Array[0]].split('-')[0] + '-triangle-right').css({visibility: 'hidden'});
			$('.' + windowList[panel4Array[0]].split('-')[0] + '-triangle-down').css({visibility: 'hidden'});
			$('.' + windowList[panel4Array[1]].split('-')[0] + '-triangle-left').css({visibility: 'hidden'});
			$('.' + windowList[panel4Array[1]].split('-')[0] + '-triangle-down').css({visibility: 'hidden'});
			$('.' + windowList[panel4Array[2]].split('-')[0] + '-triangle-right').css({visibility: 'hidden'});
			$('.' + windowList[panel4Array[2]].split('-')[0] + '-triangle-down').css({visibility: 'visible'});
			$('.' + windowList[panel4Array[3]].split('-')[0] + '-triangle-left').css({visibility: 'hidden'});
			$('.' + windowList[panel4Array[3]].split('-')[0] + '-triangle-down').css({visibility: 'visible'});
		}
		function modeTreeTriangleReset() {
			$$$.message('Call modeTreeTriangleReset', DEBUG, 'modeTreeTriangleReset');
			$('.' + windowList[panel4Array[0]].split('-')[0] + '-triangle-right').css({visibility: 'visible'});
			$('.' + windowList[panel4Array[0]].split('-')[0] + '-triangle-down').css({visibility: 'hidden'});
			$('.' + windowList[panel4Array[1]].split('-')[0] + '-triangle-left').css({visibility: 'visible'});
			$('.' + windowList[panel4Array[1]].split('-')[0] + '-triangle-down').css({visibility: 'hidden'});
			$('.' + windowList[panel4Array[2]].split('-')[0] + '-triangle-right').css({visibility: 'visible'});
			$('.' + windowList[panel4Array[2]].split('-')[0] + '-triangle-down').css({visibility: 'hidden'});
			$('.' + windowList[panel4Array[3]].split('-')[0] + '-triangle-left').css({visibility: 'visible'});
			$('.' + windowList[panel4Array[3]].split('-')[0] + '-triangle-down').css({visibility: 'hidden'});
		}
		if(windowSize > maxWindowSize) windowSize = 1;
		$$$.message('Screen mode is ' + windowSize, INFO, 'triggerWindowSizeChange');
		if(windowSize == 1) {
			$$$.message('Window size is 400 x 240', LOWDEBUG, 'triggerWindowSizeChange');
			window.resizeTo(400,240);
			$('#main-window-ctrl, #file-window-ctrl, #manu-window-ctrl, #temp-window-ctrl').css({'z-index': -1, top: '0px', left: '0px'});
			$$$.message('Reset panel position for screen mode 1', DEBUG, 'triggerWindowSizeChange')
			$('#' + windowList[panelPosition]).css({'z-index': 80});
			$$$.message('Set panel position for screen mode 1', DEBUG, 'triggerWindowSizeChange')
			modeTreeTriangleReset();
		} else if(windowSize == 2) {
			$$$.message('Window size is 800 x 240', LOWDEBUG, 'triggerWindowSizeChange');
			window.resizeTo(800,240);
			// Main panel position set
			$('#main-window-ctrl, #file-window-ctrl, #manu-window-ctrl, #temp-window-ctrl').css({'z-index': -1, top: '0px', left: '0px'});
			$$$.message('Reset panel position for screen mode 2', DEBUG, 'triggerWindowSizeChange')
			$('#' + windowList[panel2Array[0]]).css({'z-index': 80, top: '0px', left: '0px'});
			$('#' + windowList[panel2Array[1]]).css({'z-index': 80, top: '0px', left: '400px'});
			$$$.message('Set panel position for screen mode 2', DEBUG, 'triggerWindowSizeChange')
			modeTreeTriangleReset();
		} else if(windowSize == 3) {
			$$$.message('Window size is 800 x 480', LOWDEBUG, 'triggerWindowSizeChange');
			window.resizeTo(800,480);
			$('#' + windowList[panel4Array[0]]).css({'z-index': 80, top: '0px', left: '0px'});
			$('#' + windowList[panel4Array[1]]).css({'z-index': 80, top: '0px', left: '400px'});
			$('#' + windowList[panel4Array[2]]).css({'z-index': 80, top: '240px', left: '0px'});
			$('#' + windowList[panel4Array[3]]).css({'z-index': 80, top: '240px', left: '400px'});
			modeTreeTriangleSet();
		}
	}
	/**
	 * alert ok button click event
	 */
	$('#alert-ok-btn').click(function(){
		$$$.message('Click alert-ok btn', DEBUG, '$alert-ok-btn');
		$('.alert-panel').css({visibility: 'hidden'});
	});
	/**
	 * Close button click event
	 */
	$('#remove-btn').click(function(){
		if(toolTempFlag || bedTempFlag) {
			$$$.message('remove-btn operation prohibited (under toolTempFlag control)', DEBUG, 'remove-btn.click');
			return;
		}
		$$$.message('Click close btn', DEBUG, '$remove-btn');
		window.close();
	});
	$("#suspend-btn").click(function(){
		if(toolTempFlag || bedTempFlag) {
			$$$.message('suspend-btn operation prohibited (under toolTempFlag control)', DEBUG, 'suspend-btn.click');
			return;
		}
		$$$.message('Click suspend btn', DEBUG, '$suspend-btn');
		window.close();
	});
	/**
	 * fan icon click event
	 */
	$('#fan-icon').click(function(){
		if(toolTempFlag || bedTempFlag) {
			$$$.message('fan-icon operation prohibited (under toolTempFlag control)', DEBUG, 'fan-icon.click');
			return;
		}
		$$$.message('Click fan icon', DEBUG, '$fan-icon');
		$$$.message('Detect firmware type', INFO, '$fan-icon');
		let firmType;
		if(powerFlag) {
			client.printerprofiles.get('_default')
				.done(function(response){
					firmType = response.model;
					firmType = firmType.toUpperCase();
					$$$.message('Firmware type is ' + firmType, INFO, '$fan-icon');
		
					var result = firmType.match('MARLIN');
					if(fanFlag) {
						switch(result[0]) {
							case 'MARLIN':
								client.control.sendGcode('M107 P1')
									.done(function(){
										$$$.message('Stop fan(0%)', INFO, '$fan-icon');
										$('#fan-icon').css({color: sunshine});
										$('#fan-text').text('0%');
										fanFlag = false;
									}).fail(function(){
										$$$.message('Can not operate fan speed', ERROR, '$fan-icon');
									});
								break;
						}
					} else {
						switch(result[0]) {
							case 'MARLIN':
								client.control.sendGcode('M106 P1 S255')
									.done(function(){
										$$$.message('Rotate fan(speed 100%)', INFO, '$fan-icon');
										$('#fan-icon').css({color: rescueorange});
										$('#fan-text').text('100%');
										fanFlag = true;
									}).fail(function(){
										$$$.message('Can not operate fan speed', ERROR, '$fan-icon');
									});
								break;
						}
					}
				});
		} else {
			$$$.message('Printer is not connect', ERROR, '$fan-icon');
			return;
		}
	});
	/**
	 * tool on remove btn click event
	 */
	$('#tool-on-remove-btn').click(function(){
		$$$.message('Click tool-on-remove-btn', DEBUG, '$tool-on-remove-btn.click');
		$('#slider-panel-tool-ctrl').css({'z-index': -1});
		toolTempFlag = false;
		$$$.message('Change toolTempFlag. value is ' + toolTempFlag, DEBUG, 'tool-on-remove-btn.click');
	});
	/**
	 * tool icon click event
	 */
	$('#tool-icon').click(function(){
		$$$.message('Click tool-icon', DEBUG, '$tool-icon.click');
		if(submenuToggle) {
			$$$.message('Expanding subpanel. not show slider-panel-tool', WARN, '$bed-icon.click');
			return;
		}
		$.get('http://192.168.0.14/api/job?apikey=241B873D3FF8408FB95E1DB8510F81CC')
			.done(function(data){
				if(data.state.toLowerCase() != 'printing' && powerFlag) {
					$$$.message('Show tool0 temperature panel', INFO, '$tool-icon.click');
					$('#slider-panel-tool-ctrl').css({'z-index': 80});
					toolTempFlag = true;
					$$$.message('Change toolTempFlag. value is ' + toolTempFlag, DEBUG, '$tool-icon.click');
				} else {
					if(data.state.toLowerCase() == 'printing') $$$.message('Now printing. not show slider-panel-tool', WARN, 'tool-icon');
					else if(!powerFlag) $$$.message('Printer is not connected', WARN, '$tool-icon.click');
				}
			})
			.fail(function(){
				$$$.message('Printer not found', ERROR, '$tool-icon.click');
			})
	});
	/**
	 * tool on sw btn click event
	 */
	$('#tool-on-sw-btn').click(function(){
		$.get('http://192.168.0.14/api/job?apikey=241B873D3FF8408FB95E1DB8510F81CC')
			.done(function(data){
				if(data.state.toLowerCase() != 'printing' && powerFlag) {
					$$$.message('Click tool-on-sw-btn', DEBUG, '$tool-on-sw-btn.click');
					client.printer.setToolTargetTemperatures({'tool0': toolTempValue});
					$$$.message('Detect tool-0 temperature. value is ' + toolTempValue, INFO, '$tool-on-sw-btn.click');
					if(toolTempValue > 0 ) $('#tool-on-sw-btn').css({color: rescueorange});
					else $('#tool-on-sw-btn').css({color: sunshine});
					$$$.message('Change css. tool-on-sw-btn:color', DEBUG, '$tool-on-sw-btn.click');
					$('#slider-panel-tool-ctrl').css({'z-index': -1});
					toolTempFlag = false;
					$$$.message('Change toolTempFlag. value is ' + toolTempFlag, DEBUG, '$tool-on-sw-btn.click');
				}
			})
			.fail(function(){
				$$$.message('Printer not found', ERROR, '$tool-on-sw-btn.click');
			})
	});
	/**
	 * bed on remove btn click event
	 */
	$('#bed-on-remove-btn').click(function(){
		$$$.message('Click bed-on-remove-btn', DEBUG, '$bed-on-remove-btn.click');
		$('#slider-panel-bed-ctrl').css({'z-index': -1});
		bedTempFlag = false;
		$$$.message('Change bedTempFlag. value is ' + bedTempFlag, DEBUG, 'tool-on-remove-btn.click');
	});
	/**
	 * bed icon click event
	 */
	$('#bed-icon').click(function(){
		$$$.message('Click bed-icon', DEBUG, '$bed-icon.click');
		if(submenuToggle) {
			$$$.message('Expanding subpanel. not show slider-panel-bed', WARN, '$bed-icon.click');
			return;
		}
		$.get('http://192.168.0.14/api/job?apikey=241B873D3FF8408FB95E1DB8510F81CC')
			.done(function(data){
				if(data.state.toLowerCase() != 'printing' && powerFlag) {
					$$$.message('Show bed temperature panel', INFO, '$bed-icon.click');
					$('#slider-panel-bed-ctrl').css({'z-index': 80});
					bedTempFlag = true;
					$$$.message('Change bedTempFlag. value is ' + bedTempFlag, DEBUG, '$bed-icon.click');
				} else {
					if(data.state.toLowerCase() == 'printing') $$$.message('Now printing. not show slider-panel-bed', WARN, '$bed-icon.click');
					else if(!powerFlag) $$$.message('Printer is not connected', WARN, '$bed-icon.click');
				}
			}).fail(function(err){
				$$$.message('Printer not found', ERROR, '$bed-icon.click');
			})
	});
	/**
	 * bed on sw btn click event
	 */
	$('#bed-on-sw-btn').click(function(){
		$.get('http://192.168.0.14/api/job?apikey=241B873D3FF8408FB95E1DB8510F81CC')
			.done(function(data){
				if(data.state.toLowerCase() != 'printing' && powerFlag) {
					$$$.message('Click bed-on-sw-btn', DEBUG, '$bed-on-sw-btn.click');
					client.printer.setBedTargetTemperature(bedTempValue);
					$$$.message('Detect bed temperature. value is ' + bedTempValue, INFO, '$bed-on-sw-btn.click');
					if(bedTempValue > 0) $('#bed-on-sw-btn').css({color: rescueorange});
					else $('#bed-on-sw-btn').css({color: sunshine});
					$$$.message('Change css. bed-on-sw-btn:color', DEBUG, '$bed-on-sw-btn.click');
					$('#slider-panel-bed-ctrl').css({'z-index': -1});
					bedTempFlag = false;
					$$$.message('Change bedTempFlag. value is ' + bedTempFlag, DEBUG, '$bed-on-sw-btn.click');
				}
			})
			.fail(function(err){
				$$$.message('Printer not found', ERROR, '$bed-on-sw-btn.click');
			})
	});
	/**
	 * print icon click event
	 */
	$('#print-icon').click(function(){
		$$$.message('Click print-icon', DEBUG, '$print-icon.click');
		$.get('http://192.168.0.14/api/job?apikey=241B873D3FF8408FB95E1DB8510F81CC')
			.done(function(data){
				if(data.state.toLowerCase() != 'printing' && powerFlag) {
					client.job.start();
					$$$.message('Start print.', DEBUG, '$print-icon.click')
				} else {
					if(!powerFlag) $$$.message('This button is not active(print-icon)', DEBUG, 'print$print-icon.clickClick');
					else if(data.state.toLowerCase() == 'printing') $$$.message('Unable to operate buttons because printing is in progress', INFO, '$print-icon.click');
					return;
				}
			})
			.fail(function(){
				$$$.message('Printer not found', ERROR, '$printClick');
			});
	});
	/**
	 * left mark main click event
	 */
	$('#left-mark-main').click(function(){
		$$$.message('Click left-mark-main', DEBUG, '$left-mark-main.click');
		leftmarkClick(1);
	});
	/**
	 * right mark main click event
	 */
	$('#right-mark-main').click(function(){
		$$$.message('Click right-mark-main', DEBUG, '$right-mark-main.click');
		rightmarkClick(1);
	});
	/**
	 * down mark main click event
	 */
	$('#down-mark-main').click(function(){
		$$$.message('Click down-mark-main', DEBUG, '$down-mark-main');
		downmarkClick(1);
	});
	/**
	 * left mark file click event
	 */
	$('#left-mark-file').click(function(){
		$$$.message('Click left-mark-file', DEBUG, '$left-mark-file.click');
		leftmarkClick(2);
	});
	/**
	 * right mark file click event
	 */
	$('#right-mark-file').click(function(){
		$$$.message('Click right-mark-file', DEBUG, '$right-mark-file.click');
		rightmarkClick(2);
	});
	/**
	 * down mark main click event
	 */
	 $('#down-mark-file').click(function(){
		$$$.message('Click down-mark-file', DEBUG, '$down-mark-file');
		downmarkClick(2);
	});
	/**
	 * left mark file click event
	 */
	 $('#left-mark-manu').click(function(){
		$$$.message('Click left-mark-manu', DEBUG, '$left-mark-manu.click');
		leftmarkClick(3);
	});
	/**
	 * right mark manu click event
	 */
	$('#right-mark-manu').click(function(){
		$$$.message('Click right-mark-manu', DEBUG, '$right-mark-manu.click');
		rightmarkClick(3);
	});
	/**
	 * down mark main click event
	 */
	 $('#down-mark-manu').click(function(){
		$$$.message('Click down-mark-manu', DEBUG, '$down-mark-manu');
		downmarkClick(3);
	});
	/**
	 * left mark file click event
	 */
	 $('#left-mark-temp').click(function(){
		$$$.message('Click left-mark-temp', DEBUG, '$left-mark-temp.click');
		leftmarkClick(4);
	});
	/**
	 * right mark temp click event
	 */
	$('#right-mark-temp').click(function(){
		$$$.message('Click right-mark-temp', DEBUG, '$right-mark-temp.click');
		rightmarkClick(4);
	});
	/**
	 * down mark main click event
	 */
	 $('#down-mark-temp').click(function(){
		$$$.message('Click down-mark-temp', DEBUG, '$down-mark-temp');
		downmarkClick(4);
	});
	function leftmarkClick(p) {
		$$$.message('Call leftmarkClick(' + p + ')', DEBUG, 'downmarkClick');
		if(windowSize == 1) {
			panelPosition--;
			if(panelPosition < 1) panelPosition = maxPanelPosition;
			$$$.message('Change panel position. position is ' + panelPosition, DEBUG, '$left-mark.click');
			$('#' + windowList[panelPosition]).css({'z-index': 80});
			$$$.message('#' + windowList[panelPosition] + ' is shown', DEBUG, '$left-mark.click');
			if((panelPosition + 1) > maxPanelPosition) $('#' + windowList[1]).css({'z-index': -1});
			else $('#' + windowList[panelPosition + 1]).css({'z-index': -1});
			if((panelPosition + 1) > maxPanelPosition) $$$.message('#' + windowList[1] + ' is hidden', DEBUG, '$right-mark.click');
			else $$$.message('#' + windowList[panelPosition + 1] + ' is hidden', DEBUG, '$right-mark.click');
		} else if(windowSize == 2) {
			var panelNo = p;
			panelNo--;
			if(panelNo < 1) panelNo = maxPanelPosition;
			if(panelNo == panel2Array[0] || panelNo == panel2Array[1]) panelNo--;
			if(panelNo < 1) panelNo = maxPanelPosition;
			$$$.message('panelNo is ' + panelNo, DEBUG, 'leftmarkClick');
			$$$.message('Identify panel to display', DEBUG, 'leftmarkClick');
			$('#' + windowList[panelNo]).css({
				'z-index':	$('#' + windowList[p]).css('z-index'),
				left:		$('#' + windowList[p]).css('left'),
				top:		$('#' + windowList[p]).css('top')
			});
			$('#' + windowList[p]).css({'z-index': -1});
			$$$.message('Set css property', DEBUG, 'leftmarkClick');
			if(panel2Array[0] == p) panel2Array[0] = panelNo;
			else if(panel2Array[1] == p) panel2Array[1] = panelNo;
			$$$.message('Set panel2Array['+ panel2Array[0] + ',' + panel2Array[1] + ']', DEBUG, 'leftmarkClick');
		} else if(windowSize == 3) {
			if(panel4Array[0] == p) {
				$$$.message('Click upper left panel', DEBUG, 'leftmarkClick');
				switchUpperPanel();
			} else if(panel4Array[2] == p) {
				$$$.message('Click upper left panel', DEBUG, 'leftmarkClick');
				switchLowerPanel();
			}
		}
	}
	function rightmarkClick(p) {
		$$$.message('Call rightmarkClick(' + p + ')', DEBUG, 'downmarkClick');
		if(windowSize == 1) {
			panelPosition++;
			if(panelPosition > maxPanelPosition) panelPosition = 1;
			$$$.message('Change panel position. position is ' + panelPosition, DEBUG, '$right-mark.click');
			$('#' + windowList[panelPosition]).css({'z-index': 80});
			$$$.message('#' + windowList[panelPosition] + ' is shown', DEBUG, '$right-mark.click');
			if((panelPosition - 1) < 1) $('#' + windowList[maxPanelPosition]).css({'z-index': -1});
			else $('#' + windowList[panelPosition - 1]).css({'z-index': -1});
			if((panelPosition - 1) < 1) $$$.message('#' + windowList[maxPanelPosition] + ' is hidden', DEBUG, '$left-mark.click');
			else $$$.message('#' + windowList[panelPosition - 1] + ' is hidden', DEBUG, '$left-mark.click');
		} else if(windowSize == 2) {
			var panelNo = p;
			panelNo++;
			if(panelNo > maxPanelPosition) panelNo = 1;
			if(panelNo == panel2Array[0] || panelNo == panel2Array[1]) panelNo++;
			if(panelNo > maxPanelPosition) PanelNo = 1;
			$$$.message('panelNo is ' + panelNo, DEBUG, 'rightmarkClick');
			$$$.message('Identify panel to display', DEBUG, 'rightmarkClick');
			$('#' + windowList[panelNo]).css({
				'z-index':	$('#' + windowList[p]).css('z-index'),
				left:		$('#' + windowList[p]).css('left'),
				top:		$('#' + windowList[p]).css('top')
			});
			$('#' + windowList[p]).css({'z-index': -1});
			$$$.message('Set css property', DEBUG, 'rightmarkClick');
			if(panel2Array[0] == p) panel2Array[0] = panelNo;
			else if(panel2Array[1] == p) panel2Array[1] = panelNo;
			$$$.message('Set panel2Array['+ panel2Array[0] + ',' + panel2Array[1] + ']', DEBUG, 'rightmarkClick');
		} else if(windowSize == 3) {
			if(panel4Array[1] == p) {
				$$$.message('Click upper right panel', DEBUG, 'rightmarkClick');
				switchUpperPanel();
			} else if(panel4Array[3] == p) {
				$$$.message('Click lower right panel', DEBUG, 'rightmarkClick');
				switchLowerPanel();
			}
		}
	}
	function switchUpperPanel() {
		$$$.message('Call switchUpperPanel', DEBUG, 'switchUpperPanel');
		$('#' + windowList[panel4Array[0]]).css({left: '400px'});
		$('#' + windowList[panel4Array[1]]).css({left: '0px'});
		$$$.message('Switch upper panel', DEBUG, 'switchUpperPanel');
		$('.' + windowList[panel4Array[0]].split('-')[0] + '-triangle-left').css({visibility: 'hidden'});
		$('.' + windowList[panel4Array[0]].split('-')[0] + '-triangle-right').css({visibility: 'visible'});
		$('.' + windowList[panel4Array[1]].split('-')[0] + '-triangle-left').css({visibility: 'visible'});
		$('.' + windowList[panel4Array[1]].split('-')[0] + '-triangle-right').css({visibility: 'hidden'});
		$$$.message('Change upper panel triangle css', DEBUG, 'switchUpperPanel');
		var t = panel4Array[0];
		 panel4Array[0] = panel4Array[1];
		panel4Array[1] = t;
		$$$.message('Set panel4Array[' + panel4Array[0] + ' ,' + panel4Array[1] + ' ,' + panel4Array[2] + ' ,' + panel4Array[3] + ']', DEBUG, 'switchUpperPanel');
	}
	function switchLowerPanel() {
		$$$.message('Call switchLowerPanel', DEBUG, 'switchLowerPanel');
		$('#' + windowList[panel4Array[2]]).css({left: '400px'});
		$('#' + windowList[panel4Array[3]]).css({left: '0px'});
		$$$.message('Switch lower panel', DEBUG, 'switchLowerPanel');
		$('.' + windowList[panel4Array[2]].split('-')[0] + '-triangle-left').css({visibility: 'hidden'});
		$('.' + windowList[panel4Array[2]].split('-')[0] + '-triangle-right').css({visibility: 'visible'});
		$('.' + windowList[panel4Array[3]].split('-')[0] + '-triangle-left').css({visibility: 'visible'});
		$('.' + windowList[panel4Array[3]].split('-')[0] + '-triangle-right').css({visibility: 'hidden'});
		$$$.message('Change lower panel triangle css', DEBUG, 'switchLowerPanel');
		var t = panel4Array[2];
		panel4Array[2] = panel4Array[3];
		panel4Array[3] = t;
		$$$.message('Set panel4Array[' + panel4Array[0] + ' ,' + panel4Array[1] + ' ,' + panel4Array[2] + ' ,' + panel4Array[3] + ']', DEBUG, 'switchLowerPanel');
	}
	function downmarkClick(p) {
		$$$.message('Call downmarkClick(' + p + ')', DEBUG, 'downmarkClick');
		if(panel4Array[2] == p) {
			$('#' + windowList[panel4Array[0]]).css({top: '240px'});
			$('#' + windowList[panel4Array[2]]).css({top: '0px'});
			$$$.message('Switch left panel', DEBUG, 'downmarkClick');
			$('.' + windowList[panel4Array[0]].split('-')[0] + '-triangle-down').css({visibility: 'visible'});
			$('.' + windowList[panel4Array[2]].split('-')[0] + '-triangle-down').css({visibility: 'hidden'});
			$$$.message('Change left panel triangle css', DEBUG, 'downmarkClick');
			var t = panel4Array[0];
			panel4Array[0] = panel4Array[2];
			panel4Array[2] = t;
			$$$.message('Set panel4Array[' + panel4Array[0] + ' ,' + panel4Array[1] + ' ,' + panel4Array[2] + ' ,' + panel4Array[3] + ']', DEBUG, 'downmarkClick');
		} else if(panel4Array[3] == p) {
			$('#' + windowList[panel4Array[1]]).css({top: '240px'});
			$('#' + windowList[panel4Array[3]]).css({top: '0px'});
			$$$.message('Switch right panel', DEBUG, 'downmarkClick');
			$('.' + windowList[panel4Array[1]].split('-')[0] + '-triangle-down').css({visibility: 'visible'});
			$('.' + windowList[panel4Array[3]].split('-')[0] + '-triangle-down').css({visibility: 'hidden'});
			$$$.message('Change right panel triangle css', DEBUG, 'downmarkClick');
			var t = panel4Array[1];
			panel4Array[1] = panel4Array[3];
			panel4Array[3] = t;
			$$$.message('Set panel4Array[' + panel4Array[0] + ' ,' + panel4Array[1] + ' ,' + panel4Array[2] + ' ,' + panel4Array[3] + ']', DEBUG, 'downmarkClick');
		}
	}
	/**
	 * reload btn click event
	 */
	$('#reload-btn').click(function(){
		$$$.message('Click reload-btn', DEBUG, '$reload-btn.click');
		getFilelist();
	});
	/**
	 * upload btn click event
	 */
	$('#upload-btn').click(function(){
		$$$.message('Click upload-btn', DEBUG, '$upload-btn.click');
		$$$.message('Trigger file-open-btn click event', DEBUG, '$upload-btn.click');
		document.getElementById('file-open.btn').click();
	});
	/**
	 * file notice click event
	 */
	$('#file-notice-ctrl').click(function(){
		$$$.message('Click file-notice', DEBUG, '$file-notice-ctrl.click');
		$('#file-notice-ctrl').css({visibility: 'hidden'});
	});
});