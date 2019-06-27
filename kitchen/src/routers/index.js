import Router from "vue-router";
import Vue from "vue";
Vue.use(Router);
const Login = () => import("../containers/login");
const OrderList = () => import("../containers/orderList");
export default new Router({
    routes: [
        {
            path: "/",
            component: Login
        },
        {
            path: "/orderList",
            component: OrderList
        }
        // {
        //     path: "/settings",
        //     component: Settings
        // }
    ]
});