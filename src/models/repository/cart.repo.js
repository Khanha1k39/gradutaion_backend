const { convertToObjectIdMongodb } = require("../../utils");
const { cart } = require("../cart.model");
const { getProductById } = require("./product.repo");

const findCartById = async (cartId) => {
  return await cart.findOne({ _id: convertToObjectIdMongodb(cartId) }).lean();
};
const checkProductByserver = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId);
      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: foundProduct.product_quantity,
          producId: product.producId,
        };
      }
    })
  );
};
module.exports = {
  findCartById,
  checkProductByserver,
};
