<template>
  <div class="app-container">
    <el-divider content-position="left"><span>查询条件</span></el-divider>
    <el-form ref="busCheckQuery" :model="busCheckQuery" label-width="80px" class="demo-form-inline">
      <el-row>
        <el-col :span="6">
          <el-form-item label="检查单号" prop="checkid">
            <el-input size="small" v-model="busCheckQuery.checkid" placeholder="请输入检查单号"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="存在问题" prop="problem">
            <el-input size="small" v-model="busCheckQuery.problem" placeholder="请输入存在问题"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="问题描述" prop="checkdesc">
            <el-input size="small" v-model="busCheckQuery.checkdesc" placeholder="请输入问题描述"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="出租单号" prop="rentid">
            <el-input size="small" v-model="busCheckQuery.rentid" placeholder="请输入出租单号"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开始时间" prop="begindate">
            <el-date-picker
              size="small"
              v-model="busCheckQuery.begintime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="结束时间" prop="enddate">
            <el-date-picker
              size="small"
              v-model="busCheckQuery.endtime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getList()">搜索</el-button>
          <el-button type="default" icon="el-icon-refresh" size="mini" @click="resetData()">重置</el-button>
        </el-col>
      </el-row>

    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="danger" size="mini" plain icon="el-icon-delete" :disabled="multiple" @click="removeBatch()">
          批量删除
        </el-button>
      </el-col>
    </el-row>

    <el-table
      ref="multipleTable"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >

      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column prop="checkid" label="检查单号" align="center" width="200" fixed/>

      <el-table-column prop="rentid" label="出租单号" align="center" width="220"/>

      <el-table-column prop="problem" label="存在问题" align="center" width="120"/>

      <el-table-column prop="checkdesc" label="问题描述" align="center" width="200" :show-overflow-tooltip="true"/>

      <el-table-column prop="paymoney" align="center" label="赔付金额"/>

      <el-table-column prop="opername" align="center" label="操作员" width="95px"/>

      <el-table-column label="检查时间" align="center" width="170">
        <template slot-scope="scope">
          {{ scope.row.checkdate | formatDate }}
        </template>
      </el-table-column>

      <el-table-column label="录入时间" align="center" width="170">
        <template slot-scope="scope">
          {{ scope.row.createtime | formatDate }}
        </template>
      </el-table-column>

      <el-table-column label="支付状态" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.pay === true ? '已支付' : '待支付'}}
        </template>
      </el-table-column>

      <el-table-column label="支付时间" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.paytime != null ? scope.row.paytime.replace('T', ' ') : '未支付' }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="edit(scope.row.checkid)"
          >编辑
          </el-button>

          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.checkid)"
          >删除
          </el-button>

          <el-button
            type="text"
            size="mini"
            icon="el-icon-download"
            @click="exportExcel(scope.row.checkid)"
          >导出检查单
          </el-button>
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

    <!-- 修改对话框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="存在问题" prop="problem">
              <el-input size="small" v-model="form.problem" placeholder="请输入存在问题"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题描述" prop="checkdesc">
              <el-input size="small" v-model="form.checkdesc" placeholder="请输入问题描述"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="赔付金额" prop="paymoney">
              <el-input size="small" v-model="form.paymoney" placeholder="请输入赔付金额"/>
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
  import check from '@/api/check'
  import axios from 'axios'
  import { getToken } from '@/utils/auth'

  export default {
    // 写核心代码
    data() {
      return {
        loading: true,
        list: null, // 查询结果
        page: 1, // 当前页
        limit: 5, // 每页记录数
        total: 0, // 总记录数
        busCheckQuery: {},
        form: {},
        dialogVisible: false,
        tableChecked: [], // 批量删除的数据
        title: '修改检查单', // 对话框显示添加用户或修改用户
        multiple: true
      }
    },
    created() {
      this.getList()
    },
    methods: {
      exportExcel(checkid) {
        this.$confirm('是否确认导出编号为' + checkid + '的检查单信息?', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios({
            headers: {
              'Authorization': getToken()
            },
            url: `http://localhost:9999/check/export/${checkid}`,
            method: 'get',
            responseType: 'blob'
          }).then(response => {
            if (response.data.code >= 3001) {
              this.$message({
                type: 'danger',
                message: response.data.message
              })
            } else {
              const link = document.createElement('a')
              let blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
              link.style.display = 'none'
              link.href = URL.createObjectURL(blob)

              link.setAttribute('download', '检查单信息' + '.xlsx')
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }
          })
        })
      },
      getList(page = 1) {
        this.loading = true
        this.page = page
        check.list(this.page, this.limit, this.busCheckQuery)
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
        this.busCheckQuery = {}
        this.form = {}
        // 查询所有
        this.getList()
      },
      removeDataById(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            check.remove(id).then(response => {
              // 删除成功
              // 提示成功信息
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              // 重新刷新列表
              this.getList()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      removeBatch() {
        var ids = this.tableChecked.map(item => item.checkid)
        check.removeBatch(ids).then(response => {
          // 删除成功
          // 提示成功信息
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 重新刷新列表
          this.getList()
        })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      handleSelectionChange(val) {
        this.tableChecked = val
        this.multiple = !val.length
      },
      // 编辑
      edit(id) {
        // 弹出对话框
        this.dialogVisible = true
        // 根据用户身份证号查询用户信息
        check.getById(id).then(response => {
          this.form = response.data
        })
      },
      // 取消按钮
      cancel() {
        this.dialogVisible = false
        this.resetData()
      },
      submitForm() {
        check.edit(this.form).then(response => {
          // 提示成功信息
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          // 关闭对话框
          this.dialogVisible = false
          // 表单信息清空
          this.form = {}
          // 查询所有，更新数据
          this.getList()
        })
          .catch(error => {
            // 提示成功信息
            this.$message({
              type: 'danger',
              message: '修改失败!'
            })
            // 表单信息清空
            this.form = {}
            console.log(error)
          })
      }
    }
  }
</script>
