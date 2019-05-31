import axios from 'axios';
import router from '../router'
axios.defaults.withCredentials = true;

import { message } from "ant-design-vue";

// http request 拦截器
/* 拦截器 */
axios.interceptors.request.use(
	config => {
        config.headers.sessionId = localStorage.getItem("sessionId");
		return config;
	},
	err => {
		return Promise.reject(err);
    }
);
// http response 拦截器
axios.interceptors.response.use(
	response => {
		/* 代码写这里 */
		if (response.data.returnCode === 401) {
			message.success("登录信息失效，请重新登录");
			router.replace({name: "login"});
		}
		return response;
	},
	err => {
		return Promise.reject(err);
    }
);
export default axios;