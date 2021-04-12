import request from '@/utils/request'

export default {
  // 获取job列表
  listJob(page, count) {
    return request({
      url: `/job/list/${page}/${count}`,
      method: 'get'
    })
  },

  // 获取详细信息
  getJob(jobId) {
    return request({
      url: `/job/${jobId}`,
      method: 'get'
    })
  },

  // 删除定时任务
  delJob(jobIds) {
    return request({
      url: `/job/${jobIds}`,
      method: 'delete'
    })
  },

  // 添加定时任务
  addJob(job) {
    return request({
      url: `/job`,
      method: 'post',
      data: job
    })
  },

  // 修改定时任务
  updateJob(job) {
    return request({
      url: `/job`,
      method: 'put',
      data: job
    })
  },

  // 执行定时任务
  runJob(jobId) {
    return request({
      url: `/job/run/${jobId}`,
      method: 'get'
    })
  },

  // 修改定时任务状态
  changeJobStatus(jobId) {
    return request({
      url: `/job/changeStatus/${jobId}`,
      method: 'put'
    })
  }

}
