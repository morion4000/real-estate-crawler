const mongoose = require('mongoose');

const STORIA = require('./storia');
const db = require('./models');
const Currency = require('./currency');

const MONGO_URL = process.env.MONGO_URL;

(async () => {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 5
  });

  const exchange_rate = await Currency.get_ron_price_for_eur();
  const storia = new STORIA(exchange_rate);

  await storia.init();

  const links = await storia.getSearchResults();
  console.log(`Found ${links.length} links`);

  for (var i = 0; i < links.length; i++) {
    const link = links[i];
    const details = await storia.getDetailsPage(link);

    try {
      await db.property.create({
        ...details,
        source: 'storia'
      });
    } catch (e) {
      console.error(e);
    }
  }

  await storia.destroy();

  //process.exit(1);
})();