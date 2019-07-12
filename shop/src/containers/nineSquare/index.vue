<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Input, Button, Select, InputNumber, Radio, message } from "ant-design-vue";
import { operateGoods, uploadImg } from "./axios";
import { getCategoryList, getGoodsInfoById } from "../axios";
import imageX, { compress } from "image-sx";
Vue.use(Input);
Vue.use(Radio);
Vue.use(Button);
Vue.use(Select);
Vue.use(InputNumber);

@Component({
    components: {
        imageX
    }
})
export default class DishCategory extends Vue {
    squares = [];
    get userInfo() {
        return this.$store.state.qxz.userInfo;
    };
	render() {
		return (
            <div class="operate-dish">
                
            </div>
		);
    };
    mounted() {
        for(let i = 0;i < 100; i++) {
            this.sortArr.push(i);
        };
        let query = this.$route.query || {};
        if (query.type === "edit") {
            this.pageType = "edit";
            let params = JSON.parse(this.$route.query.params);
            this.queryGoodsInfo(params);
        } else {
            this.pageType = "create";
        };
        this.queryCategoryList();
    };
};
</script>
<style lang="less" scoped>
    .operate-dish{
        width: 100%;
        height: 100%;
        overflow-y: auto;
        background: #F5F5F5;
    }
</style>