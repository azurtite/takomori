241B873D3FF8408FB95E1DB8510F81CC

curl -X POST -H "X-Api-Key: 241B873D3FF8408FB95E1DB8510F81CC" -H "Content-Type: application/json" -d '{"command":"connect"}' http://192.168.0.14/api/connection

var client = new OctoPrintClient({
	baseurl:	'http://192.168.0.14/',
	apikey:		'241B873D3FF8408FB95E1DB8510F81CC'
});
client.browser.login('mozukuSu', 'ooxot8795SH', true)
	.done(function(response){
		console.log(Response);
		client.connection.connect({
			port:			'/dev/ttyACM0',
			baudrate:		115200,
			printerProfile:	'_default',
			save:			true,
			autoconnect:	false
		}).done(function(response){
			console.log('Connected printer');
			
		}).fail(function(response){
			console.log('Not connect printer');
			console.log(response);
		})
	});

タイムスタンプ正規表現
[0-9]{4}[0.1][0-9][0-3][0-9]T[0-2][0-9][0-5][0-9][0-5][0-9]\.[0-9]{3}