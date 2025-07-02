import fs from 'fs';
import puppeteer from 'puppeteer';    // import puppeteer from fs for file writing

const scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const url = 'https://flightdetails.net';
    await page.goto(url);
    // Wait for the page to load
    const cards = await page.evaluate(() => {
        // Select all the cards content by common class name
        const cardElements = document.querySelectorAll(".cont-wrap");
        return Array.from(cardElements).map((card) => {
            const title = card.querySelector("h5")?.innerText.trim();
            const image = card.querySelector("figure img.lazyload")?.getAttribute("data-src");
            const content = card.querySelector("p")?.innerText.trim();


            return { title,
                content,
                image };
        });
    });

    // Write the data to a JSON file
    fs.writeFileSync('popularDestination.json', JSON.stringify(cards, null, 2));

    await browser.close();
};

scrape();
