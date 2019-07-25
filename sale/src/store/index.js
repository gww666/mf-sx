import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import {handleData} from "../util";
import {COMPANY_INFO_LIST, SALE_LOGIN_BY_PWD} from "../config/api";
Vue.use(Vuex);
export default new Vuex.Store({
	state: {
		
	},
	getters: {
		
	},
	mutations: {
		
	},
	actions: {
		async getCompanyInfoList({state}, params) {
			let options = {
				url: COMPANY_INFO_LIST,
				headers: {
					sessionId: localStorage.getItem("sessionId")
				},
				params
			}
			let data = await axios(options);
			return handleData(data);
		},
		// 营销人员登录接口
		async saleLoginByPwd({state}, params) {
			let options = {
				url: SALE_LOGIN_BY_PWD,
				method: "post",
				data: params
			}
			let data = await axios(options);
			return handleData(data);
		}
	},
	modules: {
	}
});