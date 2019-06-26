
export const tableColumns = [
    {
        title: "订单号",
        dataIndex: "orderNo",
        key: "orderNo"
    },
    {
        title: "餐桌号",
        dataIndex: "tableNo",
        key: "tableNo"
    },
    {
        title: "实付金额",
        dataIndex: "payment",
        key: "payment"
    },
    {
        title: "订单状态",
        dataIndex: "status",
        key: "status"
    },
    {
        title: "创建时间",
        dataIndex: "createDate2",
        key: "createDate2"
    },
    {
        title: "修改时间",
        dataIndex: "updateDate",
        key: "updateDate"
    },
    {
        title: "支付时间",
        dataIndex: "paymentDate",
        key: "paymentDate"
    }
];
export const rtTableColumns = [
    {
        title: "订单号",
        dataIndex: "orderNo",
        key: "orderNo"
    },
    {
        title: "餐桌号",
        dataIndex: "tableNo",
        key: "tableNo"
    },
    {
        title: "下单时间",
        dataIndex: "createDate",
        key: "createDate"
    }
];

export const detailTableColumn = [
    {
        title: "商品",
        dataIndex: "title",
        key: "title",
        width: "120px"
    },
    {
        title: "数量",
        dataIndex: "count",
        key: "count",
        width: "120px"
    },
    {
        title: "价格",
        dataIndex: "price",
        key: "price",
        width: "120px"
    }
]
export const staticDetailTableColumn = [
    {
        title: "商品",
        dataIndex: "goodsTitle",
        key: "goodsTitle",
        width: "120px"
    },
    {
        title: "数量",
        dataIndex: "goodsCount",
        key: "goodsCount",
        width: "120px"
    },
    {
        title: "价格",
        dataIndex: "goodsPrice",
        key: "goodsPrice",
        width: "120px"
    }
]

// this.rtOrder = [{
//     orderNo: "121315467843526",
//     payment: 15.60,
//     tableNo: 2,
//     createDate: "2019-06-22 17:53:50",
//     updateDate: "2019-06-22 17:53:50",
//     orderList: [
//         {
//             createDate: "2019-06-22 18:20:08",
//             updateDate: "2019-06-22 18:20:08",
//             goods: [
//                 {count: 1, price: 15.00, title: "炒鸡蛋"},
//                 {count: 1, price: 15.00, title: "炒鸭蛋"},
//                 {count: 1, price: 15.00, title: "炒鹅蛋"},
//             ]
//         },
//         {
//             createDate: "2019-06-22 18:20:08",
//             updateDate: "2019-06-22 18:20:08",
//             goods: [
//                 {count: 1, price: 15.00, title: "炒鸡蛋"},
//                 {count: 1, price: 15.00, title: "炒鸭蛋"},
//                 {count: 1, price: 15.00, title: "炒鹅蛋"},
//             ]
//         },
//         {
//             createDate: "2019-06-22 18:20:08",
//             updateDate: "2019-06-22 18:20:08",
//             goods: [
//                 {count: 1, price: 15.00, title: "炒鸡蛋"},
//                 {count: 1, price: 15.00, title: "炒鸭蛋"},
//                 {count: 1, price: 15.00, title: "炒鹅蛋"},
//             ]
//         }
//     ]
// }];