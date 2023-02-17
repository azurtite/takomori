let sunshine			= `#FFDC00`;
let rescueorange		= `#EA5405`;
let ceruleanblue		= `#008DB7`;
let forestleaf			= `#008554`;
let peleskyblue			= `#C2E5F9`;
let lapislazuli			= `#261F87`;
let skyhigh				= `#51A5DC`;
let flameOrange			= '#ee7700';

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
let buttonPosition		= 1;
let maxButtonPosition	= 3;
let waitNextClick		= false;
let bedMargin			= 10;
let canRunExtruder		= false;
let extruderMovingTemp	= 200;
let extruderPanelShown	= false;
let actionPowerBtnClick	= false;
let locationPath		= ``;
let contentPosition		= 0;
let maxContentPosition	= 3;
let subPanelSize		= 2;
let subMenuPanelOpen	= false;
let subMenuPanelName	= '';

let folderList			= [`/`];
let windowList			= [null, `main-window-ctrl`, `file-window-ctrl`, `manu-window-ctrl`, `temp-window-ctrl`];
let feedAmount			= [0];
let feedAmountBigP1		= [0];
let feedAmountBigP2		= [0];
let extruderPosition	= [-99, -99, -99];
let bedSize				= [220, 220, 250];
let bedPositionName		= [`rear-left`, `rear-right`, `front-left`, `front-right`];

const btnNameToBedPos	= ['', `9x9-21`, `9x9-25`, `9x9-41`, `9x9-45`];
const btnNameToHome		= [`1x7-1`, `1x7-2`, `1x7-3`, `1x7-4`, `9x9-33`, `1x9-3`];
const btnNameToLevel1	= [``, `9x9-22`, `9x9-23`, `9x9-24`, `9x9-32`, `9x9-34`, `9x9-42`, `9x9-43`, `9x9-44`, `1x9-2`, `1x9-4`];
const btnNameToLevel2	= [``, `9x9-11`, `9x9-13`, `9x9-15`, `9x9-31`, `9x9-35`, `9x9-51`, `9x9-53`, `9x9-55`, `1x9-1`, `1x9-5`];
const btnNameExtruder	= [``, `5x1-1`, `5x1-2`];

let baseURL;
let client;
let serverOrigin			= localStorage.getItem(`uri-origin`);
let serverHost				= localStorage.getItem(`uri-host`);
let serverApikey			= localStorage.getItem(`uri-apikey`);
let serverPort				= localStorage.getItem(`uri-port`);
setClientObject();
function setClientObject() {
	if(serverOrigin == null) serverOrigin = `http://`;
	if(serverHost == null) serverHost = `octopi.local`;
	if(serverPort == null || serverPort == ``) baseURL = `${serverOrigin}${serverHost}/`;
	else baseURL = `${serverOrigin}${serverHost}:${serverPort}/`;
	console.warn(`Test URI: ${baseURL}api/files?apikey=${serverApikey}`);

	client = new OctoPrintClient({
		baseurl:	baseURL,
		apikey:		serverApikey
	});
}

feedAmount[1] = Number(localStorage.getItem(`movement-p1`));
feedAmount[2] = Number(localStorage.getItem(`movement-p2`));
feedAmount[3] = Number(localStorage.getItem(`movement-p3`));
feedAmount[4] = Number(localStorage.getItem(`movement-p4`));
if(feedAmount[1] == null || feedAmount[1] == ``) feedAmount[1] = 0.1;
if(feedAmount[2] == null || feedAmount[2] == ``) feedAmount[2] = 1;
if(feedAmount[3] == null || feedAmount[3] == ``) feedAmount[3] = 10;
if(feedAmount[4] == null || feedAmount[4] == ``) feedAmount[4] = 100;
let feedPosition = Number(localStorage.getItem(`feedPosition`));
if(feedPosition == null || feedPosition == ``) feedPosition = 3;
feedValue = feedAmount[feedPosition];

feedAmountBigP1[1] = Number(localStorage.getItem(`movement-big-P1-1`));
feedAmountBigP1[2] = Number(localStorage.getItem(`movement-big-P1-2`));
feedAmountBigP1[3] = Number(localStorage.getItem(`movement-big-P1-3`));
feedAmountBigP1[4] = Number(localStorage.getItem(`movement-big-P1-4`));
if(feedAmountBigP1[1] == null || feedAmountBigP1[1] == ``) feedAmountBigP1[1] = 0.1;
if(feedAmountBigP1[2] == null || feedAmountBigP1[2] == ``) feedAmountBigP1[2] = 1;
if(feedAmountBigP1[3] == null || feedAmountBigP1[3] == ``) feedAmountBigP1[3] = 10;
if(feedAmountBigP1[4] == null || feedAmountBigP1[4] == ``) feedAmountBigP1[4] = 100;
let feedPositionBigP1 = Number(localStorage.getItem(`feedPosition-big-p1`));
if(feedPositionBigP1 == null || feedPositionBigP1 == ``) feedPositionBigP1 = 2;
let feedValueBigP1 = feedAmountBigP1[feedPositionBigP1];

feedAmountBigP2[1] = Number(localStorage.getItem(`movement-big-P2-1`));
feedAmountBigP2[2] = Number(localStorage.getItem(`movement-big-P2-2`));
feedAmountBigP2[3] = Number(localStorage.getItem(`movement-big-P2-3`));
feedAmountBigP2[4] = Number(localStorage.getItem(`movement-big-P2-4`));
if(feedAmountBigP2[1] == null || feedAmountBigP2[1] == ``) feedAmountBigP2[1] = 0.1
if(feedAmountBigP2[2] == null || feedAmountBigP2[2] == ``) feedAmountBigP2[2] = 1
if(feedAmountBigP2[3] == null || feedAmountBigP2[3] == ``) feedAmountBigP2[3] = 10
if(feedAmountBigP2[4] == null || feedAmountBigP2[4] == ``) feedAmountBigP2[4] = 100;
let feedPositionBigP2 = Number(localStorage.getItem(`feedPosition-big-p2`));
if(feedPositionBigP2 == null || feedPositionBigP2 == ``) feedPositionBigP2 = 3;
let feedValueBigP2 = feedAmountBigP2[feedPositionBigP2];

