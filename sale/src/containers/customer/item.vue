<template>
    <div class="customer-item-box">
        <div class="basic-info">
            <div class="top">
                <!-- 姓名 -->
                <span class="name">{{info.name}}</span>
                
                <!-- 日期 -->
                <span class="date">{{info.verifyDate}}</span>
            </div>
            <div class="bottom">
                <div class="mobile-box">
                    <span class="mobile">{{info.mobile}}</span>
                    <!-- 没有推荐人就在这里显示电话小图标 -->
                    <a :href="'tel:' + info.originData.mobile">
                        <img src="../../../public/images/phone.png">
                    </a>
                </div>
                
                <span class="state" 
                    :style="{color: '#1db3f7'}">
                    当前状态：{{info.actName || "暂无"}}
                </span>
            </div>
        </div>
        <!-- 如果有推荐人就展示 -->
        <div class="referrer-info" v-if="info.referrer">
            <div class="content">
                <span>
                    推荐人：{{info.referrer}}
                </span>
                <a :href="'tel:' + info.referrerMobile">
                    <img src="../../../public/images/phone.png">
                </a>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    props: {
        info: {
            type: Object,
            default: () => {}
        },
        isLastItem: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            
        }
    },
    methods: {
        //打电话
        call(tel) {

        }
    }
}
</script>
<style lang="scss" scoped>
.customer-item-box {
    background-color: white;

    .basic-info {
        height: 1.3rem;
        margin-top: 0.2rem;
        padding: 0 0.5rem;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-evenly;
        // align-content: center;

        .top {
            display: flex;
            align-items: center;
            // height: 50%;

            .name {
                color: #333;
                font-size: 0.3rem;
                width: 1.8rem;
            }
            
            .star-box {
                display: flex;
                // margin-bottom: 0.16rem;
                flex: 1;
                height: 0.3rem;

                img {
                    width: 0.3rem;
                    height: 0.3rem;
                    margin-right: 3px;
                }
            }

            .date {
                color: #666;
                font-size: 0.26rem;
            }
            
        }

        .bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            // height: 50%;
            .mobile-box {
                display: flex;
                align-items: center;

                a {
                    display: block;
                    margin-left: 0.2rem;
                    width: 0.44rem;
                    height: 0.44rem;
                }
                img {
                    width: 100%;
                    height: 100%;
                    display: block;
                }
            }
            .mobile {
                color: #1db3f7;
                font-size: 0.26rem;
            }

            .state {
                font-size: 0.24rem;
            }
            
        }
    }
    .referrer-info {
        border-top: dashed 1px #d9d9d9;
        height: 0.8rem;
        font-size: 0.26rem;
        color: #808080;

        .content {
            width: 100%;
            height: 100%;
            padding: 0 0.5rem;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            a {
                display: block;
                margin-left: 0.2rem;
                width: 0.44rem;
                height: 0.44rem;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>

