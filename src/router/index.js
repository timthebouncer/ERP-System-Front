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
