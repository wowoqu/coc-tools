import { createRouter, createWebHashHistory } from 'vue-router'
import { useTrade } from '@/composables/useTrade'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'trade',
      component: () => import('@/views/TradeView.vue'),
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import('@/views/PreviewView.vue'),
      beforeEnter: () => {
        const { canPreview } = useTrade()
        return canPreview.value ? true : { name: 'trade' }
      },
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
