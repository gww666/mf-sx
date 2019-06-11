const orderPage = resolve => require(['@/containers/orderPage'], resolve);

const router = [
	{
        path: '/orderPage',
        name: 'orderPage',
        component: orderPage
    }
]
export default router;