import request from '@/utils/request'
import id from 'element-ui/src/locale/lang/id'

export default {
  // 检查单列表
  list(page, count, busCheckQuery) {
    return request({
      url: `/check/list/${page}/${count}`,
      method: 'post',
      data: busCheckQuery
    })
  },

  // 根据ID查询检查单信息
  getById(checkid) {
    return request({
      url: `/check/${checkid}`,
      method: 'get'
    })
  },

  // 添加检查单
  add(busCheck) {
    return request({
      url: `/check`,
      method: 'post',
      data: busCheck
    })
  },

  // 修改检查单
  edit(busCheck) {
    return request({
      url: `/check`,
      method: 'put',
      data: busCheck
    })
  },

  // 删除检查单
  remove(checkid) {
    return request({
      url: `/check/${checkid}`,
      method: 'delete'
    })
  },

  // 批量删除客户
  removeBatch(ids) {
    return request({
      url: `/check/removeBatch`,
      method: 'delete',
      data: ids
    })
  }

}
