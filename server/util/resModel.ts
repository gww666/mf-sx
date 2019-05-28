class BaseModel {
    constructor(public data: object[], public message: string) {
    }
}

export class SucModel extends BaseModel {
    returnCode: number = 1;
    constructor(data: object[], message: string) {
        super(data, message);
        this.returnCode = 1
    }
}

export class ErrModel extends BaseModel {
    returnCode: number = 0;
    constructor(data: object[], message: string) {
        super(data, message);
        this.returnCode = 0
    }
}
