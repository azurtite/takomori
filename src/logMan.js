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
const TYPE				= ['N/A', 'Deadly', 'Error', 'Warn', 'Info', 'Debug', 'Info(low)', 'Debug(low)'];

logMan.appendMills		= true;
logMan.debugLevel		= 1
logMan.dispose			= false;
logMan.hideLowPriority	= true;
logMan.log				= [];
logMan.logLine			= 0;
logMan.sendConsole		= true;
/**
 * fullDump ログを出力する
 * 
 * @param {JSON} options 
 *		types 		{array} 指定した警報レベルのログのみ出力する
 *			ex) logMan.fullDump({types:[ERROR, WARN]});
 *				エラーと警告のみ
 *		positions	{array} 指定したしおりのログのみ出力する
 *			ex) logMan.fullDump({positions:['testpoint-1']});
 *		scope		{json} 時間を指定してログを出力する
 *			ex) logMan.fullDump({
 *							scope:{
 *								start:	'2022-09-21T19:21:30.939',
 *								end:	'2022-09-21T19:35:30.425'
 *							}
 *						});
 *		showHide	{boolean} INFO(low)とDEBUG(low)の出力を制御する
 * 							　このパラメータ指定時はhideLowProprotuは無視される
 * 			ex) logMan.fullDump({showHide: true});
 * @returns 
 */
logMan.fullDump			= function(options = undefined) {
	if(options != undefined) {
		if(typeof options != 'object') {
			console.error('Argument must be JSON');
			return false;
		}
	}
	/**
	 * Scope processing
	 */
	let scopeStart, scopeEnd;
	if(typeof options == 'object')
		if('scope' in options) {
			if('start' in options.scope) {
				scopeStart = new Date(options.scope.start).getTime();
				if(isNaN(scopeStart)) return false;
			}
			if('end' in options.scope) {
				scopeEnd = new Date(options.scope.end).getTime();
				if(isNaN(scopeEnd)) return false;
			}
		}

	for(var i=0; i<this.log.length; i++) {
		let date	= this.timeStamp(this.log[i].time);
		let out		= date[0] + ' [' + TYPE[this.log[i].type] + ']';
		if('position' in this.log[i]) out = out +'(' + this.log[i].position + ')';
		out += this.log[i].msg;

		if(typeof options == 'object') {
			if('types' in options)
				if(options.types.indexOf(this.log[i].type) == -1) continue;
			if('positions' in options) 
				if(options.positions.indexOf(this.log[i].position) == -1) continue;
			if('showHide' in options)
				if(typeof options.showHide == 'boolean')
					if(options.showHide) {
						if(this.log[i].type < 3) console.error(out);
						else if(this.log[i].type == 3) console.warn(out);
						else console.info(out);
						continue;
					} else if(this.log[i].type > 5) continue;
		}
		if(typeof scopeStart == 'number')
			if(this.log[i].time < scopeStart) continue;
		if(typeof scopeEnd == 'number')
			if(this.log[i].time > scopeEnd) continue;
		if(this.log[i].type < 3) console.error(out);
		else if(this.log[i].type == 3) console.warn(out);
		else if(this.log[i].type > 5 && !this.hideLowPriority) console.info(out);
		else console.info(out);
	}
	return true;
}
/**
 * 
 * @param {*} msg			メッセージ文字列 
 * @param  {...any} args
 * 					(CONSTANT TYPE):メッセージの種類を指定['Deadly', 'Error', 'Warn', 'Info', 'Debug', 'Info(low)', 'Debug(low)']
 * 					SENDCONSOLE:	メッセージをコンソールに表する
 * 					NOSENDCONSOLE:	メッセージをコンソールに表示しない
 * 					(String):		メッセージにしおりを追加する
 * 					※不要パラメータは省略可能
 * 					
 * 					ex) logMan.message('this is test Message', 'test-point1',ERROR, SENDCONSOLE);
 * 					> 20220924T07:46:48.752 [Error](test-point1)this is test Message
 * @returns 
 */
logMan.message			= function(msg, ...args) {
	function consoleOut() {
		let out = date[0] + ' [' + TYPE[type] + ']';
		if('position' in data) out = out + '(' + data.position + ')';
		out += msg;
		if(type < 3) console.error(out);
		else if(type == 3) console.warn(out);
		else console.info(out);
	}
	
	let data, position, type;
	let date	= this.timeStamp();
	let dispose	= this.dispose;
	let send	= this.sendConsole;

	for(var i=0; i<args.length; i++) {
		if(args[i] < 100) type = args[i];
		else if(args[i] == SENDCONSOLE) send = true;
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