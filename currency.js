const request = require('request-promise');

class Currency {
    static async get_ron_price_for_eur() {
        const url = 'https://api.exchangeratesapi.io/latest?base=EUR&symbols=RON';
        let rate;

        try {
            const response = await request.get(url);

            rate = JSON.parse(response);
            rate = rate.rates.RON;
        } catch (e) {
            console.error(`Currency conversion error`);
        }

        return rate;
    }
}

module.exports = Currency;