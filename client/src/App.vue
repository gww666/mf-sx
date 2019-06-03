<script>
import Vue from "vue";
import Component from "vue-class-component";
import { autoLogin } from "./utils/autoLogin";

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
        return this.$route.name === "login";
    }
	render() {
		return (
            <div class="project-container">
                {
                    this.isLoginPage ? <div></div> : <left-side-list />
                }
                <div class="right-side">
                    {
                        this.isLoginPage ? <div></div> : <common-header />
                    }
                    <router-view class="router-view"></router-view>
                </div>
            </div>
		)
    }
    async created() {
        // 自动登录
        let sessionId = localStorage.getItem("sessionId");
        if (sessionId) {
            try {
                let res = await autoLogin();
                if (res.data.returnCode === 1) {
                    this.$store.dispatch("qxz/updateUserInfo", res.data.data[0]);
                    localStorage.setItem("sessionId", res.data.data[0].sessionId);
                    if (this.$route.name === "login") {
                        this.$router.replace({name: "dishManagement"});
                    };
                } else {
                    this.$store.dispatch("qxz/updateUserInfo", {});
                    localStorage.setItem("sessionId", "");
                };
            } catch (err) {
                console.log("自动登录", err);
            };
        };
    }
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
    flex: 1;
    padding: 0 20px;
}
</style>
