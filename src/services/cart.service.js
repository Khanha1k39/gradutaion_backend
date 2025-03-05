"use strict";

const { NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repository/product.repo");
class CartService {
  static async addToCart({ userId, product = {} }) {
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      return await this.createUserCart({ userId, product });
    }
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }
    return await CartService.updateUserCartQuantity({ userId, product });
  }
  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = { cart_userId: userId, "cart_products.productId": productId };
    const updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    };
    const options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateSet, options);
  }
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId };
    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };
    const options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }
  static async addToCartV2({ shop_order_ids, userId }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Product not found");

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }

    if (quantity === 0) {
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }
  static async deleteCart({ userId, productId }) {
    const query = { cart_userId: userId, "cart_products.productId": productId };
    const updateSet = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };
    const deletedCart = await cart.updateOne(query, updateSet);
    return deletedCart;
  }
  static async getListUserCart({ userId }) {
    return await cart.findOne({ cart_userId: userId }).lean();
  }
}
module.exports = CartService;
