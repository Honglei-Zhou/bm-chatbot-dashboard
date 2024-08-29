/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const adminRouter = {
  path: '/admin',
  component: Layout,
  redirect: '/admin/users',
  name: 'Admin',
  meta: {
    title: 'Admin',
    icon: 'lock'
  },
  children: [
    {
      path: 'users',
      component: () => import('@/views/admin/users'),
      name: 'Users',
      meta: { title: 'Users', noCache: false }
    }
  ]
}

export default adminRouter
