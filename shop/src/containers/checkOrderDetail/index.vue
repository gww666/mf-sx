<script>
import Vue from "vue";
import Component from "vue-class-component";
import { getOrderDetail } from "./axios";

@Component
export default class CheckOrderDetail extends Vue {
    orderInfo = {};
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
                    <span>订单总额：</span><span>￥{this.orderInfo.payment}</span>
                </div>
			</div>
		)
	};
	async mounted() {
        let order = this.$route.query.order ? JSON.parse(this.$route.query.order) : "";
        console.log(order, 'order')
		if(order) {
            this.orderInfo = order;
            try {
                let res = await getOrderDetail(order.orderNo);
                if(res.data.returnCode === 1) {
                    this.goodsList = res.data.data;
                    this.goodsList = [
                        {"id":16,"orderNo":"201906171818920001","goodsId":6,"goodsTitle":"炒辣条","goodsPrice":"48.80","goodsCount":2,"goodsImg":"/public/upload/b0d439b0f6933d8e0c63a1ccc50ad9b0.jpeg"},
                        {"id":16,"orderNo":"201906171818920001","goodsId":6,"goodsTitle":"炒辣条","goodsPrice":"48.80","goodsCount":2,"goodsImg":"/public/upload/b0d439b0f6933d8e0c63a1ccc50ad9b0.jpeg"},
                        {"id":16,"orderNo":"201906171818920001","goodsId":6,"goodsTitle":"炒辣条","goodsPrice":"48.80","goodsCount":2,"goodsImg":"/public/upload/b0d439b0f6933d8e0c63a1ccc50ad9b0.jpeg"},
                        {"id":16,"orderNo":"201906171818920001","goodsId":6,"goodsTitle":"炒辣条","goodsPrice":"48.80","goodsCount":2,"goodsImg":"/public/upload/b0d439b0f6933d8e0c63a1ccc50ad9b0.jpeg"},
                        {"id":16,"orderNo":"201906171818920001","goodsId":6,"goodsTitle":"炒辣条","goodsPrice":"48.80","goodsCount":2,"goodsImg":"/public/upload/b0d439b0f6933d8e0c63a1ccc50ad9b0.jpeg"},
                        {"id":16,"orderNo":"201906171818920001","goodsId":6,"goodsTitle":"炒辣条","goodsPrice":"48.80","goodsCount":2,"goodsImg":"/public/upload/b0d439b0f6933d8e0c63a1ccc50ad9b0.jpeg"},
                        {"id":16,"orderNo":"201906171818920001","goodsId":6,"goodsTitle":"炒辣条","goodsPrice":"48.80","goodsCount":2,"goodsImg":"/public/upload/b0d439b0f6933d8e0c63a1ccc50ad9b0.jpeg"},
                        {"id":16,"orderNo":"201906171818920001","goodsId":6,"goodsTitle":"炒辣条","goodsPrice":"48.80","goodsCount":2,"goodsImg":"/public/upload/b0d439b0f6933d8e0c63a1ccc50ad9b0.jpeg"},
                        {"id":16,"orderNo":"201906171818920001","goodsId":6,"goodsTitle":"炒辣条","goodsPrice":"48.80","goodsCount":2,"goodsImg":"/public/upload/b0d439b0f6933d8e0c63a1ccc50ad9b0.jpeg"},
                        {"id":16,"orderNo":"201906171818920001","goodsId":6,"goodsTitle":"炒辣条","goodsPrice":"48.80","goodsCount":2,"goodsImg":"/public/upload/b0d439b0f6933d8e0c63a1ccc50ad9b0.jpeg"},
                        {"id":16,"orderNo":"201906171818920001","goodsId":6,"goodsTitle":"炒辣条","goodsPrice":"48.80","goodsCount":2,"goodsImg":"/public/upload/b0d439b0f6933d8e0c63a1ccc50ad9b0.jpeg"},
                        {"id":16,"orderNo":"201906171818920001","goodsId":6,"goodsTitle":"炒辣条","goodsPrice":"48.80","goodsCount":2,"goodsImg":"/public/upload/b0d439b0f6933d8e0c63a1ccc50ad9b0.jpeg"},
                        {"id":17,"orderNo":"201906171818920001","goodsId":18,"goodsTitle":"炒鸡蛋","goodsPrice":"50.00","goodsCount":1,"goodsImg":""},
                        {"id":18,"orderNo":"201906171818920001","goodsId":11,"goodsTitle":"炒鸡蛋","goodsPrice":"50.00","goodsCount":1,"goodsImg":""}
                    ];
                    console.log(res.data.data, 'ssssssssssssssssssssssssss');
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