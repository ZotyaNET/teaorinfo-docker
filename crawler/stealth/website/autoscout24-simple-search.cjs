async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
// In this example, we'll scrape links on HN
exports.default = async ({page}) => {
    const args = process.argv;
    // console.log(args);
    const make = args[3];
    const model = args[4];
    const year = args[5];
    const price = args[6];

    await page.goto('https://www.autoscout24.de/'); // Replace with your desired URL

    await page.setViewport({
        width: 1200,
        height: 800
    });

    const cookieBtn = '[data-testid="as24-cmp-accept-all-button"]';
    await page.waitForSelector(cookieBtn, {visible: true});
    await page.click(cookieBtn);

    const makeSelector = '#make';
    await page.waitForSelector(makeSelector, {visible: true});
    await page.click(makeSelector);
    await page.keyboard.type(make);
    await page.keyboard.press('Enter');

    const modelSelector = '#model';
    await page.waitForSelector(modelSelector, {visible: true});
    await page.click(modelSelector);
    await page.keyboard.type(model);
    await page.keyboard.press('Enter');

    if (price != null) {
        const priceSelector = '#price';
        await page.waitForSelector(priceSelector, {visible: true});
        await page.click(priceSelector);
        await page.keyboard.type(price);
        await page.keyboard.press('Enter');
    }

    if (year != null) {
        const yearSelector = '#firstRegistration';
        await page.waitForSelector(yearSelector, {visible: true});
        await page.click(yearSelector);
        await page.keyboard.type(year);
        await page.keyboard.press('Enter');
    }

    const searchBtn = '#search-mask-search-cta';
    await page.waitForSelector(searchBtn, {visible: true});
    // Click on the element with the specified "data-testid" attribute
    await page.click(searchBtn);

    const sortSelect = '#sort-dropdown-select';
    await page.waitForSelector(sortSelect, {visible: true});
    await page.click(sortSelect);
    await page.keyboard.type('neu');
    await page.keyboard.press('Enter');

    await autoScroll(page);

    let associativeArray;

    associativeArray = await page.$$eval('article.cldt-summary-full-item', (elements) => {
        return elements.map((element) => {
            const imageElements = element.querySelectorAll('picture source');
            const image = Array.from(imageElements).map((img) => img.getAttribute('srcset'))[0];

            const aTag = element.querySelector('a');
            const link = aTag ? 'https://autoscout24.de' + aTag.getAttribute('href') : null;

            const titleElement = aTag.querySelector('h2');
            const title = titleElement ? titleElement.textContent.trim() : '';

            // Extract the content of the main parent article element as the teaser
            const teaser = element.innerHTML;

            const price = element.querySelector('[data-testid="regular-price"]');
            const priceText = price ? price.textContent.trim() : '';

            const kmElement = element.querySelectorAll('span[class^="VehicleDetailTable_item_"]');
            const km = kmElement ? kmElement[0].textContent.trim() : '';
            const year = kmElement ? kmElement[2].textContent.trim() : '';

            return {
                link,
                image,
                title,
                price: priceText,
                km,
                year,
                // teaser,
            };
        });
    });

    // Close the tab
    await page.close();

    console.log(JSON.stringify(associativeArray));
};
