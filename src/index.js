let sunshine			= '#FFDC00';
let rescueorange		= '#EA5405';
let ceruleanblue		= '#008DB7';
let forestleaf			= '#008554';
let peleskyblue			= '#C2E5F9';
let lapislazuli			= '#261F87';
let skyhigh				= '#51A5DC';

let powerFlag			= false;
let tool0Flag			= false;
let bedFlag				= false;
let fanFlag				= false;
let toolTempFlag		= false;
let bedTempFlag			= false;
let submenuToggle		= false;
let windowSize			= 3;
let maxWindowSize		= 3;
let panelPosition		= 3;
let maxPanelPosition	= 4;
let panel2Array			= [1, 2];
let panel4Array			= [1, 2, 3, 4];
let intervalIDprn		= undefined;
let fileIntervalID		= undefined;
let toolTempValue		= 0;
let bedTempValue		= 0;
let seedRate			= 10;
let buttonPosition		= 1;
let maxButtonPosition	= 3;
let waitNextClick		= false;
let bedMargin			= 10;
let canRunExtruder		= false;
let extruderMovingTemp	= 200;
let extruderPanelShown	= false;
let actionPowerBtnClick	= false;
let locationPath		= '';

let windowList			= [null, 'main-window-ctrl', 'file-window-ctrl', 'manu-window-ctrl', 'temp-window-ctrl'];
let seedRates			= [0, 0.1, 1, 10, 100];
let extruderPosition	= [-99, -99, -99];
let bedSize				= [230, 220, 200];
let bedPositionName		= ['rear-left', 'rear-right', 'front-left', 'front-right'];

let client = new OctoPrintClient({
	baseurl:	baseURL,
	apikey:		apiKey
});

let $$$ = new logMan(true, false);

if(windowSize == 1) {
	window.resizeTo(400, 240);
	$$$.message(`Window size is 400 x 240`, LOWDEBUG, `null`);
} else if(windowSize == 2) {
	window.resizeTo(800, 240);
	$$$.message(`Window size is 800 x 240`, LOWDEBUG, `null`);
} else if(windowSize == 3) {
	window.resizeTo(800, 480);
	$$$.message(`Window size is 800 x 480`, LOWDEBUG, `null`);
}

/**
 * file list process
 */
let fileInfoContainar;
function getFilelist(path) {
	function genBackPanel(item) {
		var elem = document.createElement('div');
		elem.innerHTML = 
			`<div class="item-panel1">` +
			`<div class="display-name" onclick="backClick('${item}')"><span class="glyphicon glyphicon glyphicon-arrow-left"></span>&nbsp Back</div>` +
			`<div class="small-font-back">Currently in ${path.split('/')[path.split('/').length - 1]}</div>` +
			`</div>`;
		$('#file-list-ctrl').append(elem);
	}
	function genFolderPanel(item, pos) {
		var folding = 1;
		var temp = '';
		var fileName = item.split('/')[item.split('/').length - 1];
		if(fileName.length > 15) {
			folding = Math.floor(fileName.length / 15) + 1;
			for(var i=0; i<fileName.length; i++) {
				if((i % 15) == 0 && i != 0) temp = temp + "<br />" + fileName[i];
				else temp = temp + fileName[i];
			}
			fileName = temp;
			console.log(temp);
		}

		var size;
		if('files' in fileInfoContainar) size = fileInfoContainar.files[pos].size;
		else if('children' in fileInfoContainar) size = fileInfoContainar.children[pos].size;

		if(size < 1024) size+='B';
		else if(size < 1048576) size = (Math.floor(size / 1024 * 100) / 100) + 'KB';
		else if(size < 1073741824) size = (Math.floor(size / 1024 / 1024 * 100) /100) + 'MB';

		var elem = document.createElement('div');
		elem.innerHTML =
			`<div class="item-panel${folding}">` +
			`<div class="display-name" onclick="folderClick('${pos}')"><span class="glyphicon glyphicon glyphicon-folder-close"></span>&nbsp;${item.split('/')[item.split('/').length-1]}</div>` +
			`<div><div class="small-font">Size: ${size}</div>` +
			`<div class="left-btn file-list-icon-level-up" onclick=""><span class="glyphicon glyphicon glyphicon-level-up"></span></div>` +
			`<div class="right-btn file-list-icon-trash" onclick=""><div class="in-folder"><span class="glyphicon glyphicon glyphicon-trash"></span></div></div>`;
			'</div>';
		$('#file-list-ctrl').append(elem);
	}
	function genFilePanel(item, pos) {
		var folding = 1;
		var temp = '';
		var fileName = item.split('/')[item.split('/').length - 1];
		if(fileName.length > 15) {
			folding = Math.floor(fileName.length / 15) + 1;
			for(var i=0; i<fileName.length; i++) {
				if((i % 15) == 0 && i != 0) temp = temp + "<br />" + fileName[i];
				else temp = temp + fileName[i];
			}
			fileName = temp;
			console.log(temp);
		}

		var elem = document.createElement('div');
		elem.innerHTML =
			`<div class="item-panel${folding}">` +
			`<div class="display-name" onclick="fileClick('${pos}')"><span class="glyphicon glyphicon glyphicon-list-alt"></span>&nbsp;${fileName}</div>` +
			`<div><div class="small-font-file">&nbsp;</div>` +
			`<div class="left-btn file-list-icon-download" onclick="downloadClick(${pos})"><div class="in-folder"><span class="glyphicon glyphicon glyphicon-download-alt"></span></div></div>` +
			`<div class="middle-btn file-list-icon-level-up" onclick="levelupClick(${pos})"><span class="glyphicon glyphicon glyphicon-level-up"></span></div>` +
			`<div class="middle-btn file-list-icon-trash" onclick="trashClick(${pos})"><div class="in-folder"><span class="glyphicon glyphicon glyphicon-trash"></span></div></div>` +
			`<div class="middle-btn file-list-icon-open" onclick="openClick(${pos})"><div class="in-folder"><span class="glyphicon glyphicon glyphicon-folder-open"></span></div></div>` +
			`<div class="right-btn file-list-icon-print" onclick="printClick(${pos})"><div class="in-folder"><span class="glyphicon glyphicon glyphicon-print"></span></div></div>`
		$('#file-list-ctrl').append(elem);
	}

	$$$.message('Call getFilelist', DEBUG, 'getFilelist');
	$('#file-list-ctrl').html('');
	locationPath = path;
	if(path == undefined || path == '')
		client.files.list()
			.done((data) => {
				fileInfoContainar = data;
				for(var i=0; i<fileInfoContainar.files.length; i++) if(fileInfoContainar.files[i].type == 'folder') genFolderPanel(fileInfoContainar.files[i].path, i);
				for(var i=0; i<fileInfoContainar.files.length; i++) if(fileInfoContainar.files[i].type != 'folder') genFilePanel(fileInfoContainar.files[i].path, i);
				console.log(data)
			})
			.fail((err) => {});
	else if(typeof(path) == 'string') {
		var backFolder = path.split('/');
		if(backFolder.length == 1) genBackPanel('');
		else {
			var temp = backFolder[0];
			for(var i=1; i<backFolder.length - 1; i++) temp = temp + '/' + backFolder[i];
			genBackPanel(temp);
		}

		client.files.get('local', path)
			.done((data) => {
				fileInfoContainar = data;
				for(var i=0; i<fileInfoContainar.children.length; i++) if(fileInfoContainar.children[i].type == 'folder') genFolderPanel(fileInfoContainar.children[i].path, i);
				for(var i=0; i<fileInfoContainar.children.length; i++) if(fileInfoContainar.children[i].type != 'folder') genFilePanel(fileInfoContainar.children[i].path, i);
				console.log(data)
			})
			.fail((err) => {});
	}
/*
		$.get(`${baseURL}api/files?apikey=${apiKey}`)
		.done((data) => {
			fileInfoContainar = data;
			$('#file-list-ctrl').html('');
			for(var i=0; i<data.files.length; i++) {
				var element = document.createElement('div');
				element.innerHTML =
					`<div class="display-name" onclick="displayClick(${i})">${data.files[i].display}</div>` + 
					`<div class="left-btn file-list-icon-download" onclick="downloadClick(${i})"><span class="glyphicon glyphicon glyphicon-download-alt"></span></div>` +
					`<div class="middle-btn file-list-icon-level-up" onclick="levelupClick(${i})"><span class="glyphicon glyphicon glyphicon-level-up"></span></div>` +
					`<div class="middle-btn file-list-icon-trash" onclick="trashClick(${i})"><span class="glyphicon glyphicon glyphicon-trash"></span></div>` +
					`<div class="middle-btn file-list-icon-trash" onclick="trashClick(${i})"><span class="glyphicon glyphicon glyphicon-trash"></span></div>` +
					`<div class="middle-btn file-list-icon-open" onclick="openClick(${i})"><span class="glyphicon glyphicon glyphicon-folder-open"></span></div>` +
					`<div class="right-btn file-list-icon-print" onclick="printClick(${i})"><span class="glyphicon glyphicon glyphicon-print"></span></div>`;
				$('#file-list-ctrl').append(element);
				$$$.message(`Append file in list. listing no ${i}`, DEBUG, 'getFilelist');
			}
			if(powerFlag) {
				$('.file-list-icon-open').css({color: sunshine});
				$$$.message('Change css(color:sunshine) file-list-icon-open', DEBUG, 'getFilelist');
				$('.file-list-icon-print').css({color: sunshine});
				$$$.message('Change css(color:sunshine) file-list-icon-print', DEBUG, 'getFilelist');
			} else {
				$('.file-list-icon-open').css({color: peleskyblue});
				$$$.message('Change css(color:peleskyblue) file-list-icon-open', DEBUG, 'getFilelist');
				$('.file-list-icon-print').css({color: peleskyblue});
				$$$.message('Change css(color:peleskyblue) file-list-icon-print', DEBUG, 'getFilelist');
			}
		}).fail((err) => {
			$$$.message('trap message alert no 00003', WARN, 'getPrinterFullState');
		});
*/
}
function backClick(item) {
	getFilelist(item);
}
function folderClick(pos) {
	$('#information-panel-ctrl').html('');
	if('files' in fileInfoContainar) getFilelist(fileInfoContainar.files[pos].path);
	else if('children' in fileInfoContainar) getFilelist(fileInfoContainar.children[pos].path);
}
function fileClick(pos) {
	function detectName() {
		$$$.message(`Call detectName`, DEBUG, `detectName`);
		var name = '';
		for(var i=0; i<temporalyContainar[pos].display.split('.').length - 1; i++) {
			if(i > 0) name += '.';
			name += temporalyContainar[pos].display.split('.')[i];
		}
		$$$.message('Detect display name', DEBUG, 'detectName');
		return name;
	}
	function calculateTime(t) {
		$$$.message(`Call calculateTime`, DEBUG, 'calculateTime');
		let time, temp;
		temp = Math.floor(t / 3600);
		if(temp > 0) time = temp + 'h';
		else time = '';
		t = t - (temp * 3600);
		$$$.message(`Calculation hour. quotient is ${temp}. surplus is ${t}`, DEBUG, 'calculateTime');
		temp = Math.floor(t / 60);
		$$$.message(`Calculation minutes. quotient is ${temp}. surplus is ${(t - (temp * 60))}`, DEBUG, 'calculateTime');
		time = time + temp + 'm' + Math.round(t - (temp * 60)) + 's';
		return time;
	}
	function calculateFilament(f) {
		$$$.message(`Call calculateFilament`, DEBUG, 'calculateFilament');
		var length,temp;
		temp = Math.floor(f / 1000);
		f = f - (temp * 1000);
		if(temp > 0) length = temp + 'm';
		else length = '';
		$$$.message(`Calculation meter. quotient is ${temp}. surplus is ${f}`, DEBUG, 'calculateFilament');
		temp = Math.floor(f / 10);
		f = f - (temp * 10);
		length = length + temp + 'cm';
		$$$.message(`Calculation centimeter. quotient is ${temp}. surplus is ${f}`, DEBUG, 'calculateFilament');
		length = length + Math.round(f) + 'mm';
		return length;
	}
	$$$.message(`Call fileClick`, DEBUG, 'fileClick');
	$$$.message('Name tag click(' + pos + ')', DEBUG, 'fileClick');
	var temporalyContainar;
	if('files' in fileInfoContainar) temporalyContainar = fileInfoContainar.files;
	else if('children' in fileInfoContainar) temporalyContainar = fileInfoContainar.children;
	$('#information-panel-ctrl').html(
		`<div class="title">${detectName()}</div>` +
		`<hr>`+
		`<table class="information-table">` +
		`<tr><td>Type:</td><td class="right">${temporalyContainar[pos].display.split('.')[temporalyContainar[pos].display.split('.').length - 1]}</td></tr>` +
		`<tr><td>Time:</td><td class="right">${calculateTime(temporalyContainar[pos].gcodeAnalysis.estimatedPrintTime)}</td></tr>` +
		`<tr><td>Filament:</td><td class="right">${calculateFilament(temporalyContainar[pos].gcodeAnalysis.filament.tool0.length)}</td></tr>` +
		`<th>Size:</th>` +
		`<tr><td colspan=2 class="right">
		${Math.floor(temporalyContainar[pos].gcodeAnalysis.dimensions.width * 100) / 100} x 
		${Math.floor(temporalyContainar[pos].gcodeAnalysis.dimensions.depth * 100) / 100} x 
		${Math.floor(temporalyContainar[pos].gcodeAnalysis.dimensions.height * 100) / 100} mm` +
		'</td></tr>' +
		`</table>`
	);
}
function downloadClick(pos) {
	function changeStream(data) {
		$$$.message('Call changeStream', DEBUG, 'changeStream')
		$$$.message('Start encording ', DEBUG, 'changeStream')
		var length = data.length;
		var result = new Uint8Array(length);
		for(var i=0; i<length; i++)
			result[i] = data[i].charCodeAt(0);
		$$$.message('End encording', DEBUG, 'changeStream');
		return result;
	}
	$$$.message(`Call downloadClick`, DEBUG, 'downloadClick');
	$$$.message(`Click the download icon in listing ${pos}`, DEBUG, 'downloadClick');
	var path;
	if('files' in fileInfoContainar) path = fileInfoContainar.files[pos].path;
	else if('children' in fileInfoContainar) path = fileInfoContainar.children[pos].path;
	client.files.download('local', path)
		.done((data) => {
			$$$.message(`Download ${path}`, DEBUG, 'downloadClick');
			var stream = new Uint8Array(changeStream(data));
			var element = document.createElement('a');
			element.href = URL.createObjectURL(new Blob([stream.subarray(0, stream.length)], {type: 'text/.gcode'}));
			element.download = '';
			element.click();
			URL.revokeObjectURL(element.href);
			$$$.message('Delete temporary files', DEBUG, 'downloadClick')
		}).fail((err) => {
			$$$.message('trap message alert no 00004', WARN, 'getPrinterFullState');
		});
}
function trashClick(pos) {
	$$$.message(`Call trashClick`, DEBUG, 'trashClick');
	$$$.message(`Click the trash icon in listing ${pos}`, DEBUG, 'trashClick');
	$.get(`${baseURL}api/job?apikey=${apiKey}`)
		.done((data) => {
			if(data.state.toLowerCase() != 'printing') {
				var f;
				if('files' in fileInfoContainar) f = fileInfoContainar.files[pos].path;
				else if('children' in fileInfoContainar) f = fileInfoContainar.children[pos].path;
				client.files.delete('local', f);
				$$$.message(`Delete ${f}`, INFO, 'trashClick');
				getFilelist(locationPath);
			} else $$$.message('Operation of this icon is prohibited during printing', WARN, 'trashClick');
		}).fail((err) => {
			$$$.message('trap message alert no 00005', WARN, 'getPrinterFullState');
		});;
}
function openClick(pos) {
	$$$.message('Call openClick', DEBUG, 'openClick');
	$$$.message(`Click the open icon in listing ${pos}`, DEBUG, 'openClick');
	if(!powerFlag) {
		$$$.message(`This button is not active(icon-open-${pos})`, DEBUG, 'openClick');
		return;
	} else {
		$.get(`${baseURL}api/job?apikey=${apiKey}`)
			.done((data) => {
				if(data.state.toLowerCase() != 'printing') {
					var path;
					if('files' in fileInfoContainar) path = fileInfoContainar.files[pos].path;
					else if('children' in fileInfoContainar) path = fileInfoContainar.children[pos].path;
					client.files.select('local', path);
					$$$.message(`Set ${path} to print`, DEBUG, 'openClick');
				} else $$$.message('Operation of this icon is prohibited during printing', WARN, 'openClick');
			}).fail((err) => {
				$$$.message('trap message alert no 00006', WARN, 'getPrinterFullState');
			});;
	}
}
function printClick(e) {
	$$$.message(`Call printClick`, DEBUG, 'printClick');
	$$$.message(`Click the print icon in listing ${e}`, DEBUG, 'printClick');
	$.get(`${baseURL}api/job?apikey=${apiKey}`)
		.done((data) => {
			if(data.state.toLowerCase() != 'printing' && powerFlag) {
				client.files.select('local', fileInfoContainar.files[e].path, true);
				$$$.message(`Start printing ${fileInfoContainar.files[e].display}`, INFO, 'printClick');
			} else {
				if(!powerFlag) $$$.message(`This button is not active(icon-print-${e})`, DEBUG, 'printClick');
				else if(data.state.toLowerCase() == 'printing') $$$.message('Unable to operate buttons because printing is in progress', INFO, 'printClick');
				return;
			}
		})
		.fail(() => {
			$$$.message('Printer not found', ERROR, '$printClick');
		});
}
function levelupClick(e) {
	$$$.message(`Call levelupClick`, DEBUG, 'levelupClick');
	$$$.message(`Click the level-up icon in listing ${e}`, DEBUG, 'levelupClick');
	$('#file-notice-ctrl').css({visibility: 'visible'});
}
/**
 * getPrinterFullSate()
 */
