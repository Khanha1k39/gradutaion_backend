const { Types } = require("mongoose")
const { product } = require("../product.model")

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await product.find(query).populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()

}

const getAllPublishedForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })

}
const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query).populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()

}
const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),

    })
    if (!foundProduct) {
        return null
    }
    foundProduct.isDraft = false;
    foundProduct.isPublish = true;
    return await foundProduct.save(foundProduct)


}
const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),

    })
    if (!foundProduct) {
        return null
    }
    foundProduct.isDraft = true;
    foundProduct.isPublish = false;
    return await foundProduct.save(foundProduct)


}
module.exports = { unPublishProductByShop, findAllDraftsForShop, publishProductByShop, getAllPublishedForShop }