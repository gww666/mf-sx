<template>
    <div class="handle-box" :style="mStyle">
        <span class="reduce" v-show="goodsCount" @click="reduceGoods">―</span>
        <span class="goods-count" v-show="goodsCount">{{goodsCount}}</span>
        <span class="add" @click="addGoods">+</span>

        <div class="options-shadow" @click.self="close" v-if="visible">
            <div class="options-box">
                <div class="options-title">
                    <div class="thumbnail-box">
                        <img :src="goods.thumbnail ? `http://120.78.221.14:2233${goods.thumbnail}` : defaultPic">
                    </div>
                    <p>{{goods.title}}</p>
                    <p class="sub-title">{{goods.subTitle}}</p>
                    <!-- <p class="close-btn" >×</p> -->
                </div>
                <div class="options-zone">
                    <div class="tag-title">偏好<span>（可多选）</span></div>
                    <div :class="isSelected(item) ? 'options choosen' : 'options'" v-for="item in goods.tag.split(',')" :key="item" @click="tagClick(item)">{{item}}</div>
                </div>
                <div class="opertion-bar">
                    <p class="price-zone">￥{{goods.price}}</p><p class="addToCart" @click="addToCart">选好了</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        mStyle: {
            type: Object,
            default: () => ({})
        },
        goods: {
            type: Object,
            default: () => ({})
        },
        fromCart: {
            type: Boolean,
            default: false
        },
        isOrderPage: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            visible: false,
            defaultPic: require("../../assets/images/noPic.jpg"),
            choosedTag: []
        }
    },
    computed: {
        goodsCount() {
            if (Object.keys(this.goods).length) {
                //根据id找到goodsList里对应的count数量
                let arr = [];
                let count = 0;
                this.$store.state.gw.goodsList.forEach(item => {
                    if(item.id === this.goods.id) {
                        if(this.isOrderPage) {
                            arr.push(item);
                        } else {
                            if(!item.tag && !this.goods.tag) arr.push(item);
                            if(item.tag && item.tag === this.goods.tag) arr.push(item);
                        }
                    }
                })
                if(arr.length) {
                    arr.forEach(item => {
                        count += item.count;
                    })
                    return count;
                }
            }
            return 0;
        }
    },
    methods: {
        addGoods() {
            if(this.fromCart) {
                this.$store.commit("gw/addGoods", this.goods);
                return;
            }
            if(this.goods.tag) {
                this.open();
            } else {
                this.$store.commit("gw/addGoods", this.goods);
            }
            this.$emit("add");
        },
        reduceGoods() {
            this.$store.commit("gw/reduceGoods", this.goods);
            this.$emit("reduce");
        },

        tagClick(item) {
            let choosed = false;
            for(let i = 0;i < this.choosedTag.length;i++) {
                if(item === this.choosedTag[i]) {
                    choosed = true;
                    this.choosedTag.splice(i, 1);
                    break;
                }
            }
            if(!choosed) {
                this.choosedTag.push(item);
            }
        },
        isSelected(item) {
            let choosed = false;
            for(let i = 0;i < this.choosedTag.length;i++) {
                if(item === this.choosedTag[i]) {
                    choosed = true;
                    break;
                }
            }
            return choosed;
        },
        open() {
            this.visible = true;
        },
        close() {
            this.visible = false;
        },
        addToCart() {
            let tagStr = "";
            this.choosedTag.forEach(item => {
                tagStr += `${item},`;
            });
            if(tagStr.length) {
                tagStr = tagStr.substr(0, tagStr.length - 1);
            }
            let obj = Object.assign({}, this.goods);
            obj.tag = tagStr;
            this.$store.commit("gw/addGoods", obj);
            this.close();
        }
    }
}
</script>
<style lang="scss" scoped>
.handle-box {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .reduce {
        box-sizing: border-box;
        width: 0.44rem;
        height: 0.44rem;
        border: 1px solid #FF0C00;
        border-radius: 50%;
        background: #fff;
        color: #FF0C00;
        font-size: 0.4rem;
        text-align: center;
        line-height: 0.44rem;
    }
    .add {
        box-sizing: border-box;
        width: 0.44rem;
        height: 0.44rem;
        border-radius: 50%;
        background: #FF0C00;
        color: #fff;
        font-size: 0.4rem;
        text-align: center;
        line-height: 0.42rem;
    }
    .goods-count {
        color: #999;
        font-size: 0.3rem;
        width: 0.5rem;
        text-align: center;
        
    }
    .options-shadow{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 3;
        background: rgba($color: #000000, $alpha: .6)
    }
    .options-box {
        width: 100%;
        height: 8rem;
        background: #FFF;
        position: absolute;
        left: 0;
        bottom: 0;
    }
    .opertion-bar{
        width: 100%;
        height: 0.88rem;
        display: flex;
        box-sizing: border-box;
        border-top: 1px solid rgba($color: #000000, $alpha: 0.1);
        .addToCart{
            width: 2.3rem;
            text-align: center;
            line-height: 0.88rem;
            height: 100%;
            font-size: .38rem;
            color: #FFF;
            // font-weight: bold;
            background: #FF0C00;
        }
        .price-zone{
            text-align: left;
            line-height: 0.88rem;
            flex: 1;
            box-sizing: border-box;
            padding-left: .2rem;
            font-size: .32rem;
            color: #FF0C00;
        }
    }
    .options-zone{
        width: 100%;
        height: 5.73rem;
        box-sizing: border-box;
        padding: .3rem;
        .tag-title{
            margin-bottom: 0.3rem;
            font-size: 0.3rem;
            margin-left: 0.2rem;
            span{
                color: #c44f6c;
            }
        }
    }
    .close-btn{
        font-size: .6rem;
        color: #999;
        font-weight: normal;
        width: .88rem;
        height: 100%;
        line-height: .80rem;
        position: absolute;
        right: 0;
        top: 0;
    }
    .options-title{
        width: 100%;
        height: 1.4rem;
        text-align: center;
        line-height: 0.7rem;
        // font-weight: bold;
        font-size: .3rem;
        position: relative;
        color: #3b3b3b;
        border-bottom: 1px solid #eaeaea;
        .thumbnail-box{
            width: 1.8rem;
            height: 1.8rem;
            border-radius: 0.2rem;
            overflow: hidden;
            border: 1px solid #FFF;
            position: absolute;
            left: 0.4rem;
            top: -0.6rem;
            img{
                width: 100%;
                height: 100%;
            }
        }
        p{
            width: 60%;
            height: 46%;
            margin-left: 2.4rem;
            text-align: left;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            color: #333333;
        }
        .sub-title{
            font-size: 0.26rem;
            color: rgba(0, 0, 0, 0.65);
        }
    }
    .options{
        min-width: 1.4rem;
        text-align: center;
        padding: 0 .2rem;
        float: left;
        height: 0.62rem;
        line-height: 0.62rem;
        border-radius: .31rem;
        margin: 0 .2rem;
        background: #F5F5F5;
        border: 1px solid transparent;
    }
    .choosen{
        border-color: #FF0C00;
        background: #FF0C00;
        color: #FFF;
    }
}
</style>

