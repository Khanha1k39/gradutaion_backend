'use strict'

const { CreatedResponse, OkResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service");

class ProductController {
    createProduct = async (req, res, next) => {
        new CreatedResponse({
            message: "create product successfully",
            metadata: await ProductFactory.createProduct(req.body.product_type, { ...req.body, product_shop: req.user.userId })
        }).send(res);
    }

    getAllDraftsForShop = async (req, res) => {
        new OkResponse({
            message: "get all drafts successfully",
            metadata: await ProductFactory.findAllDraftsForShop({ product_shop: req.user.userId })
        }).send(res);
    }

    getAllPublishedForShop = async (req, res) => {
        new OkResponse({
            message: "get all successfully",
            metadata: await ProductFactory.getAllPublishedForShop({ product_shop: req.user.userId })
        }).send(res);
    }
    PublishProductForShop = async (req, res) => {
        new OkResponse({
            message: "publish successfully",
            metadata: await ProductFactory.publishProductByShop({ product_shop: req.user.userId, product_id: req.params.id })
        }).send(res);
    }
    unPublishProductForShop = async (req, res) => {
        new OkResponse({
            message: "unpublish successfully",
            metadata: await ProductFactory.unPublishProductByShop({ product_shop: req.user.userId, product_id: req.params.id })
        }).send(res);
    }

}

module.exports = new ProductController();