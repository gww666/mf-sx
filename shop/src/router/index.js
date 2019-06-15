import Vue from "vue";
import Router from "vue-router";
import qxz from "./qxz";
import gw from "./gw";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: '/',
            redirect: '/scanPage'
        },
        ...qxz,
        ...gw
    ]
});