const fs = require('fs')

module.exports = {
  url: 'https://overwatchleague.com/en-us/teams',

  async scraper (browser) {
    let page = await browser.newPage();

    console.log(`Navigating to ${this.url}...`);
  
    // Navigate to the selected page
    await page.goto(this.url);

    // Wait for the required DOM to be rendered
    await page.waitForSelector('.teams-gridstyles__Wrapper-usf79f-0');

    // Get the link to all the required teams
    const teams = await page.$$eval('.teams-gridstyles__StyledTeamCard-usf79f-2', (links) => {
      return links.map((link) => {
        return {
          url: link.href,
          imageUrl: link.querySelector('div:first-child').outerHTML,
          name: link.querySelector('div:nth-child(2)').textContent
        }
      })
    });

    fs.writeFileSync('teams.json', JSON.stringify(teams, null, 4))
    console.log('Teams data saved to teams.json')
  },
}
