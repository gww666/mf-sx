export default {
    namespaced: true,
    state: {
		// 用户信息
		userInfo: {}
	},
	getters: {
		getUserInfo(state) {
			return state.userInfo;
		}
	},
	actions: {
		updateUserInfo({commit}, userInfo) {
			commit("setUserInfo", userInfo);
		}
	},
	mutations: {
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo;
		}
	},
}