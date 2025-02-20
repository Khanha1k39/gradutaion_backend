'use strict'

const DiscountService = require("../services/discount.service")
const { SuccessResponse, OkResponse } = require("../core/success.response")

class DiscountController {

    createDiscountCode = async (req, res, next) => {
        new OkResponse({
            message: 'Successful Code Generation',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodes = async (req, res, next) => {
        new OkResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)

    }
    getDiscountAmount = async (req, res, next) => {
        new OkResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }
    getAllDiscountCodesWithProduct = async (req, res, next) => {
        new OkResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query
            })
        }).send(res)
    }
    // getAllDiscountCodesWithProduct = async (req, res, next) => {
    //     new SuccessResponse({
    //         message: 'Successful Code Found',
    //         metadata: await DiscountService.({
    //             ...req.query,
    //             shopId: req.user.userId
    //         })
    //     })
    // }

}

module.exports = new DiscountController();
