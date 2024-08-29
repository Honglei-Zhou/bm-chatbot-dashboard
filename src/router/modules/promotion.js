/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const promotionRouter = {
  path: '/promotion',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Promotion',
  meta: {
    title: 'Promotion',
    icon: 'shopping'
  },
  children: [
    {
      path: 'promotion-list',
      component: () => import('@/views/promotion/index'),
      name: 'PromotionList',
      meta: { title: 'Promotion', noCache: true }
    }
  ]
}

export default promotionRouter
