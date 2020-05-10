var tr = require('tor-request');

//var url = 'https://api.ipify.org';
var url = 'https://www.olx.ro/oferta/vand-garsoniera-comfort-unu-zona-centrala-IDdvzU3.html#51dfd516a2'
var pass = '16:C17D832D684CB99560251E92FE6B50CA477432BE0E9D0EC489C5C24D3E';

tr.TorControlPort.password = 'pisicuta';

tr.request(url, function (err, res, body) {
  if (!err && res.statusCode == 200) {
    console.log(body);
  }
});


tr.newTorSession(console.log);
