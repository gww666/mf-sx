<script>
import Vue from "vue";
import Component from "vue-class-component";

import leftSideList from "./components/leftSideList";
import commonHeader from "./components/commonHeader";
@Component({
    components: {
        leftSideList,
        commonHeader
    }
})
export default class App extends Vue {
    get isLoginPage() {
        this.setViewStyle();
        return this.$route.name === "login";
    };
	render() {
		return (
            <div class="project-container">
                {
                    this.isLoginPage ? <div></div> : <left-side-list />
                }
                <div class="right-side" ref="rightSide">
                    {
                        this.isLoginPage ? <div></div> : <common-header />
                    }
                    <div ref="routerView" style="flex:1">
                        <router-view class="router-view"></router-view>
                    </div>
                </div>
            </div>
		)
    };
    setRightStyle() {
        let rightSide = this.$refs.rightSide;
        rightSide.style.height = document.documentElement.offsetHeight + "px";
        rightSide.style.width = document.documentElement.offsetWidth - 120 + "px";
    };
    setViewStyle() {
        let routerView = this.$refs.routerView;
        if(this.$route.name !== "login") {
            if(routerView) {
                routerView.style.height = document.documentElement.clientHeight - 50 + "px";
            }
        }else {
            if(routerView) {
                routerView.style.height = document.documentElement.clientHeight + "px";
            }
        }
    };
    mounted() {
        this.setRightStyle();
    };
};
</script>

<style scoped>
.project-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
}
.right-side{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.router-view{
    width: 100%;
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>
