const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");

module.exports = class StarRail {

  #_instance;

  constructor() {
    this.#_instance = axios.create({
      method: "GET",
      baseURL: "https://honkai.gg/codes",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 OPR/97.0.0.0"
      }
    });
  }

  async response() {
    try {
      const { data } = await this.#_instance()
      const $ = cheerio.load(data);
      return $;

    } catch (e) {
      throw new Error("An error has occurred.");
    };
  };

  async coupons() {

    const $ = await this.response();
    const coupons = [];

    $('table tbody tr').each((_, e) => {
      const coupon = $(e).find('td:nth-child(1)').text();
      const reward = $(e).find('td:nth-child(2)').text();
      const duration = $(e).find('td:nth-child(3)').text();

      coupons.push({ coupon, reward, duration });
    });

    return coupons;
  };

  async getCoupons() {
    const coupons = await this.coupons();

    let coupon = [];
    let reward = [];
    let duration = [];
    
    coupons.forEach(cp => {

      const date = cp.duration.split(" ");
      const format = moment(date[3] + "-" + date[0] + "-" + moment().year(), 'DD-MMM-YYYY');

      if (format.isValid() && !format.isSameOrBefore(moment(), 'day') || cp.duration.length == 0) {
        coupon.push(cp.coupon);
        reward.push(cp.reward);
        duration.push(cp.duration || "--/--"); 
      };
    });    

    if (coupon.length == 0 && reward.length == 0) throw new Error("No coupons currently available.");

    return {
      coupon: coupon.join("\n"),
      reward: reward.join("\n\n"),
      duration: duration.join("\n")
    };
  };
};