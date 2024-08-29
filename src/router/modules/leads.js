/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const leadsRouter = {
  path: '/leads',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Leads',
  meta: {
    title: 'Leads',
    icon: 'peoples'
  },
  children: [
    {
      path: 'leads-list',
      component: () => import('@/views/leads/index'),
      name: 'LeadsList',
      meta: { title: 'Leads', noCache: true }
    }
  ]
}

export default leadsRouter
