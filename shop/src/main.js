import Vue from "vue";
import App from "./App.vue";

import "./assets/reset.css";
import router from "./router";
import store from "./store";
import _axios from "./utils/_axios";

Vue.config.productionTip = false;

async function createApp () {
    try {
        let options = {
            url: `/api/getSettings?companyId=${1}`,
            method: "GET"
        };
        let res = await _axios(options);
        if(res.data.returnCode === 1) {
            let data = res.data.data[0];
            store.commit("qxz/updateTypes", data);

            new Vue({
                router,
                store,
                render: h => h(App)
            }).$mount("#app");
        } else {
            console.log("获取系统设置err");
        };
    } catch (err) {
        console.log("获取系统设置err", err);
    };
};
createApp();
