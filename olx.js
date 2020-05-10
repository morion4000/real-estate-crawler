const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
// TODO: Consider using zombie
// const Browser = require('zombie');

// @see: https://cheerio.js.org/
class OLX {
    constructor() {
        this.BASE_URL = 'https://www.olx.ro';
        this.LOCATION = 'drobeta-turnu-severin';
        this.SEARCH_URL = `${this.BASE_URL}/imobiliare/apartamente-garsoniere-de-vanzare/${this.LOCATION}/`;
        this.SEARCH_CSS_QUERY = '#offers_table tr.wrap .thumb.linkWithHash';
        this.DETAILS_CSS_QUERIES = {
            DESCRIPTION: '#textContent'
        };
    }

    async init() {
        //const args = ['--proxy-server=socks5://127.0.0.1:9050'];
        this.browser = await puppeteer.launch({ headless: false });
        this.page = await this.browser.newPage();

        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36');

        console.log(await this.browser.userAgent());
    }

    async destroy() {
        this.browser.close();
    }

    async navigate(url) {
        console.log(`Getting ${url}`);

        await this.page.goto(url);

        const html = await this.page.evaluate(() => document.body.innerHTML);

        //console.log(html);

        return {
            $: cheerio.load(html),
            html: html
        };
    }

    async x() {
        await this.page.click(this.SEARCH_CSS_QUERY);

        setTimeout(async () => {
            const html = await this.page.evaluate(() => document.body.innerHTML);
        }, 5000);

        //console.log(html);
    }

    async getSearchResults(url = this.SEARCH_URL, query = this.SEARCH_CSS_QUERY) {
        const {
            $,
            html
        } = await this.navigate(url);
        const results = $(query);
        let links = [];

        results.each((i, result) => {
            const href = $(result).attr('href');
            links.push(href);
        });

        return links;
    }

    async getDetailsPage(url) {
        const {
            $,
            html
        } = await this.navigate(url);

        //const description = $(this.DETAILS_CSS_QUERIES.DESCRIPTION).text();
        //console.log(description);

        //const title = $('.offer-titlebox h1');
        //console.log(title);

        console.log(html);

        return {
            url: url,
            //description: description
        };
    }
}

module.exports = OLX;