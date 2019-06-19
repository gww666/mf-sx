<script>
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Order extends Vue {
	get unfinishOrder() {
		return this.$store.state.qxz.unfinishedOrder
	}
	// 回到菜单去加菜
    goOrderPage() {
        this.$router.push({name: "orderPage", params: {orderNo: this.$route.params.orderNo || this.unfinishOrder.orderNo}});
	};
	// 查看已有订单
    goCheckOrders() {
		this.$router.push({name: "checkOrderDetail", params: {orderNo: this.$route.params.orderNo || this.unfinishOrder.orderNo, payment: this.$route.params.payment || this.unfinishOrder.payment}});
    };
	render() {
		return (
			<div class="choices-container">
				<div class="choices" onClick={this.goOrderPage}>我要加菜</div>
				<div class="choices" onClick={this.goCheckOrders}>查看已有订单</div>
			</div>
		)
	};
	mounted() {
		
	};
};
</script>
<style lang="less" scoped>
	.choices-container{
        font-size: .16rem;
		width: 100%;
		height: 100%;
		background: #F5F5F5;
		display: flex;
		// align-items: center;
		justify-content: space-between;
	}
    .choices{
        width: 2rem;
        height: .6rem;
        border-radius: .3rem;
        line-height: .6rem;
        text-align: center;
        color: #FFF;
        background: #1890ff;
        margin: 70% auto;
    }
</style>