const fs = require('fs');

const files = fs.readdirSync('./models');

files.forEach(file => {
    if (file === 'index.js') {
        return;
    }

    const [name, ] = file.split('.');

    module.exports[name] = require(`./${file}`);
});