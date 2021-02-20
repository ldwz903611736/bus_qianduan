import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/example/table',
    name: '系统管理',
    meta: { title: '系统管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/user/index',
        name: '用户管理',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'table' }
      },
      {
        path: '/role/index',
        name: '角色管理',
        component: () => import('@/views/role/index'),
        meta: { title: '角色管理', icon: 'tree' }
      },
      {
        path: '/menu/index',
        name: '菜单管理',
        component: () => import('@/views/menu/index'),
        meta: { title: '菜单管理', icon: 'tree' }
      }
    ]
  },
  {
    path: '/base',
    component: Layout,
    redirect: '/example/table',
    name: '基础管理',
    meta: { title: '基础管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/customer/index',
        name: '客户管理',
        component: () => import('@/views/customer/index'),
        meta: { title: '客户管理', icon: 'table' }
      },
      {
        path: '/car/index',
        name: '车辆管理',
        component: () => import('@/views/car/index'),
        meta: { title: '车辆管理', icon: 'tree' }
      }
    ]
  },
  {
    path: '/business',
    component: Layout,
    redirect: '/example/table',
    name: '业务管理',
    meta: { title: '业务管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/carRent/index',
        name: '汽车出租',
        component: () => import('@/views/carRent/index'),
        meta: { title: '汽车出租', icon: 'table' }
      },
      {
        path: '/rentAgreement/index',
        name: '出租单管理',
        component: () => import('@/views/rentAgreement/index'),
        meta: { title: '出租单管理', icon: 'tree' }
      },
      {
        path: '/addCar/index',
        name: '汽车入库',
        component: () => import('@/views/addCar/index'),
        meta: { title: '汽车入库', icon: 'tree' }
      },
      {
        path: '/check/index',
        name: '检查单管理',
        component: () => import('@/views/check/index'),
        meta: { title: '检查单管理', icon: 'tree' }
      },
    ]
  },
  {
    path: '/stat',
    component: Layout,
    redirect: '/example/table',
    name: '统计分析',
    meta: { title: '统计分析', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/customerRegion/index',
        name: '客户地区统计',
        component: () => import('@/views/customerRegion/index'),
        meta: { title: '客户地区统计', icon: 'table' }
      },
      {
        path: '/customerRegionSex/index',
        name: '客户地区性别统计',
        component: () => import('@/views/customerRegionSex/index'),
        meta: { title: '客户地区性别统计', icon: 'tree' }
      },
      {
        path: '/opernameYearGrade/index',
        name: '业务员年度销售额',
        component: () => import('@/views/opernameYearGrade/index'),
        meta: { title: '业务员年度销售额', icon: 'tree' }
      },
      {
        path: '/companyYearGrade/index',
        name: '公司年度月份销售额',
        component: () => import('@/views/companyYearGrade/index'),
        meta: { title: '公司年度月份销售额', icon: 'tree' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
