"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseModel {
    constructor(data, message) {
        this.data = data;
        this.message = message;
    }
}
class SucModel extends BaseModel {
    constructor(data, message, total) {
        super(data, message);
        this.total = total;
        this.returnCode = 1;
        this.returnCode = 1;
        if (total !== undefined) {
            this.total = total;
        }
    }
}
exports.SucModel = SucModel;
class ErrModel extends BaseModel {
    constructor(data, message, returnCode) {
        super(data, message);
        this.returnCode = 0;
        returnCode && (this.returnCode = returnCode);
    }
}
exports.ErrModel = ErrModel;
