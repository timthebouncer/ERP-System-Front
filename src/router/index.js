import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
console.log('check is mobile?');
const isMobile = screen.width>600?false:true
let routes
const routes1 = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/check/Login/Login'),
  },
  {
    path: '/',
    name: 'check',
    component: () => import('../views/check/Layout.vue'),
    children: [
      {
        path: '/sales',
        name: 'sales',
        component: () => import('../views/check/Sales/index.vue'),
      },
      {
        path: '/shipment',
        name: 'shipment',
        component: () => import('../views/check/Sales/Shipment.vue'),
      },
      {
        path: '/salesDetail',
        name: 'salesDetail',
        component: () => import('../views/check/Sales/SalesDetail.vue'),
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
]

const routes2 =[
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/scale/login.vue'),
  },
  {
    path: '/',
    name: 'scale',
    component: () => import('../views/scale/layout.vue'),
    children: [
      {
        path: '/scale',
        name: 'scaleMain',
        component: () => import('../views/scale/index.vue'),
      },
    ],
  },
]
if(isMobile){
  routes = routes1
}
else{
  routes = routes2
}
const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  let verify = false;
  const token = sessionStorage.getItem('token')
  if(token === '200'){
    verify = true
  }

  if(to.path !== '/login'){
    if(verify){
      if(!isMobile && to.path !== '/scale' && to.path!=='/'){
        next('/')
      }
      else if(isMobile && to.path == '/scale'){
        next('/')
      }
      else{
        next()
      }

    }
    else{
      next({name: "login"})
    }
  }else if(to.path == '/login' && verify){
    next('/')
  }
  else{
    next()
  }
})

export default router
