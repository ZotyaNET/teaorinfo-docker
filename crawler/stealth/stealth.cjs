const args = process.argv;
const {default: start} = require(args[2]);
const puppeteer = require('puppeteer-core');

(async () => {
    const browserWSEndpoint = 'ws://chrome:3000/function?blockAds=true&headless=true&ignoreHTTPSErrors=true&stealth=true';

    const connectOptions = {
        browserWSEndpoint: browserWSEndpoint,
        args: [
            '--blink-settings=imagesEnabled=false',
        ],
    };

    const browser = await puppeteer.connect(connectOptions);
    const page = await browser.newPage();

    try {
        await start({page});
    } catch (error) {
        console.error('Error during the start function:', error);
    } finally {
        await browser.close();
    }
})();
