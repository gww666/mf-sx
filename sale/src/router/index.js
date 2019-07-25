import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import User from "../containers/user";
import Add from "../containers/companyInfo/add";
import Login from "../containers/login";
import Customer from "../containers/customer";

export default new Router({
    routes: [
        {
            path: '/user',
            component: User
        },
        {
            path: '/add',
            name: "add",
            component: Add
        },
        {
            path: '/login',
            name: "login",
            component: Login
        },
        {
            path: '/customer',
            name: "customer",
            component: Customer
        },
    ]
});