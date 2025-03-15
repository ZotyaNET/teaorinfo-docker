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

const os = require('os');
const networkInterfaces = require('network-interfaces');

const getLocalIpAddress = () => {
    const ifaces = os.networkInterfaces();
    let ipAddress = '';

    for (const iface in ifaces) {
        if (ifaces.hasOwnProperty(iface)) {
            const addresses = ifaces[iface];
            for (let i = 0; i < addresses.length; i++) {
                if (addresses[i].family === 'IPv4' && !addresses[i].internal) {
                    ipAddress = addresses[i].address;
                    break;
                }
            }
            if (ipAddress) break;
        }
    }

    return ipAddress;
};

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

    // Enable request interception to track network activity
    await page.setRequestInterception(true);

    // Initialize variables to track network data
    let requestSize = 0; // Total request size in bytes
    let responseSize = 0; // Total response size in bytes

    page.on('request', (request) => {
        request.continue();
    });

    page.on('response', async (response) => {
        const contentLength = response.headers()['content-length'];
        if (contentLength) {
            responseSize += parseInt(contentLength, 10);
        }
    });

    await page.goto('https://www.autoscout24.de/'); // Replace with your desired URL

    const cookieBtn = '[data-testid="as24-cmp-accept-all-button"]';
    await page.waitForSelector(cookieBtn, {timeout: 5000});
    await page.click(cookieBtn);

    const makeSelector = '#make';
    await page.waitForSelector(makeSelector, {timeout: 5000});
    await page.click(makeSelector);
    await page.keyboard.type(make);
    await page.keyboard.press('Enter');
    await page.wait(500);

    const modelSelector = '#model';
    await page.waitForSelector(modelSelector, {timeout: 5000});
    await page.click(modelSelector);
    await page.keyboard.type(model);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    if (price != null) {
        const priceSelector = '#price';
        await page.waitForSelector(priceSelector, {timeout: 5000});
        await page.click(priceSelector);
        await page.keyboard.type(price);
        await page.keyboard.press('Enter');
    }

    if (year != null) {
        const yearSelector = '#firstRegistration';
        await page.waitForSelector(yearSelector, {timeout: 5000});
        await page.click(yearSelector);
        await page.keyboard.type(year);
        await page.keyboard.press('Enter');
    }

    await page.waitForSelector('a#search-mask-search-cta > span', {timeout: 5000});
    await page.waitForTimeout(1234);
    const numericData = await page.$eval('#search-mask-search-cta', (anchor) => {
        const textContent = anchor.textContent.trim();
        // Use a regular expression that allows numbers, a decimal point, and trailing zeros
        const numericValue = parseFloat(textContent.replace(/[^\d]/g, ''));
        return isNaN(numericValue) ? null : numericValue;
    });

    const selectedValues = await page.evaluate(() => {
        const priceSelect = document.querySelector('#price');
        const yearSelect = document.querySelector('#firstRegistration');
        const makeSelect = document.querySelector('#make');
        const modelSelect = document.querySelector('#model');

        // Get the selected option values
        const priceValue = priceSelect ? priceSelect.options[priceSelect.selectedIndex].value : '';
        const yearValue = yearSelect ? yearSelect.options[yearSelect.selectedIndex].value : '';

        const makeOption = makeSelect ? makeSelect.options[makeSelect.selectedIndex] : null;
        const makeLabel = makeOption ? makeOption.label : '';

        const modelOption = modelSelect ? modelSelect.options[modelSelect.selectedIndex] : null;
        const modelLabel = modelOption ? modelOption.label : '';

        return {
            make: makeLabel,
            model: modelLabel,
            price: priceValue,
            year: yearValue
        };
    });

    if (numericData === 0) {
        // Stop monitoring network activity
        await page.setRequestInterception(false);
        const response = {
            data: null,
            success: true,
            message: 'There are ' + numericData + ' total results for make: ' + selectedValues.make + ', model: ' + selectedValues.model + ', year: ' + selectedValues.year + ', price: ' + selectedValues.price + ', with traffic requests: ' + requestSize + ' bytes, responses: ' + responseSize + ' bytes from IP ' + getLocalIpAddress()
        };

        // Close the tab
        await page.close();

        console.log(JSON.stringify(response));

        return 0;
    }


    const searchBtn = '#search-mask-search-cta';
    await page.waitForSelector(searchBtn, {timeout: 5000});
// Click on the element with the specified "data-testid" attribute
    await page.click(searchBtn);

    const sortSelect = '#sort-dropdown-select';
    await page.waitForSelector(sortSelect, {timeout: 5000});
    await page.click(sortSelect);
    await page.keyboard.type('neu');
    await page.keyboard.press('Enter');


    await page.setViewport({
        width: 1200,
        height: 800
    });

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
            };
        });
    });


    // console.log('make:', selectedValues.make);
    // console.log('model:', selectedValues.model);
    // console.log('year:', selectedValues.year);
    // console.log('price:', selectedValues.price);
    // console.log('total:', numericData);
    // Stop measuring network traffic
    // Stop monitoring network activity
    await page.setRequestInterception(false);

    const response = {
        data: associativeArray,
        success: true,
        message: 'There were ' + numericData + ' results total for make: ' + selectedValues.make + ', model: ' + selectedValues.model + ', year: ' + selectedValues.year + ', price: ' + selectedValues.price + ', with traffic requests: ' + requestSize + ' bytes, responses: ' + responseSize + ' bytes from IP ' + getLocalIpAddress()
    };

    // Close the tab
    await page.close();

    console.log(JSON.stringify(response));
};
