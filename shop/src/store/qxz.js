export default {
    namespaced: true,
    state: {
        //付款方式
        processType: "",
        // 厨房接单方式
        noticeType: ""
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