<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="用户昵称" prop="realname">
      <el-input v-model="user.realname"/>
    </el-form-item>
    <el-form-item label="手机号码" prop="phone">
      <el-input v-model="user.phone" maxlength="11"/>
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio
          v-for="dict in sexOptions"
          :key="dict.value"
          :label="dict.value"
        >{{dict.label}}
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

  import user from '@/api/user'

  export default {
    props: {
      user: {
        type: Object
      }
    },
    data() {
      return {
        // 表单校验
        rules: {
          nickName: [
            { required: true, message: '用户昵称不能为空', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
            {
              type: 'email',
              message: '\'请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }
          ],
          phonenumber: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: '请输入正确的手机号码',
              trigger: 'blur'
            }
          ]
        },
        sexOptions: [
          {
            value: 0,
            label: '女'
          },
          {
            value: 1,
            label: '男'
          }
        ]
      }
    },
    methods: {
      submit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            user.updateUser(this.user).then(response => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            })
          }
        })
      },
      close() {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push({ path: '/dashboard' })
      }
    }
  }
</script>
