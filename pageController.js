const teamsPage = require('./scrapers/teams');
const playersPage = require('./scrapers/players');

async function scrapeAll(browserInstance){
	let browser;

	try {
		browser = await browserInstance;

		await teamsPage.scraper(browser);	
		await playersPage.scraper(browser);	
	} catch( err) {
		console.log("Could not resolve the browser instance => ", err);
	}
}

module.exports = (browserInstance) => scrapeAll(browserInstance)
