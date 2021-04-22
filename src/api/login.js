import request from '@/utils/request'
import da from 'element-ui/src/locale/lang/da'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
