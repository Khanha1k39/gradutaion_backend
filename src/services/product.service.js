const { BadRequestError } = require("../core/error.response");
const { electronic, clothing, product } = require("../models/product.model");
const { findAllDraftsForShop, getAllPublishedForShop, publishProductByShop, unPublishProductByShop } = require("../models/repository/product.repo");
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
        //     switch (type) {
        //         case "Electronic":
        //             return new Electronics(payload).createProduct()
        //             break;
        //         case "Clothing":
        //             return new Clothing(payload).createProduct()
        //             break;


        //         default:
        //             throw new BadRequestError("`Invalid Request types`")
        //             break;
        //     }
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

}
class Clothing extends Product {

    async createProduct() {
        const newClothing = await clothing.create({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newClothing) throw new BadRequestError('create new Clothing error');

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError('create new Product error');

        return newProduct;
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