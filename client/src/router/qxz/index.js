// 登录
const login = resolve => require(['@/containers/login'], resolve);
const resetPsd = resolve => require(['@/containers/resetPsd'], resolve);
// 菜品分类
const dishCategory = resolve => require(['@/containers/dishCategory'], resolve);
// 菜品分类新增、编辑
const operateCategory = resolve => require(['@/containers/dishCategory/operateCategory'], resolve);
// 菜品管理
const dishManagement = resolve => require(['@/containers/dishManagement'], resolve);
// 菜品新增、编辑
const operateDish = resolve => require(['@/containers/dishManagement/operateDish'], resolve);
// 系统设置
const systemSettings = resolve => require(['@/containers/systemSettings'], resolve);
// 订单管理
const ordersManagement = resolve => require(['@/containers/ordersManagement'], resolve);
// 数据统计
const statistics = resolve => require(['@/containers/statistics'], resolve);

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
	{
        path: '/statistics',
        name: 'statistics',
        component: statistics
    },
]
export default router;