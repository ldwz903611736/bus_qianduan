import request from '@/utils/request'

export default {

  // 根据用户获取订单
  add(busFault) {
    return request({
      url: `/fault`,
      method: 'post',
      data: busFault
    })
  },

  // 查看故障列表
  list(page, count, query) {
    return request({
      url: `/fault/list/${page}/${count}`,
      method: 'post',
      data: query
    })
  },

  // 处理故障
  handleFault(id) {
    return request({
      url: `/fault/${id}`,
      method: 'put'
    })
  }

}
