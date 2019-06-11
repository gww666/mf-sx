import axios from 'axios';
axios.defaults.withCredentials = true;

// http request 拦截器
/* 拦截器 */
axios.interceptors.request.use(
	config => {
		config.headers.sessionId = "mfurd1";
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
		return response;
	},
	err => {
		return Promise.reject(err);
    }
);
export default axios;