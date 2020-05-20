const mongoose = require('mongoose');

const STORIA = require('./storia');
const db = require('./models');
const Currency = require('./currency');

const MONGO_URL = process.env.MONGO_URL;

module.exports = async (location) => {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 5
  });

  const exchange_rate = await Currency.get_ron_price_for_eur();
  const storia = new STORIA(exchange_rate, location);

  await storia.launch();

  const links = await storia.getSearchResults();
  console.log(`Found ${links.length} links`);

  for (var i = 0; i < links.length; i++) {
    const link = links[i];
    const details = await storia.getDetailsPage(link);

    try {
      // TODO: Consider using update or create (to decrease the db size)
      // and other benefits
      await db.property.create({
        ...details,
        source: 'storia',
        location: location
      });
    } catch (e) {
      console.error(e);
    }
  }

  await storia.close();
};