import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import User from "../containers/user";

export default new Router({
    routes: [
        {
            path: '/',
            component: User
        },
    ]
});