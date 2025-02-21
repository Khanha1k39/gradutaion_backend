"use strict";
const _ = require("lodash");
const { Types } = require("mongoose");
const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};
const getSelectData = (select) => {
    return Object.fromEntries(select.map(e => [e, 1]))
}
const getUnSelectData = (select) => {
    return Object.fromEntries(select.map(e => [e, 0]))
}
const removeUndefiedObject = (obj) => {
    Object.keys(obj).forEach(k => {
        if (obj[k] === null) {
            delete obj[k];
        }
    })
    return obj;
}
const updateNestedObjectParser = (o) => {
    const obj = removeUndefiedObject(o);
    console.log(`[1]::`, obj,);
    const final = {};
    Object.keys(obj).forEach(k => {
        console.log(`[3]`, k, obj[k], typeof obj[k], typeof null, !Array.isArray(null));
        if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k]);
            Object.keys(response).forEach(a => {
                console.log(`[4]`, a);
                final[`${k}.${a}`] = response[a];
            });
        } else {
            final[k] = obj[k];
        }
    });
    return final;
};
const convertToObjectIdMongodb = (id) => new Types.ObjectId(id)
module.exports = { convertToObjectIdMongodb, removeUndefiedObject, updateNestedObjectParser, getInfoData, getSelectData, getUnSelectData };