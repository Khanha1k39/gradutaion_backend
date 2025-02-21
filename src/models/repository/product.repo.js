const { Types } = require("mongoose")
const { product } = require("../product.model")
const { getSelectData, getUnSelectData } = require("../../utils")

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
const searchProductsByUser = async ({ keySearch }) => {
    const regxSearch = new RegExp(keySearch)
    const result = await product.find({
        isPublish: true,
        $text: {
            $search: regxSearch
        }
    },
        { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } }).lean()
    // return await queryProduct({ limit, query, skip })

    return result;
}
const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find(filter)
        .sort(sortBy).skip(skip).limit(limit)
        .select(getSelectData(select)).lean()
    return products;
}
const findProduct = async ({ product_id, unSelect }) => {
    return await product.findOne({ isPublish: true, _id: new Types.ObjectId(product_id) }).select(getUnSelectData(unSelect))
}
const updateProductById = async ({
    productId, bodyUpdate, model, isNew = true
}) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew
    })
}
module.exports = { updateProductById, findProduct, findAllProducts, searchProductsByUser, unPublishProductByShop, findAllDraftsForShop, publishProductByShop, getAllPublishedForShop }