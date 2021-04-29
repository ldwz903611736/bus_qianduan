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
          @click="showChart()">查询
        </el-button>
      </el-form-item>
    </el-form>

    <div class="chart-container">
      <div id="chart" class="chart" style="height:500px;width:100%"/>
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
        data: []
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
        stat.getCompanyYearGrade(this.value).then(response => {
          this.data = response.data
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
          title: {
            text: '公司年度销售统计',
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.data,
            type: 'line'
          }]
        }

        this.chart.setOption(option)
      }
    }
  }
</script>
