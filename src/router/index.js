import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'barcode',
    component: () => import('../views/barcode/layout.vue'),
    children: [
      {
        path: '/blogin',
        name: 'barcodeLogin',
        component: () => import('../views/barcode/login.vue'),
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
