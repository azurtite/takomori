var logMan = new Object();
/**
 * define constants
 */
const NOTASSIGN			= 0;
const DEADLY			= 1;
const ERROR				= 2;
const WARN				= 3;
const INFO				= 4;
const DEBUG				= 5;
const LOWINFO			= 6;
const LOWDEBUG			= 7;
const SENDCONSOLE		= 101;
const NOTSENDCONSOLE	= 102;
const DISPOSE			= 203;
const TYPE				= ['N/A', 'Deadly', 'Error', 'Warm', 'Info', 'Debug', 'Info(low)', 'Debug(low)'];

logMan.appendMills		= true;
logMan.debugLevel		= 1
logMan.dispose			= false;
logMan.hideLowPriority	= true;
logMan.log				= [];
logMan.logLine			= 0;
logMan.sendConsole		= true;
logMan.fullDump			= function(options = undefined) {
	if(options != undefined) {
		if(typeof options != 'object') {
			console.error('Argument must be JSON');
			return false;
		}
	}

	for(var i=0; i<this.log.length; i++) {
		let date	= this.timeStamp(this.log[i].time);
		let out		= date[0] + ' [' + TYPE[this.log[i].type] + ']';
		if('position' in this.log[i]) out = out +'(' + this.log[i].position + ')';
		out += this.log[i].msg;

		if(typeof options == 'object')
			if('types' in options && typeof options == 'object')
				if(options.types.indexOf(this.log[i].type) == -1) continue;
		if(typeof options == 'object')
			if('positions' in options)
				if(options.positions.indexOf(this.log[i].position) == -1) continue;
		if(this.log[i].type < 2) console.error(out);
		else if(this.log[i].type == 3) console.warn(out);
		else console.info(out);
	}
	return true;
}
logMan.message			= function(msg, ...args) {
	function consoleOut() {
		let out = date[0] + ' [' + TYPE[type] + ']';
		if('position' in data) out = out + '(' + data.position + ')';
		out += msg;
		if(type < 2) console.error(out);
		else if(type == 3) console.warn(out);
		else console.info(out);
	}
	
	let data, position, type;
	let date	= this.timeStamp();
	let dispose	= this.dispose;
	let send	= this.sendConsole;

	for(var i=0; i<args.length; i++) {
		if(args[i] < 100) type = args[i];
		else if(args[i] == SENDCONSOLE) send = ture;
		else if(args[i] == NOTSENDCONSOLE) send = false;
		else if(args[i] == DISPOSE) dispose = true;
		else if(typeof args[i] == 'string') position = args[i];
	}
	if(type == undefined) {
		console.error('No log level specified');
		return false;
	}

	data = {
		msg:	msg,
		time:	date[1],
		type:	type
	}
	if(position != undefined) data.position = position;

	if(send) {
		if(this.hideLowPriority) {
			if(type < 6) consoleOut();
		} else {
			consoleOut();
		}
	}

	if(!dispose) {
		this.log[this.logLine] = data;
		this.logLine++;
		return true;
	}
}
logMan.timeStamp		= function(...args) {
	var now = new Date();
	if(typeof args[0] == 'number') now.setTime(args[0]);

	var year	= String(now.getFullYear());
	var month	= String(now.getMonth() + 1);
	if(month.length < 2) month = '0' + month;
	var day		= String(now.getDate());
	if(day.length < 2) day = '0' + day;
	var hour	= String(now.getHours());
	if(hour.length < 2) hour = '0' + hour;
	var minutes	= String(now.getMinutes());
	if(minutes.length < 2) minutes = '0' + minutes;
	var second	= String(now.getSeconds());
	if(second.length < 2) second = '0' + second;
	var mills	= String(now.getMilliseconds());
	if(mills.length < 2) mills = '00' + mills;
	else if(mills.length < 3) mills = '0' + mills;

	var result =  [year + month + day + 'T' + hour  + ':' + minutes + ':' + second, now.getTime()];
	if(this.appendMills) result[0] = result[0] + '.' + mills;
	return result;
}
