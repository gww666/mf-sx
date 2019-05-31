<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Input, Button, Icon } from "ant-design-vue";
Vue.use(Icon);
Vue.use(Input);
Vue.use(Button);
@Component
export default class LeftSideList extends Vue {
    list = [
        {
            title: "菜品管理",
            name: "dishManagement",
            icon: "appstore",
            isActive: true
        },
        {
            title: "菜品分类",
            name: "dishCategory",
            icon: "appstore",
            isActive: false
        }
    ]
    handleTabClick(item) {
        this.list.forEach(ele => {
            if (item.name === ele.name) {
                ele.isActive = true;
            }else {
                ele.isActive = false;
            };
        });
        this.$router.push({name: item.name});
    }
	render() {
		return (
            <div class="left-side-list">
                {
                    this.list.map(item => {
                        return (
                            <div class={item.isActive ? "tab active-tab" : "tab inactive-tab"} onClick={() => this.handleTabClick(item)}>
                                <Icon type={item.icon} class={item.isActive ? "icon active-icon" : "icon inactive-icon"} />
                                <span class="tab-title">{item.title}</span>
                            </div>
                        )
                    })
                }
            </div>
		)
	}
}
</script>
<style lang="less" scoped>
    .left-side-list{
        width: 120px;
        height: 100%;
        background: #444;
        font-size: 14px;
    }
    .tab{
        width: 100%;
        height: 50px;
        text-align: center;
        line-height: 50px;
        cursor: pointer;
    }
    .icon{
        font-size: 16px;
    }
    .active-icon{
        color: cyan;
    }
    .inactive-icon{
        color: #f5f5f5;
    }
    .active-tab{
        color: #444;
        background: #f5f5f5;
    }
    .inactive-tab{
        color: #f5f5f5;
        background: #444;
    }
    .tab-title{
        display: inline-block;
        margin-left: 4px;
    }
</style>