<template>
  <div class="app-container">
    <el-divider content-position="left"><span>查询条件</span></el-divider>
    <el-form ref="loginLogQuery" :model="loginLogQuery" label-width="80px" class="demo-form-inline">
      <el-row>
        <el-col :span="6">
          <el-form-item label="登录地址" prop="title" >
            <el-input size="small" v-model="loginLogQuery.ipaddr" placeholder="请输入登录地址"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户名称" prop="operName">
            <el-input size="small" v-model="loginLogQuery.userName" placeholder="请输入用户名称" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="businessType">
            <el-select v-model="loginLogQuery.status" placeholder="操作类型" clearable size="small">
              <el-option
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.value"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="开始时间" prop="beginTime" >
            <el-date-picker
              size="small"
              v-model="loginLogQuery.beginTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              size="small"
              v-model="loginLogQuery.endTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getList()">搜索</el-button>
          <el-button type="default" icon="el-icon-refresh" size="mini" @click="resetData()">重置</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="danger" plain size="mini" icon="el-icon-delete" :disabled="multiple" @click="removeBatch()">删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="handleClean()">清空</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain size="mini" icon="el-icon-download" @click="exportExcel()">导出</el-button>
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

        <el-table-column prop="infoId" align="center" label="访问编号"/>

        <el-table-column prop="userName" align="center" label="用户名称"/>

        <el-table-column prop="ipaddr" align="center" label="登录地址"/>

        <el-table-column prop="loginLocation" align="center" label="登录地点"/>

        <el-table-column prop="browser" align="center" label="浏览器"/>

        <el-table-column prop="os" align="center" label="操作系统"/>

        <el-table-column prop="status" align="center" label="登录状态"/>

        <el-table-column prop="msg" align="center" label="登录信息"/>

        <el-table-column align="center" label="登录时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.loginTime | formatDate()}}
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
    </el-form>

  </div>
</template>

<script>

  import loginLog from '@/api/loginlog'
  import axios from 'axios'
  import { getToken } from '@/utils/auth'

  export default {
    data() {
      return {
        loading: true,
        open: false,
        list: null, // 查询结果
        page: 1, // 当前页
        limit: 5, // 每页记录数
        total: 0, // 总记录数
        loginLogQuery: {},
        multiple: true, // 删除按钮是否可用
        statusOptions: [
          {
            value: '成功'
          },
          {
            value: '失败'
          }
        ]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList(page = 1) {
        this.loading = true
        this.page = page
        loginLog.getList(this.page, this.limit, this.loginLogQuery).then(response => {
          this.list = response.data.rows
          this.total = response.data.total
          this.loading = false
        })
      },
      resetData() {
        this.loginLogQuery = {}
        this.getList()
      },
      exportExcel() {
        this.$confirm("是否确认导出所有登录日志数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          axios({
            headers: {
              'Authorization' : getToken()
            },
            url: `http://localhost:9999/loginLog/export`,
            method: 'post',
            data: this.loginLogQuery,
            responseType: 'blob'
          }).then(response => {
            if (response.data.code >= 3001) {
              this.$message({
                type: "danger",
                message: response.data.message
              })
            } else {
              const link = document.createElement('a');
              let blob = new Blob([response.data], {type: 'application/vnd.ms-excel'});
              link.style.display = 'none';
              link.href = URL.createObjectURL(blob);

              link.setAttribute('download', '日志' + '.xlsx');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          })
        })
      },
      /** 清空按钮操作 */
      handleClean() {
        this.$confirm('是否确认清空所有登录日志数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return loginLog.clean();
        }).then(() => {
          this.getList();
          this.$message({
            type: 'success',
            message: '清空成功!'
          })
        })
      },
      removeBatch() {
        var ids = this.tableChecked.map(item => item.operId)
        this.$confirm('是否确认删除日志编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          loginLog.removeBatch(ids).then(response => {
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
                message: '删除失败'
              })
            })
        })
      },
      handleSelectionChange(val) {
        this.tableChecked = val;
        this.multiple = !val.length;
      }
    }
  }
</script>
