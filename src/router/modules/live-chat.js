/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const fastQRouter = {
  path: '/chats',
  component: Layout,
  redirect: '/chats/live',
  name: 'FastQ',
  meta: {
    title: 'Live Chat',
    icon: 'wechat'
  },
  children: [
    {
      path: 'live-chat',
      component: () => import('@/views/chat/live-chat'),
      name: 'Chats',
      meta: { title: 'Chats', noCache: false }
    }
  ]
}

export default fastQRouter
