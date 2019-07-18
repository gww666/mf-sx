<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Modal, Drawer } from "ant-design-vue";
import echarts from 'echarts';
import { getTurnover, getGoodsData } from "./axios";
Vue.use(Modal);
Vue.use(Drawer);

@Component
export default class DishCategory extends Vue {
    switchFlag = true;
    drawerVisible = false;
    turnover = [];
    goodsData = [];
    chart1Option = {
        color: ['#3398DB'],
        title: {
            text: "营业额曲线"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data:['最高营业额','最低营业额']
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {readOnly: true},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            data: ['7-01', '7-02', '7-03', '7-04', '7-05', '7-06', '7-07'],
            // axisTick: {
            //     alignWithLabel: true
            // }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '￥{value}'
            }
        },
        series: [
            {
                name: '营业额',
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                }
            }
        ]
    };
    chart2Option = {
        color: ['#3398DB'],
        title: {
            text: "菜品销量对比"
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data:['最高销量','最低销量']
        },
        xAxis : [
            {
                type : 'category',
                // data : ['炒鸡蛋', '炒番茄', '水煮肉', '水煮鱼', '柴火鸡', '大龙虾', '小龙虾', '鸡腿', '鸭腿', '猪脚饭', '炒鸡蛋', '炒番茄', '水煮肉', '水煮鱼', '柴火鸡', '大龙虾', '小龙虾', '鸡腿', '鸭腿', '猪脚饭'],
                data : [],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : {
            type : 'value',
            axisLabel: {
                formatter: '{value} 份'
            }
        },
        series : [
            {
                name: '销售份数',
                type: 'bar',
                barWidth: '60%',
                // data: [34, 52, 200, 334, 390, 330, 220, 45, 78, 36, 34, 52, 200, 334, 390, 330, 220, 45, 78, 36],
                data: [],
            }
        ]
    };
    get userInfo() {
        return this.$store.state.qxz.userInfo;
    };
    drawCharts() {
        let myChart1 = echarts.init(this.$refs.myChart1);
        let myChart2 = echarts.init(this.$refs.myChart2);
        window.addEventListener("resize", () => {
            myChart1.resize();
            myChart2.resize();
        });
        myChart1.setOption(this.chart1Option);
        myChart2.setOption(this.chart2Option);
    };
    switchChart() {
        this.drawerVisible = true;
    };
    // 获取营业额统计数据
    async turnoverRequest() {
        try {
            let res = await getTurnover(this.userInfo.id);
            if(res.data.returnCode === 1) {
                console.log(res.data, "turnoverRequest")
            }
        }catch(err) {
            console.log("获取营业额统计数据err:", err)
        }
    };
    // 获取菜品统计数据
    async goodsDataRequest() {
        try {
            let res = await getGoodsData(this.userInfo.id);
            if(res.data.returnCode === 1) {
                let data = res.data.data[0];
                this.chart2Option.xAxis[0].data = [];
                this.chart2Option.series[0].data = [];
                let goodsData = [];
                for(let key in data) {
                    if(key != "merge") {
                        let obj = {
                            goodsId: key,
                            ...data[key]
                        }
                        goodsData.push(obj);
                    }
                }
                // 降序排列
                goodsData = goodsData.sort((a, b) => {return b.count - a.count});
                this.goodsData = goodsData;
                // 前十个在表格中展示
                for(let i = 0;i < goodsData.length;i++) {
                    this.chart2Option.series[0].data.push(goodsData[i].count);
                    this.chart2Option.xAxis[0].data.push(goodsData[i].title);
                    if(i > 9) break;
                };
                this.drawCharts();
            }
        }catch(err) {
            console.log("获取菜品统计数据err:", err)
        }
    };
    // 关闭drawer
    onClose() {
        this.drawerVisible = false;
    };
	render() {
		return (
            <div class="category-page">
                <div class="title-bar">
                    <p class="createBtn">
                        <p class="addBtn"></p>
                    </p>
                </div>
                <div ref="myChart1" class="charts"></div>
                <div class="toolBox" onClick={this.switchChart}>
                    详情
                </div>
                <div ref="myChart2" class="charts"></div>
                <a-drawer
                    width={260}
                    placement="right"
                    title="销量详情"
                    closable={true}
                    onClose={this.onClose}
                    visible={this.drawerVisible}
                >
                    <div class="drawer-content">
                        <div class="title-list">
                            <div class="items">商品名称</div>
                            {
                                this.goodsData.map(item => (
                                    <div class="items">{item.title}</div>
                                ))
                            }
                        </div>
                        <div class="count-list">
                            <div class="items right">销售份数</div>
                            {
                                this.goodsData.map(item => (
                                    <div class="items" style="text-align:center;">{item.count}</div>
                                ))
                            }
                        </div>
                    </div>
                </a-drawer>
            </div>
		);
    };
    mounted() {
        this.turnoverRequest();
        this.goodsDataRequest();
        this.drawCharts();
    };
}
</script>
<style lang="less" scoped>
    .category-page{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: #F5F5F5;
    }
    .title-bar{
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .charts{
        width: 100%;
        height: 390px;
    }
    .drawer-content{
        width: 100%;
        height: 100%;
        overflow-y: auto;
        .title-list{
            width: 70%;
            float: left;
        }
        .count-list{
            width: 30%;
            float: left;
        }
        .items{
            width: 100%;
            height: 32px;
            line-height: 32px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .right{
            text-align: right;
        }
    }
</style>