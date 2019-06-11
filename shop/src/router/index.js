import Vue from "vue";
import Router from "vue-router";
import qxz from "./qxz";

Vue.use(Router);

export default new Router({
    routes: [
        ...qxz
    ]
});