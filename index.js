const StarRail = require("./services/StarRail")

async function seele() {
  const starRail = new StarRail();
  const seele = await starRail.coupons();
  console.log(`< Coupons > \n${seele.coupon}\n\n < Reward > \n${seele.reward}\n\n  < Duration > \n${seele.duration}`)
}

seele();
