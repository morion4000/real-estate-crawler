// @see: https://cheerio.js.org/
const cheerio = require('cheerio');
const Browser = require('./browser');

class STORIA extends Browser {
    constructor(exchange_rate, location) {
        super();
        
        this.exchange_rate = exchange_rate;
        this.location = location;
        this.BASE_URL = 'https://www.storia.ro/vanzare/apartament';
        this.SEARCH_URL = `${this.BASE_URL}/${this.location}`;
        this.SEARCH_RESULTS_PER_PAGE = 24; // default 24
        this.PAGE_URL = `?nrAdsPerPage=${this.SEARCH_RESULTS_PER_PAGE}&page=`;
        this.SEARCH_CSS_QUERY = '.offer-item-details h3 a';
        this.DETAILS_CSS_QUERIES = {
            DESCRIPTION: '#textContent'
        };
    }

    async getSearchResults(url = this.SEARCH_URL, page = 1, links = []) {
        const html = await this.navigate(`${url}/${this.PAGE_URL}${page}`);
        const $ = cheerio.load(html);

        if ($ && html) {
            const results = $(this.SEARCH_CSS_QUERY);

            results.each((i, result) => {
                const href = $(result).attr('href');
                links.push(href);
            });

            // FIXME: If the last page has exactly this.SEARCH_RESULTS_PER_PAGE
            // items, the script will skip it (rare edge case)
            if (results.length >= this.SEARCH_RESULTS_PER_PAGE) {
                page++;
                await this.getSearchResults(url, page, links);
            }
        }

        return links;
    }

    async getDetailsPage(url) {
        const html = await this.navigate(url);
        const $ = cheerio.load(html);

        let title;
        let price;
        let description;
        let photos;
        let rooms;
        let year;
        let floor;
        let area;
        let layout;
        let price_ron;
        let price_eur;

        // TODO: Get published_at
        // TODO: Get modified_at

        try {
            let is_ron = false;
            let properties;

            description = $('div.css-uiakpw').text();
            title = $('h1.css-1ld8fwi').text();
            properties = $('div.css-oyemm7 ul li');
            price = $('div.css-1vr19r7').text();
            photos = $('.slick-npages');

            is_ron = price.indexOf('RON') !== -1;
            price = price.replace(/\s/g, '');
            price = parseInt(price);

            if (is_ron) {
                price_ron = price;

                price_eur = price / this.exchange_rate;
                price_eur = parseInt(price_eur);
            } else {
                price_eur = price;

                price_ron = price * this.exchange_rate;
                price_ron = parseInt(price_ron);
            }

            properties.each((i, element) => {
                const property = $(element).text().toLowerCase();

                if (property.indexOf('camere') !== -1) {
                    rooms = property.split(':')[1];
                    rooms = parseInt(rooms);
                } else if (property.indexOf('anul') !== -1) {
                    year = property.split(':')[1];
                    year = parseInt(year);
                } else if (property.indexOf('etaj') !== -1) {
                    floor = property.split(':')[1];
                    floor = floor.replace(/\s/g, '');
                } else if (property.indexOf('suprafata utila') !== -1) {
                    area = property.split(':')[1];
                    area = parseInt(area);
                } else if (property.indexOf('compartimentare') !== -1) {
                    layout = property.split(':')[1];
                    layout = layout.replace(/\s/g, '');
                }
            });

            photos = photos[0];
            photos = $(photos).text();
            photos = photos.split('/')[1];
            photos = parseInt(photos) || 0;
        } catch (e) {
            console.error(e);
        }

        return {
            url: url,
            title: title,
            description: description,
            price_eur: price_eur,
            price_ron: price_ron,
            rooms: rooms,
            year: year,
            floor: floor,
            area: area,
            layout: layout,
            photos: photos,
            //raw: html
        };
    }
}

module.exports = STORIA;