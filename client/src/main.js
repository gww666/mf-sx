import Vue from "vue";
import App from "./App.vue";

import router from "./router";
import store from './store';
import "./assets/css/reset.css";
import 'ant-design-vue/dist/antd.css';
Vue.config.productionTip = false;
import domain from "./utils/domain";
import { autoLogin } from "./utils/autoLogin";

async function createApp () {
    if (localStorage.getItem("sessionId")) {
        try {
            let res = await autoLogin();
            if (res.data.returnCode === 1) {
                store.dispatch("qxz/updateUserInfo", res.data.data[0]);
                localStorage.setItem("sessionId", res.data.data[0].sessionId);
            } else {
                store.dispatch("qxz/updateUserInfo", {});
                localStorage.setItem("sessionId", "");
            };
        } catch (err) {
            console.log("自动登录", err);
        };
    };
    domain();
    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app')
};
createApp();