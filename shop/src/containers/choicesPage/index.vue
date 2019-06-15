<script>
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Order extends Vue {
    goOrderPage() {
        this.$router.replace({name: "orderPage"});
    };
    goPaymentPage() {
        console.log("去结账")
    };
	render() {
		return (
			<div class="choices-container">
				<div class="choices" onClick={this.goOrderPage}>我要加菜</div>
				<div class="choices" onClick={this.goPaymentPage}>我要结账</div>
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
        margin: .4rem auto;
    }
</style>