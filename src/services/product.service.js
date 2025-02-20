const { electronic, clothing, product } = require("../models/product.model");
class ProductFactory {
    static async createProduct(type, payload) {
        console.log("type payload", type, payload)
        switch (type) {
            case "Electronic":
                return new Electronics(payload).createProduct()
                break;
            case "Clothing":
                return new Clothing(payload).createProduct()
                break;


            default:
                break;
        }
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

module.exports = ProductFactory