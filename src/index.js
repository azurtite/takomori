let sunshine		= '#FFDC00';
let rescueorange	= '#EA5405';
let ceruleanblue	= '#008DB7';
let forestleaf		= '#008554';

let powerFlag		= false;
let submenuToggle	= false;
var windowSize		= 1;
let maxWindowSize	= 3;

$(function(){
	$('#progressbar-one').addClass('progress-bar-forestleaf');
	/**
	 * Power button click event
	 */
	$('#power-btn').click(function(){
		if(powerFlag) {
			console.info('Click powerbtn(on>off)');
			$('.nav-off').css({color: sunshine});
			powerFlag = false;
		} else {
			console.info('Click powerbtn(off>on)');
			$('.nav-off').css({color: rescueorange});
			powerFlag = true;
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