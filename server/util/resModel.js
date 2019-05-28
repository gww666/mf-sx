"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseModel {
    constructor(data, message) {
        this.data = data;
        this.message = message;
    }
}
class SucModel extends BaseModel {
    constructor(data, message) {
        super(data, message);
        this.returnCode = 1;
        this.returnCode = 1;
    }
}
exports.SucModel = SucModel;
class ErrModel extends BaseModel {
    constructor(data, message) {
        super(data, message);
        this.returnCode = 0;
        this.returnCode = 0;
    }
}
exports.ErrModel = ErrModel;