bedSize[0] = localStorage.getItem(`bdsize-w`);
bedSize[1] = localStorage.getItem(`bdsize-d`);
bedSize[2] = localStorage.getItem(`bdsize-h`);
extruderMovingTemp = localStorage.getItem(`extruder-temp`);
if(bedSize[0] == null || bedSize[0] == '') bedSize[0] = 220;
if(bedSize[1] == null || bedSize[1] == '') bedSize[1] = 220;
if(bedSize[2] == null || bedSize[2] == '') bedSize[2] = 250;
if(extruderMovingTemp == null || extruderMovingTemp == '') extruderMovingTemp = 200;

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
		$$$.message(`Call genBackPanel`, DEBUG, `genBackPanel`);
		var elem = document.createElement(`div`);
		elem.innerHTML = 
			`<div class="item-panel1">` +
			`<div class="display-name" onclick="backClick('${item}')"><span class="glyphicon glyphicon glyphicon-arrow-left"></span>&nbsp Back</div>` +
			`<div class="small-font-back">Currently in ${path.split(`/`)[path.split(`/`).length - 1]}</div>` +
			`</div>`;
		$(`#file-list-ctrl`).append(elem);
		$$$.message(`Apeend element(${item})`, DEBUG, `genBackPanel`);
	}
	function genFolderPanel(item, pos) {
		$$$.message(`Call genFolderPanel`, DEBUG, `genFolderPanel`);
		var folding = 1;
		var temp = ``;
		var fileName = item.split(`/`)[item.split(`/`).length - 1];
		$(`#textMeasure`).html(fileName);
		if($(`#textMeasure`).width() > 128) {
			var ext = `.${fileName.split(`.`)[fileName.split(`.`).length - 1]}`;
			var name = fileName.split(`.${fileName.split(`.`)[fileName.split(`.`).length - 1]}`)[0];
			fileName = `${name}<br>${ext}`;
			$(`#textMeasure`).html(fileName);
			if($(`#textMeasure`).width() > 128) {
				$(`#textMeasure`).html(``);
				for(var i=0;i<name.length;i++) {
					$(`#textMeasure`).html(`${$(`#textMeasure`).html()}${name[i]}`);
					if($(`#textMeasure`).width() > 128) $(`#textMeasure`).html(`${$(`#textMeasure`).html().substr(0, $(`#textMeasure`).html().length - 1)}<br>${$(`#textMeasure`).html().substr($(`#textMeasure`).html().length - 1)}`);
					$$$.message(`Analyse filename::${$(`#textMeasure`).html()} / ${$(`#textMeasure`).width()}`, LOWDEBUG, `genFilePanel`);
				}
				if($(`#textMeasure`).html(`${$(`#textMeasure`).html()}${ext}`).width() > 128)
					fileName = `${$(`#textMeasure`).html().substr(0, $(`#textMeasure`).html().length - ext.length)}<br>${ext}`;
				else
					fileName = `${$(`#textMeasure`).html().substr(0, $(`#textMeasure`).html().length - ext.length)}${ext}`;
			}
			folding = fileName.split(`<br>`).length;
		}
		$$$.message(`Completion of folder name analysis`, DEBUG, `genFilePanel`);

		var size;
		if(`files` in fileInfoContainar) size = fileInfoContainar.files[pos].size;
		else if(`children` in fileInfoContainar) size = fileInfoContainar.children[pos].size;

		if(size < 1024) size+=`B`;
		else if(size < 1048576) size = (Math.floor(size / 1024 * 100) / 100) + `KB`;
		else if(size < 1073741824) size = (Math.floor(size / 1024 / 1024 * 100) /100) + `MB`;
		$$$.message(`File size unit conversion`, DEBUG, `genFolderPanel`);

		var elem = document.createElement(`div`);
		elem.innerHTML =
			`<div class="item-panel${folding}">` +
			`<div class="display-name" onclick="folderClick('${pos}')"><span class="glyphicon glyphicon glyphicon-folder-close"></span>&nbsp;${item.split(`/`)[item.split(`/`).length-1]}</div>` +
			`<div><div class="small-font">Size: ${size}</div>` +
			`<div class="left-btn file-list-icon-level-up" onclick="levelupClick('${pos}')"><span class="glyphicon glyphicon glyphicon-level-up"></span></div>` +
			`<div class="right-btn file-list-icon-trash" onclick="trashClick('${pos}')"><div class="in-folder"><span class="glyphicon glyphicon glyphicon-trash"></span></div></div>`;
			`</div>`;
		$(`#file-list-ctrl`).append(elem);
		$$$.message(`Append element(${item}[${pos}])`, DEBUG, `genFolderPanel`);
	}
	function genFilePanel(item, pos) {
		$$$.message(`Call genFilePanel`, DEBUG, `genFilePanel`);
		var folding = 1;
		var temp = ``;
		var fileName = item.split(`/`)[item.split(`/`).length - 1];
		$(`#textMeasure`).html(fileName);
		if($(`#textMeasure`).width() > 128) {
			var ext = `.${fileName.split(`.`)[fileName.split(`.`).length - 1]}`;
			var name = fileName.split(`.${fileName.split(`.`)[fileName.split(`.`).length - 1]}`)[0];
			fileName = `${name}<br>${ext}`;
			$(`#textMeasure`).html(fileName);
			if($(`#textMeasure`).width() > 128) {
				$(`#textMeasure`).html(``);
				for(var i=0;i<name.length;i++) {
					$(`#textMeasure`).html(`${$(`#textMeasure`).html()}${name[i]}`);
					if($(`#textMeasure`).width() > 128) $(`#textMeasure`).html(`${$(`#textMeasure`).html().substr(0, $(`#textMeasure`).html().length - 1)}<br>${$(`#textMeasure`).html().substr($(`#textMeasure`).html().length - 1)}`);
					$$$.message(`Analyse filename::${$(`#textMeasure`).html()} / ${$(`#textMeasure`).width()}`, LOWDEBUG, `genFilePanel`);
				}
				if($(`#textMeasure`).html(`${$(`#textMeasure`).html()}${ext}`).width() > 128)
					fileName = `${$(`#textMeasure`).html().substr(0, $(`#textMeasure`).html().length - ext.length)}<br>${ext}`;
				else
					fileName = `${$(`#textMeasure`).html().substr(0, $(`#textMeasure`).html().length - ext.length)}${ext}`;
			}
			folding = fileName.split(`<br>`).length;
		}
		$$$.message(`Completion of filename analysis`, DEBUG, `genFilePanel`);

		var elem = document.createElement(`div`);
		elem.innerHTML =
		`<div class="item-panel${folding}">` +
		`<div class="name-space" onclick="fileClick(${pos})">${fileName}</div>` +
		`<span class="file-icon glyphicon glyphicon-list-alt"></span>` +
		`<div class="menu-icon">` +
		`<div class="left-btn file-list-icon-download" onclick="downloadClick(${pos})"><div class="in-folder"><span class="glyphicon glyphicon-download-alt"></span></div></div>` +
		`<div class="middle-btn file-list-icon-level-up" onclick="levelupClick(${pos})"><span class="glyphicon glyphicon-level-up"></span></div>` +
		`<div class="middle-btn file-list-icon-trash" onclick="trashClick(${pos})"><div class="in-folder"><span class="glyphicon glyphicon-trash"></span></div></div>` +
		`<div class="middle-btn file-list-icon-open" onclick="openClick(${pos})"><div class="in-folder"><span class="glyphicon glyphicon-folder-open"></span></div></div>` +
		`<div class="right-btn file-list-icon-print" onclick="printClick(${pos})"><div class="in-folder"><span class="glyphicon glyphicon-print"></span></div></div>` +
		`</div>` +
		`</div>`;
		$(`#file-list-ctrl`).append(elem);
		$$$.message(`Append element(${item}[${pos}])`, DEBUG, `genFilePanel`);
	}
	function genFNFPanel() {
		$$$.message(`Call genFNFPanel`, DEBUG, `genFNFPanel`);
		var elem = document.createElement(`div`);
		elem.innerHTML =
			`<div class="item-panel1">` +
			`<div class="display-name"><span class="glyphicon glyphicon glyphicon-remove"></span>&nbsp;File not found</div>` +
			`<div class="small-font-back">Currently in ${baseURL.split(`/`)[2]}</div>` +
			`</div>`
		$(`#file-list-ctrl`).append(elem);
		$$$.message(`Apeend element(File not found)`, DEBUG, `genFNFPanel`);
	}
	function genPNFPanel() {
		$$$.message(`Call genPNFPanel`, DEBUG, `genPNFPanel`);
		var elem = document.createElement(`div`);
		elem.innerHTML =
			`<div class="item-panel1">` +
			`<div class="display-name"><span class="glyphicon glyphicon glyphicon-remove"></span>&nbsp;Printer not found</div>` +
			`<div class="small-font-back">Currently in ${baseURL.split(`/`)[2]}</div>` +
			`</div>`
		$(`#file-list-ctrl`).append(elem);
		$$$.message(`Apeend element(Printer not found)`, DEBUG, `genPNFPanel`);
	}
	$$$.message(`Call getFilelist`, DEBUG, `getFilelist`);

	$$$.message(`Generate folder list`, DEBUG, `getFilelist`);
	folderList = [`/`];
	$(`#folder-list-ctrl`).html(``);
	client.files.listForLocation(`local`, true)
		.done((data) => {
			function detectFolder(child) {
				$$$.message(`Call detectFolder ${child.path}`, DEBUG, `detectFolder`);
				for(var i=0; i<child.children.length; i++) if(child.children[i].type == `folder`) {
					folderList[folderList.length] = child.children[i].path;
					detectFolder(child.children[i]);
				}
			}
			for(var i=0; i<data.files.length; i++)
				if(data.files[i].type == `folder`) {
					folderList[folderList.length] = data.files[i].path;
					detectFolder(data.files[i]);
				}
			for(var i=0; i<=folderList.length; i++) {
				var elem = document.createElement(`option`);
				elem.value = i;
				if(folderList[i] != `/`) elem.text = `/${folderList[i]}`;
				else elem.text = `${folderList[i]}`;
				$(`#folder-list-ctrl`).append(elem);
			}
		}).fail((err) => { 
			$$$.message(`client.files.listForLocation is failure`, ERROR, `getFilelist`);
			genPNFPanel();
		});

	$(`#file-list-ctrl`).html(``);
	locationPath = path;
	if(path == undefined || path == ``)
		client.files.list()
			.done((data) => {
				fileInfoContainar = data;
				for(var i=0; i<fileInfoContainar.files.length; i++) if(fileInfoContainar.files[i].type == `folder`) genFolderPanel(fileInfoContainar.files[i].path, i);
				for(var i=0; i<fileInfoContainar.files.length; i++) if(fileInfoContainar.files[i].type != `folder`) genFilePanel(fileInfoContainar.files[i].path, i);
				if(fileInfoContainar.files.length == 0) genFNFPanel();
				if(!powerFlag) {
					$(`.file-list-icon-open`).css({color: peleskyblue});
					$(`.file-list-icon-print`).css({color: peleskyblue});
				}
			})
			.fail((err) => $$$.message(`client.files.list is failure`, ERROR, `getFilelist`));
	else if(typeof(path) == `string`) {
		var backFolder = path.split(`/`);
		if(backFolder.length == 1) genBackPanel(``);
		else {
			var temp = backFolder[0];
			for(var i=1; i<backFolder.length - 1; i++) temp = temp + `/` + backFolder[i];
			genBackPanel(temp);
		}

		client.files.get(`local`, path)
			.done((data) => {
				fileInfoContainar = data;
				for(var i=0; i<fileInfoContainar.children.length; i++) if(fileInfoContainar.children[i].type == `folder`) genFolderPanel(fileInfoContainar.children[i].path, i);
				for(var i=0; i<fileInfoContainar.children.length; i++) if(fileInfoContainar.children[i].type != `folder`) genFilePanel(fileInfoContainar.children[i].path, i);
				if(fileInfoContainar.children.length == 0) genFNFPanel();
				if(!powerFlag) {
					$(`.file-list-icon-open`).css({color: peleskyblue});
					$(`.file-list-icon-print`).css({color: peleskyblue});
				}
			})
			.fail((err) => $$$.message(`client.files.get is failure`, ERROR, `getFilelist`));
	}
}
function backClick(item) {
	getFilelist(item);
}
function folderClick(pos) {
	$(`#information-panel-ctrl`).html(``);
	if(`files` in fileInfoContainar) getFilelist(fileInfoContainar.files[pos].path);
	else if(`children` in fileInfoContainar) getFilelist(fileInfoContainar.children[pos].path);
}
function fileClick(pos) {
	function detectName() {
		$$$.message(`Call detectName`, DEBUG, `detectName`);
		var name = ``;
		for(var i=0; i<temporalyContainar[pos].display.split(`.`).length - 1; i++) {
			if(i > 0) name += `.`;
			name += temporalyContainar[pos].display.split(`.`)[i];
		}
		$$$.message(`Detect display name`, DEBUG, `detectName`);
		return name;
	}
	function calculateTime(t) {
		$$$.message(`Call calculateTime`, DEBUG, `calculateTime`);
		let time, temp;
		temp = Math.floor(t / 3600);
		if(temp > 0) time = temp + `h`;
		else time = ``;
		t = t - (temp * 3600);
		$$$.message(`Calculation hour. quotient is ${temp}. surplus is ${t}`, DEBUG, `calculateTime`);
		temp = Math.floor(t / 60);
		$$$.message(`Calculation minutes. quotient is ${temp}. surplus is ${(t - (temp * 60))}`, DEBUG, `calculateTime`);
		time = time + temp + `m` + Math.round(t - (temp * 60)) + `s`;
		return time;
	}
	function calculateFilament(f) {
		$$$.message(`Call calculateFilament`, DEBUG, `calculateFilament`);
		var length,temp;
		temp = Math.floor(f / 1000);
		f = f - (temp * 1000);
		if(temp > 0) length = temp + `m`;
		else length = ``;
		$$$.message(`Calculation meter. quotient is ${temp}. surplus is ${f}`, DEBUG, `calculateFilament`);
		temp = Math.floor(f / 10);
		f = f - (temp * 10);
		length = length + temp + `cm`;
		$$$.message(`Calculation centimeter. quotient is ${temp}. surplus is ${f}`, DEBUG, `calculateFilament`);
		length = length + Math.round(f) + `mm`;
		return length;
	}
	$$$.message(`Call fileClick`, DEBUG, `fileClick`);
	$$$.message(`Name tag click(` + pos + `)`, DEBUG, `fileClick`);
	var temporalyContainar;
	if(`files` in fileInfoContainar) temporalyContainar = fileInfoContainar.files;
	else if(`children` in fileInfoContainar) temporalyContainar = fileInfoContainar.children;
	
	var fontSize = 18;
	$(`#textMeasure2`).text(detectName());
	$(`#textMeasure2`).css({'font-size': `${fontSize}px`});
	while($(`#textMeasure2`).width() > 160) {
		fontSize--;
		$(`#textMeasure2`).css({'font-size': `${fontSize}px`});
	}

	var htmlBody;
	if(`gcodeAnalysis` in temporalyContainar[pos]) {
		htmlBody = 
			`<div class="title" style="font-size: ${fontSize}px">${detectName()}</div>` +
			`<table class="information-table">` +
			`<tr><td>Type:</td><td class="right">${temporalyContainar[pos].display.split(`.`)[temporalyContainar[pos].display.split(`.`).length - 1]}</td></tr>`+
			`<tr><td>Time:</td><td class="right">${calculateTime(temporalyContainar[pos].gcodeAnalysis.estimatedPrintTime)}</td></tr>`+
			`<tr><td>Filament:</td><td class="right">${calculateFilament(temporalyContainar[pos].gcodeAnalysis.filament.tool0.length)}</td></tr>` +
			`<th>Size:</th>` +
			`<tr><td colspan=2 class="right">
			${Math.floor(temporalyContainar[pos].gcodeAnalysis.dimensions.width * 100) / 100} x 
			${Math.floor(temporalyContainar[pos].gcodeAnalysis.dimensions.depth * 100) / 100} x 
			${Math.floor(temporalyContainar[pos].gcodeAnalysis.dimensions.height * 100) / 100} mm` +
			`</td></tr>` +
			`</table>`;
	} else {
		htmlBody = 
			`<div class="title" style="font-size: ${fontSize}px">${detectName()}</div>` +
			`<table class="information-table">` +
			`<tr><td>Type:</td><td class="right">${temporalyContainar[pos].display.split(`.`)[temporalyContainar[pos].display.split(`.`).length - 1]}</td></tr>`+
			`<tr><td>Time:</td><td class="right">${NaN}</td></tr>`+
			`<tr><td>Filament:</td><td class="right">${NaN}</td></tr>` +
			`<th>Size:</th>` +
			`<tr><td colspan=2 class="right">
			${NaN} x 
			${NaN} x 
			${NaN} mm` +
			`</td></tr>` +
			`</table>`;
	}
	$(`#information-panel-ctrl`).html(htmlBody);
}
function downloadClick(pos) {
	function changeStream(data) {
		$$$.message(`Call changeStream`, DEBUG, `changeStream`)
		$$$.message(`Start encording `, DEBUG, `changeStream`)
		var length = data.length;
		var result = new Uint8Array(length);
		for(var i=0; i<length; i++)
			result[i] = data[i].charCodeAt(0);
		$$$.message(`End encording`, DEBUG, `changeStream`);
		return result;
	}
	$$$.message(`Call downloadClick`, DEBUG, `downloadClick`);
	$$$.message(`Click the download icon in listing ${pos}`, DEBUG, `downloadClick`);
	var path;
	if(`files` in fileInfoContainar) path = fileInfoContainar.files[pos].path;
	else if(`children` in fileInfoContainar) path = fileInfoContainar.children[pos].path;
	client.files.download(`local`, path)
		.done((data) => {
			$$$.message(`Download ${path}`, DEBUG, `downloadClick`);
			var stream = new Uint8Array(changeStream(data));
			var element = document.createElement(`a`);
			element.href = URL.createObjectURL(new Blob([stream.subarray(0, stream.length)], {type: `text/.gcode`}));
			element.download = ``;
			element.click();
			URL.revokeObjectURL(element.href);
			$$$.message(`Delete temporary files`, DEBUG, `downloadClick`)
		}).fail((err) => {
			$$$.message(`trap message alert no 00004`, WARN, `getPrinterFullState`);
		});
}
function trashClick(pos) {
	$$$.message(`Call trashClick`, DEBUG, `trashClick`);
	$$$.message(`Click the trash icon in listing ${pos}`, DEBUG, `trashClick`);
	var f;
	if(`files` in fileInfoContainar) f = fileInfoContainar.files[pos].path;
	else if(`children` in fileInfoContainar) f = fileInfoContainar.children[pos].path;
	$.get(`${baseURL}api/job?apikey=${serverApikey}`)
		.done((data) => {
			if(data.job.file.path != f) {
				client.files.delete(`local`, f);
				$$$.message(`Delete ${f}`, INFO, `trashClick`);
				getFilelist(locationPath);
			} else if(data.state.toLowerCase() != 'printing'){
				if(data.job.file.path == f) $(`#jobname`).text(`not printed`);
				client.files.delete(`local`, f);
				$$$.message(`Delete ${f}`, INFO, `trashClick`);
				getFilelist(locationPath);
			} else $$$.message(`Operation of this icon is prohibited during printing`, WARN, `trashClick`);
		}).fail((err) => {
			$$$.message(`trap message alert no 00005`, WARN, `getPrinterFullState`);
		});
}
function openClick(pos) {
	$$$.message(`Call openClick`, DEBUG, `openClick`);
	$$$.message(`Click the open icon in listing ${pos}`, DEBUG, `openClick`);
	if(!powerFlag) {
		$$$.message(`This button is not active(icon-open-${pos})`, DEBUG, `openClick`);
		return;
	} else {
		$.get(`${baseURL}api/job?apikey=${serverApikey}`)
			.done((data) => {
				if(data.state.toLowerCase() != `printing`) {
					var path;
					if(`files` in fileInfoContainar) path = fileInfoContainar.files[pos].path;
					else if(`children` in fileInfoContainar) path = fileInfoContainar.children[pos].path;
					client.files.select(`local`, path);
					$$$.message(`Set ${path} to print`, DEBUG, `openClick`);
				} else $$$.message(`Operation of this icon is prohibited during printing`, WARN, `openClick`);
			}).fail((err) => {
				$$$.message(`trap message alert no 00006`, WARN, `getPrinterFullState`);
			});;
	}
}
function printClick(pos) {
	$$$.message(`Call printClick`, DEBUG, `printClick`);
	$$$.message(`Click the print icon in listing ${pos}`, DEBUG, `printClick`);
	$.get(`${baseURL}api/job?apikey=${serverApikey}`)
		.done((data) => {
			if(data.state.toLowerCase() != `printing` && powerFlag) {
				var path;
				if(`files` in fileInfoContainar) path = fileInfoContainar.files[pos].path;
				else if(`children` in fileInfoContainar) path = fileInfoContainar.children[pos].path;
				client.files.select(`local`, path, true);
				$$$.message(`Start printing ${path}`, INFO, `printClick`);
			} else {
				if(!powerFlag) $$$.message(`This button is not active(icon-print-${pos})`, DEBUG, `printClick`);
				else if(data.state.toLowerCase() == `printing`) $$$.message(`Unable to operate buttons because printing is in progress`, INFO, `printClick`);
				return;
			}
		})
		.fail(() => {
			$$$.message(`Printer not found`, ERROR, `$printClick`);
		});
}
function levelupClick(pos) {
	$$$.message(`Call levelupClick`, DEBUG, `levelupClick`);
	$$$.message(`Click the level-up icon in listing ${pos}`, DEBUG, `levelupClick`);

	var f;
	if(`files` in fileInfoContainar) f = fileInfoContainar.files[pos].path;
	else if('children' in fileInfoContainar) f = fileInfoContainar.children[pos].path;
	$.get(`${baseURL}api/job?apikey=${serverApikey}`)
		.done((data) => {
			if(data.job.file.path != f) {
				if(`files` in fileInfoContainar) {
					$(`#filename-box-ctrl`).val(fileInfoContainar.files[pos].display);
					$(`#base-path-ctrl`).text(fileInfoContainar.files[pos].path);
				} else if(`children` in fileInfoContainar) {
					$(`#filename-box-ctrl`).val(fileInfoContainar.children[pos].display);
					$(`#base-path-ctrl`).text(fileInfoContainar.children[pos].path);
				}
				$$$.message(`Set filename to filename-box-ctrl`, DEBUG, `levelupClick`);
				$(`#file-notice-ctrl`).css({visibility: `visible`});
				$$$.message(`Change css(visibility:visible) file-notice-ctrl`, DEBUG, `levelupClick`);
			} else  $$$.message(`Operation of this icon is prohibited during printing`, WARN, `levelupClick`);
		})
		.fail((err) => {
			console.log(err);
		});
}
/**
 * getPrinterFullSate()
 */
function getPrinterFullState() {
	function bedTempertureCheck(response) {
		$$$.message(`Call bedTempertureCheck`, DEBUG, `bedTempertureCheck`, ONCE);
		$$$.message(`Target temperature check(bed)`, LOWDEBUG, `bedTemperatureCheck`, INTERMITTENT, 10);
		if(`bed` in response.temperature) {
			if(response.temperature.bed.target <= 0) {
				if($(`#bed-target-text`).text() == `N/A`) return false;
				else {
					$$$.message(`Update bed target temperature value and icon color(off)`, DEBUG, `bedTemperatureCheck`);
					$(`#bed-target-text`).text(`N/A`);
					$$$.message(`Change text(bed-target-text:N/A) bed-target-text`, DEBUG, `bedTemperatureCheck`);
					$(`#bed-icon`).css({color: sunshine});
					$$$.message(`Change css(color:sunshine) bed-icon`, DEBUG, `bedTemperatureCheck`);
					$(`#fire-bed-target-ctrl`).text(`N/A`)
					$$$.message(`Change text(fire-bed-target-ctrl:N/A) fire-bed-target-ctrl`, DEBUG, `bedTemperatureCheck`);
					$(`#fire-bed-icon-ctrl`).css({color: sunshine})
					$$$.message(`Change css(color:sunshine) fire-bed-icon-ctrl`, DEBUG, `bedTemperatureCheck`);
				}
			} else {
				var now = $(`#bed-target-text`).text();
				if(now != (`${response.temperature.bed.target}C`)) {
					$$$.message(`Update bed target temperature value and icon color(on)`, DEBUG, `bedTemperatureCheck`);
					var val;
					val = response.temperature.bed.target;
					$(`#bed-target-text`).text(`${val}C`);
					$$$.message(`Change text(bed-target-text:${val}C) bed-target-text`, DEBUG, `bedTemperatureCheck`);
					$(`#bed-icon`).css({color: rescueorange});
					$$$.message(`Change css(color:rescueorange) bed-icon`, DEBUG, `bedTemperatureCheck`);
					$(`#fire-bed-target-ctrl`).text(`${val}C`)
					$$$.message(`Change text(fire-bed-target-ctrl:${val}C) fire-bed-target-ctrl`, DEBUG, `bedTemperatureCheck`);
					$(`#fire-bed-icon-ctrl`).css({color: rescueorange})
					$$$.message(`Change css(color:rescueorange) fire-bed-icon-ctrl`, DEBUG, `bedTemperatureCheck`);
				}
			}
		}
	}
	function tool0TemperatureCheck(response) {
		$$$.message(`Call tool0TemperatureCheck`, DEBUG, `tool0TemperatureCheck`, ONCE);
		$$$.message(`Target temperature check(tool0)`, LOWDEBUG, `tool0TemperatureCheck`, INTERMITTENT, 10);
		if(`tool0` in response.temperature) {
			if(response.temperature.tool0.target <= 0) {
				if($(`#tool-target-text`).text() == `N/A`) return false;
				else {
					$$$.message(`Update tool0 temperature value and icon color(off)`, DEBUG, `tool0TemperatureCheck`);
					$(`#tool-target-text`).text(`N/A`);
					$$$.message(`Change text(tool-target-text:N/A) tool-target-text`, DEBUG, `tool0TemperatureCheck`);
					$(`#tool-icon`).css({color: sunshine});
					$$$.message(`Change css(color:sunshine) tool-icon`, DEBUG, `tool0TemperatureCheck`);
					$(`#fire-tool-target-ctrl`).text(`N/A`)
					$$$.message(`Change text(fire-tool-target-ctrl:N/A) fire-tool-target-ctrl`, DEBUG, `tool0TemperatureCheck`);
					$(`#fire-tool-icon-ctrl`).css({color: sunshine});
					$$$.message(`Change css(color:sunshine) fire-tool-icon-ctrl`, DEBUG, `tool0TemperatureCheck`);
				}
			} else {
				var now = $(`#tool-target-text`).text();
				if(now != (`${response.temperature.tool0.target}C`)) {
					var val;
					val = response.temperature.tool0.target;
					$$$.message(`Update tool0 target temperature value and icon color(on)`, DEBUG, `tool0TemperatureCheck`);
					$(`#tool-target-text`).text(`${val}C`);
					$$$.message(`Change text(fire-tool-target-ctrl:${val}C) tool-target-text`, DEBUG, `tool0TemperatureCheck`);
					$(`#tool-icon`).css({color: rescueorange});
					$$$.message(`Change css(color:rescueorange) tool-icon`, DEBUG, `tool0TemperatureCheck`);
					$(`#fire-tool-target-ctrl`).text(`${val}C`)
					$$$.message(`Change text(fire-tool-target-ctrl:${val}C) fire-tool-target-ctrl`, DEBUG, `tool0TemperatureCheck`);
					$(`#fire-tool-icon-ctrl`).css({color: rescueorange});
					$$$.message(`Change css(color:rescueorange) fire-tool-icon-ctrl`, DEBUG, `tool0TemperatureCheck`);
				}
			}
		}
	}
	function jobNameCheck(response) {
		function getTime(time) {
			$$$.message(`Call getTime`, LOWDEBUG, `getTime`, ONCE);
			let result		= ``;
			let printTime	= time;
			let hour		= Math.floor(printTime / 3600);
			if(hour > 0) {
				result = result + hour + `h`;
				printTime = printTime - (hour * 3600);
			}
			$$$.message(`Calculation hour`, LOWDEBUG, `getTime`, ONCE);
			let minute = Math.floor(printTime / 60);
			if(minute > 0) {
				result = result + minute + `m`;
				printTime = printTime - (minute * 60);
			}
			$$$.message(`Calculation minute`, LOWDEBUG, `getTime`, ONCE);
			return result + printTime + `s`
		}
		$.get(`${baseURL}api/job?apikey=${serverApikey}`)
			.done((data) => {
				if(data.job.file.name != null)
					if($(`#jobname`).text() != data.job.file.name) {
						$$$.message(`Update job name`, INFO, `jobNameCheck`);
						$(`#jobname`).text(data.job.file.name);
					}
				if(data.state.toLowerCase() == `printing`) {
					if((Math.floor(data.progress.completion * 100) / 100) != $(`#progressbar-one`).text()) {
						$$$.message(`Update progress bar position`, LOWINFO, `jobNameCheck`);
						$(`#complete-text`).text(Math.floor(data.progress.completion * 100) / 100 + `%`);
						$(`#progressbar-one`).css({width: Math.floor(data.progress.completion) + `%`});
					}
					$$$.message(`Update printer information`, LOWINFO, `jobNameCheck`);
					$(`#print-title-text`).text(`printing`);
					$(`#print-icon`).css({color: rescueorange});
					$$$.message(`Update print time`, LOWINFO, `jobNameCheck`);
					$(`#printtime-text`).text(getTime(data.progress.printTime));
					$$$.message(`Update print time left`, LOWINFO, `jobNameCheck`);
					if(getTime(data.progress.printTimeLeft) != `nulls`)
						$(`#printtimeleft-text`).text(getTime(data.progress.printTimeLeft));
				} else if($(`#print-title-text`).text() != `print`) {
					$$$.message(`Reset job status`, INFO, `jobNameCheck`);
					$(`#print-title-text`).text(`print`);
					$(`#print-icon`).css({color: sunshine});
					$(`#complete-text`).text(`0%`);
					$(`#progressbar-one`).css({width: `0%`});
					$(`#printtime-text`).text(`0s`);
					$(`#printtimeleft-text`).text(`0s`);
				}
			}).fail((err) => {
				$$$.message(`trap message alert no 00007`, WARN, `getPrinterFullState`);
			});
	}
	$$$.message(`Call getPrinterFullState`, DEBUG, `getPrinterFullState`, ONCE);
	if(client == undefined) {
		$(`.alert-text`).text(`OctoPrint object is undefined`);
		return false;
	}

	client.printer.getFullState()
		.done((response) => {
			if(`tool0` in response.temperature) {
				var val;
				val = response.temperature.tool0.actual;
				$(`#tool-text`).text(`${val}C`);
				$$$.message(`Change text(tool-text:${val}C) tool-text`, LOWDEBUG, `getFullState`);
				$(`#fire-tool-actual-ctrl`).text(`${val}C`);
				$$$.message(`Change text(fire-tool-actual-ctrl:${val}C) fire-tool-actual-ctrl`, LOWDEBUG, `getFullState`);

				$$$.message(`Update tool0 temperature value is ${response.temperature.tool0.actual}C`, LOWDEBUG, `getFullState`);
				if(response.temperature.tool0.actual >= extruderMovingTemp && !canRunExtruder) {
					$(`[id^=extruder-btn-]`).css({'background-color': lapislazuli});
					$$$.message(`Change css(background-color:lapislazuli) extruder-btn-up/down`, DEBUG, `getFullState`);
					$(`[id^=button-big-5x1-]`).css({'background-color': lapislazuli});
					$$$.message(`Change css(background-color:lapislazuli) button-big-5x1-1/2`, DEBUG, `getFullState`);
					canRunExtruder = true;
					$$$.message(`Change canRunExtruder. value is ${canRunExtruder}`, DEBUG, `getFullState`);
				}
				if(response.temperature.tool0.actual < extruderMovingTemp && canRunExtruder) {
					$(`[id^=extruder-btn-]`).css({'background-color': skyhigh});
					$$$.message(`Change css(background-color:skyhigh) extruder-btn-up/down`, DEBUG, `getFullState`);
					$(`[id^=button-big-5x1-]`).css({'background-color': skyhigh});
					$$$.message(`Change css(background-color:skyhigh) button-big-5x1-1/2`, DEBUG, `getFullState`);
					canRunExtruder = false;
					$$$.message(`Change canRunExtruder. value is ${canRunExtruder}`, DEBUG, `getFullState`);
				}
			}
			if(`bed` in response.temperature) {
				var val;
				val = response.temperature.bed.actual;
				$$$.message(`Update bed temperature value is ${val}C`, LOWDEBUG, `getFullState`);
				$(`#bed-text`).text(`${val}C`);
				$$$.message(`Change text(bed-text:${val}C) bed-text`, LOWDEBUG, `getFullState`);
				$(`#fire-bed-actual-ctrl`).text(`${val}C`);
				$$$.message(`Change text(fire-bed-actual-ctrl:${val}C) fire-bed-actual-ctrl`, LOWDEBUG, `getFullState`);
			}

			tool0TemperatureCheck(response);
			bedTempertureCheck(response);
			jobNameCheck();
		}).fail((err) => {
			$$$.message(`Printer is no connected`, WARN, `getPrinterFullState`);
			$(`.nav-off`).css({color: sunshine});
			clearInterval(intervalIDprn);
			intervalIDprn = undefined;
			$$$.message(`Change intervalIDprn. value is ${intervalIDprn}`, DEBUG, `getPrinterFullState`);
			resetMonitorText();
			powerFlag = false;
			$$$.message(`Change powerFlag. value is ${powerFlag}`, DEBUG, `$power-btn.click`);
			$(`.file-list-icon-open`).css({color: peleskyblue});
			$$$.message(`Change css(color:peleskyblue) file-list-icon-open`, DEBUG, `$power-btn.click`);
			$(`.file-list-icon-print`).css({color: peleskyblue});
			$$$.message(`Change css(color:peleskyblue) file-list-icon-print`, DEBUG, `$power-btn.click`);
			$(`input[name="powerFlag"]`).prop(`checked`, false);
			$$$.message(`Change powerFlag tag value. value is false`, DEBUG, `$power-btn.click`);
		});
}
/**
 * resetMonitorText()
 */
function resetMonitorText() {
	$$$.message(`Call resetMonitorText`, DEBUG, `resetMonitorText`);
	$$$.message(`Set tool text and icon to default`, DEBUG, `resetMonitorText`);
	$(`#tool-text`).text(`N/A`);
	$(`#tool-target-text`).text(`N/A`);
	$(`#too-icon`).css({color: sunshine});

	$$$.message(`Set bed text and icon to default`, DEBUG, `resetMonitorText`);
	$(`#bed-text`).text(`N/A`);
	$(`#bed-target-text`).text(`N/A`);
	$(`#bed-icon`).css({color: sunshine});

	$$$.message(`set fan text and icon to default`, DEBUG, `resetMonitorText`);
	$(`#fan-text`).text(`0%`);
	$(`#fan-icon`).css({color: sunshine});
}
/**
 * postProcess()
 */
function postProcess() {
	$$$.message(`Call postProcess`, DEBUG, `postProcess`);
	if(powerFlag) {
		client.printerprofiles.get(`_default`)
			.done((response) => {
				switch(response.model.toUpperCase().match(`MARLIN`)[0]) {
					case `MARLIN`:
						client.control.sendGcode(`M107`);
						$$$.message(`Stop fan(speed 0%)`, DEBUG, `postProcess`);
						break;
				}
			}).fail((err) => {
				$$$.message(`trap message alert no 00008`, WARN, `postProcess`);
			});
		$$$.message(`Execute heart down process`, DEBUG, `postProcess`);
		client.printer.setToolTargetTemperatures({tool0: 0});
		$$$.message(`Heart down tool 0`, INFO, `postProcess`);
		$(`#tool-on-sw-btn`).css({color: sunshine});
		$$$.message(`Change css(color:sunshine) tool-on-sw-btn`, DEBUG, `postProcess`);
		$(`#tool-icon`).css({color:sunshine});
		$$$.message(`Change css(color:sunshine) tool-icon`, DEBUG, `postProcess`);
		client.printer.setBedTargetTemperature(0);
		$$$.message(`Heart down bed`, INFO, `postProcess`);
		$(`#bed-on-sw-btn`).css({color:sunshine});
		$$$.message(`Change css(color:sunshine) bed-on-sw-btn`, DEBUG, `postProcess`);
		$(`#bed-icon`).css({color:sunshine});
		$$$.message(`Change css(color:sunshine) bed-icon`, DEBUG, `postProcess`);
		$("#jobname").text(`not printed`);
		$$$.message(`Initialize jobname text`, DEBUG, `postProcess`);
	}
}
/**
 * upload test code
 */
 function upload(elem) {
	$$$.message(`Call upload`, DEBUG, `upload`);
	var form = new FormData();
	form.append(`file`, elem.files[0]);
	if(locationPath == undefined) form.append(`path`, `/`); else form.append('path', locationPath);
	form.append(`select`, false);
	form.append(`print`, false);

	var settings = {
		async:			true,
		url:			`${baseURL}api/files/local`,
		method:			`POST`,
		headers:		{
			'x-api-key':		serverApikey,
			'cache-control':	`no-cache`,
		},
		processData:	false,
		contentType:	false,
		mimeType:		`multipart/form-data`,
		data:			form
	}
	$.ajax(settings).done((response) => {
		getFilelist(locationPath);
	}).fail((err) => {
		$$$.message(`trap message alert no 00009`, WARN, `getPrinterFullState`);
	});;
}
$(() => {
	if(client == undefined) {
		$(`.alert-text`).text(`Failed to create OctoPrint object`)
		$(`.alert-panel`).css({visibility: `visible`});
		$$$.message(`Change css(visibility:visible) alert-panel`, DEBUG, `jQuery`);
	}
	getFilelist(undefined);
	$(`#seed-value-p` + feedAmount.indexOf(feedValue)).css({'background-color': lapislazuli});
	$$$.message(`Initialize feedValue display`, DEBUG, `jQuery`);
	$(`#feed-amount-big-p1${feedAmountBigP1.indexOf(feedValueBigP1)}`).css({'background-color': lapislazuli});
	$$$.message(`Initialize feedValueBigP1 display`, DEBUG, `jQuery`);
	$(`#feed-amount-big-p2${feedAmountBigP2.indexOf(feedValueBigP2)}`).css({'background-color': lapislazuli});
	$$$.message(`Initialize feedValueBigP2 display`, DEBUG, `jQuery`);

	$(`#progressbar-one`).addClass(`progress-bar-forestleaf`);
	$$$.message(`Initialize progress-bar color`, DEBUG, `jQuery`);
	triggerWindowSizeChange();

	$(`#uri-host-ctrl`).val(serverHost);
	$(`#uri-port-ctrl`).val(serverPort);
	$(`#uri-apikey-ctrl`).val(serverApikey);
	$$$.message(`Set config panel uri data`, DEBUG, 'jQuery');
	
	$(`#seed-value-p1`).text(`${feedAmount[1]}mm`);
	$(`#seed-value-p2`).text(`${feedAmount[2]}mm`);
	$(`#seed-value-p3`).text(`${feedAmount[3]}mm`);
	$(`#seed-value-p4`).text(`${feedAmount[4]}mm`);

	$(`#movement-p1`).val(feedAmount[1]);
	$(`#movement-p2`).val(feedAmount[2]);
	$(`#movement-p3`).val(feedAmount[3]);
	$(`#movement-p4`).val(feedAmount[4]);
	
	$(`#feed-amount-big-p11`).val(`${feedAmountBigP1[1]}mm`);
	$(`#feed-amount-big-p12`).val(`${feedAmountBigP1[2]}mm`);
	$(`#feed-amount-big-p13`).val(`${feedAmountBigP1[3]}mm`);
	$(`#feed-amount-big-p14`).val(`${feedAmountBigP1[4]}mm`);

	$(`#movement-p11`).val(feedAmountBigP1[1]);
	$(`#movement-p12`).val(feedAmountBigP1[2]);
	$(`#movement-p13`).val(feedAmountBigP1[3]);
	$(`#movement-p14`).val(feedAmountBigP1[4]);
	
	$(`#feed-amount-big-p21`).val(`${feedAmountBigP2[1]}mm`);
	$(`#feed-amount-big-p22`).val(`${feedAmountBigP2[2]}mm`);
	$(`#feed-amount-big-p23`).val(`${feedAmountBigP2[3]}mm`);
	$(`#feed-amount-big-p24`).val(`${feedAmountBigP2[4]}mm`);

	$(`#movement-p21`).val(feedAmountBigP2[1]);
	$(`#movement-p22`).val(feedAmountBigP2[2]);
	$(`#movement-p23`).val(feedAmountBigP2[3]);
	$(`#movement-p24`).val(feedAmountBigP2[4]);
	
	$$$.message(`Set config panel movement data`, DEBUG, 'jQuery');

	$(`#win-pos-x`).val(localStorage.getItem(`win-pos-x`));
	$(`#win-pos-y`).val(localStorage.getItem(`win-pos-y`));
	
	allBtnBlink();

	$('#extruder-temp-ctrl').val(extruderMovingTemp);
	$('#bedsize-w-ctrl').val(bedSize[0]);
	$('#bedsize-d-ctrl').val(bedSize[1]);
	$('#bedsize-h-ctrl').val(bedSize[2]);

	if(localStorage.getItem(`debug-mode`) == `true`) {
		$(`#reload-btn-ctrl`).css({visibility: `visible`});
		$$$.message(`Change css(visibility:visible) reload-btn-ctrl`, DEBUG, `jQuery`);
		$(`#ID-powerFlag`).css({visibility: `visible`});
		$$$.message(`Change css(visibility:visible) ID-powerFlag`, DEBUG, `jQuery`);
		$(`#base-path-ctrl`).css({visibility: 'visible'});
		$$$.message(`Change css(visibility:visible) base-path-ctrl`, DEBUG, `jQuery`);
		$(`#debug-mode-ctrl`).prop(`checked`, true);
		$$$.message(`Change property(checked:true) debug-mode-ctrl`, DEBUG, `jQuery`);
	} else {
		$(`#reload-btn-ctrl`).css({visibility: `hidden`});
		$$$.message(`Change css(visibility:hidden) reload-btn-ctrl`, DEBUG, `jQuery`);
		$(`#ID-powerFlag`).css({visibility: `hidden`});
		$$$.message(`Change css(visibility:hidden) ID-powerFlag`, DEBUG, `jQuery`);
		$(`#base-path-ctrl`).css({visibility: 'hidden'});
		$$$.message(`Change css(visibility:hidden) base-path-ctrl`, DEBUG, `jQuery`);
		$(`#debug-mode-ctrl`).prop(`checked`, false);
		$$$.message(`Change property(checked:false) debug-mode-ctrl`, DEBUG, `jQuery`);
	}
	$$$.message(`Set config panel application data`, DEBUG, 'jQuery');

	$(`#reload-btn-ctrl`).click(() => {
		$$$.message(`Click reload-btn`, DEBUG, `$reload-btn-ctrl.click`);
		location.reload();
	});

	$(`#power-btn`).click(() => {
		function logoutProcess() {
			$$$.message(`Call logoutProcess`, DEBUG, `logoutProcess`);
			client.connection.disconnect()
				.done((response) => {
					$$$.message(`Disconnect success`, INFO, `$power-btn.click`)
					client.browser.logout()
						.done((response) => {
							$$$.message(`Logout success`, INFO, `$power-btn.click`);
							$(`.file-list-icon-open`).css({color: peleskyblue});
							$$$.message(`Change css(color:peleskyblue) file-list-icon-open`, DEBUG, `$power-btn.click`);
							$(`.file-list-icon-print`).css({color: peleskyblue});
							$$$.message(`Change css(color:peleskyblue) file-list-icon-print`, DEBUG, `$power-btn.click`);
							actionPowerBtnClick = false;
							$$$.message(`Change actionPowerBtnClick. value is ${actionPowerBtnClick}`, DEBUG, `$power-btn.click`);
						}).fail((response) => {
							$$$.message(`Logout failure`, ERROR, `$power-btn.click`);
							$(`.alert-text`).text(`Error: Failed to logout to printer`);
							$(`#alert-pnl`).css({visibility: `visible`});
							$$$.message(`Change css(visibility:visible) alert-text`, DEBUG, `$power-btn.click`);
							actionPowerBtnClick = false;
							$$$.message(`Change actionPowerBtnClick. value is ${actionPowerBtnClick}`, DEBUG, `$power-btn.click`);
						});
				}).fail((response) => {
					$$$.error(`Disconnect failure`, ERROR , `$power-btn.click`);
					$(`.alert-text`).text(`Error: Failed to disconnect to printer`);
					$(`#alert-pnl`).css({visibility: `visible`});
					$$$.message(`Change css(visibility:visible) alert-text`, DEBUG, `$power-btn.click`);
					actionPowerBtnClick = false;
					$$$.message(`Change actionPowerBtnClick. value is ${actionPowerBtnClick}`, DEBUG, `$power-btn.click`);
				});
		}
		$$$.message(`Click power-btn`, DEBUG, `$power-btn.click`);
		if(toolTempFlag || bedTempFlag) {
			$$$.message(`power-btn operation prohibited (under toolTempFlag control)`, DEBUG, `power-btn.click`);
			return;
		}
		if(powerFlag) {
			$$$.message(`Click powerbtn(on>off)`, DEBUG, `$power-btn.click`);
			if(!actionPowerBtnClick) {
				actionPowerBtnClick = true;
				$$$.message(`Change actionPowerBtnClick. value is ${actionPowerBtnClick}`, DEBUG, `$power-btn.click`);
				postProcess();
				powerFlag = false;
				$$$.message(`Change powerFlag. value is ${powerFlag}`, DEBUG, `$power-btn.click`);
				$(`input[name="powerFlag"]`).prop(`checked`, false);
				$$$.message(`Change HTML property "powerFlag" is false`, DEBUG, `$power-btn.click`);
				$(`.nav-off`).css({color: sunshine});
				$$$.message(`Change css(color:sunshine) nav-off`, DEBUG, `$power-btn.click`);
				resetMonitorText();
				clearInterval(intervalIDprn);
				intervalIDprn = undefined;
				$$$.message(`Change intervalIDprn. value is ${intervalIDprn}`, DEBUG, `$power-btn.click`);
				$$$.message(`Stop temperature monitor timer`, DEBUG, `$power-btn.click`);
				setTimeout(() => logoutProcess(), 1200);
				$$$.message(`Logout after 1200ms`, WARN, `$power-btn.click`);
			} else {
				$$$.message(`actionPowerBtnClick is true`, WARN, `$power-btn.click`);
			}
		} else {
			$$$.message(`Click powerbtn(off>on)`, DEBUG), `$power-btn.click`;
			if(!actionPowerBtnClick) {
				actionPowerBtnClick = true;
				$$$.message(`Change actionPowerBtnClick. value is ${actionPowerBtnClick}`, DEBUG, `$power-btn.click`);
				client.browser.login(`mozukuSu`, `ooxot8795SH`, true)
					.done((response) => {
						$$$.message(`Login success`, INFO, `$power-btn.click`);
						client.connection.connect({
							port:			`/dev/ttyACM0`,
							baudrate:		115200,
							printerProfile:	`_default`,
							save:			true,
							autoconnect:	false
						}).done((response) => {
							$$$.message(`Connection success`, INFO, `$power-btn.click`);
							$(`.nav-off`).css({color: rescueorange});
							powerFlag = true;
							$$$.message(`Change powerFlag. value is ${powerFlag}`, DEBUG, `$power-btn.click`);
							if(intervalIDprn == undefined) intervalIDprn = setInterval(getPrinterFullState, 1000);
							$$$.message(`intervalIDprn is ${intervalIDprn}`, DEBUG, `$power-btn.click`)
							$(`.file-list-icon-open`).css({color: sunshine});
							$$$.message(`Change css(color:sunshine) file-list-icon-open`, DEBUG, `$power-btn.click`);
							$(`.file-list-icon-print`).css({color: sunshine});
							$$$.message(`Change css(color:sunshine) file-list-icon-print`, DEBUG, `$power-btn.click`);
							actionPowerBtnClick = false;
							$$$.message(`Change actionPowerBtnClick. value is ${actionPowerBtnClick}`, DEBUG, `$power-btn.click`);
							$(`input[name="powerFlag"]`).prop(`checked`, true);
							$$$.message(`Change powerFlag tag value. value is true`, DEBUG, `$power-btn.click`);
						}).fail((response) => {
							$$$.message(`Connection failure`, ERROR, `$power-btn.click`);
							$(`.alert-text`).text(`Error: Failed to connect to printer`);
							$(`#alert-pnl`).css({visibility: `visible`});
							$$$.message(`Change css(visibility:visible) alert-text`, DEBUG, `$power-btn.click`);
							actionPowerBtnClick = false;
							$$$.message(`Change actionPowerBtnClick. value is ${actionPowerBtnClick}`, DEBUG, `$power-btn.click`);
						}).fail((err) => {
							$$$.message(`trap message alert no 00011`, WARN, `getPrinterFullState`);
						});;
					}).fail((response) => {
						$$$.message(`Login failure`, ERROR, `$power-btn.click`);
						$(`.alert-text`).text(`Error: Failed to login to octoprint server`);
						$(`#alert-pnl`).css({visibility: `visible`});
						$$$.message(`Change css(visibility:visible) alert-text`, DEBUG, `$power-btn.click`);
						actionPowerBtnClick = false;
						$$$.message(`Change actionPowerBtnClick. value is ${actionPowerBtnClick}`, DEBUG, `$power-btn.click`);
					});
			} else {
				$$$.message(`actionPowerBtnClick is true`, WARN, `$power-btn.click`)
			}
		}
	});

	$(`#submenu-btn`).click(() => {
		$$$.message(`Click submenu-btn`, DEBUG, `$submenu-btn.click`);
		if(toolTempFlag || bedTempFlag) {
			$$$.message(`submenu-btn operation prohibited (under toolTempFlag control)`, DEBUG, `submenu-btn.click`);
			return;
		}
		$$$.message(`Click submen ctrl btn`, DEBUG, `$submenu-btn`);
		if(submenuToggle) {
			$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
			if(!subMenuPanelOpen) $(`#barrierLayer-ctrl`).css({visibility: 'hidden'});
			$$$.message(`Change css(visibility:hidden) barrierLayer-ctrl`, DEBUG, `$submenu-btn`);
			$(`.nav-submenu`).css({right: `-288px`});
			$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$submenu-btn`);
			submenuToggle = false;
		} else {
			$$$.message(`Show submenu`, INFO, `$submenu-btn`);
			$(`#barrierLayer-ctrl`).css({visibility: 'visible'});
			$$$.message(`Change css(visibility:visible) barrierLayer-ctrl`, DEBUG, `$submenu-btn`);
			$(`.nav-submenu`).css({right: `0px`});
			$$$.message(`Change css(right:0px) nav-submenu`, DEBUG, `$submenu-btn`);
			submenuToggle = true;
		}
	});

	$(`#fullscreen-btn`).click(() => {
		$$$.message(`Click fullscreen btn`, DEBUG, `$fullscreen-btn.click`);
		if(toolTempFlag || bedTempFlag) {
			$$$.message(`fullscreen-btn operation prohibited (under toolTempFlag control)`, DEBUG, `$fullscreen-btn.click`);
			return;
		}
		windowSize++;
		triggerWindowSizeChange();
	});
	function triggerWindowSizeChange() {
		function modeTreeTriangleSet(){
			$$$.message(`Call modeTreeTriangleSet`, DEBUG, `modeTreeTriangleSet`);
			$(`.${windowList[panel4Array[0]].split(`-`)[0]}-triangle-right`).css({visibility: `hidden`});
			$(`.${windowList[panel4Array[0]].split(`-`)[0]}-triangle-down`).css({visibility: `hidden`});
			$(`.${windowList[panel4Array[1]].split(`-`)[0]}-triangle-left`).css({visibility: `hidden`});
			$(`.${windowList[panel4Array[1]].split(`-`)[0]}-triangle-down`).css({visibility: `hidden`});
			$(`.${windowList[panel4Array[2]].split(`-`)[0]}-triangle-right`).css({visibility: `hidden`});
			$(`.${windowList[panel4Array[2]].split(`-`)[0]}-triangle-down`).css({visibility: `visible`});
			$(`.${windowList[panel4Array[3]].split(`-`)[0]}-triangle-left`).css({visibility: `hidden`});
			$(`.${windowList[panel4Array[3]].split(`-`)[0]}-triangle-down`).css({visibility: `visible`});
		}
		function modeTreeTriangleReset() {
			$$$.message(`Call modeTreeTriangleReset`, DEBUG, `modeTreeTriangleReset`);
			$(`.${windowList[panel4Array[0]].split(`-`)[0]}-triangle-right`).css({visibility: `visible`});
			$(`.${windowList[panel4Array[0]].split(`-`)[0]}-triangle-down`).css({visibility: `hidden`});
			$(`.${windowList[panel4Array[1]].split(`-`)[0]}-triangle-left`).css({visibility: `visible`});
			$(`.${windowList[panel4Array[1]].split(`-`)[0]}-triangle-down`).css({visibility: `hidden`});
			$(`.${windowList[panel4Array[2]].split(`-`)[0]}-triangle-right`).css({visibility: `visible`});
			$(`.${windowList[panel4Array[2]].split(`-`)[0]}-triangle-down`).css({visibility: `hidden`});
			$(`.${windowList[panel4Array[3]].split(`-`)[0]}-triangle-left`).css({visibility: `visible`});
			$(`.${windowList[panel4Array[3]].split(`-`)[0]}-triangle-down`).css({visibility: `hidden`});
		}
		if(windowSize > maxWindowSize) windowSize = 1;
		$$$.message(`Screen mode is ${windowSize}`, INFO, `triggerWindowSizeChange`);
		if(windowSize == 1) {
			$$$.message(`Window size is 400 x 240`, LOWDEBUG, `triggerWindowSizeChange`);
			window.resizeTo(400,240);
			$(`#main-window-ctrl, #file-window-ctrl, #manu-window-ctrl, #temp-window-ctrl`).css({'z-index': -1, top: `0px`, left: `0px`});
			$$$.message(`Change css(z-index:-1) main-window-ctrl, file-window-ctrl, manu-window-ctrl, temp-window-ctrl`, DEBUG, `$submenu-btn`);
			$$$.message(`Change css(top:0px) main-window-ctrl, file-window-ctrl, manu-window-ctrl, temp-window-ctrl`, DEBUG, `$submenu-btn`);
			$$$.message(`Change css(left:0px) main-window-ctrl, file-window-ctrl, manu-window-ctrl, temp-window-ctrl`, DEBUG, `$submenu-btn`);
			$$$.message(`Reset panel position for screen mode 1`, DEBUG, `triggerWindowSizeChange`)
			$(`#${windowList[panelPosition]}`).css({'z-index': 80});
			$$$.message(`Change css(z-index:80px) ${windowList[panelPosition]}`, DEBUG, `$submenu-btn`);
			$$$.message(`Set panel position for screen mode 1`, DEBUG, `triggerWindowSizeChange`)
			modeTreeTriangleReset();
		} else if(windowSize == 2) {
			$$$.message(`Window size is 800 x 240`, LOWDEBUG, `triggerWindowSizeChange`);
			window.resizeTo(800,240);
			// Main panel position set
			$(`#main-window-ctrl, #file-window-ctrl, #manu-window-ctrl, #temp-window-ctrl`).css({'z-index': -1, top: `0px`, left: `0px`});
			$$$.message(`Change css(z-index:-1) main-window-ctrl, file-window-ctrl, manu-window-ctrl, temp-window-ctrl`, DEBUG, `$submenu-btn`);
			$$$.message(`Change css(top:0px) main-window-ctrl, file-window-ctrl, manu-window-ctrl, temp-window-ctrl`, DEBUG, `$submenu-btn`);
			$$$.message(`Change css(left:0px) main-window-ctrl, file-window-ctrl, manu-window-ctrl, temp-window-ctrl`, DEBUG, `$submenu-btn`);
			$$$.message(`Reset panel position for screen mode 2`, DEBUG, `triggerWindowSizeChange`)
			$(`#${windowList[panel2Array[0]]}`).css({'z-index': 80, top: `0px`, left: `0px`});
			$$$.message(`Change css(z-index:80) ${windowList[panel2Array[0]]}`, DEBUG, `$submenu-btn`);
			$$$.message(`Change css(top:0px) ${windowList[panel2Array[0]]}`, DEBUG, `$submenu-btn`);
			$$$.message(`Change css(left:0px) ${windowList[panel2Array[0]]}`, DEBUG, `$submenu-btn`);
			$(`#` + windowList[panel2Array[1]]).css({'z-index': 80, top: `0px`, left: `400px`});
			$$$.message(`Change css(z-index:80) ${windowList[panel2Array[1]]}`, DEBUG, `$submenu-btn`);
			$$$.message(`Change css(top:0px) ${windowList[panel2Array[1]]}`, DEBUG, `$submenu-btn`);
			$$$.message(`Change css(left:400px) ${windowList[panel2Array[1]]}`, DEBUG, `$submenu-btn`);
			$$$.message(`Reset panel position for screen mode 2`, DEBUG, `triggerWindowSizeChange`)
			$$$.message(`Set panel position for screen mode 2`, DEBUG, `triggerWindowSizeChange`)
			modeTreeTriangleReset();
		} else if(windowSize == 3) {
			$$$.message(`Window size is 800 x 480`, LOWDEBUG, `triggerWindowSizeChange`);
			window.resizeTo(800,480);
			$(`#` + windowList[panel4Array[0]]).css({'z-index': 80, top: `0px`, left: `0px`});
			$$$.message(`Change css(z-index:80) ${windowList[panel4Array[0]]}`, DEBUG, `$submenu-btn`);
			$$$.message(`Change css(top:0px) ${windowList[panel4Array[0]]}`, DEBUG, `$submenu-btn`);
			$$$.message(`Change css(left:0px) ${windowList[panel4Array[0]]}`, DEBUG, `$submenu-btn`);
			$(`#` + windowList[panel4Array[1]]).css({'z-index': 80, top: `0px`, left: `400px`});
			$$$.message(`Change css(z-index:80) ${windowList[panel4Array[1]]}`, DEBUG, `$submenu-btn`);
			$$$.message(`Change css(top:0px) ${windowList[panel4Array[1]]}`, DEBUG, `$submenu-btn`);
			$$$.message(`Change css(left:400px) ${windowList[panel4Array[1]]}`, DEBUG, `$submenu-btn`);
			$(`#` + windowList[panel4Array[2]]).css({'z-index': 80, top: `240px`, left: `0px`});
			$$$.message(`Change css(z-index:80) ${windowList[panel4Array[2]]}`, DEBUG, `$submenu-btn`);
			$$$.message(`Change css(top:240px) ${windowList[panel4Array[2]]}`, DEBUG, `$submenu-btn`);
			$$$.message(`Change css(left:0px) ${windowList[panel4Array[2]]}`, DEBUG, `$submenu-btn`);
			$(`#` + windowList[panel4Array[3]]).css({'z-index': 80, top: `240px`, left: `400px`});
			$$$.message(`Change css(z-index:80) ${windowList[panel4Array[3]]}`, DEBUG, `$submenu-btn`);
			$$$.message(`Change css(top:240px) ${windowList[panel4Array[3]]}`, DEBUG, `$submenu-btn`);
			$$$.message(`Change css(left:400px) ${windowList[panel4Array[3]]}`, DEBUG, `$submenu-btn`);
			modeTreeTriangleSet();
		}
	}

	$(`#alert-ok-btn`).click(() => {
		$$$.message(`Click alert-ok-btn`, DEBUG, `$alert-ok-btn`);
		$(`.alert-panel`).css({visibility: `hidden`});
		$$$.message(`Change css(visibility:hidden) alert-panel`, DEBUG, `$submenu-btn`);
	});

	$(`#remove-btn`).click(() => {
		$$$.message(`Click remove-btn`, DEBUG, `$remove-btn`);
		if(toolTempFlag || bedTempFlag) {
			$$$.message(`remove-btn operation prohibited (under toolTempFlag control)`, DEBUG, `remove-btn.click`);
			return;
		}
		$$$.message(`Click close btn`, DEBUG, `$remove-btn`);
		window.close();
	});

	$("#suspend-btn").click(() => {
		$$$.message(`Click suspend-btn`, DEBUG, `$suspend-btn`);
		if(toolTempFlag || bedTempFlag) {
			$$$.message(`suspend-btn operation prohibited (under toolTempFlag control)`, DEBUG, `suspend-btn.click`);
			return;
		}
		$$$.message(`Click suspend btn`, DEBUG, `$suspend-btn`);
		window.close();
	});

	$(`#fan-icon`).click(() => {
		$$$.message(`Click fan icon`, DEBUG, `$fan-icon.click`);
		if(toolTempFlag || bedTempFlag) {
			$$$.message(`fan-icon operation prohibited (under toolTempFlag control)`, DEBUG, `fan-icon.click`);
			return;
		}
		$$$.message(`Detect firmware type`, INFO, `$fan-icon.click`);
		let firmType;
		if(powerFlag) {
			client.printerprofiles.get(`_default`)
				.done((response) => {
					firmType = response.model;
					firmType = firmType.toUpperCase();
					$$$.message(`Firmware type is ${firmType}`, INFO, `$fan-icon.click`);
		
					var result = firmType.match(`MARLIN`);
					if(fanFlag) {
						switch(result[0]) {
							case `MARLIN`:
								client.control.sendGcode(`M107 P1`)
									.done(() => {
										$$$.message(`Stop fan(0%)`, INFO, `$fan-icon.click`);
										$(`#fan-icon`).css({color: sunshine});
										$(`#fan-text`).text(`0%`);
										fanFlag = false;
									}).fail(() => {
										$$$.message(`Can not operate fan speed`, ERROR, `$fan-icon.click`);
									});
								break;
						}
					} else {
						switch(result[0]) {
							case `MARLIN`:
								client.control.sendGcode(`M106 P1 S255`)
									.done(() => {
										$$$.message(`Rotate fan(speed 100%)`, INFO, `$fan-icon.click`);
										$(`#fan-icon`).css({color: rescueorange});
										$(`#fan-text`).text(`100%`);
										fanFlag = true;
									}).fail(() => {
										$$$.message(`Can not operate fan speed`, ERROR, `$fan-icon.click`);
									});
								break;
						}
					}
				}).fail((err) => {
					$$$.message(`trap message alert no 00012`, WARN, `getPrinterFullState`);
				});;
		} else {
			$$$.message(`Printer is not connect`, ERROR, `$fan-icon.click`);
			return;
		}
	});

	$(`[id^=tool-on-remove-]`).click(() => {
		$$$.message(`Click tool-on-remove-btn`, DEBUG, `$tool-on-remove-btn.click`);
		$(`#slider-panel-tool-ctrl`).css({'z-index': -1});
		$$$.message(`Change css(z-index:-1) slider-panel-tool-ctrl`, DEBUG, `$id^=tool-on-remove-.click`);
		$(`#slider-panel-tool-big-ctrl`).css({'z-index': -1});
		$$$.message(`Change css(z-index:-1) slider-panel-tool-big-ctrl`, DEBUG, `$id^=tool-on-remove-.click`);
		toolTempFlag = false;
		$$$.message(`Change toolTempFlag. value is ${toolTempFlag}`, DEBUG, `$id^=tool-on-remove-.click`);
	});

	$(`#tool-icon`).click(() => {
		$$$.message(`Click tool-icon`, DEBUG, `$tool-icon.click`);
		if(submenuToggle) {
			$$$.message(`Expanding subpanel. not show slider-panel-tool`, WARN, `$bed-icon.click`);
			return;
		}
		$.get(`${baseURL}api/job?apikey=${serverApikey}`)
			.done((data) => {
				if(data.state.toLowerCase() != `printing` && powerFlag) {
					$$$.message(`Show tool0 temperature panel`, INFO, `$tool-icon.click`);
					$(`#slider-panel-tool-ctrl`).css({'z-index': 80});
					$$$.message(`Change css(z-index:80) slider-panel-tool-ctrl`, DEBUG, `$tool-icon.click`);
					toolTempFlag = true;
					$$$.message(`Change toolTempFlag. value is ${toolTempFlag}`, DEBUG, `$tool-icon.click`);
				} else {
					if(data.state.toLowerCase() == `printing`) $$$.message(`Now printing. not show slider-panel-tool`, WARN, `$tool-icon.click`);
					else if(!powerFlag) $$$.message(`Printer is not connected`, WARN, `$tool-icon.click`);
				}
			}).fail(() => {
				$$$.message(`Printer not found`, ERROR, `$tool-icon.click`);
			})
	});
	
	$(`[id^=tool-on-sw-]`).click(() => {
		$$$.message(`Click tool-on-sw-btn`, DEBUG, `$tool-on-sw-btn.click`);
		$.get(`${baseURL}api/job?apikey=${serverApikey}`)
			.done((data) => {
				if(data.state.toLowerCase() != `printing` && powerFlag) {
					client.printer.setToolTargetTemperatures({tool0: toolTempValue});
					$$$.message(`Detect tool-0 temperature. value is ${toolTempValue}`, INFO, `$id^=tool-on-sw-.click`);
					if(toolTempValue > 0 ) {
						$(`[id^=tool-on-sw-]`).css({color: rescueorange});
						$$$.message(`Change css(color:rescueorange) id^=tool-on-sw-`, DEBUG, `$id^=tool-on-sw-.click`);
					} else {
						$(`[id^=tool-on-sw-]`).css({color: sunshine});
						$$$.message(`Change css(color:sunshine) id^=tool-on-sw-`, DEBUG, `$id^=tool-on-sw-.click`);
					}
					$(`[id^=slider-panel-tool-]`).css({'z-index': -1});
					$$$.message(`Change css(z-index:-1) id^=slider-panel-tool-`, DEBUG, `$id^=tool-on-sw-.click`);
					toolTempFlag = false;
					$$$.message(`Change toolTempFlag. value is ${toolTempFlag}`, DEBUG, `$id^=tool-on-sw-.click`);
				}
			}).fail(() => {
				$$$.message(`Printer not found`, ERROR, `$tool-on-sw-btn.click`);
			})
	});

	$(`[id^=bed-on-remove-]`).click(() => {
		$$$.message(`Click bed-on-remove-btn`, DEBUG, `$bed-on-remove-btn.click`);
		$(`#slider-panel-bed-ctrl`).css({'z-index': -1});
		$$$.message(`Change css(z-index:-1) slider-panel-bed-ctrl`, DEBUG, `$id^=bed-on-remove-.click`);
		$(`#slider-panel-bed-big-ctrl`).css({'z-index': -1});
		$$$.message(`Change css(z-index:-1) slider-panel-bed-big-ctrl`, DEBUG, `$id^=bed-on-remove-.click`);
		bedTempFlag = false;
		$$$.message(`Change bedTempFlag. value is ${bedTempFlag}`, DEBUG, `$id^=bed-on-remove-.click`);
	});

	$(`#bed-icon`).click(() => {
		$$$.message(`Click bed-icon`, DEBUG, `$bed-icon.click`);
		if(submenuToggle) {
			$$$.message(`Expanding subpanel. not show slider-panel-bed`, WARN, `$bed-icon.click`);
			return;
		}
		$.get(`${baseURL}api/job?apikey=${serverApikey}`)
			.done((data) => {
				if(data.state.toLowerCase() != `printing` && powerFlag) {
					$$$.message(`Show bed temperature panel`, INFO, `$bed-icon.click`);
					$(`#slider-panel-bed-ctrl`).css({'z-index': 80});
					$$$.message(`Change css(z-index:80) slider-panel-bed-ctrl`, DEBUG, `$bed-icon.click`);
					bedTempFlag = true;
					$$$.message(`Change bedTempFlag. value is ${bedTempFlag}`, DEBUG, `$bed-icon.click`);
				} else {
					if(data.state.toLowerCase() == `printing`) $$$.message(`Now printing. not show slider-panel-bed`, WARN, `$bed-icon.click`);
					else if(!powerFlag) $$$.message(`Printer is not connected`, WARN, `$bed-icon.click`);
				}
			}).fail(() =>{
				$$$.message(`Printer not found`, ERROR, `$bed-icon.click`);
			})
	});

	$(`[id^=bed-on-sw-]`).click(() => {
		$.get(`${baseURL}api/job?apikey=${serverApikey}`)
			.done(function(data){
				if(data.state.toLowerCase() != `printing` && powerFlag) {
					$$$.message(`Click bed-on-sw-btn`, DEBUG, `$id^=bed-on-sw-.click`);
					client.printer.setBedTargetTemperature(bedTempValue);
					$$$.message(`Detect bed temperature. value is ${bedTempValue}`, INFO, `$id^=bed-on-sw-.click`);
					if(bedTempValue > 0) {
						$(`#bed-on-sw-btn`).css({color: rescueorange});
						$$$.message(`Change css(color:rescueorange) bed-on-sw-btn`, DEBUG, `$id^=bed-on-sw-.click`);
						$(`#bed-on-sw-big-btn`).css({color: rescueorange});
						$$$.message(`Change css(color:rescueorange) bed-on-sw-big-btn`, DEBUG, `$id^=bed-on-sw-.click`);
					} else {
						$(`#bed-on-sw-btn`).css({color: sunshine});
						$$$.message(`Change css(color:sunshine) bed-on-sw-btn`, DEBUG, `$id^=bed-on-sw-.click`);
						$(`#bed-on-sw-big-btn`).css({color: sunshine});
						$$$.message(`Change css(color:sunshine) bed-on-sw-big-btn`, DEBUG, `$id^=bed-on-sw-.click`);
					}
					$(`#slider-panel-bed-ctrl`).css({'z-index': -1});
					$$$.message(`Change css(z-index:-1) slider-panel-bed-ctrl`, DEBUG, `$id^=bed-on-sw-.click`);
					$(`#slider-panel-bed-big-ctrl`).css({'z-index': -1});
					$$$.message(`Change css(z-index:-1) slider-panel-bed-big-ctrl`, DEBUG, `$id^=bed-on-sw-.click`);
					bedTempFlag = false;
					$$$.message(`Change bedTempFlag. value is ${bedTempFlag}`, DEBUG, `$id^=bed-on-sw-.click`);
				}
			}).fail(function(err){
				$$$.message(`Printer not found`, ERROR, `$bed-on-sw-btn.click`);
			})
	});

	$(`#print-icon`).click(() => {
		$$$.message(`Click print-icon`, DEBUG, `$print-icon.click`);
		$.get(`${baseURL}api/job?apikey=${serverApikey}`)
			.done((data) => {
				if(data.state.toLowerCase() != `printing` && powerFlag) {
					client.job.start();
					$$$.message(`Start print.`, DEBUG, `$print-icon.click`)
				} else {
				// cancelation process
				if(data.state.toLowerCase() == `printing`) {
					$(`#cancel-panel-ctrl`).css({visibility: 'visible'});
					$(`#barrierLayer-ctrl`).css({visibility: 'visible'});
				}
				/*
					if(!powerFlag) $$$.message(`This button is not active(print-icon)`, DEBUG, `print$print-icon.clickClick`);
					else if(data.state.toLowerCase() == `printing`) $$$.message(`Unable to operate buttons because printing is in progress`, INFO, `$print-icon.click`);
					return;
				*/
				}
			}).fail(() => {
				$$$.message(`Printer not found`, ERROR, `$printClick`);
			});
	});

	$(`#cancel-ok-ctrl`).click(() => {
		$$$.message(`Click cancel-no-ctrl`, DEBUG, `$cancel-ok-ctrl.click`);
		client.job.cancel()
			.done(() => {
				$$$.message('Cancel success', INFO, `$cancel-ok-ctrl.click`);
			})
			.fail(() => {
				console.log(err);
			})
		$(`#cancel-panel-ctrl`).css({visibility: 'hidden'});
		$(`#barrierLayer-ctrl`).css({visibility: 'hidden'});
	});

	$(`#cancel-no-ctrl`).click(() => {
		$$$.message(`Click cancel-no-ctrl`, DEBUG, `$cancel-no-ctrl.click`);
		$(`#cancel-panel-ctrl`).css({visibility: 'hidden'});
		$(`#barrierLayer-ctrl`).css({visibility: 'hidden'});
	});

	$(`#left-mark-main`).click(() => {
		$$$.message(`Click left-mark-main`, DEBUG, `$left-mark-main.click`);
		leftmarkClick(1);
	});

	$(`#right-mark-main`).click(() => {
		$$$.message(`Click right-mark-main`, DEBUG, `$right-mark-main.click`);
		rightmarkClick(1);
	});

	$(`#down-mark-main`).click(() => {
		$$$.message(`Click down-mark-main`, DEBUG, `$down-mark-main.click`);
		downmarkClick(1);
	});

	$(`#left-mark-file`).click(() => {
		$$$.message(`Click left-mark-file`, DEBUG, `$left-mark-file.click`);
		leftmarkClick(2);
	});

	$(`#right-mark-file`).click(() => {
		$$$.message(`Click right-mark-file`, DEBUG, `$right-mark-file.click`);
		rightmarkClick(2);
	});

	$(`#down-mark-file`).click(() => {
		$$$.message(`Click down-mark-file`, DEBUG, `$down-mark-file.click`);
		downmarkClick(2);
	});

	$(`#left-mark-manu`).click(() => {
		$$$.message(`Click left-mark-manu`, DEBUG, `$left-mark-manu.click`);
		leftmarkClick(3);
	});

	$(`#right-mark-manu`).click(() => {
		$$$.message(`Click right-mark-manu`, DEBUG, `$right-mark-manu.click`);
		rightmarkClick(3);
	});

	$(`#down-mark-manu`).click(() => {
		$$$.message(`Click down-mark-manu`, DEBUG, `$down-mark-manu.click`);
		downmarkClick(3);
	});

	$(`#left-mark-temp`).click(() => {
		$$$.message(`Click left-mark-temp`, DEBUG, `$left-mark-temp.click`);
		leftmarkClick(4);
	});

	$(`#right-mark-temp`).click(() => {
		$$$.message(`Click right-mark-temp`, DEBUG, `$right-mark-temp.click`);
		rightmarkClick(4);
	});

	$(`#down-mark-temp`).click(() => {
		$$$.message(`Click down-mark-temp`, DEBUG, `$down-mark-temp.click`);
		downmarkClick(4);
	});
	function leftmarkClick(p) {
		$$$.message(`Call leftmarkClick(${p})`, DEBUG, `downmarkClick`);
		if(windowSize == 1) {
			panelPosition--;
			if(panelPosition < 1) panelPosition = maxPanelPosition;
			$$$.message(`Change panel position. position is ${panelPosition}`, DEBUG, `$left-mark.click`);
			$(`#${windowList[panelPosition]}`).css({'z-index': 80});
			$$$.message(`#${windowList[panelPosition]} is shown`, DEBUG, `$left-mark.click`);
			if((panelPosition + 1) > maxPanelPosition) $(`#` + windowList[1]).css({'z-index': -1});
			else $(`#` + windowList[panelPosition + 1]).css({'z-index': -1});
			if((panelPosition + 1) > maxPanelPosition) $$$.message(`#` + windowList[1] + ` is hidden`, DEBUG, `$right-mark.click`);
			else $$$.message(`#${windowList[panelPosition + 1]} is hidden`, DEBUG, `$right-mark.click`);
		} else if(windowSize == 2) {
			var panelNo = p;
			panelNo--;
			if(panelNo < 1) panelNo = maxPanelPosition;
			if(panelNo == panel2Array[0] || panelNo == panel2Array[1]) panelNo--;
			if(panelNo < 1) panelNo = maxPanelPosition;
			$$$.message(`panelNo is ${panelNo}`, DEBUG, `leftmarkClick`);
			$$$.message(`Identify panel to display`, DEBUG, `leftmarkClick`);
			$(`#${windowList[panelNo]}`).css({
				'z-index':	$(`#` + windowList[p]).css('z-index'),
				left:		$(`#` + windowList[p]).css(`left`),
				top:		$(`#` + windowList[p]).css(`top`)
			});
			$$$.message(`Change css(z-index:${$('#' + windowList[p]).css('z-index')}) ${windowList[panelNo]}`, DEBUG, `leftmarkClick`);
			$$$.message(`Change css(left: + ${$('#' + windowList[p]).css(`left`)}) ${windowList[panelNo]}`, DEBUG, `leftmarkClick`);
			$$$.message(`Change css(top: + ${$('#' + windowList[p]).css(`top`)}) ${windowList[panelNo]}`, DEBUG, `leftmarkClick`);
			$(`#${windowList[p]}`).css({'z-index': -1});
			$$$.message(`Change css(z-index:-1) ${windowList[p]}`, DEBUG, `leftmarkClick`);
			if(panel2Array[0] == p) panel2Array[0] = panelNo;
			else if(panel2Array[1] == p) panel2Array[1] = panelNo;
			$$$.message(`Set panel2Array[${panel2Array[0]},${panel2Array[1]}]`, DEBUG, `leftmarkClick`);
		} else if(windowSize == 3) {
			if(panel4Array[0] == p) {
				$$$.message(`Click upper left panel`, DEBUG, `leftmarkClick`);
				switchUpperPanel();
			} else if(panel4Array[2] == p) {
				$$$.message(`Click upper left panel`, DEBUG, `leftmarkClick`);
				switchLowerPanel();
			}
		}
	}
	function rightmarkClick(p) {
		$$$.message(`Call rightmarkClick(${p})`, DEBUG, `downmarkClick`);
		if(windowSize == 1) {
			panelPosition++;
			if(panelPosition > maxPanelPosition) panelPosition = 1;
			$$$.message(`Change panel position. position is ${panelPosition}`, DEBUG, `$right-mark.click`);
			$(`#${windowList[panelPosition]}`).css({'z-index': 80});
			$$$.message(`#${windowList[panelPosition]} is shown`, DEBUG, `$right-mark.click`);
			if((panelPosition - 1) < 1) $(`#${windowList[maxPanelPosition]}`).css({'z-index': -1});
			else $(`#${windowList[panelPosition - 1]}`).css({'z-index': -1});
			if((panelPosition - 1) < 1) $$$.message(`#${windowList[maxPanelPosition]} is hidden`, DEBUG, `$left-mark.click`);
			else $$$.message(`#${windowList[panelPosition - 1]} is hidden`, DEBUG, `$left-mark.click`);
		} else if(windowSize == 2) {
			var panelNo = p;
			panelNo++;
			if(panelNo > maxPanelPosition) panelNo = 1;
			if(panelNo == panel2Array[0] || panelNo == panel2Array[1]) panelNo++;
			if(panelNo > maxPanelPosition) PanelNo = 1;
			$$$.message(`panelNo is ${panelNo}`, DEBUG, `rightmarkClick`);
			$$$.message(`Identify panel to display`, DEBUG, `rightmarkClick`);
			$(`#${windowList[panelNo]}`).css({
				'z-index':	$(`#${windowList[p]}`).css('z-index'),
				left:		$(`#${windowList[p]}`).css(`left`),
				top:		$(`#${windowList[p]}`).css(`top`)
			});
			$$$.message(`Change css(z-index:${$(`#` + windowList[p]).css('z-index')}) ${windowList[panelNo]}`, DEBUG, `rightmarkClick`);
			$$$.message(`Change css(left:${$(`#` + windowList[p]).css(`left`)}) ${windowList[panelNo]}`, DEBUG, `rightmarkClick`);
			$$$.message(`Change css(top:${$(`#` + windowList[p]).css(`top`)}) ${windowList[panelNo]}`, DEBUG, `rightmarkClick`);
			$(`#${windowList[p]}`).css({'z-index': -1});
			$$$.message(`Change css(z-index:-1) ${windowList[p]}`, DEBUG, `leftmarkClick`);
			if(panel2Array[0] == p) panel2Array[0] = panelNo;
			else if(panel2Array[1] == p) panel2Array[1] = panelNo;
			$$$.message(`Set panel2Array[${panel2Array[0]},${panel2Array[1]}]`, DEBUG, `rightmarkClick`);
		} else if(windowSize == 3) {
			if(panel4Array[1] == p) {
				$$$.message(`Click upper right panel`, DEBUG, `rightmarkClick`);
				switchUpperPanel();
			} else if(panel4Array[3] == p) {
				$$$.message(`Click lower right panel`, DEBUG, `rightmarkClick`);
				switchLowerPanel();
			}
		}
	}
	function switchUpperPanel() {
		$$$.message(`Call switchUpperPanel`, DEBUG, `switchUpperPanel`);
		$(`#${windowList[panel4Array[0]]}`).css({left: `400px`});
		$(`#${windowList[panel4Array[1]]}`).css({left: `0px`});
		$$$.message(`Switch upper panel`, DEBUG, `switchUpperPanel`);
		$(`.${windowList[panel4Array[0]].split(`-`)[0]}-triangle-left`).css({visibility: `hidden`});
		$(`.${windowList[panel4Array[0]].split(`-`)[0]}-triangle-right`).css({visibility: `visible`});
		$(`.${windowList[panel4Array[1]].split(`-`)[0]}-triangle-left`).css({visibility: `visible`});
		$(`.${windowList[panel4Array[1]].split(`-`)[0]}-triangle-right`).css({visibility: `hidden`});
		$$$.message(`Change upper panel triangle css`, DEBUG, `switchUpperPanel`);
		var t = panel4Array[0];
		 panel4Array[0] = panel4Array[1];
		panel4Array[1] = t;
		$$$.message(`Set panel4Array[${panel4Array[0]} ,${panel4Array[1]} ,${panel4Array[2]} ,${panel4Array[3]}]`, DEBUG, `switchUpperPanel`);
	}
	function switchLowerPanel() {
		$$$.message(`Call switchLowerPanel`, DEBUG, `switchLowerPanel`);
		$(`#${windowList[panel4Array[2]]}`).css({left: `400px`});
		$(`#${windowList[panel4Array[3]]}`).css({left: `0px`});
		$$$.message(`Switch lower panel`, DEBUG, `switchLowerPanel`);
		$(`.${windowList[panel4Array[2]].split(`-`)[0]}-triangle-left`).css({visibility: `hidden`});
		$(`.${windowList[panel4Array[2]].split(`-`)[0]}-triangle-right`).css({visibility: `visible`});
		$(`.${windowList[panel4Array[3]].split(`-`)[0]}-triangle-left`).css({visibility: `visible`});
		$(`.${windowList[panel4Array[3]].split(`-`)[0]}-triangle-right`).css({visibility: `hidden`});
		$$$.message(`Change lower panel triangle css`, DEBUG, `switchLowerPanel`);
		var t = panel4Array[2];
		panel4Array[2] = panel4Array[3];
		panel4Array[3] = t;
		$$$.message(`Set panel4Array[${panel4Array[0]} ,${panel4Array[1]} ,${panel4Array[2]} ,$panel4Array[3]}]`, DEBUG, `switchLowerPanel`);
	}
	function downmarkClick(p) {
		$$$.message(`Call downmarkClick(` + p + `)`, DEBUG, `downmarkClick`);
		if(panel4Array[2] == p) {
			$(`#${windowList[panel4Array[0]]}`).css({top: `240px`});
			$(`#${windowList[panel4Array[2]]}`).css({top: `0px`});
			$$$.message(`Switch left panel`, DEBUG, `downmarkClick`);
			$(`.${windowList[panel4Array[0]].split(`-`)[0]}-triangle-down`).css({visibility: `visible`});
			$(`.${windowList[panel4Array[2]].split(`-`)[0]}-triangle-down`).css({visibility: `hidden`});
			$$$.message(`Change left panel triangle css`, DEBUG, `downmarkClick`);
			var t = panel4Array[0];
			panel4Array[0] = panel4Array[2];
			panel4Array[2] = t;
			$$$.message(`Set panel4Array[${panel4Array[0]} ,${panel4Array[1]} ,${panel4Array[2]} ,${panel4Array[3]}]`, DEBUG, `downmarkClick`);
		} else if(panel4Array[3] == p) {
			$(`#${windowList[panel4Array[1]]}`).css({top: `240px`});
			$(`#${windowList[panel4Array[3]]}`).css({top: `0px`});
			$$$.message(`Switch right panel`, DEBUG, `downmarkClick`);
			$(`.${windowList[panel4Array[1]].split(`-`)[0]}-triangle-down`).css({visibility: `visible`});
			$(`.${windowList[panel4Array[3]].split(`-`)[0]}-triangle-down`).css({visibility: `hidden`});
			$$$.message(`Change right panel triangle css`, DEBUG, `downmarkClick`);
			var t = panel4Array[1];
			panel4Array[1] = panel4Array[3];
			panel4Array[3] = t;
			$$$.message(`Set panel4Array[${panel4Array[0]} ,${panel4Array[1]} ,${panel4Array[2]} ,${panel4Array[3]}]`, DEBUG, `downmarkClick`);
		}
	}

	$(`#reload-btn`).click(() => {
		$$$.message(`Click reload-btn`, DEBUG, `$reload-btn.click`);
		getFilelist(locationPath);
	});

	$(`#upload-btn`).click(() => {
		$$$.message(`Click upload-btn`, DEBUG, `$upload-btn.click`);
		$$$.message(`Trigger file-open-btn click event`, DEBUG, `$upload-btn.click`);
		document.getElementById(`file-open.btn`).click();
	});

	$(`#move-btn-ctrl`).click(() => {
		$$$.message(`Click move-btn-ctrl`, DEBUG, `$move-btn-ctrl`);
		$(`#file-notice-ctrl`).css({visibility: `hidden`});
		$$$.message(`Change css(visibility:hidden) move-btn-ctrl`, DEBUG, `$move-btn-ctrl`);

		$$$.message(`Move file or folder`, DEBUG, `$move-btn-ctrl`);
		var from = `${$(`#base-path-ctrl`).text()}`;
		var afor;
		if($(`#folder-list-ctrl`).val() == 0) afor = `${$(`#filename-box-ctrl`).val()}`;
		else afor = `${folderList[$(`#folder-list-ctrl`).val()]}/${$(`#filename-box-ctrl`).val()}`;
		$$$.message(`From: ${from}`, DEBUG, `$move-btn-ctrl`);
		$$$.message(`For: ${afor}`, DEBUG, `$move-btn-ctrl`);
		client.files.move(`local`, from, afor)
			.done((response) => {
				$$$.message(`Move file or folder success`, INFO, `$move-btn-ctrl`);
				getFilelist(locationPath);
			}).fail((err) => {
				$$$.message(`Move file or folder failure`, ERROR, `$move-btn-ctrl`);
			});
	});

	$(`#cancel-btn-ctrl`).click(() => {
		$$$.message(`Click cancel-btn-ctrl`, DEBUG, `$cancel-btn-ctrl`);
		$(`#file-notice-ctrl`).css({visibility: `hidden`});
		$$$.message(`Change css(visibility:hidden) cancel-btn-ctrl`, DEBUG, `$cancel-btn-ctrl`);
	});
	
	$(`#seed-value-p1`).click(() => {
		$$$.message(`Click seed-value-p1`, DEBUG, `$seed-value-p1.click`);
		changeSeedRate(1);
	});

	$(`#seed-value-p2`).click(() => {
		$$$.message(`Click seed-value-p2`, DEBUG, `$seed-value-p2.click`);
		changeSeedRate(2);
	});

	$(`#seed-value-p3`).click(() => {
		$$$.message(`Click seed-value-p3`, DEBUG, `$seed-value-p3.click`);
		changeSeedRate(3);
	});

	$(`#seed-value-p4`).click(() => {
		$$$.message(`Click seed-value-p4`, DEBUG, `$seed-value-p4.click`);
		changeSeedRate(4);
	});
	function changeSeedRate(p) {
		$$$.message(`Call changeSeedRate`, DEBUG, `changeSeedRate`);

		feedPosition = p;
		localStorage.setItem(`feedPosition`, feedPosition);
		$(`#seed-value-p${feedAmount.indexOf(feedValue)}`).css({'background-color': ceruleanblue});
		$$$.message(`Change css(background-color:ceruleanblue) #seed-value-p${feedAmount.indexOf(feedValue)}`, DEBUG, `changeSeedRate`);
		feedValue = Number($(`#seed-value-p${feedPosition}`).text().split(`mm`)[0]);
		if(feedValue == NaN) $$$.message(`parseInt error`, ERROR, `changeSeedRate`);
		$(`#seed-value-p` + feedPosition).css(({'background-color': lapislazuli}));
		$$$.message(`Change css(background-color:lapislazuli) seed-value-p`, DEBUG, `changeSeedRate`);
		$$$.message(`feed amount is ${feedValue}`, INFO, `changeSeedRate`);
	}

	$(`#manu-btn-p1`).click(() => {
		$$$.message(`Click manu-btn-p1`, DEBUG, `$manu-btn-p1.click`);
		if(!waitNextClick) {
			$(`#manu-btn-p1`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) manu-btn-p1`, DEBUG, `$manu-btn-p1.click`);
			$$$.message(`Change css(background-color:peleskyblue) manu-btn-p1`, DEBUG, `$manu-btn-p1.click`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `$manu-btn-p1.click`);
			setTimeout(()=>{restoreButtonCSS(`p1`)}, 500);
			$$$.message(`Execute button click process`, DEBUG, `$manu-btn-p1.click`);
			moveToHomeManuP(1);
		}
	});

	$(`#manu-btn-p2`).click(() => {
		$$$.message(`Click manu-btn-p2`, DEBUG, `$manu-btn-p2`);
		if(!waitNextClick) {
			$(`#manu-btn-p2`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) manu-btn-p2`, DEBUG, `$manu-btn-p2.click`);
			$$$.message(`Change css(background-color:peleskyblue) manu-btn-p2`, DEBUG, `$manu-btn-p2.click`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `$manu-btn-p2.click`);
			setTimeout(()=>{restoreButtonCSS(`p2`)}, 500);
			$$$.message(`Execute button click process`, DEBUG, `$manu-btn-p2.click`);
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

	$(`#manu-btn-p3`).click(() => {
		$$$.message(`Click manu-btn-pd`, DEBUG, `$manu-btn-p3.click`);
		if(!waitNextClick) {
			$(`#manu-btn-p3`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) manu-btn-p3`, DEBUG, `$manu-btn-p3.click`);
			$$$.message(`Change css(background-color:peleskyblue) manu-btn-p3`, DEBUG, `$manu-btn-p3.click`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `$manu-btn-p3.click`);
			setTimeout(()=>{restoreButtonCSS(`p3`)}, 500);
			$$$.message(`Execute button click process`, DEBUG, `$manu-btn-p3.click`);
			diagonalMove(5);
		}
	});

	$(`#manu-btn-p4`).click(() => {
		$$$.message(`Click manu-btn-p4`, DEBUG, `$manu-btn-p4`);
		if(!waitNextClick) {
			$(`#manu-btn-p4`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) manu-btn-p4`, DEBUG, `$manu-btn-p4.click`);
			$$$.message(`Change css(background-color:peleskyblue) manu-btn-p4`, DEBUG, `$manu-btn-p4.click`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `$manu-btn-p4.click`);
			setTimeout(()=>{restoreButtonCSS(`p4`)}, 500);
			$$$.message(`Execute button click process`, DEBUG, `$manu-btn-p4.click`);
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

	$(`#manu-btn-p5`).click(() => {
		$$$.message(`Click manu-btn-p5`, DEBUG, `$manu-btn-p5.click`);
		if(!waitNextClick) {
			$(`#manu-btn-p5`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) manu-btn-p5`, DEBUG, `$manu-btn-p5.click`);
			$$$.message(`Change css(background-color:peleskyblue) manu-btn-p5`, DEBUG, `$manu-btn-p5.click`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `$manu-btn-p5.click`);
			setTimeout(()=>{restoreButtonCSS(`p5`)}, 500);
			$$$.message(`Execute button click process`, DEBUG, `$manu-btn-p5.click`);
			diagonalMove(6);
		}
	});

	$(`#manu-btn-p6`).click(() => {
		$$$.message(`Click manu-btn-p6`, DEBUG, `$manu-btn-p6.click`);
		if(!waitNextClick) {
			$(`#manu-btn-p6`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) manu-btn-p6`, DEBUG, `$manu-btn-p6.click`);
			$$$.message(`Change css(background-color:peleskyblue) manu-btn-p6`, DEBUG, `$manu-btn-p6.click`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `$manu-btn-p6.click`);
			setTimeout(()=>{restoreButtonCSS(`p6`)}, 500);
			$$$.message(`Execute button click process`, DEBUG, `$manu-btn-p6.click`);
			moveToHomeManuP(2);
		}
	});

	$(`#manu-btn-p7`).click(() => {
		$$$.message(`Click manu-btn-p7`, DEBUG, `$manu-btn-p7.click`);
		if(!waitNextClick) {
			$(`#manu-btn-p7`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) manu-btn-p7`, DEBUG, `$manu-btn-p7.click`);
			$$$.message(`Change css(background-color:peleskyblue) manu-btn-p7`, DEBUG, `$manu-btn-p7.click`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `$manu-btn-p7.click`);
			setTimeout(()=>{restoreButtonCSS(`p7`)}, 500);
			$$$.message(`Execute button click process`, DEBUG, `$manu-btn-p7.click`);
			diagonalMove(7);
		}
	});

	$(`#manu-btn-p8`).click(() => {
		$$$.message(`Click manu-btn-p8`, DEBUG, `$manu-btn-p8.click`);
		buttonPosition++;
		if(buttonPosition > maxButtonPosition) buttonPosition = 1;
		$$$.message(`Manual panel mode is ${buttonPosition}`, DEBUG, `$manu-btn-p8.click`);

		switch(buttonPosition) {
			case 1:
				$(`#manu-btn-p2`).html(`BL`);
				$(`#manu-btn-p4`).html(`BR`);
				$(`#manu-btn-pc`).html(`FL`);
				$(`#manu-btn-pe`).html(`FR`);
				break;
			case 2:
				$(`#manu-btn-p2`).html(`<span class="trans-bl glyphicon glyphicon glyphicon-arrow-left"></span>`);
				$(`#manu-btn-p4`).html(`<span class="trans-br glyphicon glyphicon glyphicon-arrow-right"></span>`);
				$(`#manu-btn-pc`).html(`<span class="trans-fl glyphicon glyphicon glyphicon-arrow-left"></span>`);
				$(`#manu-btn-pe`).html(`<span class="trans-fr glyphicon glyphicon glyphicon-arrow-right"></span>`);
				break;
			case 3:
				$(`#manu-btn-p2`).html(`M1`);
				$(`#manu-btn-p4`).html(`M2`);
				$(`#manu-btn-pc`).html(`M3`);
				$(`#manu-btn-pe`).html(`M4`);
				break;
		}
	});

	$(`#manu-btn-p9`).click(() => {
		$$$.message(`Click manu-btn-p9`, DEBUG, `$manu-btn-p9.click`);
		if(!waitNextClick) {
			$(`#manu-btn-p9`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) manu-btn-p9`, DEBUG, `$manu-btn-p9.click`);
			$$$.message(`Change css(background-color:peleskyblue) manu-btn-p9`, DEBUG, `$manu-btn-p9.click`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `$manu-btn-p9.click`);
			setTimeout(()=>{restoreButtonCSS(`p9`)}, 500);
			$$$.message(`Execute button click process`, DEBUG, `$manu-btn-p9.click`);
			diagonalMove(8);
		}
	});

	$(`#manu-btn-pa`).click(() => {
		$$$.message(`Click manu-btn-pa`, DEBUG, `$manu-btn-pa.click`);
		if(!waitNextClick) {
			$(`#manu-btn-pa`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) manu-btn-pa`, DEBUG, `$manu-btn-pa.click`);
			$$$.message(`Change css(background-color:peleskyblue) manu-btn-pa`, DEBUG, `$manu-btn-pa.click`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `$manu-btn-pa.click`);
			setTimeout(()=>{restoreButtonCSS(`pa`)}, 500);
			$$$.message(`Execute button click process`, DEBUG, `$manu-btn-pa.click`);
			moveToHomeManuP(3);
		}
	});

	$(`#manu-btn-pb`).click(() => {
		$$$.message(`Click manu-btn-pb`, DEBUG, `$manu-btn-pb.click`);
		if(!waitNextClick) {
			$(`#manu-btn-pb`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) manu-btn-pb`, DEBUG, `$manu-btn-pb.click`);
			$$$.message(`Change css(background-color:peleskyblue) manu-btn-pb`, DEBUG, `$manu-btn-pb.click`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `$manu-btn-pb.click`);
			setTimeout(()=>{restoreButtonCSS(`pb`)}, 500);
			$$$.message(`Execute button click process`, DEBUG, `$manu-btn-pb.click`);
			moveToHomeManuP(3);
		}
	});

	$(`#manu-btn-pc`).click(() => {
		$$$.message(`Click manu-btn-pc`, DEBUG, `$manu-btn-pc`);
		if(!waitNextClick) {
			$(`#manu-btn-pc`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) manu-btn-pc`, DEBUG, `$manu-btn-pc.click`);
			$$$.message(`Change css(background-color:peleskyblue) manu-btn-pc`, DEBUG, `$manu-btn-pc.click`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `$manu-btn-pc.click`);
			setTimeout(()=>{restoreButtonCSS(`pc`)}, 500);
			$$$.message(`Execute button click process`, DEBUG, `$manu-btn-pc.click`);
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

	$(`#manu-btn-pd`).click(() => {
		$$$.message(`Click manu-btn-pd`, DEBUG, `$manu-btn-pd.click`);
		if(!waitNextClick) {
			$(`#manu-btn-pd`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) manu-btn-pd`, DEBUG, `$manu-btn-pd.click`);
			$$$.message(`Change css(background-color:peleskyblue) manu-btn-pd`, DEBUG, `$manu-btn-pd.click`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `$manu-btn-pd.click`);
			setTimeout(()=>{restoreButtonCSS(`pd`)}, 500);
			$$$.message(`Execute button click process`, DEBUG, `$manu-btn-pd.click`);
			diagonalMove(9);
		}
	});

	$(`#manu-btn-pe`).click(() => {
		$$$.message(`Click manu-btn-pe`, DEBUG, `$manu-btn-pe`);
		if(!waitNextClick) {
			$(`#manu-btn-pe`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) manu-btn-pe`, DEBUG, `$manu-btn-pe.click`);
			$$$.message(`Change css(background-color:peleskyblue) manu-btn-pe`, DEBUG, `$manu-btn-pe.click`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `$manu-btn-pe.click`);
			setTimeout(()=>{restoreButtonCSS(`pe`)}, 500);
			$$$.message(`Execute button click process`, DEBUG, `$manu-btn-pe.click`);
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

	$(`#manu-btn-pf`).click(() => {
		$$$.message(`Click manu-btn-pf`, DEBUG, `$manu-btn-pf.click`);
		if(!waitNextClick) {
			$(`#manu-btn-pf`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) manu-btn-pf`, DEBUG, `$manu-btn-pf.click`);
			$$$.message(`Change css(background-color:peleskyblue) manu-btn-pf`, DEBUG, `$manu-btn-pf.click`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `$manu-btn-pf.click`);
			setTimeout(()=>{restoreButtonCSS(`pf`)}, 500);
			$$$.message(`Execute button click process`, DEBUG, `$manu-btn-pf.click`);
			diagonalMove(10);
		}
	});
	function bedLevelingPosition(p) {
		$$$.message(`Call bedLevelingPosition`, DEBUG, `bedLevelingPosition`);
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
		$$$.message(`Set${bedPositionName} position value. x=${x} y=${y}`, DEBUG, `bedLevelingPosition`);
		if(powerFlag && extruderPosition[0] >= 0 && extruderPosition[1] >= 0 && extruderPosition[2] >= 0) {
			$$$.message(`Move z-axis up`, DEBUG, `bedLevelingPosition`);
			client.control.sendGcode(`G0 Z5MM`)
				.done(() => {
					$$$.message(`Move x and y-axis up`, DEBUG, `bedLevelingPosition`);
					client.control.sendGcode(`G0 X${x}MM Y${y}MM F1500`)
						.done(() => {
							client.control.sendGcode(`G28 Z0`)
								.done(() => {
									$$$.message(`Finish moving`, DEBUG, `bedLevelingPosition`)
								}).fail((err) => {
									$$$.message(`trap message alert no 00022`, WARN, `getPrinterFullState`);
								});
						}).fail((err) => {
							$$$.message(`trap message alert no 00023`, WARN, `getPrinterFullState`);
						});
				});
		}
	}
	function moveToHomeManuP(pos) {
		if(powerFlag) {
			var originValue;
			switch(pos) {
				case 1:
					originValue = 'X0';
					break;
				case 2:
					originValue = 'Y0';
					break;
				case 3:
					originValue = 'Z0';
			}
			client.control.sendGcode(`G28 ${originValue}`)
				.done(() => {
					if(originValue == `X0`) extruderPosition[0] = 0;
					else if(originValue == `Y0`) extruderPosition[1] = 0;
					else if(originValue == `Z0`) extruderPosition[2] = 0;
					$$$.message(`g-code success`, DEBUG, `moveToHomeManuP`);
				})
				.fail((err) => {
					console.log(err);
				})
		} else $$$.message(`Printer is not connect`, ERROR, `moveToHomeManuP`);
	}
	function diagonalMove(p) {
		$$$.message(`diagonalMove`, DEBUG, `diagonalMove`);
		var x, y, z;
		if(powerFlag && extruderPosition[0] >= 0 && extruderPosition[1] >= 0) {
			switch(p) {
				case 1:
					x = extruderPosition[0] - feedValue;
					y = extruderPosition[1] + feedValue;
					z = extruderPosition[2];
					if(x < 0) x = 0;
					if(y > bedSize[1]) y = bedSize[1];
					break;
				case 2:
					x = extruderPosition[0] + feedValue;
					y = extruderPosition[1] + feedValue;
					z = extruderPosition[2];
					if(x > bedSize[0]) x = bedSize[0];
					if(y > bedSize[1]) y = bedSize[1];
					break;
				case 3:
					x = extruderPosition[0] - feedValue;
					y = extruderPosition[1] - feedValue;
					z = extruderPosition[2];
					if(x < 0) x = 0;
					if(y < 0) y = 0;
					break;
				case 4:
					x = extruderPosition[0] + feedValue;
					y = extruderPosition[1] - feedValue;
					z = extruderPosition[2];
					if(x > bedSize[0]) x = bedSize[0];
					if(y < 0) y = 0;
					break;
				case 5:
					x = extruderPosition[0];
					y = extruderPosition[1] + feedValue;
					z = extruderPosition[2];
					if(y > bedSize[1]) y = bedSize[1];
					break;
				case 6:
					x = extruderPosition[0];
					y = extruderPosition[1];
					z = extruderPosition[2] = feedValue;
					if(z > bedSize[2]) z = bedSize[2];
					break;
				case 7:
					x = extruderPosition[0] - feedValue;
					y = extruderPosition[1];
					z = extruderPosition[2];
					if(x < 0) x = 0;
					break;
				case 8:
					x = extruderPosition[0] + feedValue;
					y = extruderPosition[1];
					z = extruderPosition[2];
					if(x > bedSize[0]) x = bedSize[0];
					break;
				case 9:
					x = extruderPosition[0];
					y = extruderPosition[1] - feedValue;
					z = extruderPosition[2];
					if(y < 0) y = 0;
					break;
				case 10:
					x = extruderPosition[0];
					y = extruderPosition[1];
					z = extruderPosition[2] - feedValue;
					if(z < 0) z = 0;
					break;
			}
			client.control.sendGcode(`G0 X${x}MM Y${y}MM Z${z}MM F1500`)
				.done(() => {
					extruderPosition[0] = x;
					extruderPosition[1] = y;
					$$$.message(`gCode succcess.`, INFO, `diagonalMove`);
					$$$.message(`Extruder position is x=${x} y=${y} z=${z}`, INFO,  `diagonalMove`);
				}).fail((err) => {
					$$$.message(`trap message alert no 00024`, WARN, `diagonalMove`);
				});
		}
	}
	function restoreButtonCSS(bn) {
		$$$.message(`Call restoreButtonCSS`, DEBUG, `restoreButtonCSS`);
		waitNextClick = false;
		$$$.message(`Change waitNextClick. value is ` + waitNextClick, DEBUG, `restoreButtonCSS`);
		if(bn == `up` || bn == `down`) {
			$(`#extruder-btn-` + bn).css({
				color:				sunshine,
				'background-color':	lapislazuli
			});
			$$$.message(`Change css(color:sunshine) extruder-btn-${bn}`, DEBUG, `restoreButtonCSS`);
			$$$.message(`Change css(background-color:lapislazuli) extruder-btn-${bn}`, DEBUG, `restoreButtonCSS`);
		} else {
			$(`#manu-btn-` + bn).css({
				color:				sunshine,
				'background-color':	lapislazuli
			})
			$$$.message(`Change css(color:sunshine) manu-btn-${bn}`, DEBUG, `restoreButtonCSS`);
			$$$.message(`Change css(background-color:lapislazuli) extruder-btn-${bn}`, DEBUG, `restoreButtonCSS`);
		}
	}

	$(`#extruder-btn-up`).click(() => {
		$$$.message(`Click extruder-btn-up`, DEBUG, `$extruder-btn-up.click`);
		if(!canRunExtruder || !powerFlag) {
			$$$.message(`Dispensable temperature not reached`, WARN, `$extruder-btn-up.click`);
			return;
		}
		if(!waitNextClick) {
			$(`#extruder-btn-up`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) manu-btn-pe`, DEBUG, `$extruder-btn-up.click`);
			$$$.message(`Change css(background-color:peleskyblue) manu-btn-pe`, DEBUG, `$extruder-btn-up.click`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `$extruder-btn-up.click`);
			setTimeout(()=>{restoreButtonCSS(`up`)}, 500);
			if(powerFlag && canRunExtruder) {
			client.control.sendGcode(`G92 E0`)
				.done(() => {
					$$$.message(`Reset extruder retract position`, DEBUG, `$extruder-btn-up.click`);
					client.control.sendGcode(`G1 E-${$(`#amount-value`).val()}MM`)
						.done(() => {
							$$$.message(`Retract filament ${$(`#amount-value`).val()}mm`, DEBUG, `$extruder-btn-up.click`);
						}).fail((err) => {
							$$$.message(`trap message alert no 00025`, WARN, `getPrinterFullState`);
						});
				}).fail((err) => {
					$$$.message(`trap message alert no 00026`, WARN, `getPrinterFullState`);
				});
			}
		}
	});

	$(`#extruder-btn-down`).click(() => {
		$$$.message(`Click extruder-btn-down`, DEBUG, `$extruder-btn-down.click`);
		if(!canRunExtruder || !powerFlag) {
			$$$.message(`Dispensable temperature not reached`, WARN, `$extruder-btn-down.click`);
			return;
		}
		if(!waitNextClick) {
			$(`#extruder-btn-down`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) manu-btn-pe`, DEBUG, `$extruder-btn-down.click`);
			$$$.message(`Change css(background-color:peleskyblue) manu-btn-pe`, DEBUG, `$extruder-btn-down.click`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `$extruder-btn-down.click`);
			setTimeout(()=>{restoreButtonCSS(`down`)}, 500);
			if(powerFlag && canRunExtruder) {
				client.control.sendGcode(`G92 E0`)
					.done(() => {
						$$$.message(`Reset extruder extrud position`, DEBUG, `$extruder-btn-down.click`);
						client.control.sendGcode(`G1 F500 E${$(`#amount-value`).val()}MM`)
							.done(() => {
								$$$.message(`Extrud filament ${$(`#amount-value`).val()}mm`, DEBUG, `$extruder-btn-down.click`);
							}).fail((err) => {
								$$$.message(`trap message alert no 00026`, WARN, `getPrinterFullState`);
							});
					}).fail((err) => {
						$$$.message(`trap message alert no 00027`, WARN, `getPrinterFullState`);
					});
			}
		}
	});

	$(`#extruder-tag`).click(() => {
		$$$.message(`Click extruder-tag`, DEBUG, `$extruder-tag.click`);
		if(extruderPanelShown) {
			$(`.extruder-panel`).css({visibility: `hidden`});
			$(`#extruder-tag`).css({top: `0px`});
			$$$.message(`Change css(visibility:hidden) extruder-panel`, DEBUG, `$extruder-tag.click`);
			$$$.message(`Change css(top:0px) extruder-panel-tag`, DEBUG, `$extruder-tag.click`);
			extruderPanelShown = false;
			$$$.message(`Change extruderPanelShown. value is ${extruderPanelShown}`, DEBUG, `$extruder-tag.click`);
		} else {
			$(`.extruder-panel`).css({visibility: `visible`});
			$(`#extruder-tag`).css({top: `80px`});
			$$$.message(`Change css(visibility:visible) extruder-panel`, DEBUG, `$extruder-tag.click`);
			$$$.message(`Change css(top:80px) extruder-panel-tag`, DEBUG, `$extruder-tag.click`);
			extruderPanelShown = true;
			$$$.message(`Change extruderPanelShown. value is ${extruderPanelShown}`, DEBUG, `$extruder-tag.click`);
		}
	});

	$(`#nav-cog-ctrl`).click(() => {
		$$$.message(`Click nav-cog-ctrl`, DEBUG, `$nav-cog-ctrl.click`);

		if(subMenuPanelOpen) {
			$$$.message(`Already have the ${subMenuPanelName} panel open`, WARN, '$nav-console-ctrl.click')
			$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
			$(`.nav-submenu`).css({right: `-288px`});
			$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$nav-cog-ctrl.click`);
			submenuToggle = false;
			return;
		}
		subMenuPanelOpen = true;
		subMenuPanelName = 'configure';

		$(`#barrierLayer-ctrl`).css({visibility: 'visible'});
		$$$.message(`Change css(visibility:visible) barrierLayer`, DEBUG, `$nav-cog-ctrl.click`);

		$(`#setting-panel-ctrl`).css({visibility: `visible`});
		$$$.message(`Change css(visibility:visible) setting-panel-ctrl`, DEBUG, `$nav-cog-ctrl.click`);

		$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
		$(`.nav-submenu`).css({right: `-288px`});
		$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$nav-cog-ctrl.click`);
		submenuToggle = false;
	});

	$(`#conf-set-ctrl`).click(() => {
		$$$.message(`Click conf-set-ctrl`, DEBUG, `$conf-set-ctrl.click`);

		if(!checkConfigValue()) return;
		$(`[id^=movement-remove-p]`).css({color: skyhigh});
		$$$.message(`Change css(color:skyhigh) id^=movement-remove-p`, DEBUG, `$conf-set-ctrl.click`);
				
		$(`#setting-panel-ctrl`).css({visibility: `hidden`});
		$$$.message(`Change css(visibility:hidden) setting-panel-ctrl`, DEBUG, `$conf-set-ctrl.click`);

		//localStorage.setItem(`uri-origin`, $(``));
		$$$.message(`Set server information`, INFO, `$onf-set-ctrl.click`);
		serverHost	= $(`#uri-host-ctrl`).val();
		serverPort	= $(`#uri-port-ctrl`).val();
		serverApikey= $(`#uri-apikey-ctrl`).val();
		$$$.message(`Store server information`, INFO, `$onf-set-ctrl.click`);
		localStorage.setItem(`uri-host`, serverHost);
		localStorage.setItem(`uri-apikey`, serverApikey);
		localStorage.setItem(`uri-port`, serverPort);
		$$$.message(`Regenarate octoprint client object`, INFO, `$conf-set-ctrl.click`);
		setClientObject();
		
		feedAmount[1] = Number($(`#movement-p1`).val());
		feedAmount[2] = Number($(`#movement-p2`).val());
		feedAmount[3] = Number($(`#movement-p3`).val());
		feedAmount[4] = Number($(`#movement-p4`).val());
		$$$.message(`Store movement amount information`, INFO, `$conf-set-ctrl.click`);
		localStorage.setItem(`movement-p1`, feedAmount[1]);
		localStorage.setItem(`movement-p2`, feedAmount[2]);
		localStorage.setItem(`movement-p3`, feedAmount[3]);
		localStorage.setItem(`movement-p4`, feedAmount[4]);

		$$$.message(`Change seed range view`, INFO, `$conf-set-ctrl.click`);
		$(`#seed-value-p1`).text(`${feedAmount[1]}mm`);
		$(`#seed-value-p2`).text(`${feedAmount[2]}mm`);
		$(`#seed-value-p3`).text(`${feedAmount[3]}mm`);
		$(`#seed-value-p4`).text(`${feedAmount[4]}mm`);

		feedValue = feedAmount[feedPosition];
		$$$.message(`feed amount is ${feedValue}`, INFO, `$conf-set-ctrl.click`);

		localStorage.setItem(`win-pos-x`, $(`#win-pos-x`).val());
		localStorage.setItem(`win-pos-y`, $(`#win-pos-y`).val());

		extruderMovingTemp = $(`#extruder-temp-ctrl`).val();
		localStorage.setItem(`extruder-temp`, extruderMovingTemp);
		$$$.message(`Extruder dischage temperature is ${extruderMovingTemp}C`, DEBUG, `$conf-set-ctrl.click`);
		bedSize[0] = $(`#bedsize-w-ctrl`).val();
		localStorage.setItem(`bdsize-w`, bedSize[0]);
		$$$.message(`Bed size  is ${bedSize[0]}mm`, DEBUG, `$conf-set-ctrl.click`);
		bedSize[1] = $(`#bedsize-d-ctrl`).val();
		localStorage.setItem(`bdsize-d`, bedSize[1]);
		$$$.message(`Bed size  is ${bedSize[1]}mm`, DEBUG, `$conf-set-ctrl.click`);
		bedSize[2] = $(`#bedsize-h-ctrl`).val();
		localStorage.setItem(`bdsize-h`, bedSize[2]);
		$$$.message(`Bed size  is ${bedSize[2]}mm`, DEBUG, `$conf-set-ctrl.click`);

		if($(`#debug-mode-ctrl`).prop(`checked`) == true) {
			$(`#reload-btn-ctrl`).css({visibility: `visible`});
			$(`#ID-powerFlag`).css({visibility: `visible`});
			localStorage.setItem(`debug-mode`, true);
		} else {
			$(`#reload-btn-ctrl`).css({visibility: `hidden`});
			$(`#ID-powerFlag`).css({visibility: `hidden`});
			localStorage.setItem(`debug-mode`, false);
		}


		feedAmountBigP1[1] = Number($(`#movement-p11`).val());
		feedAmountBigP1[2] = Number($(`#movement-p12`).val());
		feedAmountBigP1[3] = Number($(`#movement-p13`).val());
		feedAmountBigP1[4] = Number($(`#movement-p14`).val());
		localStorage.setItem(`movement-big-P1-1`, feedAmountBigP1[1]);
		localStorage.setItem(`movement-big-P1-2`, feedAmountBigP1[2]);
		localStorage.setItem(`movement-big-P1-3`, feedAmountBigP1[3]);
		localStorage.setItem(`movement-big-P1-4`, feedAmountBigP1[4]);
		$(`#feed-amount-big-p11`).text(`${feedAmountBigP1[1]}mm`);
		$(`#feed-amount-big-p12`).text(`${feedAmountBigP1[2]}mm`);
		$(`#feed-amount-big-p13`).text(`${feedAmountBigP1[3]}mm`);
		$(`#feed-amount-big-p14`).text(`${feedAmountBigP1[4]}mm`);

		feedAmountBigP2[1] = Number($(`#movement-p21`).val());
		feedAmountBigP2[2] = Number($(`#movement-p22`).val());
		feedAmountBigP2[3] = Number($(`#movement-p23`).val());
		feedAmountBigP2[4] = Number($(`#movement-p24`).val());
		localStorage.setItem(`movement-big-P2-1`, feedAmountBigP2[1]);
		localStorage.setItem(`movement-big-P2-2`, feedAmountBigP2[2]);
		localStorage.setItem(`movement-big-P2-3`, feedAmountBigP2[3]);
		localStorage.setItem(`movement-big-P2-4`, feedAmountBigP2[4]);
		$(`#feed-amount-big-p21`).text(`${feedAmountBigP2[1]}mm`);
		$(`#feed-amount-big-p22`).text(`${feedAmountBigP2[2]}mm`);
		$(`#feed-amount-big-p23`).text(`${feedAmountBigP2[3]}mm`);
		$(`#feed-amount-big-p24`).text(`${feedAmountBigP2[4]}mm`);

		subMenuPanelOpen = false;
		subMenuPanelName = '';

		$(`#barrierLayer-ctrl`).css({visibility: 'hidden'});
		$$$.message(`Change css(visibility:hidden) barrierLayer`, DEBUG, `$conf-set-ctrl.click`);
	});
	function checkConfigValue() {
		var checked = true;
		for(var i=1; i<=4; i++) {
			if($(`#movement-p1`).val() == $(`#movement-p${i}`).val() && i != 1) {
				$(`#movement-remove-p1`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p1`, DEBUG, `checkConfigValue`);
				$(`#movement-remove-p${i}`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p${i}`, DEBUG, `checkConfigValue`);
				checked = false;
				$$$.message(`Change checked(${i}). value is ${checked}`, DEBUG, `checkConfigValue`);
			}
			if($(`#movement-p2`).val() == $(`#movement-p${i}`).val() && i != 2) {
				$(`#movement-remove-p2`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p2`, DEBUG, `checkConfigValue`);
				$(`#movement-remove-p${i}`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p${i}`, DEBUG, `checkConfigValue`);
				checked = false;
				$$$.message(`Change checked(${i}). value is ${checked}`, DEBUG, `checkConfigValue`);
			}
			if($(`#movement-p3`).val() == $(`#movement-p${i}`).val() && i != 3) {
				$(`#movement-remove-p3`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p3`, DEBUG, `checkConfigValue`);
				$(`#movement-remove-p${i}`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p${i}`, DEBUG, `checkConfigValue`);
				checked = false;
				$$$.message(`Change checked(${i}). value is ${checked}`, DEBUG, `checkConfigValue`);
			}
			if($(`#movement-p4`).val() == $(`#movement-p${i}`).val() && i != 4) {
				$(`#movement-remove-p4`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p4`, DEBUG, `checkConfigValue`);
				$(`#movement-remove-p${i}`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p${i}`, DEBUG, `checkConfigValue`);
				checked = false;
				$$$.message(`Change checked(${i}). value is ${checked}`, DEBUG, `checkConfigValue`);
			}
		}
		for(var i=1; i<=4; i++) {
			if($(`#movement-p11`).val() == $(`#movement-p1${i}`).val() && i != 1) {
				$(`#movement-remove-p11`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p11`, DEBUG, `checkConfigValue`);
				$(`#movement-remove-p1${i}`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p1${i}`, DEBUG, `checkConfigValue`);
				checked = false;
				$$$.message(`Change checked(1${i}). value is ${checked}`, DEBUG, `checkConfigValue`);
			}
			if($(`#movement-p12`).val() == $(`#movement-p1${i}`).val() && i != 2) {
				$(`#movement-remove-p12`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p12`, DEBUG, `checkConfigValue`);
				$(`#movement-remove-p1${i}`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p1${i}`, DEBUG, `checkConfigValue`);
				checked = false;
				$$$.message(`Change checked(1${i}). value is ${checked}`, DEBUG, `checkConfigValue`);
			}
			if($(`#movement-p13`).val() == $(`#movement-p1${i}`).val() && i != 3) {
				$(`#movement-remove-p13`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p13`, DEBUG, `checkConfigValue`);
				$(`#movement-remove-p1${i}`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p1${i}`, DEBUG, `checkConfigValue`);
				checked = false;
				$$$.message(`Change checked(1${i}). value is ${checked}`, DEBUG, `checkConfigValue`);
			}
			if($(`#movement-p14`).val() == $(`#movement-p1${i}`).val() && i != 4) {
				$(`#movement-remove-p14`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p14`, DEBUG, `checkConfigValue`);
				$(`#movement-remove-p1${i}`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p1${i}`, DEBUG, `checkConfigValue`);
				checked = false;
				$$$.message(`Change checked(1${i}). value is ${checked}`, DEBUG, `checkConfigValue`);
			}
		}
		for(var i=1; i<=4; i++) {
			if($(`#movement-p21`).val() == $(`#movement-p2${i}`).val() && i != 1) {
				$(`#movement-remove-p21`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p21`, DEBUG, `checkConfigValue`);
				$(`#movement-remove-p2${i}`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p2${i}`, DEBUG, `checkConfigValue`);
				checked = false;
				$$$.message(`Change checked(2${i}). value is ${checked}`, DEBUG, `checkConfigValue`);
			}
			if($(`#movement-p22`).val() == $(`#movement-p2${i}`).val() && i != 2) {
				$(`#movement-remove-p22`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p22`, DEBUG, `checkConfigValue`);
				$(`#movement-remove-p2${i}`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p2${i}`, DEBUG, `checkConfigValue`);
				checked = false;
				$$$.message(`Change checked(2${i}). value is ${checked}`, DEBUG, `checkConfigValue`);
			}
			if($(`#movement-p23`).val() == $(`#movement-p2${i}`).val() && i != 3) {
				$(`#movement-remove-p23`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p23`, DEBUG, `checkConfigValue`);
				$(`#movement-remove-p2${i}`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p2${i}`, DEBUG, `checkConfigValue`);
				checked = false;
				$$$.message(`Change checked(2${i}). value is ${checked}`, DEBUG, `checkConfigValue`);
			}
			if($(`#movement-p24`).val() == $(`#movement-p2${i}`).val() && i != 4) {
				$(`#movement-remove-p24`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p24`, DEBUG, `checkConfigValue`);
				$(`#movement-remove-p2${i}`).css({color: rescueorange});
				$$$.message(`Change css(color:rescueorange) movement-remove-p2${i}`, DEBUG, `checkConfigValue`);
				checked = false;
				$$$.message(`Change checked(2${i}). value is ${checked}`, DEBUG, `checkConfigValue`);
			}
		}
		return checked;
	}

	$(`#leftmark-ctrl`).click(() => {
		$$$.message(`Call leftmark-ctrl`, DEBUG, `leftmark-ctrl.click`);
		contentPosition++;
		if(contentPosition > maxContentPosition) contentPosition = 0;
		$(`[id^=content-body-]`).css({'z-index': -1});
		$$$.message(`Change css(z-index:-1) content-body-*-ctrl`, DEBUG, `$leftmark-ctrl.click`);
		switch(contentPosition) {
			case 0:
				$(`#content-body-uri-ctrl`).css({'z-index': 1});
				$$$.message(`Change css(z-index:1) content-body-uri-ctrl`, DEBUG, `$leftmark-ctrl.click`);
				break;
			case 1:
				$(`#content-body-movement-ctrl`).css({'z-index': 1});
				$$$.message(`Change css(z-index:1) content-body-movement-ctrl`, DEBUG, `$leftmark-ctrl.click`);
				break;
			case 2:
				$(`#content-body-printer-ctrl`).css({'z-index': 1});
				$$$.message(`Change css(z-index:1) content-body-printer-ctrl`, DEBUG, `$leftmark-ctrl.click`);
				break;
			case 3:
				$(`#content-body-win-control-ctrl`).css({'z-index': 1});
				$$$.message(`Change css(z-index:1) content-body-win-control-ctrl`, DEBUG, `$leftmark-ctrl.click`);
				break;
		}
	});

	$(`#gCode-close-btn-ctrl`).click(() => {
		$$$.message(`Click gCode-close-btn-ctrl`, DEBUG, `gCode-close-btn-ctrl.click`);
		$(`#gCode-panel-ctrl`).css({visibility: `hidden`});

		$(`#barrierLayer-ctrl`).css({visibility: `hidden`});
		$$$.message(`Change css(visibility:hidden) barrierLayer-ctrl`, DEBUG, `$gCode-close-btn-ctrl.click`);

		subMenuPanelOpen = false;
		subMenuPanelName = '';
	});

	$(`#nav-console-ctrl`).click(() => {
		$$$.message(`Click nav-console-ctrl`, DEBUG, `$nav-console-ctrl.click`);

		if(subMenuPanelOpen && subMenuPanelName != 'gCode terminal') {
			$$$.message(`Already have the ${subMenuPanelName} panel open`, WARN, '$nav-console-ctrl.click')
			$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
			$(`.nav-submenu`).css({right: `-288px`});
			$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$nav-console-ctrl.click`);
			submenuToggle = false;
			return;
		}
		subMenuPanelOpen = true;
		subMenuPanelName = 'gCode terminal';

		if(windowSize != 3) {
			if($(`#gCode-panel-ctrl`).css(`visibility`) == `hidden`) {
				$$$.message(`Show gCode console`, INFO, `nav-console-ctrl.click`);
				$$$.message(`Set the screen when windowSize=1 or 2`, DEBUG, `$nav-console-ctrl.click`);
				$(`#gCode-panel-ctrl`).removeClass(`gCode-panel-x4`);
				$(`#gCode-title-ctrl`).removeClass(`title-x4`);
				$(`#gCode-monitor-ctrl`).removeClass(`gCode-monitor-x4`);
				$(`#gCode-line-ctrl`).removeClass(`gCode-line-x4`);
				$(`#gCode-send-btn-ctrl`).removeClass(`gCode-send-btn-x4`);
				$(`#gCode-close-btn-ctrl`).removeClass(`gCode-close-btn-x4`);
				$(`#gCode-panel-ctrl`).css({visibility: `visible`});
			}
		} else {
			if($(`#gCode-panel-ctrl`).css(`visibility`) != `hidden`) {
				subPanelSize++;
				if(subPanelSize> 2) subPanelSize= 1;
				switch(subPanelSize) {
					case 1:
						$$$.message(`Show gCode console`, INFO, `nav-console-ctrl.click`);
						$$$.message(`Set the screen when windowSize=1 or 2`, DEBUG, `$nav-console-ctrl.click`);
						$(`#gCode-panel-ctrl`).removeClass(`gCode-panel-x4`);
						$(`#gCode-title-ctrl`).removeClass(`title-x4`);
						$(`#gCode-monitor-ctrl`).removeClass(`gCode-monitor-x4`);
						$(`#gCode-line-ctrl`).removeClass(`gCode-line-x4`);
						$(`#gCode-send-btn-ctrl`).removeClass(`gCode-send-btn-x4`);
						$(`#gCode-close-btn-ctrl`).removeClass(`gCode-close-btn-x4`);
						$(`#gCode-panel-ctrl`).css({visibility: `visible`});
						break;
					case 2:
						$$$.message(`Show gCode console`, INFO, `nav-console-ctrl.click`);
						$$$.message(`Set the screen when windowSize=3`, DEBUG, `$nav-console-ctrl.click`);
						$(`#gCode-panel-ctrl`).addClass(`gCode-panel-x4`);
						$(`#gCode-title-ctrl`).addClass(`title-x4`);
						$(`#gCode-monitor-ctrl`).addClass(`gCode-monitor-x4`);
						$(`#gCode-line-ctrl`).addClass(`gCode-line-x4`);
						$(`#gCode-send-btn-ctrl`).addClass(`gCode-send-btn-x4`);
						$(`#gCode-close-btn-ctrl`).addClass(`gCode-close-btn-x4`);
						$(`#gCode-panel-ctrl`).css({visibility: `visible`});
						break;
				}
			} else {
				$$$.message(`Show gCode console`, INFO, `nav-console-ctrl.click`);
				$$$.message(`Set the screen when windowSize=1 or 2`, DEBUG, `$nav-console-ctrl.click`);
				$(`#gCode-panel-ctrl`).addClass(`gCode-panel-x4`);
				$(`#gCode-title-ctrl`).addClass(`title-x4`);
				$(`#gCode-monitor-ctrl`).addClass(`gCode-monitor-x4`);
				$(`#gCode-line-ctrl`).addClass(`gCode-line-x4`);
				$(`#gCode-send-btn-ctrl`).addClass(`gCode-send-btn-x4`);
				$(`#gCode-close-btn-ctrl`).addClass(`gCode-close-btn-x4`);
				$(`#gCode-panel-ctrl`).css({visibility: `visible`});
			}
		}

		$(`#barrierLayer-ctrl`).css({visibility: `visible`});
		$$$.message(`Change css(visibility:visible) barrierLayer-ctrl`, DEBUG, `$nav-console-ctrl.click`);

		$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
		$(`.nav-submenu`).css({right: `-288px`});
		$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$nav-console-ctrl.click`);
		submenuToggle = false;
	});

	$(`#gCode-send-btn-ctrl`).click(() => {
		$$$.message(`Call gCode-send-btn-ctrl`, DEBUG, `$gCode-send-btn-ctrl.click`);

		if($(`#gCode-line-ctrl`).val() != '') {
			$$$.message(`Send gCode [ ${$(`#gCode-line-ctrl`).val().toUpperCase()} ]`, INFO, `$gCode-send-btn-ctrl.click`);
			$(`#gCode-monitor-ctrl`).val(`${$(`#gCode-monitor-ctrl`).val()}Send : ${$(`#gCode-line-ctrl`).val().toUpperCase()}\n`);
			client.control.sendGcode($(`#gCode-line-ctrl`).val().toUpperCase())
				.done(() => {
					$$$.message(`Send gCode success`, INFO, `$gCode-send-btn-ctrl.click`)
					$(`#gCode-monitor-ctrl`).val(`${$(`#gCode-monitor-ctrl`).val()}Send ok.\n`);
					$(`#gCode-line-ctrl`).val(``);
				})
				.fail((err) => {
					$$$.message(`Send gCode failure`, INFO, `$gCode-send-btn-ctrl.click`)
					$(`#gCode-monitor-ctrl`).val(`${$(`#gCode-monitor-ctrl`).val()}Send error.\n`);
					$(`#gCode-line-ctrl`).val(``);
				})
		} else $$$.message(`gCode value is empty`, WARN, `$gCode-send-btn-ctrl.click`);

		if(!powerFlag) {
			$$$.message(`gCode cannot be sent unless a printer is connected.`, ERROR, `gCode-send-btn-ctrl.click`);
			$(`#gCode-monitor-ctrl`).val(`${$(`#gCode-monitor-ctrl`).val()}Error : gCode cannot be sent unless a printer is connected.\n`);
			$(`#gCode-line-ctrl`).val();
		}
	});

	$(`#big-manual-close-btn-ctrl`).click(() => {
		$$$.message(`click big-manual-close-btn-ctrl`, DEBUG, `$big-manual-close-btn-ctrl.click`);
		$(`#big-manual-panel-ctrl`).css({visibility: `hidden`});

		$(`#barrierLayer-ctrl`).css({visibility: 'hidden'});
		$$$.message(`Change css(visibility:hidden) barrierLayer`, DEBUG, `$big-manual-close-btn-ctrl.click`);

		subMenuPanelOpen = false;
		subMenuPanelName = '';
	});

	$(`#nav-move-ctrl`).click(() => {
		$$$.message(`click nav-move-ctrl`, DEBUG, `$nav-move-ctrl.click`);
		
		if(windowSize != 3) {
			$$$.message(`Large manual controller only works in x4 mode`, WARN, '$nav-move-ctrl.click');

			$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
			$(`.nav-submenu`).css({right: `-288px`});
			$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$nav-move-ctrl.click`);
			submenuToggle = false;
			return;
		}

		if(subMenuPanelOpen) {
			$$$.message(`Already have the ${subMenuPanelName} panel open`, WARN, '$nav-move-ctrl.click');
			$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
			$(`.nav-submenu`).css({right: `-288px`});
			$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$nav-move-ctrl.click`);
			submenuToggle = false;
			return;
		}
		subMenuPanelOpen = true;
		subMenuPanelName = 'manual control';

		$(`#big-manual-panel-ctrl`).css({visibility: `visible`});

		$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
		$(`.nav-submenu`).css({right: `-288px`});
		$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$nav-move-ctrl.click`);
		submenuToggle = false;
	});
	$(`#feed-amount-big-p11`).click(() => {
		$$$.message(`Click feed-amount-big-p11`, DEBUG, `$feed-amount-big-p11.click`);
		changeFeedAmountBigP1(1);
	});
	$(`#feed-amount-big-p12`).click(() => {
		$$$.message(`Click feed-amount-big-p12`, DEBUG, `$feed-amount-big-p12.click`);
		changeFeedAmountBigP1(2);
	});
	$(`#feed-amount-big-p13`).click(() => {
		$$$.message(`Click feed-amount-big-p13`, DEBUG, `$feed-amount-big-p13.click`);
		changeFeedAmountBigP1(3);
	});
	$(`#feed-amount-big-p14`).click(() => {
		$$$.message(`Click feed-amount-big-p14`, DEBUG, `$feed-amount-big-p14.click`);
		changeFeedAmountBigP1(4);
	});
	function changeFeedAmountBigP1(pos) {
		$$$.message(`Call changeFeedAmountBigP1`, DEBUG, `changeFeedAmountBigP1`);

		$(`[id^=feed-amount-big-p1]`).css({'background-color': skyhigh});
		$$$.message(`Change css(background-color:skyhigh) feed-amount-big-p1`, DEBUG, `changeFeedAmountBigP1`);
		$(`#feed-amount-big-p1${pos}`).css({'background-color': lapislazuli});
		$$$.message(`Change css(background-color:lapislazuli) feed-amount-big-p1${pos}`, DEBUG, `changeFeedAmountBigP1`);
		feedValueBigP1 = feedAmountBigP1[pos];
		$$$.message(`Change value(feedValueBigP1:${feedValueBigP1})`, INFO, `changeFeedAmountBigP1`);
	}
	$(`#feed-amount-big-p21`).click(() => {
		$$$.message(`Click feed-amount-big-p21`, DEBUG, `$feed-amount-big-p21.click`);
		changeFeedAmountBigP2(1);
	});
	$(`#feed-amount-big-p22`).click(() => {
		$$$.message(`Click feed-amount-big-p22`, DEBUG, `$feed-amount-big-p12.click`);
		changeFeedAmountBigP2(2);
	});
	$(`#feed-amount-big-p23`).click(() => {
		$$$.message(`Click feed-amount-big-p23`, DEBUG, `$feed-amount-big-p23.click`);
		changeFeedAmountBigP2(3);
	});
	$(`#feed-amount-big-p24`).click(() => {
		$$$.message(`Click feed-amount-big-p24`, DEBUG, `$feed-amount-big-p24.click`);
		changeFeedAmountBigP2(4);
	});
	function changeFeedAmountBigP2(pos) {
		$$$.message(`Call changeFeedAmountBigP1`, DEBUG, `changeFeedAmountBigP2`);

		$(`[id^=feed-amount-big-p2]`).css({'background-color': skyhigh});
		$$$.message(`Change css(background-color:skyhigh) feed-amount-big-p2`, DEBUG, `changeFeedAmountBigP2`);
		$(`#feed-amount-big-p2${pos}`).css({'background-color': lapislazuli});
		$$$.message(`Change css(background-color:lapislazuli) feed-amount-big-p2${pos}`, DEBUG, `changeFeedAmountBigP2`);
		feedValueBigP2 = feedAmountBigP2[pos];
		$$$.message(`Change value(feedValueBigP2:${feedValueBigP2})`, INFO, `changeFeedAmountBigP2`);
	}

	$(`#button-big-1x7-1`).click(() => {
		$$$.message(`Click button-big-1x7-1`, DEBUG, `$button-big-1x7-1.click`);
		moveToHome(0);
	});

	$(`#button-big-1x7-2`).click(() => {
		$$$.message(`Click button-big-1x7-2`, DEBUG, `$button-big-1x7-2.click`);
		moveToHome(1);
	});

	$(`#button-big-1x7-3`).click(() => {
		$$$.message(`Click button-big-1x7-3`, DEBUG, `$button-big-1x7-3.click`);
		moveToHome(2);
	});

	$(`#button-big-1x7-4`).click(() => {
		$$$.message(`Click button-big-1x7-4`, DEBUG, `$button-big-1x7-4.click`);
		moveToHome(3);
	});

	$(`#button-big-1x9-1`).click(() => {
		$$$.message(`Click button-big-1x9-1`, DEBUG, `$button-big-1x9-1.click;`);
		moveToLevel2(9);
	});

	$(`#button-big-1x9-2`).click(() => {
		$$$.message(`Click button-big-1x9-2`, DEBUG, `$button-big-1x9-2.click;`);
		moveToLevel1(9);
	});

	$(`#button-big-1x9-3`).click(() => {
		$$$.message(`Click button-big-1x9-3`, DEBUG, `$button-big-1x9-3.click;`);
		moveToHome(5);
	});

	$(`#button-big-1x9-4`).click(() => {
		$$$.message(`Click button-big-1x9-4`, DEBUG, `$button-big-1x9-4.click;`);
		moveToLevel1(10);
	});

	$(`#button-big-1x9-5`).click(() => {
		$$$.message(`Click button-big-1x9-5`, DEBUG, `$button-big-1x9-5.click;`);
		moveToLevel2(10);
	});

	$(`#button-big-5x1-1`).click(() => {
		$$$.message(`Click button-big-5x1-1`, DEBUG, `$button-big-5x1-1.click`);
		moveToExtruder(1);
	});

	$(`#button-big-5x1-2`).click(() => {
		$$$.message(`Click button-big-5x1-2`, DEBUG, `$button-big-5x1-2.click`);
		moveToExtruder(2);
	});
	function moveToExtruder(order) {
		$$$.message(`Call mobeExtruder`, DEBUG, `moveToExtruder`);
		if(!canRunExtruder) {
			$$$.message(`Dispensable temperature not reached`, WARN, `moveToExtruder`);
			return;
		}
		if(!waitNextClick) {
			$(`#button-big-${btnNameExtruder[order]}`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) button-big-${btnNameExtruder[order]}`, DEBUG, `moveToExtruder`);
			$$$.message(`Change css(background-color:peleskyblue) button-big-${btnNameExtruder[order]}`, DEBUG, `moveToExtruder`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `moveToExtruder`);
			setTimeout(()=>{restoreButtonCSSBig(btnNameExtruder[order])}, 500);

			if(!powerFlag) {
				$$$.message(`Printer connection required for manual operation`, WARN, `moveToExtruder`);
				return;
			}
	
			client.control.sendGcode(`G92 E0`)
				.done(() =>{
					$$$.message(`Reset extruder retract position`, DEBUG, `moveToExtruder`);
					client.control.sendGcode(`G0 E${order == 1 ? '-' : ''}${$(`#amount-value-big`).val()}MM`)
						.done(() => {
							$$$.message(`Retract filament ${$(`#amount-value-big`).val()}mm`, DEBUG, `moveToExtruder`);
						})
						.fail((err) => {
							console.log(err)
						})
				})
				.fail((err) => {
					console.log(err);
				});
		}
	}

	$(`#button-big-9x9-11`).click(() => {
		$$$.message(`Click button-big-9x9-11`, DEBUG, `$button-big-9x9-11.click`);
		moveToLevel2(1);
	});

	$(`#button-big-9x9-12`).click(() => {
		$$$.message(`Click button-big-9x9-12`, DEBUG, `$button-big-9x9-12.click`);
	});

	$(`#button-big-9x9-13`).click(() => {
		$$$.message(`Click button-big-9x9-13`, DEBUG, `$button-big-9x9-13.click`);
		moveToLevel2(2);
	});

	$(`#button-big-9x9-14`).click(() => {
		$$$.message(`Click button-big-9x9-14`, DEBUG, `$button-big-9x9-14.click`);
	});

	$(`#button-big-9x9-15`).click(() => {
		$$$.message(`Click button-big-9x9-15`, DEBUG, `$button-big-9x9-15.click`);
		moveToLevel2(3);
	});

	$(`#button-big-9x9-21`).click(() => {
		$$$.message(`Click button-big-9x9-21`, DEBUG, `$button-big-9x9-21.click`);
		bedLevelingPositionBig(1);
	});

	$(`#button-big-9x9-22`).click(() => {
		$$$.message(`Click button-big-9x9-22`, DEBUG, `$button-big-9x9-22.click`);
		moveToLevel1(1);
	});

	$(`#button-big-9x9-23`).click(() => {
		$$$.message(`Click button-big-9x9-23`, DEBUG, `$button-big-9x9-23.click`);
		moveToLevel1(2);
	});

	$(`#button-big-9x9-24`).click(() => {
		$$$.message(`Click button-big-9x9-24`, DEBUG, `$button-big-9x9-24.click`);
		moveToLevel1(3);
	});

	$(`#button-big-9x9-25`).click(() => {
		$$$.message(`Click button-big-9x9-25`, DEBUG, `$button-big-9x9-25.click`);
		bedLevelingPositionBig(2);
	});

	$(`#button-big-9x9-31`).click(() => {
		$$$.message(`Click button-big-9x9-31`, DEBUG, `$button-big-9x9-31.click`);
		moveToLevel2(4);
	});

	$(`#button-big-9x9-32`).click(() => {
		$$$.message(`Click button-big-9x9-32`, DEBUG, `$button-big-9x9-32.click`);
		moveToLevel1(4);
	});

	$(`#button-big-9x9-33`).click(() => {
		$$$.message(`Click button-big-9x9-33`, DEBUG, `$button-big-9x9-33.click`);
		moveToHome(4);
	});

	$(`#button-big-9x9-34`).click(() => {
		$$$.message(`Click button-big-9x9-34`, DEBUG, `$button-big-9x9-34.click`);
		moveToLevel1(5);
	});

	$(`#button-big-9x9-35`).click(() => {
		$$$.message(`Click button-big-9x9-35`, DEBUG, `$button-big-9x9-35.click`);
		moveToLevel2(5);
	});

	$(`#button-big-9x9-41`).click(() => {
		$$$.message(`Click button-big-9x9-41`, DEBUG, `$button-big-9x9-41.click`);
		bedLevelingPositionBig(3);
	});

	$(`#button-big-9x9-42`).click(() => {
		$$$.message(`Click button-big-9x9-42`, DEBUG, `$button-big-9x9-42.click`);
		moveToLevel1(6);
	});

	$(`#button-big-9x9-43`).click(() => {
		$$$.message(`Click button-big-9x9-43`, DEBUG, `$button-big-9x9-43.click`);
		moveToLevel1(7);
	});

	$(`#button-big-9x9-44`).click(() => {
		$$$.message(`Click button-big-9x9-44`, DEBUG, `$button-big-9x9-44.click`);
		moveToLevel1(8);
	});

	$(`#button-big-9x9-45`).click(() => {
		$$$.message(`Click button-big-9x9-45`, DEBUG, `$button-big-9x9-45.click`);
		bedLevelingPositionBig(4);
	});

	$(`#button-big-9x9-51`).click(() => {
		$$$.message(`Click button-big-9x9-51`, DEBUG, `$button-big-9x9-51.click`);
		moveToLevel2(6);
	});

	$(`#button-big-9x9-52`).click(() => {
		$$$.message(`Click button-big-9x9-52`, DEBUG, `$button-big-9x9-52.click`);
	});

	$(`#button-big-9x9-53`).click(() => {
		$$$.message(`Click button-big-9x9-53`, DEBUG, `$button-big-9x9-53.click`);
		moveToLevel2(7);
	});

	$(`#button-big-9x9-54`).click(() => {
		$$$.message(`Click button-big-9x9-54`, DEBUG, `$button-big-9x9-54.click`);
	});

	$(`#button-big-9x9-55`).click(() => {
		$$$.message(`Click button-big-9x9-55`, DEBUG, `$button-big-9x9-55.click`);
		moveToLevel2(8);
	});
	function moveToHome(order) {
		$$$.message(`Call moveToHome`, DEBUG, `moveToHome`);
		if(!waitNextClick) {
			$(`#button-big-${btnNameToHome[order]}`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) button-big-${btnNameToHome[order]}`, DEBUG, `moveToHome`);
			$$$.message(`Change css(background-color:peleskyblue) button-big-${btnNameToHome[order]}`, DEBUG, `moveToHome`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `moveToHome`);
			setTimeout(()=>{restoreButtonCSSBig(btnNameToHome[order])}, 500);

			if(!powerFlag) {
				$$$.message(`Printer connection required for manual operation`, WARN, `moveToHome`);
				return;
			}

			switch(order) {
				case 0:
					$$$.message(`Execute G28 X0 Y0 Z0`, INFO, `moveToHome`);
					client.control.sendGcode(`G28 X0 Y0 Z0`)
						.done(() => {
							$$$.message(`Success`, INFO, `moveToHome`);
							extruderPosition[0] = 0;
							extruderPosition[1] = 0;
							extruderPosition[2] = 0;
						})
						.fail((err) => {
							console.error(err);
						})
					break;
				case 1:
					$$$.message(`Execute G28 X0`, INFO, `moveToHome`);
					client.control.sendGcode(`G28 X0`)
						.done(() => {
							$$$.message(`Success`, INFO, `moveToHome`);
							extruderPosition[0] = 0;
						})
						.fail((err) => {
							console.error(err);
						})
					break;
				case 2:
					$$$.message(`Execute G28 Y0`, INFO, `moveToHome`);
					client.control.sendGcode(`G28 Y0`)
						.done(() => {
							$$$.message(`Success`, INFO, `moveToHome`);
							extruderPosition[1] = 0;
						})
						.fail((err) => {
							console.error(err);
						})
					break;
				case 3:
					$$$.message(`Execute G28 Z0`, INFO, `moveToHome`);
					client.control.sendGcode(`G28 Z0`)
						.done(() => {
							$$$.message(`Success`, INFO, `moveToHome`);
							extruderPosition[2] = 0;
						})
						.fail((err) => {
							console.error(err);
						})
					break;
				case 4:
					$$$.message(`Execute G28 X0 Y0`, INFO, `moveToHome`);
					client.control.sendGcode(`G28 X0 Y0`)
						.done(() => {
							$$$.message(`Success`, INFO, `moveToHome`);
						})
						.fail((err) => {
							console.error(err);
						})
					break;
				case 5:
					$$$.message(`Execute G28 Z0`, INFO, `moveToHome`);
					client.control.sendGcode(`G28 Z0`)
						.done(() => {
							$$$.message(`Success`, INFO, `moveToHome`);
							extruderPosition[2] = 0;
						})
						.fail((err) => {
							console.error(err);
						})
					break;
			}
		}
	}
	function moveToLevel1(order) {
		$$$.message(`Call moveToLevel1`, DEBUG, `moveToLevel1`);

		if(!waitNextClick) {
			$(`#button-big-${btnNameToLevel1[order]}`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) button-big-${btnNameToLevel1[order]}`, DEBUG, `moveToHome`);
			$$$.message(`Change css(background-color:peleskyblue) button-big-${btnNameToLevel1[order]}`, DEBUG, `moveToHome`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `moveToLevel1`);
			setTimeout(()=>{restoreButtonCSSBig(btnNameToLevel1[order])}, 500);

			if(bedSize[0] < 0 && bedSize[1] < 0 && bedSize[2] < 0) {
				$$$.message(`Nozzle movement requires return to origin`, WARN, `moveToLevel1`);
				return;
			}
	
			if(!powerFlag) {
				$$$.message(`Printer connection required for manual operation`, WARN, `moveToLevel1`);
				return;
			}

			var x, y;
			$$$.message(`Nozzle position calculation`, DEBUG, `moveToLevel1`);
			switch(order) {
				case 1:
					x = extruderPosition[0] - feedValueBigP1;
					y = extruderPosition[1] + feedValueBigP1;
					z = extruderPosition[2];
					if(x < 0) x = 0;
					if(y > bedSize[1]) y = bedSize[1];
					break;
				case 2:
					x = extruderPosition[0];
					y = extruderPosition[1] + feedValueBigP1;
					z = extruderPosition[2];
					if(y > bedSize[1]) y = bedSize[1];
					break;
				case 3:
					x = extruderPosition[0] + feedValueBigP1;
					y = extruderPosition[1] + feedValueBigP1;
					z = extruderPosition[2];
					if(x > bedSize[0]) x = bedSize[0];
					if(y > bedSize[1]) y = bedSize[1];
					break;
				case 4:
					x = extruderPosition[0] - feedValueBigP1;
					y = extruderPosition[1];
					z = extruderPosition[2];
					if(x < 0) x = 0;
					break;
				case 5:
					x = extruderPosition[0] + feedValueBigP1;
					y = extruderPosition[1];
					z = extruderPosition[2];
					if(x > bedSize[0]) x = bedSize[0];
					break;
				case 6:
					x = extruderPosition[0] - feedValueBigP1;
					y = extruderPosition[1] - feedValueBigP1;
					z = extruderPosition[2];
					if(x < 0) x = 0;
					if(y < 0) y = 0;
					break;
				case 7:
					x = extruderPosition[0];
					y = extruderPosition[1] - feedValueBigP1;
					z = extruderPosition[2];
					if(y < 0) y = 0;
					break;
				case 8:
					x = extruderPosition[0] + feedValueBigP1;
					y = extruderPosition[1] - feedValueBigP1;
					z = extruderPosition[2];
					if(x > bedSize[0]) x = bedSize[0];
					if(y < 0) y = 0;
					break;
				case 9:
					x = extruderPosition[0];
					y = extruderPosition[1];
					z = extruderPosition[2] + feedValueBigP1;
					if(z > bedSize[2]) z = bedSize[2];
					break;
				case 10:
					x = extruderPosition[0];
					y = extruderPosition[1];
					z = extruderPosition[2] - feedValueBigP1;
					if(z < 0) z = 0;
					break;
			}

			$$$.message(`Send gCode X${x} Y${y} Z${z}`, INFO, `moveToLevel1`);
			client.control.sendGcode(`G0 X${x} Y${y} Z${z}`)
				.done(() => {
					$$$.message(`Success`, INFO, `moveToLevel1`);
					extruderPosition[0] = x;
					extruderPosition[1] = y;
					extruderPosition[2] = z;
					$$$.message(`Set extruder position x:${x} y:${y} z:${z}`, DEBUG, `moveToLevel1`);
				})
				.fail((err) => {
					console.error(err);
				})
		}
	}
	function moveToLevel2(order) {
		$$$.message(`Call moveToLevel2`, DEBUG, `moveToLevel2`);

		if(!waitNextClick) {
			$(`#button-big-${btnNameToLevel2[order]}`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) button-big-${btnNameToLevel2[order]}`, DEBUG, `moveToHome`);
			$$$.message(`Change css(background-color:peleskyblue) button-big-${btnNameToLevel2[order]}`, DEBUG, `moveToHome`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `moveToLevel2`);
			setTimeout(()=>{restoreButtonCSSBig(btnNameToLevel2[order])}, 500);

			if(bedSize[0] < 0 && bedSize[1] < 0 && bedSize[2] < 0) {
				$$$.message(`Nozzle movement requires return to origin`, WARN, `moveToLevel2`);
				return;
			}
	
			if(!powerFlag) {
				$$$.message(`Printer connection required for manual operation`, WARN, `moveToLevel2`);
				return;
			}

			var x, y;
			console.log(feedValueBigP2);
			$$$.message(`Nozzle position calculation`, DEBUG, `moveToLevel2`);
			switch(order) {
				case 1:
					x = extruderPosition[0] - feedValueBigP2;
					y = extruderPosition[1] + feedValueBigP2;
					z = extruderPosition[2];
					if(x < 0) x = 0;
					if(y > bedSize[1]) y = bedSize[1];
					break;
				case 2:
					x = extruderPosition[0];
					y = extruderPosition[1] + feedValueBigP2;
					z = extruderPosition[2];
					if(y > bedSize[1]) y = bedSize[1];
					break;
				case 3:
					x = extruderPosition[0] + feedValueBigP2;
					y = extruderPosition[1] + feedValueBigP2;
					z = extruderPosition[2];
					if(x > bedSize[0]) x = bedSize[0];
					if(y > bedSize[1]) y = bedSize[1];
					break;
				case 4:
					x = extruderPosition[0] - feedValueBigP2;
					y = extruderPosition[1];
					z = extruderPosition[2];
					if(x < 0) x = 0;
					break;
				case 5:
					x = extruderPosition[0] + feedValueBigP2;
					y = extruderPosition[1];
					z = extruderPosition[2];
					if(x > bedSize[0]) x = bedSize[0];
					break;
				case 6:
					x = extruderPosition[0] - feedValueBigP2;
					y = extruderPosition[1] - feedValueBigP2;
					z = extruderPosition[2];
					if(x < 0) x = 0;
					if(y < 0) y = 0;
					break;
				case 7:
					x = extruderPosition[0];
					y = extruderPosition[1] - feedValueBigP2;
					z = extruderPosition[2];
					if(y < 0) y = 0;
					break;
				case 8:
					x = extruderPosition[0] + feedValueBigP2;
					y = extruderPosition[1] - feedValueBigP2;
					z = extruderPosition[2];
					if(x > bedSize[0]) x = bedSize[0];
					if(y < 0) y = 0;
					break;
				case 9:
					x = extruderPosition[0];
					y = extruderPosition[1];
					z = extruderPosition[2] + feedValueBigP2;
					if(z > bedSize[2]) z = bedSize[2];
					break;
				case 10:
					x = extruderPosition[0];
					y = extruderPosition[1];
					z = extruderPosition[2] - feedValueBigP2;
					if(z < 0) z = 0;
					break;
			}
		
			$$$.message(`Send gCode X${x} Y${y} Z${z}`, INFO, `moveToLevel2`);
			client.control.sendGcode(`G0 X${x} Y${y} Z${z}`)
				.done(() => {
					$$$.message(`Success`, INFO, `moveToLevel2`);
					extruderPosition[0] = x;
					extruderPosition[1] = y;
					extruderPosition[2] = z;
					$$$.message(`Set extruder position x:${x} y:${y} z${z}`, DEBUG, `moveToLevel2`);
				})
				.fail((err) => {
					console.error(err);
				})
		}
	}
	function bedLevelingPositionBig(order) {
		$$$.message(`Call bedLevelingPositionBig`, DEBUG, `bedLevelingPositionBig`);

		if(!waitNextClick) {
			$(`#button-big-${btnNameToBedPos[order]}`).css({
				color:				rescueorange,
				'background-color':	peleskyblue
			});
			$$$.message(`Change css(color:rescueorange) button-big-${btnNameToBedPos[order]}`, DEBUG, `bedLevelingPositionBig`);
			$$$.message(`Change css(background-color:peleskyblue) button-big-${btnNameToBedPos[order]}`, DEBUG, `bedLevelingPositionBig`);
			waitNextClick = true;
			$$$.message(`Change waitNextClick. value is ${waitNextClick}`, DEBUG, `bedLevelingPositionBig`);
			setTimeout(()=>{restoreButtonCSSBig(btnNameToBedPos[order])}, 500);

			if(bedSize[0] < 0 && bedSize[1] < 0 && bedSize[2] < 0) {
				$$$.message(`Nozzle movement requires return to origin`, WARN, `moveToLevel1`);
				return;
			}
	
			if(!powerFlag) {
				$$$.message(`Printer connection required for manual operation`, WARN, `bedLevelingPositionBig`);
				return;
			}

			var x, y;
			$$$.message(`Nozzle position calculation`, DEBUG, `moveToLevel2`);
			switch(order) {
				case 1:
					x = bedMargin;
					y = bedSize[1] -bedMargin;
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

			$$$.message(`Move bed leveling position ${order}`, INFO, `bedLevelingPositionBig`);
			$$$.message(`Move Z10`, INFO, `bedLevelingPositionBig`);
			client.control.sendGcode(`G0 Z10`)
				.done(() => {
					$$$.message(`Move X${x} Y${y}`, INFO, `bedLevelingPositionBig`);
					client.control.sendGcode(`G0 X${x} Y${y}`)
						.done(() =>{
							extruderPosition[0] = x;
							extruderPosition[1] = y;
							$$$.message(`Set extruder position x:${x} y:${y}`, DEBUG, `bedLevelingPositionBig`);
							$$$.message(`Home Z0`, INFO, `bedLevelingPositionBig`);
							client.control.sendGcode(`G28 Z0`)
								.done(() => {
									$$$.message(`Success`, INFO, `bedLevelingPositionBig`);
								})
								.fail((err) => {
									console.log(err);
								})
						})
						.fail((err) => {
							console.log(err);
						})
				})
				.fail((err) => {
					console.error(err);
				})
		}
	}
	function restoreButtonCSSBig(order) {
		$$$.message(`Call restoreButtonCSSBig`, DEBUG, `restoreButtonCSSBig`);
		waitNextClick = false;
		$$$.message(`Change waitNextClick. value is ` + waitNextClick, DEBUG, `restoreButtonCSSBig`);
		$(`#button-big-${order}`).css({
			color:				sunshine,
			'background-color':	lapislazuli
		});
		$$$.message(`Change css(color:sunshine) button-big-${order}`, DEBUG, `restoreButtonCSSBig`);
		$$$.message(`Change css(background-color:lapislazuli) button-big-${order}`, DEBUG, `restoreButtonCSSBig`);
	}

	$(`#fire-tool-icon-ctrl`).click(() => {
		$$$.message(`Click file-tool-icon`, DEBUG, `$fire-tool-icon-ctrl.click`);
		$(`#slider-panel-tool-big-ctrl`).css({'z-index': 91});
		$$$.message(`Change css(z-index:91) slider-panel-tool-big-ctrl`, DEBUG, `$fire-tool-icon-ctrl.click`);
	});

	$(`#fire-bed-icon-ctrl`).click(() => {
		$$$.message(`Click file-bed-icon`, DEBUG, `$fire-bed-icon-ctrl.click`);
		$(`#slider-panel-bed-big-ctrl`).css({'z-index': 91});
		$$$.message(`Change css(z-index:91) slider-panel-bed-big-ctrl`, DEBUG, `$file-bed-icon.click`);
	});

	$(`#big-graph-close-btn-ctrl`).click(() => {
		$$$.message(`click big-graph-close-btn-ctrl`, DEBUG, `$big-graph-close-btn-ctrl.click`);
		$(`#big-graph-panel-ctrl`).css({visibility: `hidden`});

		$(`#barrierLayer-ctrl`).css({visibility: `hidden`});
		$$$.message(`Change css(visibility:hidden) barrierLayer-ctrl`, DEBUG, `$big-graph-close-btn-ctrl.click`);

		subMenuPanelOpen = false;
		subMenuPanelName = '';
	});

	$(`#nav-stats-ctrl`).click(() => {
		$$$.message(`click nav-move-ctrl`, DEBUG, `$nav-stats-ctrl.click`);

		if(subMenuPanelOpen) {
			$$$.message(`Already have the ${subMenuPanelName} panel open`, WARN, '$nav-stats-ctrl.click');
			$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
			$(`.nav-submenu`).css({right: `-288px`});
			$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$nav-stats-ctrl.click`);
			submenuToggle = false;
			return;
		}
		subMenuPanelOpen = true;
		subMenuPanelName = 'graph vierer';

		$(`#big-graph-panel-ctrl`).css({visibility: `visible`});

		$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
		$(`.nav-submenu`).css({right: `-288px`});
		$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$nav-stats-ctrl.click`);
		submenuToggle = false;
	});
	$(`#big-graph-tool-btn-ctrl`).click(() => {
		$$$.message(`Call big-graph-tool-btn-ctrl`, DEBUG, `$big-graph-tool-btn-ctrl.click`);
		if($(`#big-graph-bed-btn-ctrl`).css(`background-color`) == `rgb(38, 31, 135)`) {
			$(`#big-graph-tool-btn-ctrl`).css({'background-color': lapislazuli});
			$$$.message(`Change css(background-color:lapislazuli) big-graph-tool-btn-ctrl`, DEBUG, `$big-graph-tool-btn-ctrl.click`);
			$(`#big-graph-bed-btn-ctrl`).css({'background-color': skyhigh});
			$$$.message(`Change css(background-color:skyhigh) big-graph-bed-btn-ctrl`, DEBUG, `$big-graph-tool-btn-ctrl.click`);
		}
	});
	$(`#big-graph-bed-btn-ctrl`).click(() => {
		$$$.message(`Call big-graph-bed-btn-ctrl`, DEBUG, `$big-graph-tool-btn-ctrl.click`);
		if($(`#big-graph-tool-btn-ctrl`).css(`background-color`) == `rgb(38, 31, 135)`) {
			$(`#big-graph-tool-btn-ctrl`).css({'background-color': skyhigh});
			$$$.message(`Change css(background-color:skyhigh) big-graph-tool-btn-ctrl`, DEBUG, `$big-graph-bed-btn-ctrl.click`);
			$(`#big-graph-bed-btn-ctrl`).css({'background-color': lapislazuli});
			$$$.message(`Change css(background-color:lapislazuli) big-graph-bed-btn-ctrl`, DEBUG, `$big-graph-bed-btn-ctrl.click`);
		}
	});
	$(`#big-graph-pause-btn-ctrl`).click(() => {
		$$$.message(`Call big-graph-pause-btn-ctrl`, DEBUG, `$big-graph-pause-btn-ctrl.click`);
		if($(`#big-graph-pause-btn-ctrl`).css(`background-color`) == 'rgb(38, 31, 135)') {
			$(`#big-graph-pause-btn-ctrl`).css({'background-color': skyhigh});
			$$$.message(`Change css(background-color:skyhigh) big-graph-pause-btn-ctrl`, DEBUG, `$big-graph-pause-btn-ctrl.click`);
		} else {
			$(`#big-graph-pause-btn-ctrl`).css({'background-color': lapislazuli});
			$$$.message(`Change css(background-color:lapislazuli) big-graph-pause-btn-ctrl`, DEBUG, `$big-graph-pause-btn-ctrl.click`);
		}
	});

	$(`#log-close-btn-ctrl`).click(() => {
		$$$.message(`click log-close-btn-ctrl`, DEBUG, `$log-close-btn-ctrl.click`);
		$(`#log-panel-ctrl`).css({visibility: `hidden`});

		subMenuPanelOpen = false;
		subMenuPanelName = '';
	});

	$(`#nav-log-ctrl`).click(() => {
		$$$.message(`click nav-move-ctrl`, DEBUG, `$nav-log-ctrl.click`);

		if(subMenuPanelOpen && subMenuPanelName != 'log viewer') {
			$$$.message(`Already have the ${subMenuPanelName} panel open`, WARN, '$nav-log-ctrl.click');
			$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
			$(`.nav-submenu`).css({right: `-288px`});
			$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$nav-log-ctrl.click`);
			submenuToggle = false;
			return;
		}
		subMenuPanelOpen = true;
		subMenuPanelName = 'log viewer';

		if($(`#log-panel-ctrl`).css('visibility') == 'hidden' && windowSize == 3) subPanelSize = 2;
		else if($(`#log-panel-ctrl`).css('visibility') == 'visible' && windowSize == 3) {
			console.log('hoge')
			subPanelSize++;
			if(subPanelSize > 2) subPanelSize = 1;
		} else subPanelSize = 1;
		$$$.message(`Determine panel size`, DEBUG, `$nav-log-ctrl.click`);
		switch(subPanelSize) {
			case 1:
				$(`#log-panel-ctrl`).removeClass(`log-panel-x4`);
				$(`#log-panel-title-ctrl`).removeClass(`title-x4`);
				$(`#content-log-panel-ctrl`).removeClass(`content-log-panel-x4`);
				$(`#low-info-btn-ctrl`).text('l-info');
				$(`#low-info-btn-ctrl`).removeClass(`low-info-btn-x4`);
				$(`#low-debug-btn-ctrl`).text('l-debug');
				$(`#low-debug-btn-ctrl`).removeClass(`low-debug-btn-x4`);
				$(`#log-information-ctrl`).removeClass(`log-information-x4`);
				$$$.message(`Set panel mode 1`, DEBUG, `$nav-log-ctrl.click`);
				break;
			case 2:
				$(`#log-panel-ctrl`).addClass(`log-panel-x4`);
				$(`#log-panel-title-ctrl`).addClass(`title-x4`);
				$(`#content-log-panel-ctrl`).addClass(`content-log-panel-x4`);
				$(`#low-info-btn-ctrl`).text('low-info');
				$(`#low-info-btn-ctrl`).addClass(`low-info-btn-x4`);
				$(`#low-debug-btn-ctrl`).text('low-debug');
				$(`#low-debug-btn-ctrl`).addClass(`low-debug-btn-x4`);
				$(`#log-information-ctrl`).addClass(`log-information-x4`);
				$$$.message(`Set panel mode 2`, DEBUG, `$nav-log-ctrl.click`);
				break;
		}
		$(`#log-panel-ctrl`).css({visibility: `visible`});
		$$$.message(`Change css(visibility:visible) log-panel-ctrl`, DEBUG, `$nav-log-ctrl.click`);

		$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
		$(`.nav-submenu`).css({right: `-288px`});
		$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$nav-log-ctrl.click`);
		submenuToggle = false;

		allBtnBlink();
		writeLog();
	});
	$(`#all-btn-ctrl`).click(() => {
		$$$.message(`Click all-btn-ctrl`, DEBUG, `$all-btn-ctrl.click`);
		if($(`#all-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) return;

		$(`#all-btn-ctrl`).css({'background-color': lapislazuli});
		$$$.message(`Change css(background-color:lapislazuli) all-btn-ctrl`, DEBUG, `$all-btn-ctrl.click`);
		$(`#error-btn-ctrl`).css({'background-color': skyhigh});
		$(`#warn-btn-ctrl`).css({'background-color': skyhigh});
		$(`#info-btn-ctrl`).css({'background-color': skyhigh});
		$(`#debug-btn-ctrl`).css({'background-color': skyhigh});
		$(`#low-info-btn-ctrl`).css({'background-color': skyhigh});
		$(`#low-debug-btn-ctrl`).css({'background-color': skyhigh});
		$$$.message(`Change css(background-color:skyhigh) ***-btn-ctrl`, DEBUG, `$all-btn-ctrl.click`);
		allBtnBlink();
		writeLog();
	});
	$(`#error-btn-ctrl`).click(() => {
		$$$.message(`Click error-btn-ctrl`, DEBUG, `$error-btn-ctrl.click`);
		if($(`#error-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) {
			$(`#error-btn-ctrl`).css({'background-color': skyhigh});
			$$$.message(`Change css(background-color:skyhigh) error-btn-ctrl`, DEBUG, `$error-btn-ctrl.click`);
		} else {
			$(`#error-btn-ctrl`).css({'background-color': lapislazuli});
			$$$.message(`Change css(background-color:lapislazuli) error-btn-ctrl`, DEBUG, `$error-btn-ctrl.click`);
			$(`#all-btn-ctrl`).css({'background-color': skyhigh});
			$$$.message(`Change css(background-color:skyhigh) all-btn-ctrl`, DEBUG, `$error-btn-ctrl.click`);
		}
		allBtnBlink();
		writeLog();
	});
	$(`#warn-btn-ctrl`).click(() => {
		$$$.message(`Click warn-btn-ctrl`, DEBUG, `$warn-btn-ctrl.click`);
		if($(`#warn-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) {
			$(`#warn-btn-ctrl`).css({'background-color': skyhigh});
			$$$.message(`Change css(background-color:skyhigh) warn-btn-ctrl`, DEBUG, `$warn-btn-ctrl.click`);
		} else {
			$(`#warn-btn-ctrl`).css({'background-color': lapislazuli});
			$$$.message(`Change css(background-color:lapislazuli) warn-btn-ctrl`, DEBUG, `$warn-btn-ctrl.click`);
			$(`#all-btn-ctrl`).css({'background-color': skyhigh});
			$$$.message(`Change css(background-color:skyhigh) all-btn-ctrl`, DEBUG, `$warn-btn-ctrl.click`);
		}
		allBtnBlink();
		writeLog();
	});
	$(`#info-btn-ctrl`).click(() => {
		$$$.message(`Click info-btn-ctrl`, DEBUG, `$info-btn-ctrl.click`);
		if($(`#info-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) {
			$(`#info-btn-ctrl`).css({'background-color': skyhigh});
			$$$.message(`Change css(background-color:skyhigh) info-btn-ctrl`, DEBUG, `$info-btn-ctrl.click`);
		} else {
			$(`#info-btn-ctrl`).css({'background-color': lapislazuli});
			$$$.message(`Change css(background-color:lapislazuli) info-btn-ctrl`, DEBUG, `$info-btn-ctrl.click`);
			$(`#all-btn-ctrl`).css({'background-color': skyhigh});
			$$$.message(`Change css(background-color:skyhigh) all-btn-ctrl`, DEBUG, `$info-btn-ctrl.click`);
		}
		allBtnBlink();
		writeLog();
	});
	$(`#debug-btn-ctrl`).click(() => {
		$$$.message(`Click debug-btn-ctrl`, DEBUG, `$debug-btn-ctrl.click`);
		if($(`#debug-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) {
			$(`#debug-btn-ctrl`).css({'background-color': skyhigh});
			$$$.message(`Change css(background-color:skyhigh) debug-btn-ctrl`, DEBUG, `$debug-btn-ctrl.click`);
		} else {
			$(`#debug-btn-ctrl`).css({'background-color': lapislazuli});
			$$$.message(`Change css(background-color:lapislazuli) debug-btn-ctrl`, DEBUG, `$debug-btn-ctrl.click`);
			$(`#all-btn-ctrl`).css({'background-color': skyhigh});
			$$$.message(`Change css(background-color:skyhigh) all-btn-ctrl`, DEBUG, `$debug-btn-ctrl.click`);
		}
		allBtnBlink();
		writeLog();
	});
	$(`#low-info-btn-ctrl`).click(() => {
		$$$.message(`Click low-info-btn-ctrl`, DEBUG, `$low-info-btn-ctrl.click`);
		if($(`#low-info-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) {
			$(`#low-info-btn-ctrl`).css({'background-color': skyhigh});
			$$$.message(`Change css(background-color:skyhigh) low-info-btn-ctrl`, DEBUG, `$low-info-btn-ctrl.click`);
		} else {
			$(`#low-info-btn-ctrl`).css({'background-color': lapislazuli});
			$$$.message(`Change css(background-color:lapislazuli) low-info-btn-ctrl`, DEBUG, `$low-info-btn-ctrl.click`);
			$(`#all-btn-ctrl`).css({'background-color': skyhigh});
			$$$.message(`Change css(background-color:skyhigh) all-btn-ctrl`, DEBUG, `$low-info-btn-ctrl.click`);
		}
		allBtnBlink();
		writeLog();
	});
	$(`#low-debug-btn-ctrl`).click(() => {
		$$$.message(`Click low-debug-btn-ctrl`, DEBUG, `$low-debug-btn-ctrl.click`);
		if($(`#low-debug-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) {
			$(`#low-debug-btn-ctrl`).css({'background-color': skyhigh});
			$$$.message(`Change css(background-color:skyhigh) low-debug-btn-ctrl`, DEBUG, `$low-debug-btn-ctrl.click`);
		} else {
			$(`#low-debug-btn-ctrl`).css({'background-color': lapislazuli});
			$$$.message(`Change css(background-color:lapislazuli) low-debug-btn-ctrl`, DEBUG, `$low-debug-btn-ctrl.click`);
			$(`#all-btn-ctrl`).css({'background-color': skyhigh});
			$$$.message(`Change css(background-color:skyhigh) all-btn-ctrl`, DEBUG, `$low-debug-btn-ctrl.click`);
		}
		allBtnBlink();
		writeLog();
	});
	function allBtnBlink() {
		$$$.message(`Call allBtnBlink`, DEBUG, 'allBtnBlink');
		var flag = false;
		if($(`#low-debug-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) flag = true;
		if($(`#low-info-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) flag = true;
		if($(`#debug-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) flag = true;
		if($(`#info-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) flag = true;
		if($(`#warn-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) flag = true;
		if($(`#error-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) flag = true;
		if(!flag) {
			$(`#all-btn-ctrl`).css({'background-color': lapislazuli});
			$$$.message(`Change css(background-color:lapislazuli) all-btn-ctrl`, DEBUG, `allBtnBlink`);
		}
	}
	function writeLog() {
		$$$.message(`Call writeLog`, DEBUG, `writeLog`);
		var colorPallet = ['N/A', 'Deadly', rescueorange, sunshine, forestleaf, lapislazuli, peleskyblue, peleskyblue]
		$(`#log-information-ctrl`).html('');
		
		var detect =[];
		if($(`#low-debug-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) detect[detect.length] = 7;
		if($(`#low-info-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) detect[detect.length] = 6;
		if($(`#debug-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) detect[detect.length] = 5;
		if($(`#info-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) detect[detect.length] = 4;
		if($(`#warn-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) detect[detect.length] = 3;
		if($(`#error-btn-ctrl`).css('background-color') == `rgb(38, 31, 135)`) detect[detect.length] = 2;
		if($(`#all-btn-ctrl`).css('background-color') ==  `rgb(38, 31, 135)`) detect[detect.length] = 0;
		$$$.message(`Detect message type to output`, LOWDEBUG, `writeLog`);

		for(var i=0; i<$$$.log.length; i++) {
			var date =
				$$$.timeStamp($$$.log[i].time)[0].split('T')[0].substr(0,4) + '/' +
				$$$.timeStamp($$$.log[i].time)[0].split('T')[0].substr(4,2) + '/' +
				$$$.timeStamp($$$.log[i].time)[0].split('T')[0].substr(6,2);
			var timeStamp = `<font color="${forestleaf}">${date}</font> <font color="${sunshine}">${$$$.timeStamp($$$.log[i].time)[0].split('T')[1]}</font>`;
			var msg = $$$.log[i].msg;
			msg = msg.replace(`Change css`, `<font color="${flameOrange}"style="font-weight: bold;">Change css</font>`)
			msg = msg.replace(`Call`, `<font color="${forestleaf}"style="font-weight: bold;">Call</font>`)
			msg = msg.replace(`Click`, `<font color="${lapislazuli}"style="font-weight: bold;">Click</font>`)
			var elem = document.createElement(`div`);
			elem.innerHTML = 
				`<font color="${peleskyblue}">[${i.toString().padStart(3, 0)}]</font>` +
				`${timeStamp}${subPanelSize == 2 ? ` : ` : `<br />`}` +
				`<font color="${colorPallet[$$$.log[i].type]}">[${TYPE[$$$.log[i].type]}]</font>` +
				`<font color="${rescueorange}">(${$$$.log[i].position})</font>${subPanelSize == 2 ? `` : `<br />`}` +
				` ${msg}`;
			if(subPanelSize == 1) elem.className = 'log-message';
			if(detect.indexOf($$$.log[i].type) != -1) $('#log-information-ctrl').append(elem);
			else if(detect.indexOf(0) != -1) $('#log-information-ctrl').append(elem);
		}
	}

	$(`#barrierLayer-ctrl`).click(() => {
		$$$.message(`Call barrierLayer-ctrl`, DEBUG, `@barrierLayer-ctrl.click`);

		if(submenuToggle) {
			if(!subMenuPanelOpen) $(`#barrierLayer-ctrl`).css({visibility: `hidden`});
			$$$.message(`Change css(right:-288px) barrierLayer-ctrl`, DEBUG, `$barrierLayer-ctrl.click`);

			$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
			$(`.nav-submenu`).css({right: `-288px`});
			$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$barrierLayer-ctrl.click`);
			submenuToggle = false;
		}
	});
	$(`#big-manual-panel-ctrl`).click(() => {
		$$$.message(`Call big-manual-panel-ctrl`, DEBUG, `$big-manual-panel-ctrl.click`);
	
		if(submenuToggle) {
			if(!subMenuPanelOpen) $(`#barrierLayer-ctrl`).css({visibility: `hidden`});
			$$$.message(`Change css(right:-288px) barrierLayer-ctrl`, DEBUG, `$big-manual-panel-ctrl.click`);

			$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
			$(`.nav-submenu`).css({right: `-288px`});
			$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$big-manual-panel-ctrl.click`);
			submenuToggle = false;
		}
	});
	$(`#big-graph-panel-ctrl`).click(() => {
		$$$.message(`Call big-graph-panel-ctrl`, DEBUG, `$big-graph-panel-ctrl.click`);
	
		if(submenuToggle) {
			if(!subMenuPanelOpen) $(`#barrierLayer-ctrl`).css({visibility: `hidden`});
			$$$.message(`Change css(right:-288px) barrierLayer-ctrl`, DEBUG, `$big-graph-panel-ctrl.click`);

			$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
			$(`.nav-submenu`).css({right: `-288px`});
			$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$big-graph-panel-ctrl.click`);
			submenuToggle = false;
		}
	});
	$(`#gCode-panel-ctrl`).click(() => {
		$$$.message(`Call gCode-panel-ctrl`, DEBUG, `$gCode-panel-ctrl.click`);
	
		if(submenuToggle) {
			if(!subMenuPanelOpen) $(`#barrierLayer-ctrl`).css({visibility: `hidden`});
			$$$.message(`Change css(right:-288px) barrierLayer-ctrl`, DEBUG, `$gCode-panel-ctrl.click`);

			$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
			$(`.nav-submenu`).css({right: `-288px`});
			$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$gCode-panel-ctrl.click`);
			submenuToggle = false;
		}
	});
	$(`#setting-panel-ctrl`).click(() => {
		$$$.message(`Call setting-panel-ctrl`, DEBUG, `$setting-panel-ctrl.click`);
	
		if(submenuToggle) {
			if(!subMenuPanelOpen) $(`#barrierLayer-ctrl`).css({visibility: `hidden`});
			$$$.message(`Change css(right:-288px) barrierLayer-ctrl`, DEBUG, `$setting-panel-ctrl.click`);

			$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
			$(`.nav-submenu`).css({right: `-288px`});
			$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$setting-panel-ctrl.click`);
			submenuToggle = false;
		}
	});
	$(`#log-panel-ctrl`).click(() => {
		$$$.message(`Call log-panel-ctrl`, DEBUG, `$log-panel-ctrl.click`);
	
		if(submenuToggle) {
			if(!subMenuPanelOpen) $(`#barrierLayer-ctrl`).css({visibility: `hidden`});
			$$$.message(`Change css(right:-288px) barrierLayer-ctrl`, DEBUG, `$log-panel-ctrl.click`);

			$$$.message(`Hide submenu`, INFO, `$submenu-btn`);
			$(`.nav-submenu`).css({right: `-288px`});
			$$$.message(`Change css(right:-288px) nav-submenu`, DEBUG, `$log-panel-ctrl.click`);
			submenuToggle = false;
		}
	});
});