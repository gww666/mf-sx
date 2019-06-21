const orderPage = resolve => require(['@/containers/orderPage'], resolve);
const scanPage = resolve => require(['@/containers/scanPage'], resolve);
const choicesPage = resolve => require(['@/containers/choicesPage'], resolve);
const checkOrderDetail = resolve => require(['@/containers/checkOrderDetail'], resolve);
const detail = resolve => require(['@/containers/detail'], resolve);

const router = [
    {
        path: '/scanPage',
        name: 'scanPage',
        component: scanPage
    },
	{
        path: '/orderPage',
        name: 'orderPage',
        component: orderPage
    },
	{
        path: '/choicesPage',
        name: 'choicesPage',
        component: choicesPage
    },
	{
        path: '/checkOrderDetail',
        name: 'checkOrderDetail',
        component: checkOrderDetail
    },
	{
        path: '/detail',
        name: 'detail',
        component: detail
    }
]
export default router;