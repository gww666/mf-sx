import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import {handleData} from "../util";
import {RT_ORDER_LIST} from "../config/api";
Vue.use(Vuex);
export default new Vuex.Store({
	state: {
		settings: {
			itemCount: 4,//横屏模式下，每屏展示的数量
		},
		orderList: {}
	},
	getters: {
		getOrderList: state => {
			let arr = [];
			//拿出所有订单
			for (let key in state.orderList) {
				// let goodsArray = [];
				state.orderList[key].goodsArray.forEach(item => {
					let goodsArray = [];
					Object.keys(item.goods).forEach(goodsId => {
						goodsArray.push({
							...item.goods[goodsId],
							id: goodsId
						});
					});
					arr.push({
						baseInfo: item.baseInfo,
						goodsArray
					});
				});
			}
			//按照创建时间进行排序
			arr.sort((m, n) => {
				return (m.baseInfo.createDate - 0) < (n.baseInfo.createDate - 0);
			});
			return arr;
		}
	},
	mutations: {
		setOrderList(state, list) {
			state.orderList = list;
		},
		setItemCount(state, count) {
			state.settings = {
				...state.settings,
				itemCount: count
			}
		}	
	},
	actions: {
		async getOrderList({commit}, params) {
			let options = {
				url: RT_ORDER_LIST,
				params
			}
			let res = handleData(await axios(options));
			if (res) {
				commit("setOrderList", res[0]);
			}
			// return handleData(res);
		}
	},
	modules: {
	}
});