const mongoose = require('mongoose');

const STORIA = require('./storia');
const db = require('./models');

const MONGO_URL = process.env.MONGO_URL;

(async () => {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 5
  });

  const storia = new STORIA();

  await storia.init();

  const links = await storia.getSearchResults();
  console.log(`Found ${links.length} links`);

  for (var i = 0; i < links.length; i++) {
    const link = links[i];
    const details = await storia.getDetailsPage(link);

    await db.property.create({
      ...details,
      source: 'storia'
    });
  }

  await storia.destroy();
})();