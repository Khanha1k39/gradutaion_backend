// {
//     "cartId": "cartId_value",
//     "userId": "userId_value",
//     "shop_order_ids": [
//         {
//             "shopId": "shopId_value",
//             "shop_discount": [
//                 {
//                     "shopId": "shopId_value",
//                     "discountId": "discountId_value",
//                     "codeId": "codeId_value"
//                 }
//             ],
//             "item_products": [
//                 {
//                     "price": "price_value",
//                     "quantity": "quantity_value",
//                     "productId": "productId_value"
//                 }
//             ]
//         },
//         {
//             "shopId": "shopId_value",
//             "shop_discount": [
//                 {
//                     "shopId": "shopId_value",
//                     "discountId": "discountId_value",
//                     "codeId": "codeId_value"
//                 }
//             ],
//             "item_products": [
//                 {
//                     "price": "price_value",
//                     "quantity": "quantity_value",
//                     "productId": "productId_value"
//                 }
//             ]
//         }
//     ]
// }

const { BadRequestError } = require("../core/error.response");
const { order } = require("../models/order.model");
const {
  findCartById,
  checkProductByserver,
} = require("../models/repository/cart.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

class CheckoutService {
  static async checkoutReview({ cartId, shop_order_ids, userId }) {
    const foundCart = await findCartById(cartId);
    if (!cartId) {
      throw new BadRequestError("cart doesnt exsist");
    }
    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discount = [], item_products } = shop_order_ids[i];
      const checkProductByserver = await checkProductByserver(item_products);
      if (!checkProductByserver[0]) {
        throw new BadRequestError("order wrong");
      }
      const checkout_price = checkProductByserver.reduce(
        (acc, product) => acc + product.price * product.quantity
      );
      checkout_order.totalPrice += checkout_price;
      const itemCheckout = {
        priceRaw: checkout_price,
        priceRawApplyDiscount: checkout_price,
        shopId,
        shop_discount,
        item_products: checkProductByserver,
      };
      if (shop_discount.length > 0) {
        const { discount = 0, totalPrice = 0 } = getDiscountAmount({
          codeId: shop_discount[0].codeId,
          userId,
          shopId,
          products: checkProductByserver,
        });
        checkout_order.totalDiscount += discount;
        if (discount > 0) {
          itemCheckout.priceRawApplyDiscount = checkout_price - discount;
        }
      }
      checkout_order.totalCheckout += itemCheckout.priceRawApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }
    return {
      shop_order_ids_new,
      checkout_order,
      shop_order_ids,
    };
  }
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment,
  }) {
    const { shop_order_ids_new, checkout_order } = await checkoutReview({
      cartId,
      userId,
      shop_order_ids,
    });
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { price, quantity, productId } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Một số sản phẩm được update vui lòng thay đổi giỏ hàng"
      );
    }
    const newOrder = await order.create();
  }
}
module.exports = CheckoutService;
