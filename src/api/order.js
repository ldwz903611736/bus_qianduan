import request from '@/utils/request'

export default {

  // 根据用户获取订单
  getByMember(page, count, query) {
    return request({
      url: `/order/list/${page}/${count}`,
      method: 'post',
      data: query
    })
  },

  // 支付订单
  pay(orderid) {
    return request({
      url: `/order/${orderid}`,
      method: 'put'
    })
  }

}
