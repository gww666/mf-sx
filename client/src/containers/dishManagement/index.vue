<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Input, Button } from "ant-design-vue";
Vue.use(Input);
Vue.use(Button);

@Component()
export default class DishManagement extends Vue {
	render() {
		return (
            <div class="home-page">
                菜品管理
            </div>
		)
    }
    mounted() {
        console.log("abdss")   
    }
}
</script>
<style lang="less" scoped>
    .home-page{
        width: 100%;
        height: 100%;
        background: #F5F5F5;
    }
</style>