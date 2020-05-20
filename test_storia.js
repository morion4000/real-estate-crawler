const STORIA = require('./storia');
const Currency = require('./currency');

const link = 'https://www.storia.ro/oferta/renovat-complet-merita-vazut-IDif68.html#c7a01e7fb4';
const location = 'timis/timisoara';

(async () => {
    const exchange_rate = await Currency.get_ron_price_for_eur();
    const storia = new STORIA(exchange_rate, location);

    await storia.launch();

    const details = await storia.getDetailsPage(link);
    console.log(details);

    await storia.close();
})();