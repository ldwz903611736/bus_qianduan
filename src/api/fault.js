import request from '@/utils/request'

export default {

  // 根据用户获取订单
  add(busFault) {
    return request({
      url: `/fault`,
      method: 'post',
      data: busFault
    })
  }

}
