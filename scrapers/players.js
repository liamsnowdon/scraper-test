const fs = require('fs')

module.exports = {
  url: 'https://overwatchleague.com/en-us/players',

  async scraper (browser) {
    let page = await browser.newPage();

    console.log(`Navigating to ${this.url}...`);
  
    
    // Navigate to the selected page
    await page.goto(this.url);

    // Wait for the required DOM to be rendered
    await page.waitForSelector('.players-liststyles__TableContainer-sc-1jhwo3g-5');

    // Get the link to all the players
    const players = await page.$$eval('.players-liststyles__PlayerRow-sc-1jhwo3g-23', (rows) => {
      return rows.map((row) => {
        return {
          // Initial data needed to access main player page, and additional data only available on players listing page
          url: row.querySelector('.players-liststyles__PlayerCard-sc-1jhwo3g-21').href,
          role: row.querySelector('.players-liststyles__RoleName-sc-1jhwo3g-20').textContent,
        }
      })
    });

    const data = []

    for (let player of players) {
      console.log(`Navigating to ${player.url}...`);
      
      // Go to player page
      await page.goto(player.url)
      await page.waitForSelector('.player-herostyles__PlayerTag-sc-4caowu-16')
      
      // Get detailed player data
      const nickname = await page.$eval('.player-herostyles__PlayerTag-sc-4caowu-16', el => el.textContent)
      const name = await page.$eval('.player-herostyles__PlayerName-sc-4caowu-15', el => el.textContent)
      const imageUrl = await page.$eval('.player-herostyles__PlayerImage-sc-4caowu-12', el => el.getAttribute('src'))
      const socials = await page.$$eval('.player-herostyles__SocialNetworksContainer-sc-4caowu-18 .player-herostyles__SocialNetworkLink-sc-4caowu-19', (socials) => {
        return [...new Set(socials.map(social => social.href))]
      })
      const stats = {
        2022: {
          topHeroes: await page.$$eval('.hero-rowstyles__StyledTableRow-sc-1nswscz-0', (rows) => {
            return rows.map((row) => ({
              name: row.querySelector('.table-hero-cardstyles__Name-dh187u-3').textContent,
              timePlayed: row.querySelector('.hero-rowstyles__TimePlayed-sc-1nswscz-1').textContent,
              percentagePlayed: row.querySelector('.hero-rowstyles__PlayedPercentage-sc-1nswscz-2').textContent,
            }))
          }),
          overview: await page.$$eval('.player-detailstyles__StyledTableRow-dqkiz9-15', (rows) => {
            return rows.map((row) => ({
              name: row.querySelector('.player-detailstyles__AsAllHeroesCell-dqkiz9-12').textContent,
              value: row.querySelector('.player-detailstyles__Avg10MinCell-dqkiz9-13').textContent,
            }))
          })
        }
      }

      const playerData = {
        ...player,
        nickname,
        name,
        imageUrl,
        socials,
        stats,
      }

      data.push(playerData)
    }

    fs.writeFileSync('players.json', JSON.stringify(data, null, 2))
    console.log('Players data saved to players.json')
  },
}
