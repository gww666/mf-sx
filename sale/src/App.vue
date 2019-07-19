<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	components: {}
};
</script>

<style>
* {
	margin: 0;
	padding: 0;
}
div {
	box-sizing: border-box;
}
html, body {
	height: 100%;
	width: 100%;
}
#app {
	height: 100%;
	width: 100%;
}

/* toast弹出框样式 */
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
/* toast弹出框样式 */
</style>
