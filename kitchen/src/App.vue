<template>
	<router-view></router-view>
</template>

<script>
export default {
	components: {}
};
</script>

<style lang="scss">
* {
	margin: 0;
	padding: 0;
}
div, span {
	box-sizing: border-box;
}
html, body {
	width: 100%;
	height: 100%;
}
html {
	font-size: 42.66px;
}
/* 媒体查询 */
@media screen and (min-width: 320px) {
	html {
		font-size: 42.66px;
	}
}
@media screen and (min-width: 360px) {
	html {
		font-size: 48px;
	}
}
@media screen and (min-width: 375px) {
	html {
		font-size: 50px;
	}
}
@media screen and (min-width: 414px) {
	html {
		font-size: 55.2px;
	}
}
@media screen and (min-width: 414px) {
	html {
		font-size: 55.2px;
	}
}
/* 重设设置页面的样式 */
.settings-box {
	.mint-cell:last-child {
		background-image: unset;
	}
	.mint-cell-wrapper {
		background-image: unset;
	}
} 

</style>
