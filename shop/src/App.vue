<script>
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class App extends Vue {
	render() {
		return (
            <div class="project-container">
                <router-view class="router-view"></router-view>
            </div>
		)
    };
};
</script>

<style scoped>
.project-container {
    position: relative;
    width: 100%;
    height: 100%;
}
.router-view{
    width: 100%;
    height: 100%;
}
</style>
<style>
    /* toast弹出框样式开始 */
    .toast-box {
        background: rgba(255, 255, 255, 1);
        border-radius: 0.1rem;
        color: #FFF;
        background: #494949;
        position: absolute;
        z-index: 999;
        top: 80%;
        left: 50%;
        box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
        padding: 0.2rem 0.2rem;
        transform: translate(-50%, -40%);
        max-width: 9rem;
    }

    .toast_default {
        border: 1px solid #494949;
    }

    .toast_warning {
        border: 1px solid #f0cb85;
        color: #f0cb85;
        background: #FFF;
    }

    .toast_fail {
        border: 1px solid #ffb8b0;
        color: #ffb8b0;
        background: #FFF;
    }

    .toast_success {
        border: 1px solid #a7d99d;
        color: #a7d99d;
        background: #FFF;
    }
</style>

