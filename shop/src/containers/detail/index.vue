<script>
import Vue from "vue";
import Component from "vue-class-component";
import cart from "../../components/cart";
import handle from "../../components/cart/handle";
// import {  } from "./axios";

@Component({
    cart,
    handle
})
export default class CheckOrderDetail extends Vue {
    info = {};
    defaultPic = require("../../assets/images/noPic.jpg");
    goBack() {
        this.$router.go(-1);
    };
	render() {
		return (
            <div class="detail-container">
                <div class="content">
                    <div class="back-btn" onClick={this.goBack}>×</div>
                    <img src={this.info.mainImg ? `http://120.78.221.14:2233${this.info.mainImg}` : this.defaultPic} style="width: 100%;" />
                    <div class="literal-detail">
                        <p class="title">{this.info.title}</p>
                        <p class="sub-title">{this.info.subTitle}</p>
                        <div class="price-zone">
                            <span class={"price"}>￥{this.info.salePrice ? this.info.salePrice : this.info.price}</span>
                            {
                                this.info.salePrice
                                ?
                                <span class="sale-price">￥{this.info.price}</span>
                                :
                                <span></span>
                            }
                            <handle goods={this.info} mStyle={{width: "1.6rem", float: "right"}} />
                        </div>
                    </div>
                </div>
                <cart />
			</div>
		)
	};
	mounted() {
        let { info } = this.$route.params;
        this.info = info || {};
        console.log(info, 'info');    
	};
};
</script>
<style lang="less" scoped>
	.detail-container{
        font-size: .16rem;
		width: 100%;
		height: 100%;
		background: #F5F5F5;
		display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-between;
    }
    .content{
        flex: 1;
        width: 100%;
    }
    .literal-detail{
        width: 100%;
        box-sizing: border-box;
        padding: .2rem 5%;
        .title{
            font-size: .38rem;
            font-weight: bold;
        }
        .sub-title{
            margin-top: .1rem;
            line-height: .35rem;
            font-size: .24rem;
            color: #666;
        }
    }
    .price-zone{
        height: .4rem;
        margin-top: .3rem;
        line-height: .4rem;
    }
    .price{
		display: inline-block;
		margin-right: .16rem;
		font-size: .26rem;
		color: #FF4544;
	}
	.sale-price{
		color: rgba(0, 0, 0, 0.65);
		font-size: .2rem;
		text-decoration: line-through;
    }
    .back-btn{
        width: .4rem;
        height: .4rem;
        border-radius: .2rem;
        text-align: center;
        line-height: .36rem;
        font-size: .32rem;
        color: #FFF;
        background-color: rgba(0,0,0,.2);
        position: absolute;
        right: .2rem;
        top: .2rem;
    }
</style>