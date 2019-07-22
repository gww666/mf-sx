<script>
import Vue from "vue";
import Component from "vue-class-component";
import { getOrderDetail, doPay } from "./axios";
import { formatDateTime } from "../../utils/getFormateDate";

@Component
export default class CheckOrderDetail extends Vue {
    goodsList = [];
    payment = 0;
    // 企业id
	get companyId () {
		return this.$store.state.qxz.companyId;
	};
    // 未完结订单
    get unfinishedOrder () {
        return this.$store.state.qxz.unfinishedOrder;
    };
    // 支付
    async goPayment() {
        let param = {
            companyId: this.companyId,
            orderNo: this.unfinishedOrder.orderNo
        };
        try {
            let res = await doPay(param);
            if(res.data.returnCode === 1) {
                console.log("支付成功")
            } else {
                console.log("支付失败")
            }
            console.log(res, 'resssss')
        }catch (err) {
            console.log("支付接口err：", err);
        }
        console.log(this.unfinishedOrder.orderNo, "去支付")
    };
    // 返回
    goBack() {
        this.$router.go(-1);
    };
	render() {
		return (
            <div class="order-container">
                <div class="page-title">
                    <div class="go-back" onClick={this.goBack}>
                        <span class="iconfont icon-left"></span>
                    </div>
                    订单详情
                </div>
                <div class="mid-content">
                    <div class="ul-title">
                        已点菜品：
                    </div>
                    <ul class="content-ul">
                        {
                            this.goodsList.map(item => (
                                <li class="goods-item">
                                    <div class="content">
                                        <p class="title">{item.goodsTitle}</p>
                                        <p class="count"><span>×{item.goodsCount}</span></p>
                                        <p class="price">￥{item.goodsPrice}</p>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                    <div class="split-line"></div>
                    <div class="order-infos">
                        <p class="info-title">订单信息：</p>
                        <p><span>订单号：</span><span>{this.unfinishedOrder.orderNo}</span></p>
                        <p><span>下单时间：</span><span>{this.unfinishedOrder.createDate ? formatDateTime(Number(this.unfinishedOrder.createDate)) : ""}</span></p>
                    </div>
                </div>
                <div class="payment-infos">
                    <p><span>共需支付：</span><span class="sum">￥ {this.payment}</span></p>
                    <div class="payment-btn" onClick={this.goPayment}>去结算</div>
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
                    console.log(res.data.data, "dataaaaaaa");
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
		background: #FFF;
		display: flex;
        // align-items: center;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
    }
    .page-title{
        width: 100%;
        height: .88rem;
        text-align: center;
        line-height: .88rem;
        font-size: 0.34rem;
        color: #333;
        background: #FFF;
        border-bottom: 1px solid #E7E7E7;
        position: relative;
        // background: linear-gradient(90deg, #ED323D, #FF5B65);
    }
    .go-back{
        height: 100%;
        width: 1rem;
        font-size: .8rem;
        line-height: .5rem;
        position: absolute;
        left: 0;
        top: 0;
    }
    .ul-title{
        font-size: .28rem;
        height: 0.9rem;
        line-height: 0.9rem;
        color: #333333;
        box-sizing: border-box;
        width: 92%;
        margin: 0 auto;
        border-bottom: 1px solid #E7E7E7;
    }
    .mid-content{
        flex: 1;
    }
    .content-ul{
        overflow-y: scroll;
        width: 100%;
        box-sizing: border-box;
        padding: 0 5%;
        background: #FFF;
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
        font-size: 0.24rem;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: .26rem 0;
		display: flex;
        justify-content: space-between;
        color: #333333;
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
        width: 1.3rem;
        text-align: right;
		font-size: .26rem;
    }
    .count{
        color: #999999;
        width: .8rem;
        font-size: .24rem;
        text-align: right;
    }
    .split-line{
        width: 100%;
        height: 0.2rem;
        background: #EEEEEE;
    }
    .order-infos{
        margin: 0 auto;
        width: 92%;
        height: 2rem;
        box-sizing: border-box;
        color: #6e6e6e;
        .info-title{
            height: 0.94rem;
            line-height: 0.94rem;
            font-size: .3rem;
            color: #333;
            border-bottom: 1px solid #E7E7E7;
        }
        p{
            height: 0.85rem;
            line-height: 0.85rem;
            font-size: .28rem;
            border-bottom: 1px solid #E7E7E7;
        }
    }
    .sum{
        color: #EC313C;
    }
    .payment-infos{
        width: 100%;
        height: .8rem;
        line-height: .8rem;
        text-align: right;
        font-size: .3rem;
        color: #333;
        background: #FFF;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        box-sizing: border-box;
        border-top: 1px solid #e6e6e6;
        p{
            text-align: left;
            width: 100%;
            padding-left: 2%;
        }
    }
    .payment-btn{
        color: #FFF;
        width: 2.6rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgb(255, 77, 77);
    }
</style>