function getPrinterFullState() {
	function bedTempertureCheck(response) {
		$$$.message(`Call bedTempertureCheck`, DEBUG, 'bedTempertureCheck', ONCE);
		$$$.message('Target temperature check(bed)', LOWDEBUG, 'bedTemperatureCheck', INTERMITTENT, 10);
		if('bed' in response.temperature) {
			if(response.temperature.bed.target <= 0) {
				if($('#bed-target-text').text() == 'N/A') return false;
				else {
					$$$.message('Update bed target temperature value and icon color(off)', DEBUG, 'bedTemperatureCheck');
					$('#bed-target-text').text('N/A');
					$('#bed-icon').css({color: sunshine});
				}
			} else {
				var now = $('#bed-target-text').text();
				if(now != (`${response.temperature.bed.target}C`)) {
					$$$.message('Update bed target temperature value and icon color(on)', DEBUG, 'bedTemperatureCheck');
					$('#bed-target-text').text(response.temperature.bed.target + 'C');
					$('#bed-icon').css({color: rescueorange});
				}
			}
		}
	}
	function tool0TemperatureCheck(response) {
		$$$.message(`Call tool0TemperatureCheck`, DEBUG, 'tool0TemperatureCheck', ONCE);
		$$$.message('Target temperature check(tool0)', LOWDEBUG, 'tool0TemperatureCheck', INTERMITTENT, 10);
		if('tool0' in response.temperature) {
			if(response.temperature.tool0.target <= 0) {
				if($('#tool-target-text').text() == 'N/A') return false;
				else {
					$$$.message('Update tool0 temperature value and icon color(off)', DEBUG, 'tool0TemperatureCheck');
					$('#tool-target-text').text('N/A');
					$('#tool-icon').css({color: sunshine});
				}
			} else {
				var now = $('#tool-target-text').text();
				if(now != (`${response.temperature.tool0.target}C`)) {
					$$$.message('Update tool0 target temperature value and icon color(on)', DEBUG, 'bedTemperatureCheck');
					$('#tool-target-text').text(response.temperature.tool0.target + 'C');
					$('#tool-icon').css({color: rescueorange});
				}
			}
		}
	}
	function jobNameCheck(response) {
		function getTime(time) {
			$$$.message(`Call getTime`, LOWDEBUG, 'getTime', ONCE);
			let result		= '';
			let printTime	= time;
			let hour		= Math.floor(printTime / 3600);
			if(hour > 0) {
				result = result + hour + 'h';
				printTime = printTime - (hour * 3600);
			}
			$$$.message(`Calculation hour`, LOWDEBUG, 'getTime', ONCE);
			let minute = Math.floor(printTime / 60);
			if(minute > 0) {
				result = result + minute + 'm';
				printTime = printTime - (minute * 60);
			}
			$$$.message(`Calculation minute`, LOWDEBUG, 'getTime', ONCE);
			return result + printTime + 's'
		}
		$.get(`${baseURL}api/job?apikey=${apiKey}`)
			.done((data) => {
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
			}).fail((err) => {
				$$$.message('trap message alert no 00007', WARN, 'getPrinterFullState');
			});
	}
	$$$.message(`Call getPrinterFullState`, DEBUG, 'getPrinterFullState', ONCE);
	if(client == undefined) {
		$('.alert-text').text('OctoPrint object is undefined');
		return false;
	}

	client.printer.getFullState()
		.done((response) => {
			if('tool0' in response.temperature) {
				$('#tool-text').text(response.temperature.tool0.actual+'C');
				$$$.message(`Update tool0 temperature value is ${response.temperature.tool0.actual}C`, LOWDEBUG, 'getFullState');
				if(response.temperature.tool0.actual >= extruderMovingTemp && !canRunExtruder) {
					$('[id^=extruder-btn-]').css({'background-color': lapislazuli});
					$$$.message('Change css(background-color:lapislazuli) extruder-btn-up/down', DEBUG, 'getPrinterFullState');
					canRunExtruder = true;
					$$$.message(`Change canRunExtruder. value is ${canRunExtruder}`, DEBUG, 'getPrinterFullState');
				}
				if(response.temperature.tool0.actual < extruderMovingTemp && canRunExtruder) {
					$('[id^=extruder-btn-]').css({'background-color': skyhigh});
					$$$.message('Change css(background-color:skyhigh) extruder-btn-up/down', DEBUG, 'getPrinterFullState');
					canRunExtruder = false;
					$$$.message(`Change canRunExtruder. value is ${canRunExtruder}`, DEBUG, 'getPrinterFullState');
				}
			}
			if('bed' in response.temperature) {
				$$$.message(`Update bed temperature value is ${response.temperature.bed.actual}C`, LOWDEBUG, 'getFullState');
				$('#bed-text').text(response.temperature.bed.actual+'C');
			}

			tool0TemperatureCheck(response);
			bedTempertureCheck(response);
			jobNameCheck();
		}).fail((err) => {
			$$$.message('Printer is no connected', WARN, 'getPrinterFullState');
			$('.nav-off').css({color: sunshine});
			clearInterval(intervalIDprn);
			resetMonitorText();
			powerFlag = false;
			$$$.message(`Change powerFlag. value is ${powerFlag}`, DEBUG, '$power-btn.click');
			$('.file-list-icon-open').css({color: peleskyblue});
			$$$.message('Change css(color:peleskyblue) file-list-icon-open', DEBUG, '$power-btn.click');
			$('.file-list-icon-print').css({color: peleskyblue});
			$$$.message('Change css(color:peleskyblue) file-list-icon-print', DEBUG, '$power-btn.click');
			$('input[name="powerFlag"]').prop('checked', false);
			$$$.message(`Change powerFlag tag value. value is false`, DEBUG, '$power-btn.click');
		});
}
/**
 * resetMonitorText()
 */
