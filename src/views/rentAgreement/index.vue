<template>
  <div class="app-container">
    <el-divider content-position="left"><span>查询条件</span></el-divider>
    <el-form ref="busRentQuery" :model="busRentQuery" label-width="80px" class="demo-form-inline">
      <el-row>
        <el-col :span="6">
          <el-form-item label="出租单号" prop="rentid">
            <el-input size="small" v-model="busRentQuery.rentid" placeholder="请输入出租单号"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="身份证号" prop="identity">
            <el-input size="small" v-model="busRentQuery.identity" placeholder="请输入身份证号"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车牌号" prop="carnumber">
            <el-input size="small" v-model="busRentQuery.carnumber" placeholder="请输入车牌号"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="开始时间" prop="begindate">
            <el-date-picker
              size="small"
              v-model="busRentQuery.begindate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="结束时间" prop="returndate">
            <el-date-picker
              size="small"
              v-model="busRentQuery.returndate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出租单状态" label-width="90px">
            <el-radio v-model="busRentQuery.rentflag" label="1">已归还</el-radio>
            <el-radio v-model="busRentQuery.rentflag" label="0">未归还</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getList()">搜索</el-button>
          <el-button type="default" icon="el-icon-refresh" size="mini" @click="resetData()">重置</el-button>
        </el-col>
      </el-row>

    </el-form>

    <el-table
      :data="list"
      border
      style="width: 100%"
      v-loading="loading"
    >

      <el-table-column prop="rentid" label="出租单号" align="center" fixed width="215"/>


      <el-table-column prop="identity" label="身份证号" align="center" width="165"/>

      <el-table-column prop="carnumber" label="车牌号" align="center" width="85"/>

      <el-table-column prop="price" label="出租价格" align="center" width="80"/>

      <el-table-column label="归还状态" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.rentflag === 0 ? '未归还' : '已归还'}}
        </template>
      </el-table-column>

      <el-table-column label="起租时间" align="center" width="155">
        <template slot-scope="scope">
          {{ scope.row.begindate | formatDate }}
        </template>
      </el-table-column>

      <el-table-column label="还车时间" align="center" width="155">
        <template slot-scope="scope">
          {{ scope.row.returndate | formatDate }}
        </template>
      </el-table-column>

      <el-table-column prop="opername" align="center" label="操作员" width="95px"/>

      <el-table-column label="录入时间" align="center" width="155">
        <template slot-scope="scope">
          {{ scope.row.createtime | formatDate }}
        </template>
      </el-table-column>


      <el-table-column label="操作" align="center" fixed="right" width="300">
        <template slot-scope="scope">

          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="edit(scope.row.rentid)"
          >编辑
          </el-button>

          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.rentid)"
          >删除
          </el-button>

          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            :disabled="scope.row.rentflag === 1"
            @click="goCheckAdd(scope.row.rentid)"
          >添加检查单
          </el-button>

          <el-button
            type="text"
            size="mini"
            icon="el-icon-download"
            @click="exportExcel(scope.row.rentid)"
          >导出出租单
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

    <!-- 编辑对话框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="还车时间" prop="returndate">
              <el-date-picker
                size="small"
                v-model="form.returndate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="归还状态">
              <el-radio-group v-model="form.rentflag">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}
                </el-radio>
              </el-radio-group>
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
  import rent from '@/api/rent'
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
        busRentQuery: {},
        form: {},
        dialogVisible: false,
        tableChecked: [], // 批量删除的数据
        title: '编辑出租单', // 对话框显示添加用户或修改用户
        statusOptions: [
          {
            value: 0,
            label: '未归还'
          },
          {
            value: 1,
            label: '已归还'
          }
        ]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      exportExcel(rentid) {
        this.$confirm('是否确认导出编号为' + rentid + '的出租单信息?', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios({
            headers: {
              'Authorization': getToken()
            },
            url: `http://localhost:9999/rent/export/${rentid}`,
            method: 'get',
            responseType: 'blob'
          }).then(response => {
            const link = document.createElement('a')
            let blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)

            link.setAttribute('download', '出租单信息' + '.xlsx')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          })
        })
      },
      getList(page = 1) {
        this.loading = true
        this.page = page
        rent.list(this.page, this.limit, this.busRentQuery)
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
        this.busRentQuery = {}
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
            rent.remove(id).then(response => {
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
      // 编辑
      edit(id) {
        // 弹出对话框
        this.dialogVisible = true
        // 根据用户身份证号查询用户信息
        rent.getById(id).then(response => {
          this.form = response.data
        })
      },
      // 取消按钮
      cancel() {
        this.dialogVisible = false
        this.resetData()
      },
      submitForm() {
        rent.edit(this.form).then(response => {
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
      },
      goCheckAdd(rentid) {
        this.$router.push({ path: '/check/add', query: { rentid: rentid } })
      }
    }
  }
</script>
