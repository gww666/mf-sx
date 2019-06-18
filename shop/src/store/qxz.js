export default {
    namespaced: true,
    state: {
        // 就餐流程
        processType: 2,
        // 厨房接单方式
        noticeType: 0
    },
    getters: {

    },
    mutations: {
        updateTypes(state, params) {
            state.processType = params.processType;
            state.noticeType = params.noticeType;
        }
    },
    actions: {

    }
}