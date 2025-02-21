const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new OkResponse({
      message: "Successful checkout review",
      metadata: await CheckoutService.checkoutReview({
        ...req.body,
      }),
    }).send(res);
  };
}
module.exports = new CheckoutController();
