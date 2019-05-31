const login = resolve => require(['@/containers/login'], resolve);
const resetPsd = resolve => require(['@/containers/resetPsd'], resolve);
const dishManagement = resolve => require(['@/containers/dishManagement'], resolve);
const dishCategory = resolve => require(['@/containers/dishCategory'], resolve);
const operateDish = resolve => require(['@/containers/dishCategory/operateDish'], resolve);

const router = [
	{
        path: '/login',
        name: 'login',
        component: login
    },
	{
        path: '/resetPsd',
        name: 'resetPsd',
        component: resetPsd
    },
	{
        path: '/dishManagement',
        name: 'dishManagement',
        component: dishManagement
    },
	{
        path: '/dishCategory',
        name: 'dishCategory',
        component: dishCategory
    },
	{
        path: '/operateDish',
        name: 'operateDish',
        component: operateDish
    },
]
export default router;