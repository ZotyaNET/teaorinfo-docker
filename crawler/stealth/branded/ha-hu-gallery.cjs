"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
// In this example, we'll scrape links on HN
exports.default = async ({page}) => {
    const args = process.argv;
    // console.log(args);
    const url = args[3];

    await page.goto(url); // Replace with your desired URL

    const cookieBtn = '#didomi-notice-agree-button';
    await page.waitForSelector(cookieBtn);
    await page.click(cookieBtn);

    // Wait for the div with class name 'kepek-holder' to appear
    await page.waitForSelector('.kepek-holder', {timeout: 5000});

    // let associativeArray;
    // associativeArray = await page.$$eval('div.talalati-sor', (elements) => {
    //     return elements.map((element) => {
    //
    //         const img = element.querySelector('img.img-responsive');
    //         const image = img ? img.getAttribute('src') : null;
    //
    //         const aTag = element.querySelector('h3 > a');
    //         const link = aTag ? aTag.getAttribute('href') : null;
    //         const title = aTag ? aTag.textContent : null;
    //
    //         const tTag = element.querySelector('div.talalatisor-adatok');
    //         // Extract the content of the main parent article element as the teaser
    //         const infoSpans = tTag.querySelectorAll('span.info');
    //         // Extract the date from the second span with class "info"
    //         const dateSpan = infoSpans[1];
    //         const year = dateSpan ? dateSpan.textContent.trim() : null;
    //
    //         const abbr = tTag ? tTag.querySelector('abbr') : null;
    //         const km = abbr ? abbr.textContent : null;
    //
    //         const pricefield = tTag ? tTag.querySelector('div.pricefield-primary') : null;
    //         const price = pricefield ? pricefield.textContent : null;
    //
    //         return {
    //             link,
    //             title,
    //             image,
    //             year,
    //             price,
    //             km,
    //         };
    //     });
    // });
    // Extract the src attributes from img tags within the 'kepek-holder' div
    const imgSrcs = await page.$$eval('.kepek-holder img', (imgs) => imgs.map((img) => {
        let src = img.getAttribute('src');
        return {src};
    }));

    // Close the tab
    await page.close();

    console.log(JSON.stringify(imgSrcs));
};


