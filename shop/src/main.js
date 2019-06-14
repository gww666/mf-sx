import Vue from "vue";
import App from "./App.vue";

import "./assets/reset.css";
import router from "./router";
import store from "./store";
import _axios from "./utils/_axios";

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");