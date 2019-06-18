const login = resolve => require(['@/containers/login'], resolve);
const resetPsd = resolve => require(['@/containers/resetPsd'], resolve);
const dishManagement = resolve => require(['@/containers/dishManagement'], resolve);
const dishCategory = resolve => require(['@/containers/dishCategory'], resolve);
const operateCategory = resolve => require(['@/containers/dishCategory/operateCategory'], resolve);
const operateDish = resolve => require(['@/containers/dishManagement/operateDish'], resolve);
const systemSettings = resolve => require(['@/containers/systemSettings'], resolve);
const ordersManagement = resolve => require(['@/containers/ordersManagement'], resolve);

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
        path: '/operateCategory',
        name: 'operateCategory',
        component: operateCategory
    },
	{
        path: '/operateDish',
        name: 'operateDish',
        component: operateDish
    },
	{
        path: '/systemSettings',
        name: 'systemSettings',
        component: systemSettings
    },
	{
        path: '/ordersManagement',
        name: 'ordersManagement',
        component: ordersManagement
    },
]
export default router;