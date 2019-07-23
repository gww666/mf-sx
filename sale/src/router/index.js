import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import User from "../containers/user";
import Add from "../containers/companyInfo/add";

export default new Router({
    routes: [
        {
            path: '/',
            component: User
        },
        {
            path: '/add',
            name: "add",
            component: Add
        },
    ]
});