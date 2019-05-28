import Vue from "vue";
import Router from "vue-router";
import qxz from "./qxz";

const login = resolve => require(['@/containers/login'], resolve);

Vue.use(Router);

export default new Router({
    routes: [
        {
          path: '/',
          name: '/',
          redirect: '/login'
        },
        {
          path: '/login',
          name: 'login',
          component: login
        },
        ...qxz
    ]
})