<script>
import Vue from "vue";
import Component from "vue-class-component";

import { getCategoryList } from "./axios";

@Component
export default class Order extends Vue {
	categoryList = [];
	currentCategory = "";
	// 获取分类列表
    async queryCategoryList() {
        try {
            let res = await getCategoryList(1);
            if (res.data.returnCode === 1) {
				if (res.data.data.length > 0) {
					this.categoryList = res.data.data.sort((a, b) => {
						if (a.sort < b.sort) {
							return -1;
						}
						if (a.sort > b.sort) {
							return 1;
						}
						return 0;
					});
					this.currentCategory = this.categoryList[0].id;
				} else {
					this.categoryList = [];
				};
            } else {
                this.categoryList = [];
            };
        }catch(err) {
            console.log(err, "获取分类列表err");
        };
	};
	// 获取分类下的商品
	async queryGoodsList() {
		
	};
	// 切换分类
	handleCategoryClick(item) {
		this.currentCategory = item.id;
	};
	render() {
		return (
            <div class="order-page">
				<div class="list-left">
					<ul>
						{
							this.categoryList.map(item => (
								<li class={this.currentCategory === item.id ? "choosen-class" : ""} onClick={() => this.handleCategoryClick(item)}>
									{item.name}
								</li>
							))
						}
					</ul>
				</div>
				<div class="list-right">
					2
				</div>
            </div>
		)
	};
	mounted() {
		this.queryCategoryList();
	};
};
</script>
<style lang="less" scoped>
    .order-page{
		width: 100%;
		height: 100%;
		background: #F5F5F5;
		font-size: 0.26rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.list-left{
		width: 2rem;
		height: 100%;
		ul{
			height: 100%;
			overflow-y: auto;
			li{
				width: 100%;
				height: 1rem;
				line-height: 1rem;
				padding: 0 .2rem;
			}
			.choosen-class{
				background: #FFF;
			}
		}
	}
	.list-right{
		flex: 1;
		height: 100%;
		background: pink;
	}
</style>