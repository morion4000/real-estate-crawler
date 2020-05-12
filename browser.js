const puppeteer = require('puppeteer');

class Browser {
    constructor() {}

    async launch() {
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        this.page = await this.browser.newPage();

        /*
        await this.page.setRequestInterception(true);

        this.page.on('request', request => {
            if (request.isNavigationRequest() && request.redirectChain().length !== 0) {
                request.abort();
            } else {
                request.continue();
            }
        });
        */

        console.log('Started browser');
        console.log(await this.browser.userAgent());
    }

    async close() {
        console.log('Closed browser');

        this.browser.close();
    }

    async navigate(url) {
        let html;

        console.log(`Getting ${url}`);

        try {
            const response = await this.page.goto(url);

            html = await this.page.evaluate(() => document.body.innerHTML);
        } catch (e) {
            console.error(`There was an error`);
        }

        return html;
    }
}

module.exports = Browser;