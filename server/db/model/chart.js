"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const { promisify } = util;
const getGoodsDataKey = (compnayId) => {
    return "goodsData-" + compnayId;
};
exports.getGoodsData = ctx => {
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    // let data = 
};
