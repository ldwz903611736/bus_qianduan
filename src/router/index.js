import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { getToken } from '@/utils/auth'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import fa from 'element-ui/src/locale/lang/fa'
import menu from '@/api/menu'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    name: "登录",
    hidden: true
  },
  {
    path:'/register',
    component: () => import('@/views/login/register'),
    name: "注册",
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    name: "404",
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    name: "首页",
    children: [{
      path: '/dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/system',
    component: Layout,
    name: '系统管理',
    alwaysShow: true,
    meta: { title: '系统管理', icon: 'system' },
    children: [
      {
        path: '/user/index',
        name: '用户管理',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'user' },
      },
      {
        path: '/role/index',
        name: '角色管理',
        component: () => import('@/views/role/index'),
        meta: { title: '角色管理', icon: 'peoples' },
      },
      {
        path: '/menu/index',
        name: '菜单管理',
        component: () => import('@/views/menu/index'),
        meta: { title: '菜单管理', icon: 'tree-table' },
      }
    ]
  },
  {
    path: '/base',
    component: Layout,
    name: '基础管理',
    hidden: false,
    alwaysShow: true,
    meta: { title: '基础管理', icon: 'system' },
    children: [
      {
        path: '/customer/index',
        name: '客户管理',
        component: () => import('@/views/customer/index'),
        meta: { title: '客户管理', icon: 'peoples' },
      },
      {
        path: '/car/index',
        name: '车辆管理',
        component: () => import('@/views/car/index'),
        meta: { title: '车辆管理', icon: 'car' },
      }
    ]
  },
  {
    path: '/business',
    component: Layout,
    name: '业务管理',
    alwaysShow: true,
    meta: { title: '业务管理', icon: 'system' },
    children: [
      {
        path: '/carRent/index',
        name: '汽车出租',
        component: () => import('@/views/carRent/index'),
        meta: { title: '汽车出租', icon: 'chuzu' },
      },
      {
        path: '/rentAgreement/index',
        name: '出租单管理',
        component: () => import('@/views/rentAgreement/index'),
        meta: { title: '出租单管理', icon: 'dan' },
      },
      {
        path: '/faultFeedback/index',
        name: '故障查看',
        component: () => import('@/views/faultFeedback/index'),
        meta: { title: '故障查看', icon: 'ruku' },
      },
      {
        path: '/check/index',
        name: '检查单管理',
        component: () => import('@/views/check/index'),
        meta: { title: '检查单管理', icon: 'dan' },
      },
    ]
  },
  {
    path: '/stat',
    component: Layout,
    name: '统计分析',
    alwaysShow: true,
    meta: { title: '统计分析', icon: 'fenxi' },
    children: [
      {
        path: '/customerRegion/index',
        name: '客户地区统计',
        component: () => import('@/views/customerRegion/index'),
        meta: { title: '客户地区统计', icon: 'bingtu' },
      },
      {
        path: '/customerRegionSex/index',
        name: '客户地区性别统计',
        component: () => import('@/views/customerRegionSex/index'),
        meta: { title: '客户地区性别统计', icon: 'bingtu' },
      },
      {
        path: '/companyYearGrade/index',
        name: '公司年度月份销售额',
        component: () => import('@/views/companyYearGrade/index'),
        meta: { title: '公司年度月份销售额', icon: 'zhexiantu' },
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    name: '系统监控',
    alwaysShow: true,
    meta: { title: '系统监控', icon: 'monitor' },
    children: [
      {
        path: '/monitor/task',
        name: '定时任务',
        component: () => import('@/views/task/index'),
        meta: { title: '定时任务', icon: 'task' },
      },
      {
        path: '/monitor/druid',
        name: '数据监控',
        component: () => import('@/views/druid/index'),
        meta: { title: '数据监控', icon: 'druid' },
      },
    ]
  },
  {
    path: '/log',
    component: Layout,
    name: '日志管理',
    alwaysShow: true,
    meta: { title: '日志管理', icon: 'log' },
    children: [
      {
        path: '/log/operlog',
        name: '操作日志',
        component: () => import('@/views/operlog/index'),
        meta: { title: '操作日志', icon: 'form' },
      },
      {
        path: '/log/logininfor',
        name: '登录日志',
        component: () => import('@/views/logininfor/index'),
        meta: { title: '登录日志', icon: 'logininfor' },
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    name: "个人中心",
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: (resolve) => require(['@/views/userprofile/index'], resolve),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/member/rent',
    component: Layout,
    name: "汽车租赁",
    children: [{
      path: '/member/rent',
      name: '汽车租赁',
      component: () => import('@/views/member/rent'),
      meta: { title: '汽车租赁', icon: 'car' }
    }]
  },
  {
    path: '/member/myRent',
    component: Layout,
    name: "我的租赁",
    children: [{
      path: '/member/myRent',
      name: '我的租赁',
      component: () => import('@/views/member/myRent'),
      meta: { title: '我的租赁', icon: 'car' }
    }]
  },
  {
    path: '/member/order',
    component: Layout,
    name: "我的订单",
    children: [{
      path: '/member/order',
      name: '我的订单',
      component: () => import('@/views/member/order'),
      meta: { title: '我的订单', icon: 'car' }
    }]
  },
  {
    path: '/member/check',
    component: Layout,
    name: "我的检查单",
    children: [{
      path: '/member/check',
      name: '我的检查单',
      component: () => import('@/views/member/check'),
      meta: { title: '我的检查单', icon: 'car' }
    }]
  },
  {
    path: '/member/faultFeedback',
    component: Layout,
    name: "故障反馈",
    children: [{
      path: '/member/faultFeedback',
      name: '故障反馈',
      component: () => import('@/views/member/faultFeedback'),
      meta: { title: '故障反馈', icon: 'car' }
    }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', name: "*", redirect: '/404', hidden: true }
]

export default new Router({
  routes: constantRoutes
})

// const createRouter = () => new Router({
//   // mode: 'history', // require service support
//   routes: constantRoutes
// })
//
// const router = createRouter()
//
// // Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
// }
//
// export default router
