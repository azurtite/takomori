let sunshine		= '#FFDC00';
let rescueorange	= '#EA5405';
let ceruleanblue	= '#008DB7';
let forestleaf		= '#008554';

let powerFlag		= false;
let submenuToggle	= false;
var windowSize		= 1;
let maxWindowSize	= 3;

var client = new OctoPrintClient({
	baseurl:	'http://192.168.0.14/',
	apikey:		'241B873D3FF8408FB95E1DB8510F81CC'
});
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
			client.connection.disconnect()
				.done(function(response){
					console.info('Disconnect success')
					client.browser.logout()
						.done(function(response){
							console.info('Logout success');
							$('.nav-off').css({color: sunshine});
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
});