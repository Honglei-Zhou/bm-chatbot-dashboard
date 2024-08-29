/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chatRouter = {
  path: '/history',
  component: Layout,
  redirect: '/history/chat-sessions',
  name: 'History',
  meta: {
    title: 'History',
    icon: 'example'
  },
  children: [
    {
      path: 'chat-sessions',
      component: () => import('@/views/chat/chat-sessions'),
      name: 'ChatSessions',
      meta: { title: 'Chat Sessions', noCache: false }
    },
    {
      path: 'messages',
      component: () => import('@/views/chat/messages'),
      name: 'Messages',
      meta: { title: 'Messages', noCache: false }
    },
    {
      path: 'messages/:sessionId',
      component: () => import('@/views/chat/session-messages'),
      hidden: true,
      name: 'ChatMessages',
      meta: { title: 'Chat Messages', noCache: false }
    }
  ]
}

export default chatRouter
