<template>
    <div class="order-item-box" :style="horizontal ? itemStyle : {}">
        <div class="header">
            <div class="top">
                <span class="tableNo">桌号：{{baseInfo.tableNo}}</span>
                <span class="note">备注：{{baseInfo.note}}</span>
            </div>
            <div class="bottom">
                <span class="note">时间：{{baseInfo.time}}</span>
            </div>
        </div>
        <div class="dish-box">
            <div class="dish-item" v-for="(item, index) in goodsList" :key="'dish-item-' + index">
                <span class="title">
                    {{item.title}}
                    <font class="note">
                        【{{item.note}}】
                    </font>
                </span>
                <span class="count">
                    {{item.count}}
                </span>
                
            </div>
            <span class="iconfont icon-xiala" v-if="hasMore"></span>
        </div>
    </div>
</template>
<script>
import {rem2px} from "../../util";
export default {
    props: {
        order: {
            type: Object,
            default: () => ({})
        },
        itemStyle: {
            type: Object,
            default: () => ({
                width: "",
                height: ""
            })
        },
        horizontal: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            
        }
    },
    computed: {
        baseInfo() {
            return this.order.baseInfo || {};
        },
        originGoodsArray() {
            return this.order.goodsArray || [];
        },
        goodsList() {
            // return this.order.goodsArray || [];
            return this.order.showArray || [];
        },
        //是否展示下拉按钮
        hasMore() {
            return this.originGoodsArray.length > this.goodsList.length;
        },
        settings() {
            return this.$store.state.settings;
        },
        //横屏模式下，单个菜单能展示的菜品数量
        dishBoxItemCount() {

        }
    },
    methods: {
        resetStyle() {
            let width = document.documentElement.offsetWidth;
            // console.log("width", width);
            if (width >= 640) {
                // console.log("width", width);
                //只有大于这个临界值，才会认为是横屏模式
                this.horizontal = true;
                const {itemCount} = this.settings;
                switch (itemCount) {
                    case 4:
                        this.itemStyle = {
                            width: "49%",
                            height: "48%",
                        };
                        break;
                    case 9:
                        this.itemStyle = {
                            width: "33.33%",
                            height: "50%",
                        };
                        break;
                }
                //计算一个菜单能放置几道菜
                //获取dish-box的高度
                let dishBox = document.querySelector(".dish-box");
                // console.log("dishBox", dishBox);
                
                let dishBoxHeight = window.getComputedStyle(dishBox, null).height.slice(0, -2);
                console.log("dishBoxHeight", dishBoxHeight);
                //获取一道菜的高度
                let dishItem = document.querySelector(".dish-item");
                // console.log("dishItem", dishItem);
                let dishItemHeight = window.getComputedStyle(dishItem, null).height.slice(0, -2);
                console.log("dishItemHeight", dishItemHeight);
                let count = Math.ceil(dishBoxHeight / dishItemHeight);
                let marginBottom = rem2px(0.2);
                let realHeight = count * dishItemHeight + (count - 1) * marginBottom;
                if (dishItemHeight < realHeight) {
                    count -= 1;
                }
                console.log("能展示的数量", count);
            } else {
                this.horizontal = false;
            }
        },
        resize() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.timer = setTimeout(() => {
                this.resetStyle();
            }, 500);
        },
        addListener() {
            window.addEventListener("resize", this.resize, false);
        },
        removeListener() {
            window.removeEventListener("resize", this.resize, false);
        }
    },
    created() {
        
    },
    mounted() {
        // this.addListener();
        //设置样式
        // this.resetStyle();
    }
}
</script>

<style lang="scss" scoped>
.order-item-box {
    width: 100%;
    background: #fff;
    // background: #e0e0e0;
    // background: #f1f1f1;
    font-size: 0.3rem;
    border-radius: 5px;
    display: flex;
    flex-flow: column nowrap;
    // justify-content: center;
    

    .header {
        border-bottom: 1px solid #999;
        padding: 0.1rem 0.2rem;
        // height: 0.8rem;
        // display: flex;
        // align-items: center;
        
        
        .top {
            display: flex;
            align-items: center;
            font-weight: bold;
            
            .note {
                margin-left: 0.5rem;
            }
        }

        .bottom {
            font-size: 0.2rem;

        }


        
    }
    .dish-box {
        // padding: 0 0.2rem;
        padding: 0.2rem;
        flex: 1;
        display: flex;
        flex-flow: column nowrap;
        // justify-content: center;
        // display: flex
        position: relative;

        .dish-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.2rem;
            

            .title {
                border: 1px solid #e0e0e0;
                // border: 1px solid #999;
                border-radius: 0.2rem;
                padding: 3px 0.3rem;

                .note {

                }
            }
            .count {
                font-weight: bold;
            }
            
        }
        

        .dish-item:last-of-type {
            margin-bottom: 0;
        }

        .icon-xiala {
            // display: block;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            font-weight: bold;

        }

    }
}
</style>

