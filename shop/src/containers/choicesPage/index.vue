<script>
import Vue from "vue";
import Component from "vue-class-component";
import { getSettings, getOrder } from "./axios";

@Component
export default class Order extends Vue {
	showPage = false;
	loading = require("../../assets/images/loading.gif");
	get unfinishedOrder() {
		return this.$store.state.qxz.unfinishedOrder;
	};
	// 回到菜单去加菜
    goOrderPage() {
        this.$router.push({name: "orderPage"});
	};
	// 查看已有订单
    goCheckOrders() {
		this.$router.push({name: "checkOrderDetail", params: {orderNo: this.unfinishedOrder.orderNo, payment: this.unfinishedOrder.payment}});
	};
	// 获取系统设置
	async querySystemSettings(companyId, tableNo) {
		let hour = new Date().getHours();
		let requestArr = [];
		if(0 <= hour && hour <= 3) {
			requestArr = [getSettings(), getOrder(companyId, tableNo, new Date()), getOrder(companyId, tableNo, new Date().getTime() - 24 * 60 * 60 * 1000)];
		} else {
			requestArr = [getSettings(), getOrder(companyId, tableNo, new Date())];
		};
		Promise.all(requestArr).then(res => {
			this.handleDatas(res, tableNo);
		}).catch(err => {
			console.log("是否有未完结订单err:", err);
		});
	};
	handleDatas(res, tableNo) {
		let setting_res = res[0];
		let order_res = res[1];
		let order_res2 = res[2];
		if (setting_res.data.returnCode === 1 && order_res.data.returnCode === 1) {
			let setting = setting_res.data.data[0];
			let order = order_res.data.data;
			if(order_res2 && order_res2.data.returnCode === 1) {
				let order2 = order_res2.data.data;
				order = order.concat(order2);
			};
			this.$store.commit("qxz/updateTypes", setting);
			if (setting.processType === 1) {
				// 先付款，有没有未完结的单都继续点
				this.$router.replace({name: "orderPage"});
			};
			if (setting.processType === 2 && Array.isArray(order)) {
				for(let i = 0; i < order.length; i++) {
					if(order[i].status === 1) {
						// 把未完结的单存到vuex中
						this.$store.commit("qxz/updateUnfinishedOrder", order[i]);
						this.showPage = true;
						// 后付款，且有未完结订单，跳转加菜、查看已有订单选择页面
						// this.$router.push({name: "choicesPage", params: {orderNo: order[i].orderNo, payment: order[i].payment}});
						return;
					};
				};
				this.$router.replace({name: "orderPage"});
			};
		};
	};
	// <p class="iconfont icon-chushi1"></p>
	render() {
		return (
			this.showPage
			?
			<div class="page-container">
				<div class="top-pad"></div>
				<div class="title">
					<p class="iconfont icon-wankuai"></p>
					<p class="tip">您有正在进行中的订单...</p>
				</div>
				<div class="choices-container">
					<div class="choices" onClick={this.goOrderPage}>我要加菜</div>
					<div class="choices hyaline-bg" onClick={this.goCheckOrders}>查看已有订单</div>
				</div>
			</div>
			:
			<div class="loading-box">
				<img src={this.loading} style="width: 0.7rem;height: 0.7rem;" />
				<p class="loading-text">加载中...</p>
			</div>
		)
	};
	created() {
		let { companyId, tableNo } = this.$route.query;
		this.$store.commit("qxz/updateIdNo", {companyId, tableNo});
		this.querySystemSettings(companyId, tableNo);
	};
};
</script>
<style lang="less" scoped>
	.tip{
		margin-top: 0.53rem;
		font-size: .36rem;
		text-align: center;
		color: #FFFFFF;
		opacity: 0.8;
	}
	.top-pad{
		width: 100%;
		height: 2.18rem;
	}
	.page-container{
		width: 100%;
		height: 100%;
		position: relative;
		background: #EC313C;
		background: linear-gradient(to bottom, #EC313C, #FF5B65);
	}
	.choices-container{
		margin-top: 2.27rem;
        font-size: .16rem;
		width: 100%;
	}
    .choices{
        width: 5.5rem;
        height: .86rem;
        border-radius: .1rem;
		line-height: .86rem;
		font-size: .38rem;
        text-align: center;
        color: #ED323D;
		margin: 0rem auto;
		background: #FFF;
		border: 1px solid #FFF;
	}
	.hyaline-bg{
		margin: 0.5rem auto;
		color: #FFF;
		background: rgba(0, 0, 0, 0);
	}
	.title{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.loading-box{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		background: #EC313C;
		background: linear-gradient(to bottom, #EC313C, #FF5B65);
		justify-content: center;
		font-size: .12rem;
		color: rgba(0, 0, 0, 0.65);
	}
	.icon-wankuai{
		width: 1.8rem;
		height: 1.8rem;
		text-align: center;
		line-height: 1.8rem;
		font-size: 1.4rem;
		color: #FFF;
		border-radius: 50%;
		box-shadow: 0 0 0.2rem #FFF;
	}
	.icon-chushi1 {
		color: #FFF;
		opacity: 0.4;
		font-size: 1.8rem;
	}
	.loading-text{
		margin-top: .2rem;
		color: #FFF;
		font-size: 0.34rem;
	}
</style>