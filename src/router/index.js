import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import LeftMainmenu from '@/components/LeftMainmenu.vue'
import InterfaceCase from '@/views/InterfaceCase/InterfaseCaseIndex/InterfaceCase'
import AddCase from '@/views/InterfaceCase/AddCase/AddCase'
import EnvironmentManage from '@/views/EnvironmentManagement/EnvironmentManageIndex/EnvironmentManage'
import AddGlobalConfig from '@/views/AddGlobalConfig/AddGlobalConfig'


import PerfTask from '@/views/PerfTask/PerfTask.vue'
import Script from '@/views/Script/Script.vue'
import Senario from '@/views/Senario/SenarioManager.vue'

//合并挡板配置
// const BaffleConfiguration = resolve => require(['@/views/BaffleConfiguration/BaffleConfigurationIndex/BaffleConfiguration'],resolve);

//挡板新增
import AddMock from '@/views/BaffleConfiguration/AddMock/AddMock.vue'
import StandardBasis from '@/views/StandardBasis/StandardBasis'
export default new Router({
  routes: [
    {
      path: '/',
      name: 'LeftMainmeu',
      component: LeftMainmenu,
      redirect:'/perftask',
      children:[
        {
          path: '/perftask',
          name: 'PerfTask',
          component: PerfTask
        },
        {
          path: '/script',
          name: 'Script',
          component: Script
        },
        {
          path: '/senario',
          name: 'Senario',
          component: Senario
        },


        {
          path: '/InterfaceCase',
          name: 'InterfaceCase',
          component: InterfaceCase
        },
        {
          path:'/addCase',
          name:'addCase',
          component:AddCase,
          props:true
        },
        {
          path:'/environmentManage',
          name:'EnvironmentManage',
          component:EnvironmentManage
        },
        {
          path:'/addGlobalConfig',
          name:'AddGlobalConfig',
          component:AddGlobalConfig
        },
        // {
        //   path:'baffleConfiguration',
        //   name:'BaffleConfiguration',
        //   component:BaffleConfiguration,
        // },
        {
          path:'/addMock',
          name:'addMock',
          component:AddMock
        },
        {
          path:'/standardBasis',
          name:'standardBasis',
          component:StandardBasis
        }

      ]
    },

  ]
})
