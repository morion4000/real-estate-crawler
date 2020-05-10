// @see: https://cheerio.js.org/
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

class STORIA {
    constructor() {
        this.BASE_URL = 'https://www.storia.ro/vanzare/apartament';
        this.LOCATION = 'mehedinti/drobeta-turnu-severin';
        this.SEARCH_URL = `${this.BASE_URL}/${this.LOCATION}`;
        this.SEARCH_RESULTS_PER_PAGE = 24;
        this.PAGE_URL = `?nrAdsPerPage=${this.SEARCH_RESULTS_PER_PAGE}&page=`;
        this.SEARCH_CSS_QUERY = '.offer-item-details h3 a';
        this.DETAILS_CSS_QUERIES = {
            DESCRIPTION: '#textContent'
        };
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: true
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

        console.log(await this.browser.userAgent());
    }

    async destroy() {
        this.browser.close();
    }

    async navigate(url) {
        console.log(`Getting ${url}`);

        let html, $;

        try {
            const response = await this.page.goto(url);

            html = await this.page.evaluate(() => document.body.innerHTML);
            $ = cheerio.load(html);
        } catch (e) {
            console.error(`There was an error`);
        }

        return {
            $: $,
            html: html
        };
    }

    async getSearchResults(url = this.SEARCH_URL, page = 1, links = []) {
        const {
            $,
            html
        } = await this.navigate(`${url}/${this.PAGE_URL}${page}`);

        if ($ && html) {
            const results = $(this.SEARCH_CSS_QUERY);

            results.each((i, result) => {
                const href = $(result).attr('href');
                links.push(href);
            });

            // FIXME: If the last page has exactly this.SEARCH_RESULTS_PER_PAGE
            // items, the script will skip it (rare edge case)
            if (results.length === this.SEARCH_RESULTS_PER_PAGE) {
                page++;
                await this.getSearchResults(url, page, links);
            }
        }

        return links;
    }

    async getDetailsPage(url) {
        const {
            $,
            html
        } = await this.navigate(url);

        let price = $('div.css-1vr19r7').text();
        const description = $('div.css-uiakpw').text();
        const title = $('h1.css-1ld8fwi').text();

        // TODO: EUR or RON?
        price = price.replace(/\s/g, '');
        price = parseInt(price);

        console.log(price);

        // rooms
        // floor
        // layout
        // year

        return {
            url: url,
            price: price,
            title: title,
            description: description,
            raw: html
        };
    }
}

module.exports = STORIA;