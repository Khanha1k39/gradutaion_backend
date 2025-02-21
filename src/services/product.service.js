const { Types } = require("mongoose");
const { BadRequestError } = require("../core/error.response");
const { electronic, clothing, product } = require("../models/product.model");
const { findAllDraftsForShop, getAllPublishedForShop, publishProductByShop, unPublishProductByShop, searchProductsByUser, findAllProducts, findProduct, updateProductById } = require("../models/repository/product.repo");
const { updateNestedObjectParser, removeUndefiedObject } = require("../utils");
class ProductFactory {
    static productRegistry = {};
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef

    }
    static async createProduct(type, payload) {
        console.log("type payload", type, payload)
        const productClass = this.productRegistry[type]
        if (!productClass) {
            throw new BadRequestError("Invalid product type")
        }
        return new productClass(payload).createProduct();

    }
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async getAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublish: true }
        return await getAllPublishedForShop({ query, limit, skip })
    }
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }
    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }
    static async searchProductsByUser({ keySearch }) {
        return await searchProductsByUser({ keySearch })
    }
    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublish: true } }) {
        return await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb'] })
    }
    static async findProduct(product_id) {
        return await findProduct({ product_id, unSelect: ['__v'] })
    }
    static async updateProduct(type, payload, id) {
        const productClass = this.productRegistry[type];
        if (!productClass) {
            throw new BadRequestError("Invalid product type")
        }
        return new productClass(payload).updateProduct(id);
    }
}

class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_type, product_shop, product_attributes, product_quantity
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
        this.product_quantity = product_quantity;
    }

    // create new product
    async createProduct(id) {
        return await product.create({ ...this, _id: id });
    }
    async updateProduct(id, payload) {
        return await updateProductById({
            productId: id,
            bodyUpdate: payload,
            model: product
        })
    }

}
class Clothing extends Product {

    async createProduct() {
        const newClothing = await clothing.create({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newClothing) throw new BadRequestError('create new Clothing error');

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError('create new Product error');

        return newProduct;
    }
    async updateProduct(id) {
        const objectParams = removeUndefiedObject(this);

        if (objectParams.product_attributes) {
            await updateProductById({
                productId: id,
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
                model: clothing
            })
        }
        const updateProduct = await super.updateProduct(id, updateNestedObjectParser(objectParams));
        return updateProduct;
    }
}

// Define sub-class for different product types Electronics
class Electronics extends Product {

    async createProduct() {
        const newElectronic = await electronic.create({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newElectronic) throw new BadRequestError('create new Electronics error');

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError('create new Product error');

        return newProduct;
    }
}
ProductFactory.registerProductType("Electronic", Electronics)
ProductFactory.registerProductType("Clothing", Clothing)

module.exports = ProductFactory