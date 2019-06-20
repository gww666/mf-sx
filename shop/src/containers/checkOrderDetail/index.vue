<script>
import Vue from "vue";
import Component from "vue-class-component";
import { getOrderDetail } from "./axios";

@Component
export default class CheckOrderDetail extends Vue {
    goodsList = [];
    payment = 0;
    defaultPic = require("../../assets/images/noPic.jpg");
    goBack() {
        this.$router.go(-1);
    };
	render() {
		return (
            <div class="order-container">
                <div class="page-title">
                    订单详情
                </div>
                <div class="ul-title">
                    已点菜品：
                </div>
                <ul class="content-ul">
                    {
                        this.goodsList.map(item => (
                            <li class="goods-item">
                                <div class="content">
                                    <p class="title">{item.goodsTitle}</p>
                                    <p class="count"><span>×</span><span>{item.goodsCount}</span></p>
                                    <p class="price">￥{item.goodsPrice}</p>
                                </div>
                            </li>
                        ))
                    }
                </ul>
                <div class="payment-infos">
                    <p style="margin-right: .2rem;"><span>需要支付：</span><span>￥{this.payment}</span></p>
                    <div class="payment-btn">去结算</div>
                </div>
			</div>
		)
	};
	async mounted() {
        let orderNo = this.$route.params.orderNo;
        this.payment = this.$route.params.payment || 0;
		if(orderNo) {
            this.orderInfo = orderNo;
            try {
                let res = await getOrderDetail(orderNo);
                if(res.data.returnCode === 1) {
                    this.goodsList = res.data.data;
                }
            } catch(err) {
                console.log("获取订单详情err: ", err);
            };
        };
	};
};
</script>
<style lang="less" scoped>
	.order-container{
        font-size: .16rem;
		width: 100%;
		height: 100%;
		background: #F5F5F5;
		display: flex;
        // align-items: center;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
    }
    .page-title{
        width: 100%;
        height: .8rem;
        text-align: center;
        line-height: .8rem;
        font-size: .3rem;
        font-weight: bold;
        color: #FFF;
        background: #0af;
        background: linear-gradient(90deg, #0af, #0085ff);
    }
    .ul-title{
        font-size: .3rem;
        color: #333;
        box-sizing: border-box;
        padding: .2rem 5%;
    }
    .content-ul{
        flex: 1;
        overflow-y: scroll;
        width: 100%;
        box-sizing: border-box;
        padding: 0 5%;
    }
    .main-img{
		max-width: 100%;
		max-height: 1rem;
	}
	.goods-item{
		width: 100%;
		background: #FFF;
		display: flex;
		align-items: center;
		justify-content: space-between;
    }
	.content{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: .24rem 0;
		display: flex;
        justify-content: space-between;
        color: #333;
	}
	.title{
		flex: 1;
		font-size: .28rem;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.sub-title{
		width: 100%;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		margin-top: .1rem;
		font-size: .2rem;
		color: rgba(0, 0, 0, 0.65);
	}
	.price{
        width: 1.8rem;
        text-align: right;
		font-size: .26rem;
    }
    .count{
        width: .8rem;
        text-align: right;
    }
    .payment-infos{
        width: 100%;
        height: .8rem;
        line-height: .8rem;
        text-align: right;
        font-size: .3rem;
        color: #FFF;
        background: rgba(61,61,63,.9);
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .payment-btn{
        width: 2.6rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #38ca73;
    }
</style>