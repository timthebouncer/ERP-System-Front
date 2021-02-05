import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'check',
    component: () => import('../views/check/Layout.vue'),
    redirect:'/clogin',
    children: [
      {
        path: '/clogin',
        name: 'checkLogin',
        component: () => import('../views/check/Login.vue'),
      },
      {
        path: '/sales',
        name: 'sales',
        component: () => import('../views/check/Sales/index.vue'),
      },
      {
        path: '/salesLog',
        name: 'salesLog',
        component: () => import('../views/check/Sales/SalesLog.vue'),
      },
      {
        path: '/restore',
        name: 'restore',
        component: () => import('../views/check/Restore/index.vue'),
      },
      {
        path: '/restoreLog',
        name: 'restoreLog',
        component: () => import('../views/check/Restore/restoreLog.vue'),
      },
      {
        path: '/cancelRestoreLog',
        name: 'cancelRestoreLog',
        component: () => import('../views/check/Restore/cancelRestoreLog.vue'),
      },
      {
        path: '/cancelRestore',
        name: 'cancelRestore',
        component: () => import('../views/check/Restore/cancelRestore.vue'),
      },
    ],
  },
  {
    path: '/',
    name: 'scale',
    component: () => import('../views/scale/layout.vue'),
    children: [
      {
        path: '/slogin',
        name: 'scaleLogin',
        component: () => import('../views/scale/login.vue'),
      },
      {
        path: '/scale',
        name: 'scaleMain',
        component: () => import('../views/scale/index.vue'),
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
