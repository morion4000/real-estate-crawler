var tr = require('tor-request');

//var url = 'https://api.ipify.org';
var url = 'https://www.olx.ro/oferta/vand-garsoniera-comfort-unu-zona-centrala-IDdvzU3.html#51dfd516a2'

tr.TorControlPort.password = '';

tr.request(url, function (err, res, body) {
  if (!err && res.statusCode == 200) {
    console.log(body);
  }
});


tr.newTorSession(console.log);
