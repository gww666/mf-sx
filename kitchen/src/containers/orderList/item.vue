<template>
    <div class="order-item-box" :style="horizontal ? itemStyle : {}">
        <div class="header">
            <span class="tableNo">桌号：{{baseInfo.tableNo}}</span>
            <span class="note">备注：{{baseInfo.note}}</span>
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
        </div>
    </div>
</template>
<script>
export default {
    props: {
        order: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            itemStyle: {
                width: "",
                height: ""
            },
            horizontal: false
        }
    },
    computed: {
        baseInfo() {
            return this.order.baseInfo || {};
        },
        goodsList() {
            return this.order.goodsArray || [];
        },
        settings() {
            return this.$store.state.settings;
        }
    },
    methods: {
        resetStyle() {
            let width = document.documentElement.offsetWidth;
            // console.log("width", width);
            if (width > 640) {
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
        //设置样式
        this.resetStyle();
    },
    mounted() {
        this.addListener();
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
    

    .header {
        border-bottom: 1px solid #999;
        padding: 0 0.2rem;
        height: 0.8rem;
        display: flex;
        align-items: center;
        font-weight: bold;

        .note {
            margin-left: 0.5rem;
        }
    }
    .dish-box {
        padding: 0.4rem 0.2rem;

        .dish-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.2rem;

            .title {
                border: 1px solid #e0e0e0;
                // border: 1px solid #999;
                border-radius: 0.2rem;
                padding: 0.1rem 0.3rem;

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

    }
}
</style>

