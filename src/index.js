let sunshine		= '#FFDC00';
let rescueorange	= '#EA5405';
let ceruleanblue	= '#008DB7';
let forestleaf		= '#008554';

let powerFlag		= false;
let tool0Flag		= false;
let bedFlag			= false;
let fanFlag			= false;
let toolTempFlag	= false;
let bedTempFlag		= false;
let submenuToggle	= false;
let windowSize		= 1;
let maxWindowSize	= 3;
let intervalID		= undefined;
let toolTempValue	= 0;
let bedTempValue	= 0;

let client = new OctoPrintClient({
	baseurl:	'http://192.168.0.14/',
	apikey:		'241B873D3FF8408FB95E1DB8510F81CC'
});

let $$$ = new logMan(true, false);

window.resizeTo(400, 240);

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

$(function(){
	if(client == undefined) {
		$('.alert-text').text('Failed to create OctoPrint object')
		$('.alert-panel').css({visibility: 'visible'});
	}

	$('#progressbar-one').addClass('progress-bar-forestleaf');
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
						intervalID = setInterval(getPrinterFullState, 1000);
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
		if(windowSize > maxWindowSize) windowSize = 1;
		$$$.message('Screen mode is ' + windowSize, INFO, '$fullscreen-btn');
		if(windowSize == 1) {
			$$$.message('Window size is 400 x 240', LOWDEBUG, '$fullscreen-btn');
			window.resizeTo(400,240);
		} else if(windowSize == 2) {
			$$$.message('Window size is 800 x 240', LOWDEBUG, '$fullscreen-btn');
			window.resizeTo(800,240);
		} else if(windowSize == 3) {
			$$$.message('Window size is 800 x 480', LOWDEBUG, '$fullscreen-btn');
			window.resizeTo(800,480);
		}
	});
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
		$$$.message('Click tool-on-remove', DEBUG, '$tool-on-remove-btn.click');
		$('#slider-panel-tool-ctrl').css({'z-index': -1});
		toolTempFlag = false;
		$$$.message('Change toolTempFlag. value is ' + toolTempFlag, DEBUG, 'tool-on-remove-btn.click');
	});
	/**
	 * tool icon click event
	 */
	$('#tool-icon').click(function(){
		$$$.message('Click tool-icon', DEBUG, '$tool-icon.click');
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
	 * bed icon click event
	 */
	$('#bed-icon').click(function(){
		$$$.message('Click bed-icon', DEBUG, '$bed-icon.click');
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
});