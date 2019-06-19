export default {
    namespaced: true,
    state: {
        // 就餐流程
        processType: 2,
        // 厨房接单方式
        noticeType: 0,
        // 企业id
        companyId: 0,
        // 桌号
        tableNo: "",
        // 未完订单信息
        unfinishedOrder: {}
    },
    getters: {

    },
    mutations: {
        updateTypes(state, params) {
            state.processType = params.processType;
            state.noticeType = params.noticeType;
        },
        updateIdNo(state, params) {
            state.companyId = params.companyId;
            state.tableNo = params.tableNo;
        },
        updateUnfinishedOrder(state, unfinishedOrder) {
            state.unfinishedOrder = unfinishedOrder;
        },
    },
    actions: {

    }
}