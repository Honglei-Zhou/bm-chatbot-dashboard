/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const boteditorRouter = {
  path: '/boteditor',
  component: Layout,
  redirect: 'noRedirect',
  name: 'BotEditor',
  meta: {
    title: 'Bot',
    icon: 'edit'
  },
  children: [
    {
      path: 'bot',
      component: () => import('@/views/boteditor/index'),
      name: 'Bot',
      meta: { title: 'Customize Bot', noCache: true }
    }
  ]
}

export default boteditorRouter
