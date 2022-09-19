let sunshine		= '#FFDC00';
let rescueorange	= '#EA5405';
let ceruleanblue	= '#008DB7';
let forestleaf		= '#008554';

let powerFlag		= false;
let tool0Flag		= false;
let bedFlag			= false;
let fanFlag			= false;
let submenuToggle	= false;
let windowSize		= 1;
let maxWindowSize	= 3;
let intervalID		= undefined;

let client = new OctoPrintClient({
	baseurl:	'http://192.168.0.14/',
	apikey:		'241B873D3FF8408FB95E1DB8510F81CC'
});

/**
 * getPrinterFullSate()
 */
function getPrinterFullState() {
	if(client == undefined) {
		$('.alert-text').text('hoge');
		return false;
	}

	client.printer.getFullState()
		.done(function(response){
			console.info('Update tool0 temperature value');
			if('tool0' in response.temperature)
				$('#tool-text').text(response.temperature.tool0.actual+'C');
			console.info('Update bed temperature value');
			if('bed' in response.temperature)
				$('#bed-text').text(response.temperature.bed.actual+'C');

			if('tool0' in response.temperature) {
				console.info('Target temperatue check');
				if(response.temperature.tool0.target > 0) {
					console.info('Update tool0 target temperatue value and icon(on)');
					$('#tool-target-text').text(response.temperature.tool0.target+'C');
					$('#tool-icon').css({color: rescueorange});
				} else {
					console.info('Update tool0 target temperatue value and icon(off)');
					$('#tool-target-text').text('N/A');
					$('#tool-icon').css({color: sunshine});
				}
			}

			if('bed' in response.temperature) {
				console.info('Target temperatue check');
				if(response.temperature.bed.target > 0) {
					console.info('Update tool0 target temperatue value and icon(on)');
					$('#bed-target-text').text(response.temperature.bed.target+'C');
					$('#bed-icon').css({color: rescueorange});
				} else {
					console.info('Update tool0 target temperatue value and icon(off)');
					$('#bed-target-text').text('N/A');
					$('#bed-icon').css({color: sunshine});
				}
			}
		}).fail(function(response){});
}
/**
 * resetMonitorText()
 */
function resetMonitorText() {
	console.info('resetMonitorText::Set tool text and icon to default')
	$('#tool-text').text('N/A');
	$('#tool-target-text').text('N/A');
	$('#too-icon').css({color: sunshine});

	console.info('resetMonitorText::Set bed text and icon to default')
	$('#bed-text').text('N/A');
	$('#bed-target-text').text('N/A');
	$('#bed-icon').css({color: sunshine});

	console.info('resetMonitorText::set fan text and icon to default');
	$('#fan-text').text('0%');
	$('#fan-icon').css({color: sunshine});
}
/**
 * postProcess()
 */
function postProcess() {
	console.info('postProcess::Start Function');
	if(powerFlag) {
		client.printerprofiles.get('_default')
			.done(function(response){
				switch(response.model.toUpperCase().match('MARLIN')[0]) {
					case 'MARLIN':
						client.control.sendGcode('M107');
						console.info('postProcess::Stop fan(speed 0%)');
						break;
				}
			}) 
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
		if(powerFlag) {
			console.info('Click powerbtn(on>off)');
			postProcess();
			client.connection.disconnect()
				.done(function(response){
					console.info('Disconnect success')
					client.browser.logout()
						.done(function(response){
							console.info('Logout success');
							$('.nav-off').css({color: sunshine});
							clearInterval(intervalID);
							resetMonitorText();
							powerFlag = false;
						}).fail(function(response){
							console.error('Logout failure');
						});
				}).fail(function(response){
					console.error('Disconnect failure');
					$('.alert-text').text('Error: Failed to disconnect to printer');
					$('#alert-pnl').css({visibility: 'visible'});
				})
		} else {
			console.info('Click powerbtn(off>on)');
			client.browser.login('mozukuSu', 'ooxot8795SH', true)
				.done(function(response){
					console.info('Login success');
					client.connection.connect({
						port:			'/dev/ttyACM0',
						baudrate:		115200,
						printerProfile:	'_default',
						save:			true,
						autoconnect:	false
					}).done(function(response){
						console.info('Connection success');
						$('.nav-off').css({color: rescueorange});
						powerFlag = true;
						intervalID = setInterval(getPrinterFullState, 1000);
					}).fail(function(response){
						console.error('Connection failure');
						$('.alert-text').text('Error: Failed to connect to printer');
						$('#alert-pnl').css({visibility: 'visible'});
					});
				}).fail(function(response){
					console.error('Login failure');
					$('.alert-text').text('Error: Failed to login to octoprint server');
					$('#alert-pnl').css({visibility: 'visible'});
				});
		}
	});
	/**
	 * Sub menu button click event
	 */
	$('#submenu-btn').click(function(){
		console.info('Click submen ctrl btn');

		if(submenuToggle) {
			console.info('Hide submenu');
			$('.nav-submenu').css({right: '-285px'});
			submenuToggle = false;
		} else {
			console.info('Show submenu');
			$('.nav-submenu').css({right: '0px'});
			submenuToggle = true;
		}
	});
	/**
	 * Fullscreen button click event
	 */
	$('#fullscreen-btn').click(function(){
		console.log('Click fullscreen btn');
		windowSize++;
		if(windowSize > maxWindowSize) windowSize = 1;
		console.log('Screen mode is ' + windowSize);
	});
	/**
	 * alert ok button click event
	 */
	$('#alert-ok-btn').click(function(){
		console.log('Click alert-ok btn');
		$('.alert-panel').css({visibility: 'hidden'});
	});
	/**
	 * Close button click event
	 */
	$('#remove-btn').click(function(){
		console.info('Click close btn');
		window.close();
	});
	$("#suspend-btn").click(function(){
		console.info('Click suspend btn');
		window.close();
	});
	/**
	 * fan icon click event
	 */
	$('#fan-icon').click(function(){
		console.info('jQuery::Click fan icon');
		console.info('jQuery::Detect firmware type');
		let firmType;
		if(powerFlag) {
			client.printerprofiles.get('_default')
				.done(function(response){
					firmType = response.model;
					firmType = firmType.toUpperCase();
					console.info('jQuery::Firmware type is ' + firmType);
		
					var result = firmType.match('MARLIN');
					if(fanFlag) {
						switch(result[0]) {
							case 'MARLIN':
								client.control.sendGcode('M107 P1')
									.done(function(){
										console.info('jQuery::Stop fan(0%)');
										$('#fan-icon').css({color: sunshine});
										$('#fan-text').text('0%');
										fanFlag = false;
									}).fail(function(){
										console.error('jQuery::Can not operate fan speed');
									});
								break;
						}
					} else {
						switch(result[0]) {
							case 'MARLIN':
								client.control.sendGcode('M106 P1 S255')
									.done(function(){
										console.info('jQuery::Rotate fan(speed 100%)');
										$('#fan-icon').css({color: rescueorange});
										$('#fan-text').text('100%');
										fanFlag = true;
									}).fail(function(){
										console.error('jQuery::Can not operate fan speed');
									});
								break;
						}
					}
				});
		} else {
			console.error('jQuery::Printer is not connect');
			return;
		}
	});
});