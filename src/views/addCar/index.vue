<template>
  <div class="app-container">
    <el-divider content-position="left"><span>查询条件</span></el-divider>
    <el-form :inline="true" class="demo-form-inline" label-width="80px">
      <el-form-item>
        <el-form-item label="出租单号">
          <el-input size="small" v-model="form.rentid" placeholder="请输入出租单号" style="width: 250px"/>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-search"
          @click="query()">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-divider content-position="center"><span>检查单表单</span></el-divider>
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="出租单号" prop="rentid">
            <el-input size="small" :disabled="true" v-model="form.rentid"  placeholder="请输入出租单号" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="存在问题" prop="problem">
            <el-input size="small" v-model="form.problem" placeholder="请输入存在问题" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="赔付金额" prop="paymoney">
            <el-input size="small" v-model="form.paymoney" placeholder="请输入赔付金额" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="检查时间" prop="checkdate">
            <el-date-picker
              size="small"
              v-model="form.checkdate"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="车辆描述" prop="phone">
            <el-input type="textarea" :rows="4" size="small" v-model="form.checkdesc" placeholder="请输入车辆描述" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col align="center">
          <el-button type="primary" size="mini" @click="save()">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
    <br>
    <el-row>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>车辆信息</span>
          </div>
          <div class="text item">
            {{'车牌号码: '}}  {{this.carInfo == {} ? ' ' : this.carInfo.carnumber}}
          </div>
          <div class="text item">
            {{'车牌类型: '}}  {{this.carInfo == {} ? ' ' : this.carInfo.cartype}}
          </div>
          <div class="text item">
            {{'车牌颜色: '  }} {{this.carInfo == {} ? ' ' : this.carInfo.color}}
          </div>
          <div class="text item">
            {{'购买价格: '}} {{this.carInfo == {} ? ' ' : this.carInfo.price}}
          </div>
          <div class="text item">
            {{'出租价格: '}} {{this.carInfo == {} ? ' ' : this.carInfo.rentprice}}
          </div>
          <div class="text item">
            {{'出租押金: '}} {{this.carInfo == {} ? ' ' : this.carInfo.deposit}}
          </div>
          <div class="text item">
            {{'车辆描述: '}} {{this.carInfo == {} ? ' ' : this.carInfo.description}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>出租单信息</span>
          </div>
          <div class="text item">
            {{'出租单号: ' }} {{ this.rentInfo == {} ? ' ' : this.rentInfo.rentid }}
          </div>
          <div class="text item">
            {{'出租价格: ' }} {{ this.rentInfo == {} ? ' ' : this.rentInfo.price }}
          </div>
          <div class="text item">
            {{'起始时间: '}} {{ this.rentInfo == {} ? ' ' : this.rentInfo.begindate | formatDate() }}
          </div>
          <div class="text item">
            {{'还车时间: '}} {{ this.rentInfo == {} ? ' ' : this.rentInfo.returndate | formatDate() }}
          </div>
          <div class="text item">
            {{'操作员: '}} {{ this.rentInfo == {} ? ' ' : this.rentInfo.opername }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>客户信息</span>
          </div>
          <div class="text item">
            {{'身份证号: ' }} {{ this.customerInfo == {} ? ' ' : this.customerInfo.identity }}
          </div>
          <div class="text item">
            {{'客户姓名: ' }} {{ this.customerInfo == {} ? ' ' : this.customerInfo.custname }}
          </div>
          <div class="text item">
            {{'客户性别: '}} {{ this.customerInfo == {} ? ' ' : this.customerInfo.sex }}
          </div>
          <div class="text item">
            {{'客户地址: ' }} {{ this.customerInfo == {} ? ' ' : this.customerInfo.address }}
          </div>
          <div class="text item">
            {{'客户电话: '}} {{ this.customerInfo == {} ? ' ' : this.customerInfo.phone }}
          </div>
          <div class="text item">
            {{'客户职位: '}} {{ this.customerInfo == {} ? ' ' : this.customerInfo.career }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  // 引入调用的相关api下的js文件
  import car from '@/api/car'
  import customer from '@/api/customer'
  import check from '@/api/check'
  import rent from '@/api/rent'

  export default {
    data() {
      return {
        rentid: '',
        form: {},
        carInfo: {},
        rentInfo: {},
        customerInfo: {}
      }
    },
    created() {
      this.carInfo = {}
      this.rentInfo = {}
      this.customerInfo = {}
    },
    methods: {
      getCustomerInfo() {
        customer.getByRentId(this.form.rentid).then(response => {
          this.customerInfo = response.data
        })
      },
      getRentInfo() {
        rent.getById(this.form.rentid).then(response => {
          this.rentInfo = response.data
        })
      },
      getCarInfo() {
        car.getByRentId(this.form.rentid).then(response => {
          this.carInfo = response.data
        })
      },
      query() {
        this.getCustomerInfo()
        this.getCarInfo()
        this.getRentInfo()
      },
      save() {
        check.add(this.form).then(() => {
          // 添加成功
          // 提示成功信息
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.form.problem = ''
          this.form.paymoney = ''
          this.form.checkdesc = ''
          this.form.paymoney = ''
          this.form.checkdate = ''
        })
        .catch(() => {
          // 添加失败
          // 提示失败信息
          this.$message({
            type: 'danger',
            message: '添加失败!'
          })
        })
      }
    }
  }
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>

