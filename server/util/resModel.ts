class BaseModel {
    constructor(public data: object[], public message: string) {
    }
}

export class SucModel extends BaseModel {
    returnCode: number = 1;
    constructor(data: object[], message: string, public total?: number) {
        super(data, message);
        this.returnCode = 1;
        if (total !== undefined) {
            this.total = total;
        }
    }
}

export class ErrModel extends BaseModel {
    returnCode: number = 0;
    constructor(data: object[], message: string, returnCode?: number) {
        super(data, message);
        returnCode && (this.returnCode = returnCode);
    }
}
