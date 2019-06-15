const orderPage = resolve => require(['@/containers/orderPage'], resolve);
const scanPage = resolve => require(['@/containers/scanPage'], resolve);
const choicesPage = resolve => require(['@/containers/choicesPage'], resolve);

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
    }
]
export default router;