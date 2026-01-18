import { createRouter, createWebHistory } from 'vue-router'
import { auth } from "@/firebase/config";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'login',
      path: '/',
      component: () => import('../login.vue'),
      meta: { requiresAuth: false },
    },
    {
      name: 'register',
      path: '/register',
      component: () => import('../register.vue'),
      meta: { requiresAuth: false },
    },
    {
      name: 'home',
      path: '/home',
      component: () => import('../home.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  if (to.meta.requiresAuth && !user) {
    next({ name: 'login' })
  } else {
    next()
  }
})
export default router
