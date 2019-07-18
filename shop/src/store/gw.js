import axios from "../utils/_axios";

const handleData = (data) => {
    if (data.data.returnCode === 1) {
        return data.data.data;
    } else {
        console.log(data.data.message);
        return;
    }
}

export default {
    namespaced: true,
    state: {
        //维护的菜品数组
        goodsList: []
    },
    getters: {

    },
    mutations: {
        addGoods(state, goods) {
            let isSame = false;
            state.goodsList.forEach(item => {
                let tempSame = true;
                if(item.id === goods.id) {
                    if(item.tag && goods.tag) {
                        let arr1 = item.tag.split(",");
                        let arr2 = goods.tag.split(",");
                        if(arr1.length === arr2.length) {
                            arr1.forEach(ele => {
                                let tagSame = false;
                                arr2.forEach(element => {
                                    if(ele === element) {
                                        tagSame = true;
                                    }
                                })
                                if(!tagSame) {
                                    tempSame = false;
                                }
                            })
                        }else {
                            tempSame = false;
                        }
                    } else {
                        tempSame = false;
                    }
                    if(!item.tag && !goods.tag) {
                        tempSame = true;
                    }
                }else {
                    tempSame = false;
                }
                if(tempSame) {
                    isSame = true;
                    item.count += 1;
                }
            })
            if(!isSame) {
                //不存在，添加到数组开头
                state.goodsList.unshift({
                    ...goods,
                    count: 1
                });
            }
            //查找是否已存在菜品
            // let index = state.goodsList.findIndex(item => item.id === goods.id);
            // if (index > -1) {
            //     //存在，数量加1
            //     state.goodsList[index].count += 1;
            // } else {
            //     //不存在，添加到数组开头
            //     state.goodsList.unshift({
            //         ...goods,
            //         count: 1
            //     });
            // }
        },
        reduceGoods(state, goods) {
            let index;
            if(goods.tag) {
                index = state.goodsList.findIndex(item => item.id === goods.id && item.tag === goods.tag);
            } else {
                index = state.goodsList.findIndex(item => item.id === goods.id && !item.tag);
            }
            if (index === -1) return console.warn("菜品数组中没有该商品");
            if (state.goodsList[index].count === 1) {
                //数量为1，代表从数组中删除该菜品
                state.goodsList.splice(index, 1);
            } else {
                //数量减1
                state.goodsList[index].count -= 1;
            }
        },
        clearCart(state) {
            state.goodsList = [];
        }
    },
    actions: {
        //插入订单
        async addOrder({state, rootState}) {
            let options = {
                url: "/api/addOrder",
                method: "post",
                data: {
                    companyId: 1,
                    tableNo: 3,
                    foodType: 1,
                    goods: state.goodsList.map(item => {
                        return {
                            goodsId: item.id,
                            title: item.title,
                            price: item.salePrice || item.price,
                            count: item.count,
                            img: item.thumbnail || item.mainImg,
                            tag: item.tag
                        }
                    }),
                    orderNo: rootState.qxz.unfinishedOrder.orderNo
                }
            };
            let data = await axios(options);
            return handleData(data);
        },
        //测试一下
        async mt() {
            let options = {
                url: "/api/resetTableNo",
                method: "get",
                params: {
                    orderNo: "23ewfdwedgf43",
                    tableNo: "A-4"
                }
            };
            await axios(options);
        }
    }
}