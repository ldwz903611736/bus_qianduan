<template>
  <div class="app-container">
    <el-divider content-position="left"><span>查询条件</span></el-divider>
    <el-form ref="busCarQuery" :model="busCarQuery" label-width="80px" class="demo-form-inline">
      <el-row>
        <el-col :span="5">
          <el-form-item label="车牌号" prop="carnumber" >
            <el-input size="small" v-model="busCarQuery.carnumber" placeholder="请输入车牌号"/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="getList()">搜索</el-button>
            <el-button type="default" icon="el-icon-refresh" size="mini" @click="resetData()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>


    </el-form>

    <el-table
      :data="list"
      style="width: 100%"
      v-loading="loading"
    >
    >

      <el-table-column prop="carnumber" align="center" label="车牌号"/>

      <el-table-column prop="cartype" align="center" label="车辆类型"/>

      <el-table-column prop="color" align="center" label="车辆颜色"/>

      <el-table-column prop="price" align="center" label="车辆价格"/>

      <el-table-column prop="rentprice" align="center" label="出租价格"/>

      <el-table-column prop="deposit" align="center" label="出租押金"/>

      <el-table-column label="出租状态" align="center" width="50">
        <template slot-scope="scope">
          {{ scope.row.isrenting === 1 ? '在租' : '未租'}}
        </template>
      </el-table-column>

      <el-table-column prop="description" align="center" label="车辆描述"/>


      <el-table-column label="图片" align="center" width="50%">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="" trigger="hover">
            <img :src="scope.row.carimg" alt="" style="width: 200px;height: 150px">
            <img slot="reference" :src="scope.row.carimg" style="width: 30px;height: 30px">
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="录入时间" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.createtime | formatDate }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="rent(scope.row.carnumber)"
          >出租汽车</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pull-right"
      :current-page="page"
      :page-size="limit"
      :total="total"
      background
      layout="prev, pager, next"
      @current-change="getList"
    />


    <!-- 出租对话框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号" prop="identity">
              <el-input size="small" v-model="form.carnumber" placeholder="请输入车牌号" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆类型" prop="career">
              <el-input size="small" v-model="form.cartype" placeholder="请输入车辆类型" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车辆颜色" prop="custname">
              <el-input size="small" v-model="form.color" placeholder="请输入车辆颜色" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆价格" prop="address">
              <el-input size="small" v-model="form.price" placeholder="请输入车辆价格" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出租价格" prop="phone">
              <el-input size="small" v-model="form.rentprice" placeholder="请输入出租价格" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出租押金" prop="phone">
              <el-input size="small" v-model="form.deposit" placeholder="请输入出租押金" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="借出日期" prop="begindate">
              <el-date-picker
                size="small"
                v-model="form.begindate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="归还日期" prop="returndate">
              <el-date-picker
                size="small"
                v-model="form.returndate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="identity">
              <el-input size="small" v-model="form.identity" placeholder="请输入客户身份证号" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        <el-button size="small" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // 引入调用的相关api下的js文件
  import car from '@/api/car'
  import rent from '@/api/rent'
  import axios from 'axios'

  export default {
    // 写核心代码
    data() {
      return {
        loading: true,
        list: null, // 查询结果
        page: 1, // 当前页
        limit: 5, // 每页记录数
        total: 0, // 总记录数
        busCarQuery: {},
        dialogVisible: false,
        form: {},
        title: '', // 对话框显示添加用户或修改用户
        showImg: false
      }
    },
    created() {
      this.getNotRent()
    },
    methods: {
      getNotRent(page = 1) {
        this.loading = true
        this.page = page
        car.getNotRent(this.page, this.limit)
          .then(response => {
            this.list = response.data.rows
            this.total = response.data.total
            this.loading = false
          })
          .catch(error => {
            console.log(error)
          })
      },
      getList(page = 1) {
        this.loading = true
        this.page = page
        car.list(this.page, this.limit, this.busCarQuery)
          .then(response => {
            this.list = response.data.rows
            this.total = response.data.total
            this.loading = false
          })
          .catch(error => {
            console.log(error)
          })
      },
      resetData() {
        // 将表单中的数据清空
        this.busCarQuery = {}
        this.form = {}
        // 查询所有
        this.getNotRent()
      },
      rent(carnumber) {
        car.getById(carnumber).then(response => {
          this.form = response.data
        })
        this.dialogVisible = true
      },
      submitForm() {
        rent.rent(this.form).then(response => {
          // 出租成功
          // 提示成功信息
          this.$message({
            type: 'success',
            message: '出租成功!'
          })
          // 关闭对话框
          this.dialogVisible = false
          // 重新刷新列表
          this.getNotRent()
        })
        .catch(error => {
          // 出租失败
          // 提示失败信息
          this.$message({
            type: 'danger',
            message: '出租失败!'
          })
          // 关闭对话框
          this.dialogVisible = false
        })
      },
      // 取消按钮
      cancel() {
        this.dialogVisible = false;
        this.resetData()
      },
    }
  }
</script>
