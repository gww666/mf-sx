<script>
import Vue from "vue";
import Component from "vue-class-component";
import { getOrderDetail } from "./axios";

@Component
export default class CheckOrderDetail extends Vue {
    get unfinishedOrder() {
        return this.$store.state.qxz.unfinishedOrder;
    }
    goodsList = [];
    defaultPic = require("../../assets/images/noPic.jpg");
	render() {
		return (
			<div class="order-container">
				<ul class="content-ul">
                    {
                        this.goodsList.map(item => (
                            <li class="goods-item">
                                <div class="icon-can">
                                    <img src={item.goodsImg ? `http://120.78.221.14:2233${item.goodsImg}` : this.defaultPic} class="main-img" />
                                </div>
                                <div class="content">
                                    <div style="width: 100%;">
                                        <p class="title">{item.goodsTitle}</p>
                                    </div>
                                    <div>
                                        <span>数量：</span><span class={"price"}>{item.goodsCount}</span>
                                    </div>
                                    <div style="position: relative;">
                                        <span class={"price"}>￥{item.goodsPrice}</span>
                                    </div>
                                </div>
                            </li>
                        ))
                    }
                </ul>
                <div class="payment-infos">
                    <span>订单总额：</span><span>￥{this.unfinishedOrder.payment}</span>
                </div>
			</div>
		)
	};
	async mounted() {
        let orderNo = this.unfinishedOrder.orderNo;
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
		height: 1.8rem;
		background: #FFF;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.content{
		width: 76%;
		height: 100%;
		box-sizing: border-box;
		padding: .3rem .2rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.title{
		width: 100%;
		font-size: .32rem;
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
		color: rgba(0, 0, 0, 0.65);
	}
	.price{
		display: inline-block;
		margin-right: .16rem;
		color: #FF4544;
	}
	.sale-price{
		color: rgba(0, 0, 0, 0.65);
		font-size: .14rem;
		text-decoration: line-through;
    }
    .payment-infos{
        box-sizing: border-box;
        padding: 0 5%;
        width: 100%;
        height: .8rem;
        line-height: .8rem;
        text-align: right;
        font-size: .3rem;
        background: #FFF;
    }
</style>