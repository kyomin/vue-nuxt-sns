import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _63ea03a9 = () => interopDefault(import('../pages/profile.vue' /* webpackChunkName: "pages/profile" */))
const _47c41270 = () => interopDefault(import('../pages/signup.vue' /* webpackChunkName: "pages/signup" */))
const _f688f784 = () => interopDefault(import('../pages/post/_id/index.vue' /* webpackChunkName: "pages/post/_id/index" */))
const _60be7f5c = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/profile",
    component: _63ea03a9,
    name: "profile"
  }, {
    path: "/signup",
    component: _47c41270,
    name: "signup"
  }, {
    path: "/post/:id",
    component: _f688f784,
    name: "post-id"
  }, {
    path: "/",
    component: _60be7f5c,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
