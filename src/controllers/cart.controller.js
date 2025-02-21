const { OkResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  addToCart = async (req, res, next) => {
    return new OkResponse({
      message: "Add to cart Success",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  update = async (req, res, next) => {
    return new OkResponse({
      message: "update Success",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };
  delete = async (req, res, next) => {
    return new OkResponse({
      message: "delete Success",
      metadata: await CartService.deleteCart(req.body),
    }).send(res);
  };
  listToCart = async (req, res, next) => {
    return new OkResponse({
      message: "List to cart Success",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}
module.exports = new CartController();
