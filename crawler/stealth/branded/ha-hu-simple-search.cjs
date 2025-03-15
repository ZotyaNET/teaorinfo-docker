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

    // const make = "Audi";
    // const model = "A7";
    // const year = "2007";
    // const price = "40000000"; // !!!

    await page.goto('https://www.hasznaltauto.hu/'); // Replace with your desired URL

    const cookieBtn = '#didomi-notice-agree-button';
    await page.waitForSelector(cookieBtn, {timeout: 5000});
    await page.click(cookieBtn);

    const makeSelector = 'input#mui-2';
    await page.waitForSelector(makeSelector, {timeout: 5000});
    await page.click(makeSelector);
    await page.keyboard.type(make);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const modelSelector = 'input#mui-4';
    await page.waitForSelector(modelSelector, {timeout: 5000});
    await page.click(modelSelector);
    await page.keyboard.type(model);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    if (year != null) {
        const yearSelector = 'select#mui-7';
        await page.waitForSelector(yearSelector, {timeout: 5000});
        await page.click(yearSelector);
        await page.keyboard.type(year);
        await page.keyboard.press('Enter');
    }

    if (price != null) {
        const priceSelector = 'input#mui-10';
        await page.waitForSelector(priceSelector, {timeout: 5000});
        await page.click(priceSelector);
        await page.keyboard.type(price);
        await page.keyboard.press('Tab');
    }

    const searchBtn = '[data-testid="submit-button"]';
    // await page.waitForSelector(searchBtn);
// Click on the element with the specified "data-testid" attribute
    await page.waitForTimeout(500);
    await page.click(searchBtn);
    // await page.waitForTimeout(1000);

    await page.waitForSelector('div.talalati-sor', {timeout: 10000});
    let associativeArray;
    associativeArray = await page.$$eval('div.talalati-sor', (elements) => {
        return elements.map((element) => {

            const img = element.querySelector('img.img-responsive');
            const image = img ? img.getAttribute('src') : null;

            const aTag = element.querySelector('h3 > a');
            const link = aTag ? aTag.getAttribute('href') : null;
            const title = aTag ? aTag.textContent : null;

            const tTag = element.querySelector('div.talalatisor-adatok');
            // Extract the content of the main parent article element as the teaser
            const infoSpans = tTag.querySelectorAll('span.info');
            // Extract the date from the second span with class "info"
            const dateSpan = infoSpans[1];
            const year = dateSpan ? dateSpan.textContent.trim() : null;

            const abbr = tTag ? tTag.querySelector('abbr') : null;
            const km = abbr ? abbr.textContent : null;

            const pricefield = tTag ? tTag.querySelector('div.pricefield-primary') : null;
            const price = pricefield ? pricefield.textContent : null;

            return {
                link,
                title,
                image,
                year,
                price,
                km,
            };
        });
    });

    // Close the tab
    await page.close();

    console.log(JSON.stringify(associativeArray));
};


