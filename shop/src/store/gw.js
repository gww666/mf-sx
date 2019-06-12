export default {
    namespaced: true,
    state: {
        //维护的菜品数组
        goodsList: [
            {
                id: "232",
                title: "辣椒炒肉",
                price: "26.00",
                salePrice: "24.00",
                count: 1
            },
            {
                id: "231",
                title: "小鸡炖蘑菇",
                price: "56.00",
                salePrice: "",
                count: 1
            },
            {
                id: "233",
                title: "炸花生米",
                price: "12.00",
                count: 2
            },
        ]
    },
    getters: {

    },
    mutations: {
        addGoods(state, goods) {
            //查找是否已存在菜品
            let index = state.goodsList.findIndex(item => item.id === goods.id);
            if (index > -1) {
                //存在，数量加1
                state.goodsList[index].count += 1;
            } else {
                //不存在，添加到数组开头
                state.goodsList.unshift({
                    ...goods,
                    count: 1
                });
            }
        },
        reduceGoods(state, goods) {
            let index = state.goodsList.findIndex(item => item.id === goods.id);
            if (index === -1) return console.warn("菜品数组中没有该商品");
            if (state.goodsList[index].count === 1) {
                //数量为1，代表从数组中删除该菜品
                state.goodsList.splice(index, 1);
            } else {
                //数量减1
                state.goodsList[index].count -= 1;
            }
        }
    },
    actions: {

    }
}