function resetMonitorText() {
	$$$.message(`Call resetMonitorText`, DEBUG, 'resetMonitorText');
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
	$$$.message('Call postProcess', DEBUG, 'postProcess');
	if(powerFlag) {
		client.printerprofiles.get('_default')
			.done((response) => {
				switch(response.model.toUpperCase().match('MARLIN')[0]) {
					case 'MARLIN':
						client.control.sendGcode('M107');
						$$$.message('Stop fan(speed 0%)', DEBUG, 'postProcess');
						break;
				}
			}).fail((err) => {
				$$$.message('trap message alert no 00008', WARN, 'getPrinterFullState');
			});
		$$$.message('Execute heart down process', DEBUG, 'postProcess');
		client.printer.setToolTargetTemperatures({'tool0': 0});
		$('#tool-on-sw-btn').css({color: sunshine});
		$('#tool-icon').css({color:sunshine});
		client.printer.setBedTargetTemperature(0);
		$('#bed-on-sw-btn').css({color:sunshine});
		$('#bed-icon').css({color:sunshine});
		$("#jobname").text('not printed');
	}
}
/**
 * upload test code
 */
 function upload(elem) {
	$$$.message('Call upload', DEBUG, 'upload');
	var form = new FormData();
	form.append('file', elem.files[0]);
	form.append('select', false);
	form.append('print', false);

	var settings = {
		async:			true,
		url:			`${baseURL}api/files/local`,
		method:			'POST',
		headers:		{
			'x-api-key':		apiKey,
			'cache-control':	'no-cache',
		},
		processData:	false,
		contentType:	false,
		mimeType:		'multipart/form-data',
		data:			form
	}
	$.ajax(settings).done((response) => {
		getFilelist();
	}).fail((err) => {
		$$$.message('trap message alert no 00009', WARN, 'getPrinterFullState');
	});;
}
$(() => {
	if(client == undefined) {
		$('.alert-text').text('Failed to create OctoPrint object')
		$('.alert-panel').css({visibility: 'visible'});
		$$$.message('Change css(visibility:visible) alert-panel', DEBUG, 'jQuery');
	}
	getFilelist(undefined);
	$('#seed-value-p' + seedRates.indexOf(seedRate)).css({'background-color': lapislazuli});
	$$$.message('Initialize seedRate display', DEBUG, 'jQuery');
	$('#progressbar-one').addClass('progress-bar-forestleaf');
	$$$.message('Initialize progress-bar color', DEBUG, 'jQuery');
	triggerWindowSizeChange();

	$('#reload-btn-ctrl').click(() => {
		$$$.message('Click reload-btn', DEBUG, '$reload-btn-ctrl.click');
		location.reload();
	});

	$('#power-btn').click(() => {
		function logoutProcess() {
			$$$.message('Call logoutProcess', DEBUG, 'logoutProcess');
			client.connection.disconnect()
				.done((response) => {
					$$$.message('Disconnect success', INFO, '$power-btn.click')
					client.browser.logout()
						.done((response) => {
							$$$.message('Logout success', INFO, '$power-btn.click');
							$('.file-list-icon-open').css({color: peleskyblue});
							$$$.message('Change css(color:peleskyblue) file-list-icon-open', DEBUG, '$power-btn.click');
							$('.file-list-icon-print').css({color: peleskyblue});
							$$$.message('Change css(color:peleskyblue) file-list-icon-print', DEBUG, '$power-btn.click');
							actionPowerBtnClick = false;
							$$$.message(`Change actionPowerBtnClick. value is ${actionPowerBtnClick}`, DEBUG, '$power-btn.click');
						}).fail((response) => {
							$$$.message('Logout failure', ERROR, '$power-btn.click');
							$('.alert-text').text('Error: Failed to logout to printer');
							$('#alert-pnl').css({visibility: 'visible'});
							$$$.message('Change css(visibility:visible) alert-text', DEBUG, '$power-btn.click');
							actionPowerBtnClick = false;
							$$$.message(`Change actionPowerBtnClick. value is ${actionPowerBtnClick}`, DEBUG, '$power-btn.click');
						});
				}).fail((response) => {
					$$$.error('Disconnect failure', ERROR , '$power-btn.click');
					$('.alert-text').text('Error: Failed to disconnect to printer');
					$('#alert-pnl').css({visibility: 'visible'});
					$$$.message('Change css(visibility:visible) alert-text', DEBUG, '$power-btn.click');
					actionPowerBtnClick = false;
					$$$.message(`Change actionPowerBtnClick. value is ${actionPowerBtnClick}`, DEBUG, '$power-btn.click');
				});
		}
		$$$.message('Click power-btn', DEBUG, '$power-btn.click');
		if(toolTempFlag || bedTempFlag) {
			$$$.message('power-btn operation prohibited (under toolTempFlag control)', DEBUG, 'power-btn.click');
			return;
		}
		if(powerFlag) {
			$$$.message('Click powerbtn(on>off)', DEBUG, '$power-btn.click');
			if(!actionPowerBtnClick) {
				actionPowerBtnClick = true;
				$$$.message(`Change actionPowerBtnClick. value is ${actionPowerBtnClick}`, DEBUG, '$power-btn.click');
				postProcess();
				powerFlag = false;
				$$$.message(`Change powerFlag. value is ${powerFlag}`, DEBUG, '$power-btn.click');
				$('input[name="powerFlag"]').prop('checked', false);
				$$$.message('Change HTML property "powerFlag" is false', DEBUG, '$power-btn.click');
				$('.nav-off').css({color: sunshine});
				$$$.message('Change css(color:sunshine) nav-off', DEBUG, '$power-btn.click');
				resetMonitorText();
				clearInterval(intervalIDprn);
				$$$.message('Stop temperature monitor timer', DEBUG, '$power-btn.click');
				setTimeout(() => logoutProcess(), 1200);
				$$$.message('Logout after 1200ms', WARN, '$power-btn.click');
			} else {
				$$$.message('actionPowerBtnClick is true', WARN, '$power-btn.click');
			}
		} else {
			$$$.message('Click powerbtn(off>on)', DEBUG), '$power-btn.click';
			if(!actionPowerBtnClick) {
				actionPowerBtnClick = true;
				$$$.message(`Change actionPowerBtnClick. value is ${actionPowerBtnClick}`, DEBUG, '$power-btn.click');
				client.browser.login('mozukuSu', 'ooxot8795SH', true)
					.done((response) => {
						$$$.message('Login success', INFO, '$power-btn.click');
						client.connection.connect({
							port:			'/dev/ttyACM0',
							baudrate:		115200,
							printerProfile:	'_default',
							save:			true,
							autoconnect:	false
						}).done((response) => {
							$$$.message('Connection success', INFO, '$power-btn.click');
							$('.nav-off').css({color: rescueorange});
							powerFlag = true;
							$$$.message(`Change powerFlag. value is ${powerFlag}`, DEBUG, '$power-btn.click');
							intervalIDprn = setInterval(getPrinterFullState, 1000);
							$$$.message(`intervalIDprn is ${intervalIDprn}`, WARN, '$power-btn.click')
							$('.file-list-icon-open').css({color: sunshine});
							$$$.message('Change css(color:sunshine) file-list-icon-open', DEBUG, '$power-btn.click');
							$('.file-list-icon-print').css({color: sunshine});
							$$$.message('Change css(color:sunshine) file-list-icon-print', DEBUG, '$power-btn.click');
							actionPowerBtnClick = false;
							$$$.message(`Change actionPowerBtnClick. value is ${actionPowerBtnClick}`, DEBUG, '$power-btn.click');
							$('input[name="powerFlag"]').prop('checked', true);
							$$$.message(`Change powerFlag tag value. value is true`, DEBUG, '$power-btn.click');
						}).fail((response) => {
							$$$.message('Connection failure', ERROR, '$power-btn.click');
							$('.alert-text').text('Error: Failed to connect to printer');
							$('#alert-pnl').css({visibility: 'visible'});
							$$$.message('Change css(visibility:visible) alert-text', DEBUG, '$power-btn.click');
							actionPowerBtnClick = false;
							$$$.message(`Change actionPowerBtnClick. value is ${actionPowerBtnClick}`, DEBUG, '$power-btn.click');
						}).fail((err) => {
							$$$.message('trap message alert no 00011', WARN, 'getPrinterFullState');
						});;
					}).fail((response) => {
						$$$.message('Login failure', ERROR, '$power-btn.click');
						$('.alert-text').text('Error: Failed to login to octoprint server');
						$('#alert-pnl').css({visibility: 'visible'});
						$$$.message('Change css(visibility:visible) alert-text', DEBUG, '$power-btn.click');
						actionPowerBtnClick = false;
						$$$.message(`Change actionPowerBtnClick. value is ${actionPowerBtnClick}`, DEBUG, '$power-btn.click');
					});
			} else {
				$$$.message('actionPowerBtnClick is true', WARN, '$power-btn.click')
			}
		}
	});

	$('#submenu-btn').click(() => {
		$$$.message('Click submenu-btn', DEBUG, '$submenu-btn.click');
		if(toolTempFlag || bedTempFlag) {
			$$$.message('submenu-btn operation prohibited (under toolTempFlag control)', DEBUG, 'submenu-btn.click');
			return;
		}
		$$$.message('Click submen ctrl btn', DEBUG, '$submenu-btn');
		if(submenuToggle) {
			$$$.message('Hide submenu', INFO, '$submenu-btn');
			$('.nav-submenu').css({right: '-285px'});
			$$$.message('Change css(right:-285px) nav-submenu', DEBUG, '$submenu-btn');
			submenuToggle = false;
		} else {
			$$$.message('Show submenu', INFO, '$submenu-btn');
			$('.nav-submenu').css({right: '0px'});
			$$$.message('Change css(right:0px) nav-submenu', DEBUG, '$submenu-btn');
			submenuToggle = true;
		}
	});

	$('#fullscreen-btn').click(() => {
		$$$.message('Click fullscreen btn', DEBUG, '$fullscreen-btn.click');
		if(toolTempFlag || bedTempFlag) {
			$$$.message('fullscreen-btn operation prohibited (under toolTempFlag control)', DEBUG, '$fullscreen-btn.click');
			return;
		}
		windowSize++;
		triggerWindowSizeChange();
	});
	function triggerWindowSizeChange() {
		function modeTreeTriangleSet(){
			$$$.message('Call modeTreeTriangleSet', DEBUG, 'modeTreeTriangleSet');
			$(`.${windowList[panel4Array[0]].split('-')[0]}-triangle-right`).css({visibility: 'hidden'});
			$(`.${windowList[panel4Array[0]].split('-')[0]}-triangle-down`).css({visibility: 'hidden'});
			$(`.${windowList[panel4Array[1]].split('-')[0]}-triangle-left`).css({visibility: 'hidden'});
			$(`.${windowList[panel4Array[1]].split('-')[0]}-triangle-down`).css({visibility: 'hidden'});
			$(`.${windowList[panel4Array[2]].split('-')[0]}-triangle-right`).css({visibility: 'hidden'});
			$(`.${windowList[panel4Array[2]].split('-')[0]}-triangle-down`).css({visibility: 'visible'});
			$(`.${windowList[panel4Array[3]].split('-')[0]}-triangle-left`).css({visibility: 'hidden'});
			$(`.${windowList[panel4Array[3]].split('-')[0]}-triangle-down`).css({visibility: 'visible'});
		}
		function modeTreeTriangleReset() {
			$$$.message('Call modeTreeTriangleReset', DEBUG, 'modeTreeTriangleReset');
			$(`.${windowList[panel4Array[0]].split('-')[0]}-triangle-right`).css({visibility: 'visible'});
			$(`.${windowList[panel4Array[0]].split('-')[0]}-triangle-down`).css({visibility: 'hidden'});
			$(`.${windowList[panel4Array[1]].split('-')[0]}-triangle-left`).css({visibility: 'visible'});
			$(`.${windowList[panel4Array[1]].split('-')[0]}-triangle-down`).css({visibility: 'hidden'});
			$(`.${windowList[panel4Array[2]].split('-')[0]}-triangle-right`).css({visibility: 'visible'});
			$(`.${windowList[panel4Array[2]].split('-')[0]}-triangle-down`).css({visibility: 'hidden'});
			$(`.${windowList[panel4Array[3]].split('-')[0]}-triangle-left`).css({visibility: 'visible'});
			$(`.${windowList[panel4Array[3]].split('-')[0]}-triangle-down`).css({visibility: 'hidden'});
		}
		if(windowSize > maxWindowSize) windowSize = 1;
		$$$.message(`Screen mode is ${windowSize}`, INFO, 'triggerWindowSizeChange');
		if(windowSize == 1) {
			$$$.message('Window size is 400 x 240', LOWDEBUG, 'triggerWindowSizeChange');
			window.resizeTo(400,240);
			$('#main-window-ctrl, #file-window-ctrl, #manu-window-ctrl, #temp-window-ctrl').css({'z-index': -1, top: '0px', left: '0px'});
			$$$.message('Change css(z-index:-1) main-window-ctrl, file-window-ctrl, manu-window-ctrl, temp-window-ctrl', DEBUG, '$submenu-btn');
			$$$.message('Change css(top:0px) main-window-ctrl, file-window-ctrl, manu-window-ctrl, temp-window-ctrl', DEBUG, '$submenu-btn');
			$$$.message('Change css(left:0px) main-window-ctrl, file-window-ctrl, manu-window-ctrl, temp-window-ctrl', DEBUG, '$submenu-btn');
			$$$.message('Reset panel position for screen mode 1', DEBUG, 'triggerWindowSizeChange')
			$(`#${windowList[panelPosition]}`).css({'z-index': 80});
			$$$.message(`Change css(z-index:80px) ${windowList[panelPosition]}`, DEBUG, '$submenu-btn');
			$$$.message('Set panel position for screen mode 1', DEBUG, 'triggerWindowSizeChange')
			modeTreeTriangleReset();
		} else if(windowSize == 2) {
			$$$.message('Window size is 800 x 240', LOWDEBUG, 'triggerWindowSizeChange');
			window.resizeTo(800,240);
			// Main panel position set
			$('#main-window-ctrl, #file-window-ctrl, #manu-window-ctrl, #temp-window-ctrl').css({'z-index': -1, top: '0px', left: '0px'});
			$$$.message('Change css(z-index:-1) main-window-ctrl, file-window-ctrl, manu-window-ctrl, temp-window-ctrl', DEBUG, '$submenu-btn');
			$$$.message('Change css(top:0px) main-window-ctrl, file-window-ctrl, manu-window-ctrl, temp-window-ctrl', DEBUG, '$submenu-btn');
			$$$.message('Change css(left:0px) main-window-ctrl, file-window-ctrl, manu-window-ctrl, temp-window-ctrl', DEBUG, '$submenu-btn');
			$$$.message('Reset panel position for screen mode 2', DEBUG, 'triggerWindowSizeChange')
			$(`#${windowList[panel2Array[0]]}`).css({'z-index': 80, top: '0px', left: '0px'});
			$$$.message(`Change css(z-index:80) ${windowList[panel2Array[0]]}`, DEBUG, '$submenu-btn');
			$$$.message(`Change css(top:0px) ${windowList[panel2Array[0]]}`, DEBUG, '$submenu-btn');
			$$$.message(`Change css(left:0px) ${windowList[panel2Array[0]]}`, DEBUG, '$submenu-btn');
			$('#' + windowList[panel2Array[1]]).css({'z-index': 80, top: '0px', left: '400px'});
			$$$.message(`Change css(z-index:80) ${windowList[panel2Array[1]]}`, DEBUG, '$submenu-btn');
			$$$.message(`Change css(top:0px) ${windowList[panel2Array[1]]}`, DEBUG, '$submenu-btn');
			$$$.message(`Change css(left:400px) ${windowList[panel2Array[1]]}`, DEBUG, '$submenu-btn');
			$$$.message('Reset panel position for screen mode 2', DEBUG, 'triggerWindowSizeChange')
			$$$.message('Set panel position for screen mode 2', DEBUG, 'triggerWindowSizeChange')
			modeTreeTriangleReset();
		} else if(windowSize == 3) {
			$$$.message('Window size is 800 x 480', LOWDEBUG, 'triggerWindowSizeChange');
			window.resizeTo(800,480);
			$('#' + windowList[panel4Array[0]]).css({'z-index': 80, top: '0px', left: '0px'});
			$$$.message(`Change css(z-index:80) ${windowList[panel4Array[0]]}`, DEBUG, '$submenu-btn');
			$$$.message(`Change css(top:0px) ${windowList[panel4Array[0]]}`, DEBUG, '$submenu-btn');
			$$$.message(`Change css(left:0px) ${windowList[panel4Array[0]]}`, DEBUG, '$submenu-btn');
			$('#' + windowList[panel4Array[1]]).css({'z-index': 80, top: '0px', left: '400px'});
			$$$.message(`Change css(z-index:80) ${windowList[panel4Array[1]]}`, DEBUG, '$submenu-btn');
			$$$.message(`Change css(top:0px) ${windowList[panel4Array[1]]}`, DEBUG, '$submenu-btn');
			$$$.message(`Change css(left:400px) ${windowList[panel4Array[1]]}`, DEBUG, '$submenu-btn');
			$('#' + windowList[panel4Array[2]]).css({'z-index': 80, top: '240px', left: '0px'});
			$$$.message(`Change css(z-index:80) ${windowList[panel4Array[2]]}`, DEBUG, '$submenu-btn');
			$$$.message(`Change css(top:240px) ${windowList[panel4Array[2]]}`, DEBUG, '$submenu-btn');
			$$$.message(`Change css(left:0px) ${windowList[panel4Array[2]]}`, DEBUG, '$submenu-btn');
			$('#' + windowList[panel4Array[3]]).css({'z-index': 80, top: '240px', left: '400px'});
			$$$.message(`Change css(z-index:80) ${windowList[panel4Array[3]]}`, DEBUG, '$submenu-btn');
			$$$.message(`Change css(top:240px) ${windowList[panel4Array[3]]}`, DEBUG, '$submenu-btn');
			$$$.message(`Change css(left:400px) ${windowList[panel4Array[3]]}`, DEBUG, '$submenu-btn');
			modeTreeTriangleSet();
		}
	}

	$('#alert-ok-btn').click(() => {
		$$$.message('Click alert-ok-btn', DEBUG, '$alert-ok-btn');
		$('.alert-panel').css({visibility: 'hidden'});
		$$$.message('Change css(visibility:hidden) alert-panel', DEBUG, '$submenu-btn');
	});

	$('#remove-btn').click(() => {
		$$$.message('Click remove-btn', DEBUG, '$remove-btn');
		if(toolTempFlag || bedTempFlag) {
			$$$.message('remove-btn operation prohibited (under toolTempFlag control)', DEBUG, 'remove-btn.click');
			return;
		}
		$$$.message('Click close btn', DEBUG, '$remove-btn');
		window.close();
	});

	$("#suspend-btn").click(() => {
		$$$.message('Click suspend-btn', DEBUG, '$suspend-btn');
		if(toolTempFlag || bedTempFlag) {
			$$$.message('suspend-btn operation prohibited (under toolTempFlag control)', DEBUG, 'suspend-btn.click');
			return;
		}
		$$$.message('Click suspend btn', DEBUG, '$suspend-btn');
		window.close();
	});

	$('#fan-icon').click(() => {
		$$$.message('Click fan icon', DEBUG, '$fan-icon.click');
		if(toolTempFlag || bedTempFlag) {
			$$$.message('fan-icon operation prohibited (under toolTempFlag control)', DEBUG, 'fan-icon.click');
			return;
		}
		$$$.message('Detect firmware type', INFO, '$fan-icon.click');
		let firmType;
		if(powerFlag) {
			client.printerprofiles.get('_default')
				.done((response) => {
					firmType = response.model;
					firmType = firmType.toUpperCase();
					$$$.message(`Firmware type is ${firmType}`, INFO, '$fan-icon.click');
		
					var result = firmType.match('MARLIN');
					if(fanFlag) {
						switch(result[0]) {
							case 'MARLIN':
								client.control.sendGcode('M107 P1')
									.done(() => {
										$$$.message('Stop fan(0%)', INFO, '$fan-icon.click');
										$('#fan-icon').css({color: sunshine});
										$('#fan-text').text('0%');
										fanFlag = false;
									}).fail(() => {
										$$$.message('Can not operate fan speed', ERROR, '$fan-icon.click');
									});
								break;
						}
					} else {
						switch(result[0]) {
							case 'MARLIN':
								client.control.sendGcode('M106 P1 S255')
									.done(() => {
										$$$.message('Rotate fan(speed 100%)', INFO, '$fan-icon.click');
										$('#fan-icon').css({color: rescueorange});
										$('#fan-text').text('100%');
										fanFlag = true;
									}).fail(() => {
										$$$.message('Can not operate fan speed', ERROR, '$fan-icon.click');
									});
								break;
						}
					}
				}).fail((err) => {
					$$$.message('trap message alert no 00012', WARN, 'getPrinterFullState');
				});;
		} else {
			$$$.message('Printer is not connect', ERROR, '$fan-icon.click');
			return;
		}
	});

	$('#tool-on-remove-btn').click(() => {
		$$$.message('Click tool-on-remove-btn', DEBUG, '$tool-on-remove-btn.click');
		$('#slider-panel-tool-ctrl').css({'z-index': -1});
		$$$.message('Change css(z-index:-1) slider-panel-tool-ctrl', DEBUG, '$tool-on-remove-btn.click');
		toolTempFlag = false;
		$$$.message(`Change toolTempFlag. value is ${toolTempFlag}`, DEBUG, '$tool-on-remove-btn.click');
	});

	$('#tool-icon').click(() => {
		$$$.message('Click tool-icon', DEBUG, '$tool-icon.click');
		if(submenuToggle) {
			$$$.message('Expanding subpanel. not show slider-panel-tool', WARN, '$bed-icon.click');
			return;
		}
		$.get(`${baseURL}api/job?apikey=${apiKey}`)
			.done((data) => {
				if(data.state.toLowerCase() != 'printing' && powerFlag) {
					$$$.message('Show tool0 temperature panel', INFO, '$tool-icon.click');
					$('#slider-panel-tool-ctrl').css({'z-index': 80});
					$$$.message('Change css(z-index:80) slider-panel-tool-ctrl', DEBUG, '$tool-icon.click');
					toolTempFlag = true;
					$$$.message(`Change toolTempFlag. value is ${toolTempFlag}`, DEBUG, '$tool-icon.click');
				} else {
					if(data.state.toLowerCase() == 'printing') $$$.message('Now printing. not show slider-panel-tool', WARN, '$tool-icon.click');
					else if(!powerFlag) $$$.message('Printer is not connected', WARN, '$tool-icon.click');
				}
			}).fail(() => {
				$$$.message('Printer not found', ERROR, '$tool-icon.click');
			})
	});
	
	$('#tool-on-sw-btn').click(() => {
		$$$.message('Click tool-on-sw-btn', DEBUG, '$tool-on-sw-btn.click');
		$.get(`${baseURL}api/job?apikey=${apiKey}`)
			.done((data) => {
				if(data.state.toLowerCase() != 'printing' && powerFlag) {
					$$$.message('Click tool-on-sw-btn', DEBUG, '$tool-on-sw-btn.click');
					client.printer.setToolTargetTemperatures({'tool0': toolTempValue});
					$$$.message(`Detect tool-0 temperature. value is ${toolTempValue}`, INFO, '$tool-on-sw-btn.click');
					if(toolTempValue > 0 ) $('#tool-on-sw-btn').css({color: rescueorange});
					else $('#tool-on-sw-btn').css({color: sunshine});
					$$$.message('Change css(color:sunshine) tool-on-sw-btn', DEBUG, '$tool-on-sw-btn.click');
					$('#slider-panel-tool-ctrl').css({'z-index': -1});
					$$$.message('Change css(z-index:-1) tool-on-sw-btn', DEBUG, '$tool-on-sw-btn.click');
					toolTempFlag = false;
					$$$.message(`Change toolTempFlag. value is ${toolTempFlag}`, DEBUG, '$tool-on-sw-btn.click');
				}
			}).fail(() => {
				$$$.message('Printer not found', ERROR, '$tool-on-sw-btn.click');
			})
	});

	$('#bed-on-remove-btn').click(() => {
		$$$.message('Click bed-on-remove-btn', DEBUG, '$bed-on-remove-btn.click');
		$('#slider-panel-bed-ctrl').css({'z-index': -1});
		$$$.message('Change css(z-index:-1) bed-on-remove-btn', DEBUG, '$tool-on-sw-btn.click');
		bedTempFlag = false;
		$$$.message(`Change bedTempFlag. value is ${bedTempFlag}`, DEBUG, 'tool-on-remove-btn.click');
	});

	$('#bed-icon').click(() => {
		$$$.message('Click bed-icon', DEBUG, '$bed-icon.click');
		if(submenuToggle) {
			$$$.message('Expanding subpanel. not show slider-panel-bed', WARN, '$bed-icon.click');
			return;
		}
		$.get(`${baseURL}api/job?apikey=${apiKey}`)
			.done((data) => {
				if(data.state.toLowerCase() != 'printing' && powerFlag) {
					$$$.message('Show bed temperature panel', INFO, '$bed-icon.click');
					$('#slider-panel-bed-ctrl').css({'z-index': 80});
					$$$.message('Change css(z-index:80) slider-panel-bed-ctrl', DEBUG, '$bed-icon.click');
					bedTempFlag = true;
					$$$.message(`Change bedTempFlag. value is ${bedTempFlag}`, DEBUG, '$bed-icon.click');
				} else {
					if(data.state.toLowerCase() == 'printing') $$$.message('Now printing. not show slider-panel-bed', WARN, '$bed-icon.click');
					else if(!powerFlag) $$$.message('Printer is not connected', WARN, '$bed-icon.click');
				}
			}).fail(() =>{
				$$$.message('Printer not found', ERROR, '$bed-icon.click');
			})
	});

	$('#bed-on-sw-btn').click(() => {
		$.get(`${baseURL}api/job?apikey=${apiKey}`)
			.done(function(data){
				if(data.state.toLowerCase() != 'printing' && powerFlag) {
					$$$.message('Click bed-on-sw-btn', DEBUG, '$bed-on-sw-btn.click');
					client.printer.setBedTargetTemperature(bedTempValue);
					$$$.message(`Detect bed temperature. value is ${bedTempValue}`, INFO, '$bed-on-sw-btn.click');
					if(bedTempValue > 0) {
						$('#bed-on-sw-btn').css({color: rescueorange});
						$$$.message('Change css(color:rescueorange) bed-on-sw-btn', DEBUG, '$bed-on-sw-btn.click');
					} else {
						$('#bed-on-sw-btn').css({color: sunshine});
						$$$.message('Change css(color:sunshine) bed-on-sw-btn', DEBUG, '$bed-on-sw-btn.click');
					}
					$('#slider-panel-bed-ctrl').css({'z-index': -1});
					$$$.message('Change css(z-index:-1) slider-panel-bed-ctrl', DEBUG, '$tool-on-sw-btn.click');
					bedTempFlag = false;
					$$$.message(`Change bedTempFlag. value is ${bedTempFlag}`, DEBUG, '$bed-on-sw-btn.click');
				}
			}).fail(function(err){
				$$$.message('Printer not found', ERROR, '$bed-on-sw-btn.click');
			})
	});

	$('#print-icon').click(() => {
		$$$.message('Click print-icon', DEBUG, '$print-icon.click');
		$.get(`${baseURL}api/job?apikey=${apiKey}`)
			.done((data) => {
				if(data.state.toLowerCase() != 'printing' && powerFlag) {
					client.job.start();
					$$$.message('Start print.', DEBUG, '$print-icon.click')
				} else {
					if(!powerFlag) $$$.message('This button is not active(print-icon)', DEBUG, 'print$print-icon.clickClick');
					else if(data.state.toLowerCase() == 'printing') $$$.message('Unable to operate buttons because printing is in progress', INFO, '$print-icon.click');
					return;
				}
			}).fail(() => {
				$$$.message('Printer not found', ERROR, '$printClick');
			});
	});

	$('#left-mark-main').click(() => {
		$$$.message('Click left-mark-main', DEBUG, '$left-mark-main.click');
		leftmarkClick(1);
	});

	$('#right-mark-main').click(() => {
		$$$.message('Click right-mark-main', DEBUG, '$right-mark-main.click');
		rightmarkClick(1);
	});

	$('#down-mark-main').click(() => {
		$$$.message('Click down-mark-main', DEBUG, '$down-mark-main.click');
		downmarkClick(1);
	});

	$('#left-mark-file').click(() => {
		$$$.message('Click left-mark-file', DEBUG, '$left-mark-file.click');
		leftmarkClick(2);
	});

	$('#right-mark-file').click(() => {
		$$$.message('Click right-mark-file', DEBUG, '$right-mark-file.click');
		rightmarkClick(2);
	});

	$('#down-mark-file').click(() => {
		$$$.message('Click down-mark-file', DEBUG, '$down-mark-file.click');
		downmarkClick(2);
	});

	$('#left-mark-manu').click(() => {
		$$$.message('Click left-mark-manu', DEBUG, '$left-mark-manu.click');
		leftmarkClick(3);
	});

	$('#right-mark-manu').click(() => {
		$$$.message('Click right-mark-manu', DEBUG, '$right-mark-manu.click');
		rightmarkClick(3);
	});

	$('#down-mark-manu').click(() => {
		$$$.message('Click down-mark-manu', DEBUG, '$down-mark-manu.click');
		downmarkClick(3);
	});

	$('#left-mark-temp').click(() => {
		$$$.message('Click left-mark-temp', DEBUG, '$left-mark-temp.click');
		leftmarkClick(4);
	});

	$('#right-mark-temp').click(() => {
		$$$.message('Click right-mark-temp', DEBUG, '$right-mark-temp.click');
		rightmarkClick(4);
	});

	$('#down-mark-temp').click(() => {
		$$$.message('Click down-mark-temp', DEBUG, '$down-mark-temp.click');
		downmarkClick(4);
	});
	function leftmarkClick(p) {
		$$$.message(`Call leftmarkClick(${p})`, DEBUG, 'downmarkClick');
		if(windowSize == 1) {
			panelPosition--;
			if(panelPosition < 1) panelPosition = maxPanelPosition;
			$$$.message(`Change panel position. position is ${panelPosition}`, DEBUG, '$left-mark.click');
			$(`#${windowList[panelPosition]}`).css({'z-index': 80});
			$$$.message(`#${windowList[panelPosition]} is shown`, DEBUG, '$left-mark.click');
			if((panelPosition + 1) > maxPanelPosition) $('#' + windowList[1]).css({'z-index': -1});
			else $('#' + windowList[panelPosition + 1]).css({'z-index': -1});
			if((panelPosition + 1) > maxPanelPosition) $$$.message('#' + windowList[1] + ' is hidden', DEBUG, '$right-mark.click');
			else $$$.message(`#${windowList[panelPosition + 1]} is hidden`, DEBUG, '$right-mark.click');
		} else if(windowSize == 2) {
			var panelNo = p;
			panelNo--;
			if(panelNo < 1) panelNo = maxPanelPosition;
			if(panelNo == panel2Array[0] || panelNo == panel2Array[1]) panelNo--;
			if(panelNo < 1) panelNo = maxPanelPosition;
			$$$.message(`panelNo is ${panelNo}`, DEBUG, 'leftmarkClick');
			$$$.message('Identify panel to display', DEBUG, 'leftmarkClick');
			$(`#${windowList[panelNo]}`).css({
				'z-index':	$('#' + windowList[p]).css('z-index'),
				left:		$('#' + windowList[p]).css('left'),
				top:		$('#' + windowList[p]).css('top')
			});
			$$$.message(`Change css(z-index:${$('#' + windowList[p]).css('z-index')}) ${windowList[panelNo]}`, DEBUG, 'leftmarkClick');
			$$$.message(`Change css(left: + ${$('#' + windowList[p]).css('left')}) ${windowList[panelNo]}`, DEBUG, 'leftmarkClick');
			$$$.message(`Change css(top:' + ${$('#' + windowList[p]).css('top')}) ${windowList[panelNo]}`, DEBUG, 'leftmarkClick');
			$(`#${windowList[p]}`).css({'z-index': -1});
			$$$.message(`Change css(z-index:-1) ${windowList[p]}`, DEBUG, 'leftmarkClick');
			if(panel2Array[0] == p) panel2Array[0] = panelNo;
			else if(panel2Array[1] == p) panel2Array[1] = panelNo;
			$$$.message(`Set panel2Array[${panel2Array[0]},${panel2Array[1]}]`, DEBUG, 'leftmarkClick');
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
		$$$.message(`Call rightmarkClick(${p})`, DEBUG, 'downmarkClick');
		if(windowSize == 1) {
			panelPosition++;
			if(panelPosition > maxPanelPosition) panelPosition = 1;
			$$$.message(`Change panel position. position is ${panelPosition}`, DEBUG, '$right-mark.click');
			$(`#${windowList[panelPosition]}`).css({'z-index': 80});
			$$$.message(`#${windowList[panelPosition]} is shown`, DEBUG, '$right-mark.click');
			if((panelPosition - 1) < 1) $(`#${windowList[maxPanelPosition]}`).css({'z-index': -1});
			else $(`#${windowList[panelPosition - 1]}`).css({'z-index': -1});
			if((panelPosition - 1) < 1) $$$.message(`#${windowList[maxPanelPosition]} is hidden`, DEBUG, '$left-mark.click');
			else $$$.message(`#${windowList[panelPosition - 1]} is hidden`, DEBUG, '$left-mark.click');
		} else if(windowSize == 2) {
			var panelNo = p;
			panelNo++;
			if(panelNo > maxPanelPosition) panelNo = 1;
			if(panelNo == panel2Array[0] || panelNo == panel2Array[1]) panelNo++;
			if(panelNo > maxPanelPosition) PanelNo = 1;
			$$$.message(`panelNo is ${panelNo}`, DEBUG, 'rightmarkClick');
			$$$.message('Identify panel to display', DEBUG, 'rightmarkClick');
			$(`#${windowList[panelNo]}`).css({
				'z-index':	$(`#${windowList[p]}`).css('z-index'),
				left:		$(`#${windowList[p]}`).css('left'),
				top:		$(`#${windowList[p]}`).css('top')
			});
			$$$.message(`Change css(z-index:${$('#' + windowList[p]).css('z-index')}) ${windowList[panelNo]}`, DEBUG, 'rightmarkClick');
			$$$.message(`Change css(left:${$('#' + windowList[p]).css('left')}) ${windowList[panelNo]}`, DEBUG, 'rightmarkClick');
			$$$.message(`Change css(top:${$('#' + windowList[p]).css('top')}) ${windowList[panelNo]}`, DEBUG, 'rightmarkClick');
			$(`#${windowList[p]}`).css({'z-index': -1});
			$$$.message(`Change css(z-index:-1) ${windowList[p]}`, DEBUG, 'leftmarkClick');
			if(panel2Array[0] == p) panel2Array[0] = panelNo;
			else if(panel2Array[1] == p) panel2Array[1] = panelNo;
			$$$.message(`Set panel2Array[${panel2Array[0]},${panel2Array[1]}]`, DEBUG, 'rightmarkClick');
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
		$(`#${windowList[panel4Array[0]]}`).css({left: '400px'});
		$(`#${windowList[panel4Array[1]]}`).css({left: '0px'});
		$$$.message('Switch upper panel', DEBUG, 'switchUpperPanel');
		$(`.${windowList[panel4Array[0]].split('-')[0]}-triangle-left`).css({visibility: 'hidden'});
		$(`.${windowList[panel4Array[0]].split('-')[0]}-triangle-right`).css({visibility: 'visible'});
		$(`.${windowList[panel4Array[1]].split('-')[0]}-triangle-left`).css({visibility: 'visible'});
		$(`.${windowList[panel4Array[1]].split('-')[0]}-triangle-right`).css({visibility: 'hidden'});
		$$$.message('Change upper panel triangle css', DEBUG, 'switchUpperPanel');
		var t = panel4Array[0];
		 panel4Array[0] = panel4Array[1];
		panel4Array[1] = t;
		$$$.message(`Set panel4Array[${panel4Array[0]} ,${panel4Array[1]} ,${panel4Array[2]} ,${panel4Array[3]}]`, DEBUG, 'switchUpperPanel');
	}
	function switchLowerPanel() {
		$$$.message('Call switchLowerPanel', DEBUG, 'switchLowerPanel');
		$(`#${windowList[panel4Array[2]]}`).css({left: '400px'});
		$(`#${windowList[panel4Array[3]]}`).css({left: '0px'});
		$$$.message('Switch lower panel', DEBUG, 'switchLowerPanel');
		$(`.${windowList[panel4Array[2]].split('-')[0]}-triangle-left`).css({visibility: 'hidden'});
		$(`.${windowList[panel4Array[2]].split('-')[0]}-triangle-right`).css({visibility: 'visible'});
		$(`.${windowList[panel4Array[3]].split('-')[0]}-triangle-left`).css({visibility: 'visible'});
		$(`.${windowList[panel4Array[3]].split('-')[0]}-triangle-right`).css({visibility: 'hidden'});
		$$$.message('Change lower panel triangle css', DEBUG, 'switchLowerPanel');
		var t = panel4Array[2];
		panel4Array[2] = panel4Array[3];
		panel4Array[3] = t;
		$$$.message(`Set panel4Array[${panel4Array[0]} ,${panel4Array[1]} ,${panel4Array[2]} ,$panel4Array[3]}]`, DEBUG, 'switchLowerPanel');
	}
	function downmarkClick(p) {
		$$$.message('Call downmarkClick(' + p + ')', DEBUG, 'downmarkClick');
		if(panel4Array[2] == p) {
			$(`#${windowList[panel4Array[0]]}`).css({top: '240px'});
			$(`#${windowList[panel4Array[2]]}`).css({top: '0px'});
			$$$.message('Switch left panel', DEBUG, 'downmarkClick');
			$(`.${windowList[panel4Array[0]].split('-')[0]}-triangle-down`).css({visibility: 'visible'});
			$(`.${windowList[panel4Array[2]].split('-')[0]}-triangle-down`).css({visibility: 'hidden'});
			$$$.message('Change left panel triangle css', DEBUG, 'downmarkClick');
			var t = panel4Array[0];
			panel4Array[0] = panel4Array[2];
			panel4Array[2] = t;
			$$$.message(`Set panel4Array[${panel4Array[0]} ,${panel4Array[1]} ,${panel4Array[2]} ,${panel4Array[3]}]`, DEBUG, 'downmarkClick');
		} else if(panel4Array[3] == p) {
			$(`#${windowList[panel4Array[1]]}`).css({top: '240px'});
			$(`#${windowList[panel4Array[3]]}`).css({top: '0px'});
			$$$.message('Switch right panel', DEBUG, 'downmarkClick');
			$(`.${windowList[panel4Array[1]].split('-')[0]}-triangle-down`).css({visibility: 'visible'});
			$(`.${windowList[panel4Array[3]].split('-')[0]}-triangle-down`).css({visibility: 'hidden'});
			$$$.message('Change right panel triangle css', DEBUG, 'downmarkClick');
			var t = panel4Array[1];
			panel4Array[1] = panel4Array[3];
			panel4Array[3] = t;
			$$$.message(`Set panel4Array[${panel4Array[0]} ,${panel4Array[1]} ,${panel4Array[2]} ,${panel4Array[3]}]`, DEBUG, 'downmarkClick');
		}
	}

	$('#reload-btn').click(() => {
		$$$.message('Click reload-btn', DEBUG, '$reload-btn.click');
		getFilelist();
	});

	$('#upload-btn').click(() => {
		$$$.message('Click upload-btn', DEBUG, '$upload-btn.click');
		$$$.message('Trigger file-open-btn click event', DEBUG, '$upload-btn.click');
		document.getElementById('file-open.btn').click();
	});

	$('#file-notice-ctrl').click(() => {
		$$$.message('Click file-notice', DEBUG, '$file-notice-ctrl.click');
		$('#file-notice-ctrl').css({visibility: 'hidden'});
	});

	$('#seed-value-p1').click(() => {
		$$$.message('Click seed-value-p1', DEBUG, '$seed-value-p1.click');
		changeSeedRate(1);
	});

	$('#seed-value-p2').click(() => {
		$$$.message('Click seed-value-p2', DEBUG, '$seed-value-p2.click');
		changeSeedRate(2);
	});

	$('#seed-value-p3').click(() => {
		$$$.message('Click seed-value-p3', DEBUG, '$seed-value-p3.click');
		changeSeedRate(3);
	});

	$('#seed-value-p4').click(() => {
		$$$.message('Click seed-value-p4', DEBUG, '$seed-value-p4.click');
		changeSeedRate(4);
	});
	function changeSeedRate(p) {
		$$$.message('Call changeSeedRate', DEBUG, 'changeSeedRate');
		$(`#seed-value-p${seedRates.indexOf(seedRate)}`).css({'background-color': ceruleanblue});
		$$$.message(`Change css(background-color:ceruleanblue) #seed-value-p${seedRates.indexOf(seedRate)}`, DEBUG, 'changeSeedRate');
		seedRate = Number($(`#seed-value-p${p}`).text().split('mm')[0]);
		if(seedRate == NaN) $$$.message('parseInt error', ERROR, 'changeSeedRate');
		$('#seed-value-p' + p).css(({'background-color': lapislazuli}));
		$$$.message('Change css(background-color:lapislazuli) seed-value-p', DEBUG, 'changeSeedRate');
		$$$.message(`Seed rate is ${seedRate}`, INFO, 'changeSeedRate');
	}

	$('#manu-btn-p1').click(() => {
		$$$.message('Click manu-btn-p1', DEBUG, '$manu-btn-p1.click');
		if(!waitNextClick) {
			$('#manu-btn-p1').css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message('Change css(color:rescueorange) manu-btn-p1', DEBUG, '$manu-btn-p1.click');
			$$$.message('Change css(background-color:peleskyblue) manu-btn-p1', DEBUG, '$manu-btn-p1.click');
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, '$manu-btn-p1.click');
			setTimeout(()=>{restoreButtonCSS('p1')}, 500);
			$$$.message('Execute button click process', DEBUG, '$manu-btn-p1.click');
			if(powerFlag) {
				client.control.sendGcode('G28 X0')
					.done((response) => {
						extruderPosition[0] = 0;
						$$$.message('g-code success', DEBUG, '$manu-btn-p1.click');
					}).fail((err) => {
						$$$.message('trap message alert no 00013', WARN, 'getPrinterFullState');
					});
			} else $$$.message('Printer is not connect', ERROR, '$manu-btn-p1.click');
		}
	});

	$('#manu-btn-p2').click(() => {
		$$$.message('Click manu-btn-p2', DEBUG, '$manu-btn-p2');
		if(!waitNextClick) {
			$('#manu-btn-p2').css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message('Change css(color:rescueorange) manu-btn-p2', DEBUG, '$manu-btn-p2.click');
			$$$.message('Change css(background-color:peleskyblue) manu-btn-p2', DEBUG, '$manu-btn-p2.click');
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, '$manu-btn-p2.click');
			setTimeout(()=>{restoreButtonCSS('p2')}, 500);
			$$$.message('Execute button click process', DEBUG, '$manu-btn-p2.click');
			switch(buttonPosition) {
				case 1:
					bedLevelingPosition(1);
					break;
				case 2:
					diagonalMove(1);
					break;
				case 3:
					break;
			}
		}
	});

	$('#manu-btn-p3').click(() => {
		$$$.message('Click manu-btn-pd', DEBUG, '$manu-btn-p3.click');
		if(!waitNextClick) {
			$('#manu-btn-p3').css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message('Change css(color:rescueorange) manu-btn-p3', DEBUG, '$manu-btn-p3.click');
			$$$.message('Change css(background-color:peleskyblue) manu-btn-p3', DEBUG, '$manu-btn-p3.click');
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, '$manu-btn-p3.click');
			setTimeout(()=>{restoreButtonCSS('p3')}, 500);
			$$$.message('Execute button click process', DEBUG, '$manu-btn-p3.click');
			var pos = extruderPosition[1] + seedRate;
			if(pos > bedSize[1]) pos = bedSize[1];
			if(powerFlag && extruderPosition[1] >= 0) {
				client.control.sendGcode(`G0 Y${pos}MM F1500`)
					.done(() => {
						extruderPosition[1] = pos;
						$$$.message('gCode succcess.', INFO, '$manu-btn-p3.click');
						$$$.message(`Extruder position is x=${extruderPosition[0]} y=${extruderPosition[1]} z=${extruderPosition[2]}`, INFO,  '$manu-btn-p3.click');
					}).fail((err) => {
						$$$.message('trap message alert no 00014', WARN, 'getPrinterFullState');
					});
			} else $$$.message('Y-axis is not at the origin yet', INFO, '$manu-btn-p3.click');
		}
	});

	$('#manu-btn-p4').click(() => {
		$$$.message('Click manu-btn-p4', DEBUG, '$manu-btn-p4');
		if(!waitNextClick) {
			$('#manu-btn-p4').css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message('Change css(color:rescueorange) manu-btn-p4', DEBUG, '$manu-btn-p4.click');
			$$$.message('Change css(background-color:peleskyblue) manu-btn-p4', DEBUG, '$manu-btn-p4.click');
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, '$manu-btn-p4.click');
			setTimeout(()=>{restoreButtonCSS('p4')}, 500);
			$$$.message('Execute button click process', DEBUG, '$manu-btn-p4.click');
			switch(buttonPosition) {
				case 1:
					bedLevelingPosition(2);
					break;
				case 2:
					diagonalMove(2);
					break;
				case 3:
					break;
			}
		}
	});

	$('#manu-btn-p5').click(() => {
		$$$.message('Click manu-btn-p5', DEBUG, '$manu-btn-p5.click');
		if(!waitNextClick) {
			$('#manu-btn-p5').css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message('Change css(color:rescueorange) manu-btn-p5', DEBUG, '$manu-btn-p5.click');
			$$$.message('Change css(background-color:peleskyblue) manu-btn-p5', DEBUG, '$manu-btn-p5.click');
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, '$manu-btn-p5.click');
			setTimeout(()=>{restoreButtonCSS('p5')}, 500);
			$$$.message('Execute button click process', DEBUG, '$manu-btn-p5.click');
			if(powerFlag && extruderPosition[2] >= 0) {
				var pos = extruderPosition[2] + seedRate;
				if(pos > bedSize[2]) pos = bedSize[2];
				client.control.sendGcode(`G0 Z${pos}MM F1500`)
					.done(() => {
						extruderPosition[2] = pos;
						$$$.message('gCode succcess.', INFO, '$manu-btn-p5.click');
						$$$.message(`Extruder position is x=${extruderPosition[0]} y=${extruderPosition[1]} z=${extruderPosition[2]}`, INFO,  '$manu-btn-p5.click');
					}).fail((err) => {
						$$$.message('trap message alert no 00015', WARN, 'getPrinterFullState');
					});
			} else $$$.message('Z-axis is not at the origin yet', INFO, '$manu-btn-p5.click');
		}
	});

	$('#manu-btn-p6').click(() => {
		$$$.message('Click manu-btn-p6', DEBUG, '$manu-btn-p6.click');
		if(!waitNextClick) {
			$('#manu-btn-p6').css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message('Change css(color:rescueorange) manu-btn-p6', DEBUG, '$manu-btn-p6.click');
			$$$.message('Change css(background-color:peleskyblue) manu-btn-p6', DEBUG, '$manu-btn-p6.click');
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, '$manu-btn-p6.click');
			setTimeout(()=>{restoreButtonCSS('p6')}, 500);
			$$$.message('Execute button click process', DEBUG, '$manu-btn-p6.click');
			if(powerFlag) {
				client.control.sendGcode('G28 Y0')
					.done(() => {
						extruderPosition[1] = 0;
						$$$.message('g-code success', DEBUG, '$manu-btn-p6.click');
					}).fail((err) => {
						$$$.message('trap message alert no 00016', WARN, 'getPrinterFullState');
					});
			} else $$$.message('Printer is not connect', ERROR, '$manu-btn-p6.click');
		}
	});

	$('#manu-btn-p7').click(() => {
		$$$.message('Click manu-btn-p7', DEBUG, '$manu-btn-p7.click');
		if(!waitNextClick) {
			$('#manu-btn-p7').css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message('Change css(color:rescueorange) manu-btn-p7', DEBUG, '$manu-btn-p7.click');
			$$$.message('Change css(background-color:peleskyblue) manu-btn-p7', DEBUG, '$manu-btn-p7.click');
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, '$manu-btn-p7.click');
			setTimeout(()=>{restoreButtonCSS('p7')}, 500);
			$$$.message('Execute button click process', DEBUG, '$manu-btn-p7.click');
			if(powerFlag && extruderPosition[0] >= 0) {
				var pos = extruderPosition[0] - seedRate;
				if(pos < 0) pos = 0;
				client.control.sendGcode(`G0 X${pos}MM F1500`)
					.done(() => {
						extruderPosition[0] = pos;
						$$$.message('gCode succcess.', INFO, '$manu-btn-p7.click');
						$$$.message(`Extruder position is x=${extruderPosition[0]} y=${extruderPosition[1]} z=${extruderPosition[2]}`, INFO,  '$manu-btn-p7.click');
					}).fail((err) => {
						$$$.message('trap message alert no 00017', WARN, 'getPrinterFullState');
					});
			} else $$$.message('X-axis is not at the origin yet', INFO, '$manu-btn-p7.click');
		}
	});

	$('#manu-btn-p8').click(() => {
		$$$.message('Click manu-btn-p8', DEBUG, '$manu-btn-p8.click');
		buttonPosition++;
		if(buttonPosition > maxButtonPosition) buttonPosition = 1;
		$$$.message(`Manual panel mode is ${buttonPosition}`, DEBUG, '$manu-btn-p8.click');

		switch(buttonPosition) {
			case 1:
				$('#manu-btn-p2').html('BL');
				$('#manu-btn-p4').html('BR');
				$('#manu-btn-pc').html('FL');
				$('#manu-btn-pe').html('FR');
				break;
			case 2:
				$('#manu-btn-p2').html('<span class="trans-bl glyphicon glyphicon glyphicon-arrow-left"></span>');
				$('#manu-btn-p4').html('<span class="trans-br glyphicon glyphicon glyphicon-arrow-right"></span>');
				$('#manu-btn-pc').html('<span class="trans-fl glyphicon glyphicon glyphicon-arrow-left"></span>');
				$('#manu-btn-pe').html('<span class="trans-fr glyphicon glyphicon glyphicon-arrow-right"></span>');
				break;
			case 3:
				$('#manu-btn-p2').html('M1');
				$('#manu-btn-p4').html('M2');
				$('#manu-btn-pc').html('M3');
				$('#manu-btn-pe').html('M4');
				break;
		}
	});

	$('#manu-btn-p9').click(() => {
		$$$.message('Click manu-btn-p9', DEBUG, '$manu-btn-p9.click');
		if(!waitNextClick) {
			$('#manu-btn-p9').css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message('Change css(color:rescueorange) manu-btn-p9', DEBUG, '$manu-btn-p9.click');
			$$$.message('Change css(background-color:peleskyblue) manu-btn-p9', DEBUG, '$manu-btn-p9.click');
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, '$manu-btn-p9.click');
			setTimeout(()=>{restoreButtonCSS('p9')}, 500);
			$$$.message('Execute button click process', DEBUG, '$manu-btn-p9.click');
			if(powerFlag && extruderPosition[0] >= 0) {
				var pos = extruderPosition[0] + seedRate;
				if(pos > bedSize[0]) pos = bedSize[0];
				client.control.sendGcode(`G0 X${pos}MM F1500`)
					.done(() => {
						extruderPosition[0] = pos;
						$$$.message('gCode succcess.', INFO, '$manu-btn-p9.click');
						$$$.message(`Extruder position is x=${extruderPosition[0]} y=${extruderPosition[1]} z=${extruderPosition[2]}`, INFO,  '$manu-btn-p9.click');
					}).fail((err) => {
						$$$.message('trap message alert no 00018', WARN, 'getPrinterFullState');
					});
			} else $$$.message('X-axis is not at the origin yet', INFO, '$manu-btn-p9.click');
		}
	});

	$('#manu-btn-pa').click(() => {
		$$$.message('Click manu-btn-pa', DEBUG, '$manu-btn-pa.click');
		if(!waitNextClick) {
			$('#manu-btn-pa').css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message('Change css(color:rescueorange) manu-btn-pa', DEBUG, '$manu-btn-pa.click');
			$$$.message('Change css(background-color:peleskyblue) manu-btn-pa', DEBUG, '$manu-btn-pa.click');
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, '$manu-btn-pa.click');
			setTimeout(()=>{restoreButtonCSS('pa')}, 500);
			$$$.message('Execute button click process', DEBUG, '$manu-btn-pa.click');
			if(powerFlag) {
				client.control.sendGcode('G28 Z0')
					.done(() => {
						extruderPosition[2] = 0;
						$$$.message('g-code success', DEBUG, '$manu-btn-pa.click');
					});
			} else $$$.message('Printer is not connect', ERROR, '$manu-btn-pa.click');
		}
	});

	$('#manu-btn-pb').click(() => {
		$$$.message('Click manu-btn-pb', DEBUG, '$manu-btn-pb.click');
		if(!waitNextClick) {
			$('#manu-btn-pb').css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message('Change css(color:rescueorange) manu-btn-pb', DEBUG, '$manu-btn-pb.click');
			$$$.message('Change css(background-color:peleskyblue) manu-btn-pb', DEBUG, '$manu-btn-pb.click');
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, '$manu-btn-pb.click');
			setTimeout(()=>{restoreButtonCSS('pb')}, 500);
			$$$.message('Execute button click process', DEBUG, '$manu-btn-pb.click');
			if(powerFlag) {
				client.control.sendGcode('G28 Z0')
					.done(() => {
						extruderPosition[2] = 0;
						$$$.message('g-code success', DEBUG, '$manu-btn-pb.click');
					}).fail((err) => {
						$$$.message('trap message alert no 00019', WARN, 'getPrinterFullState');
					});
			} else $$$.message('Printer is not connect', ERROR, '$manu-btn-pb.click');
		}
	});

	$('#manu-btn-pc').click(() => {
		$$$.message('Click manu-btn-pc', DEBUG, '$manu-btn-pc');
		if(!waitNextClick) {
			$('#manu-btn-pc').css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message('Change css(color:rescueorange) manu-btn-pc', DEBUG, '$manu-btn-pc.click');
			$$$.message('Change css(background-color:peleskyblue) manu-btn-pc', DEBUG, '$manu-btn-pc.click');
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, '$manu-btn-pc.click');
			setTimeout(()=>{restoreButtonCSS('pc')}, 500);
			$$$.message('Execute button click process', DEBUG, '$manu-btn-pc.click');
			switch(buttonPosition) {
				case 1:
					bedLevelingPosition(3);
					break;
				case 2:
					diagonalMove(3);
					break;
				case 3:
					break;
			}
		}
	});

	$('#manu-btn-pd').click(() => {
		$$$.message('Click manu-btn-pd', DEBUG, '$manu-btn-pd.click');
		if(!waitNextClick) {
			$('#manu-btn-pd').css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message('Change css(color:rescueorange) manu-btn-pd', DEBUG, '$manu-btn-pd.click');
			$$$.message('Change css(background-color:peleskyblue) manu-btn-pd', DEBUG, '$manu-btn-pd.click');
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, '$manu-btn-pd.click');
			setTimeout(()=>{restoreButtonCSS('pd')}, 500);
			$$$.message('Execute button click process', DEBUG, '$manu-btn-pd.click');
			if(powerFlag && extruderPosition[1] >= 0) { 
				var pos = extruderPosition[1] - seedRate;
				if(pos < 0) pos = 0;
				console.log(pos);
				client.control.sendGcode(`G0 Y${pos}MM F1500`)
					.done(() => {
						extruderPosition[1] = pos;
						$$$.message('gCode succcess.', INFO, '$manu-btn-pd.click');
						$$$.message(`Extruder position is x=${extruderPosition[0]} y=${extruderPosition[1]} z=${extruderPosition[2]}`, INFO,  '$manu-btn-pd.click');
					}).fail((err) => {
						$$$.message('trap message alert no 00020', WARN, 'getPrinterFullState');
					});
			} else $$$.message('Y-axis is not at the origin yet', INFO, '$manu-btn-pd.click');
		}
	});

	$('#manu-btn-pe').click(() => {
		$$$.message('Click manu-btn-pe', DEBUG, '$manu-btn-pe');
		if(!waitNextClick) {
			$('#manu-btn-pe').css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message('Change css(color:rescueorange) manu-btn-pe', DEBUG, '$manu-btn-pe.click');
			$$$.message('Change css(background-color:peleskyblue) manu-btn-pe', DEBUG, '$manu-btn-pe.click');
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, '$manu-btn-pe.click');
			setTimeout(()=>{restoreButtonCSS('pe')}, 500);
			$$$.message('Execute button click process', DEBUG, '$manu-btn-pe.click');
			switch(buttonPosition) {
				case 1:
					bedLevelingPosition(4);
					break;
				case 2:
					diagonalMove(4);
					break;
				case 3:
					break;
			}
		}
	});

	$('#manu-btn-pf').click(() => {
		$$$.message('Click manu-btn-pf', DEBUG, '$manu-btn-pf.click');
		if(!waitNextClick) {
			$('#manu-btn-pf').css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message('Change css(color:rescueorange) manu-btn-pf', DEBUG, '$manu-btn-pf.click');
			$$$.message('Change css(background-color:peleskyblue) manu-btn-pf', DEBUG, '$manu-btn-pf.click');
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, '$manu-btn-pf.click');
			setTimeout(()=>{restoreButtonCSS('pf')}, 500);
			$$$.message('Execute button click process', DEBUG, '$manu-btn-pf.click');
			if(powerFlag && extruderPosition[2] >= 0) {
				var pos = extruderPosition[2] - seedRate;
				if(pos < 0) pos = 0;
				client.control.sendGcode(`G0 Z${pos}MM F1500`)
					.done(() => {
						extruderPosition[2] = pos;
						$$$.message('gCode succcess.', INFO, '$manu-btn-pf.click');
						$$$.message(`Extruder position is x=${extruderPosition[0]} y=${extruderPosition[1]} z=${extruderPosition[2]}`, INFO,  '$manu-btn-pf.click');
					}).fail((err) => {
						$$$.message('trap message alert no 00021', WARN, 'getPrinterFullState');
					});
			} else $$$.message('Z-axis is not at the origin yet', INFO, '$manu-btn-pf.click');
		}
	});
	function bedLevelingPosition(p) {
		$$$.message('Call bedLevelingPostion', DEBUG, 'bedLevelingPosition');
		var x, y;
		switch(p) {
			case 1:
				x = bedMargin;
				y = bedSize[1] - bedMargin;
				break;
			case 2:
				x = bedSize[0] - bedMargin;
				y = bedSize[1] - bedMargin;
				break;
			case 3:
				x = bedMargin;
				y = bedMargin;
				break;
			case 4:
				x = bedSize[0] - bedMargin;
				y = bedMargin;
				break;
		}
		$$$.message(`Set${bedPositionName} position value. x=${x} y=${y}`, DEBUG, 'bedLevelingPosition');
		if(powerFlag && extruderPosition[0] >= 0 && extruderPosition[1] >= 0 && extruderPosition[2] >= 0) {
			$$$.message('Move z-axis up', DEBUG, 'bedLevelingPosition');
			client.control.sendGcode('G0 Z5MM')
				.done(() => {
					$$$.message('Move x and y-axis up', DEBUG, 'bedLevelingPosition');
					client.control.sendGcode(`G0 X${x}MM Y${y}MM F1500`)
						.done(() => {
							client.control.sendGcode('G28 Z0')
								.done(() => {
									$$$.message('Finish moving', DEBUG, 'bedLevelingPosition')
								}).fail((err) => {
									$$$.message('trap message alert no 00022', WARN, 'getPrinterFullState');
								});
						}).fail((err) => {
							$$$.message('trap message alert no 00023', WARN, 'getPrinterFullState');
						});
				});
		}
	}
	function diagonalMove(p) {
		$$$.message('diagonalMove', DEBUG, 'diagonalMove');
		var x, y;
		if(powerFlag && extruderPosition[0] >= 0 && extruderPosition[1] >= 0) {
			switch(p) {
				case 1:
					x = extruderPosition[0] - seedRate;
					y = extruderPosition[1] + seedRate;
					if(x < 0) x = 0;
					if(y > bedSize[1]) y = bedSize[1];
					break;
				case 2:
					x = extruderPosition[0] + seedRate;
					y = extruderPosition[1] + seedRate;
					if(x > bedSize[0]) x = bedSize[0];
					if(y > bedSize[1]) y = bedSize[1];
					break;
				case 3:
					x = extruderPosition[0] - seedRate;
					y = extruderPosition[1] - seedRate;
					if(x < 0) x = 0;
					if(y < 0) y = 0;
					break;
				case 4:
					x = extruderPosition[0] + seedRate;
					y = extruderPosition[1] - seedRate;
					if(x > bedSize[0]) x = bedSize[0];
					if(y < 0) y = 0;
					break;
			}
			client.control.sendGcode(`G0 X${x}MM Y${y}MM F1500`)
				.done(() => {
					extruderPosition[0] = x;
					extruderPosition[1] = y;
					$$$.message('gCode succcess.', INFO, 'diagonalMove');
					$$$.message(`Extruder position is x=${x} y=${y} z=${extruderPosition[2]}`, INFO,  'diagonalMove');
				}).fail((err) => {
					$$$.message('trap message alert no 00024', WARN, 'getPrinterFullState');
				});
		}
	}
	function restoreButtonCSS(bn) {
		$$$.message('Call restoreButtonCSS', DEBUG, 'restoreButtonCSS');
		waitNextClick = false;
		$$$.message('Change waitNextClick. value is ' + waitNextClick, DEBUG, 'restoreButtonCSS');
		if(bn == 'up' || bn == 'down') {
			$('#extruder-btn-' + bn).css({
				color:				sunshine,
				'background-color':	lapislazuli
			});
			$$$.message(`Change css(color:sunshine) extruder-btn-${bn}`, DEBUG, 'restoreButtonCSS');
			$$$.message(`Change css(background-color:lapislazuli) extruder-btn-${bn}`, DEBUG, 'restoreButtonCSS');
		} else {
			$('#manu-btn-' + bn).css({
				color:				sunshine,
				'background-color':	lapislazuli
			})
			$$$.message(`Change css(color:sunshine) manu-btn-${bn}`, DEBUG, 'restoreButtonCSS');
			$$$.message(`Change css(background-color:lapislazuli) extruder-btn-${bn}`, DEBUG, 'restoreButtonCSS');
		}
	}

	$('#extruder-btn-up').click(() => {
		$$$.message('Click extruder-btn-up', DEBUG, '$extruder-btn-up.click');
		if(!canRunExtruder || !powerFlag) {
			$$$.message('Dispensable temperature not reached', WARN, '$extruder-btn-up.click');
			return;
		}
		if(!waitNextClick) {
			$('#extruder-btn-up').css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message('Change css(color:rescueorange) manu-btn-pe', DEBUG, '$extruder-btn-up.click');
			$$$.message('Change css(background-color:peleskyblue) manu-btn-pe', DEBUG, '$extruder-btn-up.click');
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, '$extruder-btn-up.click');
			setTimeout(()=>{restoreButtonCSS('up')}, 500);
			if(powerFlag && canRunExtruder) {
			client.control.sendGcode('G92 E0')
				.done(() => {
					$$$.message('Reset extruder retract position', DEBUG, '$extruder-btn-up.click');
					client.control.sendGcode(`G1 E-${$('#amount-value').val()}MM`)
						.done(() => {
							$$$.message(`Retract filament ${$('#amount-value').val()}mm`, DEBUG, '$extruder-btn-up.click');
						}).fail((err) => {
							$$$.message('trap message alert no 00025', WARN, 'getPrinterFullState');
						});
				}).fail((err) => {
					$$$.message('trap message alert no 00026', WARN, 'getPrinterFullState');
				});
			}
		}
	});

	$('#extruder-btn-down').click(() => {
		$$$.message('Click extruder-btn-down', DEBUG, '$extruder-btn-down.click');
		if(!canRunExtruder || !powerFlag) {
			$$$.message('Dispensable temperature not reached', WARN, '$extruder-btn-down.click');
			return;
		}
		if(!waitNextClick) {
			$('#extruder-btn-down').css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message('Change css(color:rescueorange) manu-btn-pe', DEBUG, '$extruder-btn-down.click');
			$$$.message('Change css(background-color:peleskyblue) manu-btn-pe', DEBUG, '$extruder-btn-down.click');
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, '$extruder-btn-down.click');
			setTimeout(()=>{restoreButtonCSS('down')}, 500);
			if(powerFlag && canRunExtruder) {
				console.log(`G1 E${$('#amount-value').val()}MM`);
				client.control.sendGcode('G92 E0')
					.done(() => {
						$$$.message('Reset extruder extrud position', DEBUG, '$extruder-btn-down.click');
						client.control.sendGcode(`G1 F500 E${$('#amount-value').val()}MM`)
							.done(() => {
								$$$.message(`Extrud filament ${$('#amount-value').val()}mm`, DEBUG, '$extruder-btn-down.click');
							}).fail((err) => {
								$$$.message('trap message alert no 00026', WARN, 'getPrinterFullState');
							});
					}).fail((err) => {
						$$$.message('trap message alert no 00027', WARN, 'getPrinterFullState');
					});
			}
		}
	});

	$('#extruder-tag').click(() => {
		$$$.message('Click extruder-tag', DEBUG, '$extruder-tag.click');
		if(extruderPanelShown) {
			$('.extruder-panel').css({visibility: 'hidden'});
			$('#extruder-tag').css({top: '0px'});
			$$$.message('Change css(visibility:hidden) extruder-panel', DEBUG, '$extruder-tag.click');
			$$$.message('Change css(top:0px) extruder-panel-tag', DEBUG, '$extruder-tag.click');
			extruderPanelShown = false;
			$$$.message(`Change extruderPanelShown. value is ${extruderPanelShown}`, DEBUG, '$extruder-tag.click');
		} else {
			$('.extruder-panel').css({visibility: 'visible'});
			$('#extruder-tag').css({top: '80px'});
			$$$.message('Change css(visibility:visible) extruder-panel', DEBUG, '$extruder-tag.click');
			$$$.message('Change css(top:80px) extruder-panel-tag', DEBUG, '$extruder-tag.click');
			extruderPanelShown = true;
			$$$.message(`Change extruderPanelShown. value is ${extruderPanelShown}`, DEBUG, '$extruder-tag.click');
		}
	});
});