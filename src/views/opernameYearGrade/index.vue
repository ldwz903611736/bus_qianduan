<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>
        <el-select v-model="value" placeholder="请选择年份" size="small">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          size="mini"
          :disabled="btnDisabled"
          type="primary"
          icon="el-icon-search"
          @click="showChart()">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="chart-container">
      <div id="chart" class="chart" style="height:500px;width:100%" />
    </div>
  </div>
</template>

<script>
  import stat from '@/api/stat'
  import rent from '@/api/rent'
  import echarts from 'echarts'

  export default {
    data() {
      return {
        value: '',
        btnDisabled: false,
        chart: null,
        options: [],
        xData: [],
        yData: []
      }
    },
    created() {
      this.getYears()
    },
    methods: {
      getYears() {
        rent.getYears().then(response => {
          this.options = response.data
        })
      },
      showChart() {
        stat.getOpernameYearGrade(this.value).then(response => {
          this.xData = response.data.name
          this.yData = response.data.value
          this.setChart()
        })
      },
      // 设置图标参数
      setChart() {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById('chart'))
        console.log(this.chart)

        // 指定图表的配置项和数据
        const option = {
          color: ['#3398DB'],
          title: {
            text: '年度业务员销售统计',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: this.xData,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '直接访问',
              type: 'bar',
              barWidth: '35%',
              data: this.yData
            }
          ]
        }

        this.chart.setOption(option)
      }
    }
  }
</script>
