import request from '@/utils/request'
import da from 'element-ui/src/locale/lang/da'

export default {

  list(page, count, userQuery) {
    return request({
      url: `/user/list/${page}/${count}`,
      method: 'post',
      data: userQuery
    })
  },

  add(SysRole) {
    return request({
      url: `/user`,
      method: 'post',
      data: SysRole
    })
  },

  getInfoById(userid) {
    return request({
      url: `/user/${userid}`,
      method: 'get'
    })
  },

  updateUser(SysUser) {
    return request({
      url: `/user`,
      method: 'put',
      data: SysUser
    })
  },

  deleteById(userid) {
    return request({
      url: `/user/${userid}`,
      method: 'delete'
    })
  },

  resetUserPwd(userid, pwd) {
    const data = {
      userid,
      pwd
    }
    return request({
      url: '/user/resetPwd',
      method: 'put',
      data: data
    })
  },

  changeUserStatus(userid, available) {
    const data = {
      userid,
      available
    }
    return request({
      url: `/user/changeStatus`,
      method: 'put',
      data: data
    })
  },

  getUserProfile() {
    return request({
      url: `/user/profile`,
      method: 'get'
    })
  },

  updateUserPwd(oldPassword, newPassword) {
    const data = {
      oldPassword,
      newPassword
    }
    return request({
      url: `/user/updatePwd`,
      method: 'put',
      params: data
    })
  }
}
