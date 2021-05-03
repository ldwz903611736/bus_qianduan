<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="110px">
      <el-form-item label="车牌号">
        <el-input v-model="form.carnumber" size="medium" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="故障描述">
        <el-input v-model="form.description" size="medium" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="故障类型">
        <el-select v-model="form.type" placeholder="请选择活动区域">
          <el-option label="软件故障" value="软件故障"></el-option>
          <el-option label="机器故障" value="机器故障"></el-option>
          <el-option label="车身故障" value="车身故障"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发现故障的时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.findtime" style="width: 300px;"></el-date-picker>
        </el-col>
      </el-form-item>
      <!--      <el-form-item label="是否影响驾驶">-->
      <!--        <el-switch v-model="form.delivery"></el-switch>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="是否需要修理">-->
      <!--        <el-switch v-model="form.delivery"></el-switch>-->
      <!--      </el-form-item>-->
      <el-form-item label="是否影响驾驶" prop="available">
        <el-select
          v-model="form.influence"
          placeholder="是否影响驾驶"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否需要修理" prop="available">
        <el-select
          v-model="form.replacement"
          placeholder="是否需要修理"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remarks" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add">上报故障</el-button>
        <el-button @click="resetData">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import fault from '@/api/fault'

  export default {
    data() {
      return {
        form: {},
        statusOptions: [
          {
            value: 1,
            label: '是'
          },
          {
            value: 0,
            label: '否'
          }
        ]
      }
    },
    methods: {
      add() {
        fault.add(this.form).then(response => {
          this.$message({
            type: 'success',
            message: '上报成功，稍后我们将会与您取得联系！'
          })
          this.resetData()
        }).then(error => {
          console.log(error)
        })
      },
      resetData() {
        this.form = {}
      }
    }
  }
</script>
