const axios = require("axios");
const cheerio = require("cheerio");

module.exports = class StarRail {

  #_instance;

  constructor() {
    this.#_instance = axios.create({
      baseURL: "https://honkai-star-rail.fandom.com/wiki/Redemption_Code",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 OPR/98.0.0.0"
      }
    });
  }

  async response() {
    try {
      const { data } = await this.#_instance.get()
      const $ = cheerio.load(data);
      return $;

    } catch (e) {
      throw new Error("An error has occurred.");
    };
  };

  async coupons() {

    const $ = await this.response();

    let coupons = [];
    let rewards = [];
    let durations = [];

    const activeCodes = $('h2 span#Active_Codes').parent().next('table').find('tbody tr');
    activeCodes.each((_, e) => {
      coupons.push($(e).find('td:nth-child(1)').text().trim());
      rewards.push($(e).find('td:nth-child(3)').text().trim());
      durations.push($(e).find('td:nth-child(4)').text().trim());
    });

    if (coupons.length === 0) throw new Error("No coupons currently available.");

    return {
      coupon: coupons.join("\n"),
      reward: rewards.join("\n"),
      duration: durations.join("\n")
    };
  };
}
