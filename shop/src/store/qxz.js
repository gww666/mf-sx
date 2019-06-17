export default {
    namespaced: true,
    state: {
        // 就餐流程
        processType: 0,
        // 厨房接单方式
        noticeType: 0,
        // 企业id
        companyId: 0,
        // 桌号
        tableNum: ""
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
            state.tableNum = params.tableNum;
        },
    },
    actions: {

    }
}