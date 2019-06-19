import Cart from "../components/cart";
// import Test from "../containers/Test";
const Info = () => import("../containers/info");
export default [
    {
        path: "/cart",
        name: "cart",
        component: Cart
    },
    // {
    //     path: "/test",
    //     name: "test",
    //     component: Test
    // },
    {
        path: "/info",
        name: "info",
        component: Info
    },
]