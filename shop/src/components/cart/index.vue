<template>
    <div class="cart-box" >
        <div class="left">
            <div class="cart-o-circle" @click="showGoodsList">
                <span class="cart-i-circle">
                    <span class="iconfont icon-cart"></span>
                    <!-- 数量 -->
                    <span class="cart-count">{{cartCount}}</span>
                </span>
            </div>
            <span class="msg" :style="{color: cartCount ? '#ff4d4d' : '#999999'}">{{msg}}</span>
        </div>
        <div class="right" @click="pay" 
            :style="{background: cartCount ? '#ff4d4d' : '#e6e6e6', color: cartCount ? '#fff' : '#999999'}">
            <span>去下单</span>
        </div>
        <div class="cart-cover">
            <!-- 点餐车菜品列表 -->
            <div class="goods-list">
                <!-- 每个菜品项 -->
                <div class="goods-item" v-for="(item, index) in transList" :key="'goods-item-' + index">
                    <span class="title">{{item.title}}</span>
                    <div class="price-box">
                        <span class="sale-price">{{item.salePrice || item.price}}</span>
                        <span class="price" v-if="item.salePrice">{{item.price}}</span>
                    </div>
                    <handle-box :mStyle="{flex: 1}" :goods="item" @reduce="reduceGoods" :fromCart="true"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import HandleBox from "./handle";
export default {
    props: {
        
    },
    data() {
        return {
            count: 0
        }
    },
    computed: {
        //菜品列表
        goodsList() {
            return this.$store.state.gw.goodsList;
        },
        transList() {
            return this.goodsList.map(item => {
                return {
                    ...item,
                    price: "￥" + item.price,
                    salePrice: item.salePrice ? "￥" + item.salePrice : ""
                }
            });
        },
        //购物车数量
        cartCount() {
            let totalCount = 0;
            this.goodsList.forEach(item => {
                totalCount += item.count;
            });
            return totalCount;
        },
        //信息展示
        msg() {
            if (this.cartCount) {   
                //计算总价
                let totalPrice = 0;
                this.goodsList.forEach(item => {
                    let price = item.salePrice || item.price;
                    totalPrice += (Number(price) * item.count);
                });
                return "￥" + totalPrice.toFixed(2);
            } else {
                return "点餐车空空如也";
            }
        },
        // 就餐流程
        // 1先付款，2先就餐
        processType() {
            return this.$store.state.qxz.processType;
        }
    },
    methods: {
        //支付按钮（去下单）
        async pay() {
            if (!this.cartCount) return;
            if (this.processType === 1) {
                //先付款，直接走支付流程
            } else if (this.processType === 2) {
                //先就餐, 先提交订单，暂不支付
                let data = await this.$store.dispatch("gw/addOrder");
                //清除购物车数据
                this.$store.commit("gw/clearCart");
                //将订单信息存储到vuex中
                this.$store.commit("qxz/updateUnfinishedOrder", data[0]);
                this.$router.push({name: "info"})
            }
            
            
        },
        //生成订单
        generateOrder() {

        },
        showGoodsList() {
            //点餐车数量为0，不展示点餐车菜品列表
            if (!this.cartCount) return;
            let cover = document.querySelector(".cart-box .cart-cover");
            let list = document.querySelector(".cart-cover .goods-list");
            if (this.coverVisible) {
                this.coverVisible = false;
                cover.style.display = "none";
                return;
            }
            //cover的高度：页面高度-购物车盒子的高度
            let pageHeight = document.documentElement.offsetHeight;
            let cartBox = document.querySelector(".cart-box");
            let cartBoxHeight = window.getComputedStyle(cartBox, null).height.slice(0, -2);
            let coverHeight = pageHeight - cartBoxHeight;
            //设置cover的样式
            cover.style.height = coverHeight + "px";
            cover.style.display = "flex";
            cover.style.top = -coverHeight + "px";
            //置一个标志
            this.coverVisible = true;
        },
        reduceGoods() {
            if (!this.cartCount) {
                let cover = document.querySelector(".cart-box .cart-cover");
                cover.style.display = "none";
                this.coverVisible = false;
            }
        }
    },
    components: {
        HandleBox
    }
    
}
</script>
<style lang="scss" scoped>
.cart-box {
    width: 100%;
    height: 0.88rem;
    background: #fff;
    display: flex;
    position: relative;

    .left {
        flex: 1;
        height: 100%;
        background: #f2f2f2;
        display: flex;
        align-items: center;

        .cart-o-circle {
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: translateY(-30%);
            margin-left: 0.3rem;
            position: relative;
            z-index: 1;

            .cart-i-circle {
                width: 0.9rem;
                height: 0.9rem;
                border-radius: 50%;
                background: #e6e6e6;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;

                .iconfont {
                    font-size: 0.4rem;
                    color: #999999;
                }

                .cart-count {
                    position: absolute;
                    font-size: 12px;
                    background: #ff4d4d;
                    color: #fff;
                    width: 0.4rem;
                    height: 0.4rem;
                    border-radius: 50%;
                    // line-height: 0.4rem;
                    // text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    right: -0.05rem;
                    top: -0.05rem;
                }
            }
        }

        .msg {
            font-size: 0.3rem;
            color: #999999;
            margin-left: 0.3rem;
        }
    }
    .right {
        width: 2.3rem;
        height: 100%;
        font-size: 0.4rem;
        // font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #e6e6e6;
        color: #999999;
    }

    .cart-cover {
        position: absolute;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        width: 100%;
        // display: flex;
        align-items: flex-end;

        .goods-list {
            max-height: 70%;
            overflow-y: auto;
            background: #fff;
            width: 100%;
            
            .goods-item {
                width: 100%;
                height: 1rem;
                font-size: 0.3rem;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                padding: 0.2rem;
                border-bottom: 1px solid #f2f2f2;

                .title {
                    width: 35%;
                }
                .price-box {
                    // color: 
                    width: 40%;
                    .price {
                        color: #999;
                        text-decoration: line-through;
                        font-size: 12px;
                    }
                    .sale-price {
                        color: #ff4d4d;
                    }
                }
            }

            
        }
    }
}
</style>

