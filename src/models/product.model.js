'use strict'
const { model, Schema, Types } = require('mongoose'); // Erase if
const { default: slugify } = require('slugify');

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: { type: String },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronic', "Clothing"] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be equal or above than 1"],
        max: [5, "Rating must be equal or less than 1"],
        set: (value) => Math.round(value * 10) / 10

    },
    product_variations: {
        type: Array, default: [],
        index: true, select: false
    },
    isDraft: { type: Boolean, default: true, index: true },
    isPublish: { type: Boolean, default: false, index: true }


}, {
    collection: COLLECTION_NAME,
    timestamps: true
})
//indexing
productSchema.index({
    product_name: "text",
    product_description: "text"
})

//document middleware run before save
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next()

})



// define the product type = clothing

const clothingSchme = new Schema({

    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },

    brand: { type: String, require: true },
    size: String,
    material: String
}, {
    collection: "Clothes", timestamps: true

})

const electronicSchme = new Schema({
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },

}, {
    collection: "electronics", timestamps: true

})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model("Clothing", clothingSchme),
    electronic: model("Electronic", electronicSchme)
}

