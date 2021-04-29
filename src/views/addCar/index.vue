<template>
  <div class="app-container">
    <el-divider content-position="center"><span>检查单表单</span></el-divider>
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="出租单号" prop="rentid">
            <el-input size="small" :disabled="true" v-model="form.rentid" placeholder="请输入出租单号"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="存在问题" prop="problem">
            <el-input size="small" v-model="form.problem" placeholder="请输入存在问题"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="赔付金额" prop="paymoney">
            <el-input size="small" v-model="form.paymoney" placeholder="请输入赔付金额"/>
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
            <el-input type="textarea" :rows="4" size="small" v-model="form.checkdesc" placeholder="请输入车辆描述"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col align="center">
          <el-button type="primary" size="mini" @click="save()">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
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
      this.form.rentid = this.$route.query.rentid
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

