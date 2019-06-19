<script>
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Order extends Vue {
    doScan() {
		this.$router.push({name: "choicesPage", query: {companyId: 1, tableNo: 3}});
    };
	render() {
		return (
			<div class="scan-container">
				<div class="scanBtn" onClick={this.doScan}>扫码</div>
			</div>
		)
	};
};
</script>
<style lang="less" scoped>
	.scan-container{
        font-size: .16rem;
		width: 100%;
		height: 100%;
		background: #F5F5F5;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: space-between;
	}
    .scanBtn{
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