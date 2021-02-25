<template>
  <div class="app-container">
    <el-divider content-position="left"><span>查询条件</span></el-divider>
    <el-form ref="operLogQuery" :model="operLogQuery" label-width="80px" class="demo-form-inline">
      <el-row>
        <el-col :span="6">
          <el-form-item label="系统模块" prop="title" >
            <el-input size="small" v-model="operLogQuery.title" placeholder="请输入系统模块"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="操作人员" prop="operName">
            <el-input size="small" v-model="operLogQuery.operName" placeholder="请输入操作人员" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="类型" prop="businessType">
            <el-select v-model="operLogQuery.businessType" placeholder="操作类型" clearable size="small">
              <el-option
                v-for="dict in businessTypeOptions"
                :key="dict.value"
                :label="dict.label"
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
              v-model="operLogQuery.beginTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              size="small"
              v-model="operLogQuery.endTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="status">
            <el-select v-model="operLogQuery.status" placeholder="状态" clearable size="small">
              <el-option
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
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
      >

        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column prop="operId" align="center" label="日志编号"/>

        <el-table-column prop="title" align="center" label="系统模块"/>

        <el-table-column align="center" label="操作类型">
          <template slot-scope="scope">
            {{ convertBusinessType(scope.row.businessType) }}
          </template>
        </el-table-column>

        <el-table-column prop="requestMethod" align="center" label="请求方式"/>

        <el-table-column prop="operName" align="center" label="操作人员"/>

        <el-table-column prop="operIp" align="center" label="主机"/>

        <el-table-column prop="operLocation" align="center" label="操作地点"/>

        <el-table-column align="center" label="操作状态">
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? '成功' : '失败'}}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作日期" width="200">
          <template slot-scope="scope">
            {{ scope.row.operTime | formatDate }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-view"
              @click="handleView(scope.row,scope.index)"
            >详细</el-button>
          </template>
        </el-table-column>
       </el-table>

       <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        background
        layout="prev, pager, next"
        @current-change="getList"
      />
    </el-form>

    <!-- 操作日志详细 -->
    <el-dialog title="操作日志详细" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ form.title }}</el-form-item>
            <el-form-item
              label="登录信息："
            >{{ form.operName }} / {{ form.operIp }} / {{ form.operLocation }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
            <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="form.status === 0">正常</div>
              <div v-else-if="form.status === 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{ form.operTime |　formatDate }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  import operLog from '@/api/log'
  import axios from 'axios'
  import { getToken } from '@/utils/auth'

  export default {
    data() {
      return {
        open: false,
        list: null, // 查询结果
        page: 1, // 当前页
        limit: 5, // 每页记录数
        total: 0, // 总记录数
        form: {}, // 操作日志详细
        operLogQuery: {},
        multiple: true, // 删除按钮是否可用
        businessTypeOptions: [
          {
            value: 0,
            label: "其他"
          },
          {
            value: 1,
            label: "新增"
          },
          {
            value: 2,
            label: "修改"
          },
          {
            value: 3,
            label: "删除"
          }
        ],
        statusOptions: [
          {
            value: 0,
            label: "正常"
          },
          {
            value: 1,
            label: "失败"
          },
        ]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList(page = 1) {
        this.page = page
        operLog.getList(this.page, this.limit, this.operLogQuery).then(response => {
            this.list = response.data.rows
            this.total = response.data.total
        })
      },
      resetData() {
        this.operLogQuery = {}
        this.getList()
      },
      exportExcel() {
        this.$confirm("是否确认导出所有操作日志数据项", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          axios({
            headers: {
              'Authorization' : getToken()
            },
            url: `http://localhost:9999/log/export`,
            method: 'post',
            data: this.operLogQuery,
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
        this.$confirm('是否确认清空所有操作日志数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return operLog.clean();
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
          operLog.removeBatch(ids).then(response => {
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
      convertBusinessType(type) {
        switch(type) {
          case 0:
            return '其它'
            break;
          case 1:
            return '新增'
            break;
          case 2:
            return '修改'
            break;
          case 3:
            return '删除'
            break;
          default:
            return 'NULL'
        }
      },
      handleSelectionChange(val) {
        this.tableChecked = val;
        this.multiple = !val.length;
      },
      /** 详细按钮操作 */
      handleView(row) {
        this.open = true;
        this.form = row;
      },
    }
  }
</script>
