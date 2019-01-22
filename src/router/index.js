import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import LeftMainmenu from '@/components/LeftMainmenu.vue'
// import InterfaceCase from '@/views/InterfaceCase/InterfaseCaseIndex/InterfaceCase'
// import AddCase from '@/views/InterfaceCase/AddCase/AddCase'
// import EnvironmentManage from '@/views/EnvironmentManagement/EnvironmentManageIndex/EnvironmentManage'
// import AddGlobalConfig from '@/views/AddGlobalConfig/AddGlobalConfig'

import AddGlobalConfig from '@/views/AddGlobalConfig/AddGlobalConfig'
import Monitoring from '@/views/ExeQueue/Monitoring/Monitoring'  
import PerfTask from '@/views/PerfTask/PerfTask.vue'
import Script from '@/views/Script/Script.vue'
import ScriptDetail from '@/views/Script/ScriptDetail.vue'
import Senario from '@/views/Senario/SenarioManager.vue'
import ExeQueue from '@/views/ExeQueue/ExeQueue.vue'
import ExeResult from '@/views/ExeResult/ExeResult.vue'
import Merge from '@/views/ExeResult/Report/GetMerge.vue'
import Details from   '@/views/ExeResult/Details.vue'
import Load from   '@/views/ExeResult/Report/Mix.vue'
import Machine from '@/views/Machine/Machine.vue'
import SysPluginMgr from '@/views/SysPluginMgr/SysPluginMgr.vue'
import UserPluginMgr from '@/views/UserPluginMgr/UserPluginMgr.vue'
import MonitorEcharts from '@/views/ExeQueue/MonitorEcharts.vue'

//合并挡板配置
// const BaffleConfiguration = resolve => require(['@/views/BaffleConfiguration/BaffleConfigurationIndex/BaffleConfiguration'],resolve);

//挡板新增
// import AddMock from '@/views/BaffleConfiguration/AddMock/AddMock.vue'
// import StandardBasis from '@/views/StandardBasis/StandardBasis'

// 所有权限通用路由表（如首页、登录页和一些不用权限的公用页面）
export const constantRouterMap = [
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
        path: '/script_detail',
        name: 'ScriptDetail',
        component: ScriptDetail
      },
      {
        path: '/senario',
        name: 'Senario',
        component: Senario
      },
      {
        path: '/exequeue',
        name: 'ExeQueue',
        component: ExeQueue
      },
      {
        path: '/exeresult',
        name: 'ExeResult',
        component: ExeResult
      },
      {
        path: '/details',
        name: 'Details',
        component: Details
      },
      {
        path: '/load',
        name: 'Load',
        component: Load
      },
      {
        path: '/merge',
        name: 'Merge',
        component: Merge
      },
      {
        path: '/syspluginmgr',
        name: 'SysPluginMgr',
        component: SysPluginMgr
      },
      {
        path: '/userpluginmgr',
        name: 'UserPluginMgr',
        component: UserPluginMgr
      },
      {
        path: '/machine',
        name: 'Machine',
        component: Machine
      },


      // {
      //   path: '/InterfaceCase',
      //   name: 'InterfaceCase',
      //   component: InterfaceCase
      // },
      // {
      //   path:'/addCase',
      //   name:'addCase',
      //   component:AddCase,
      //   props:true
      // },
      {
        path:'/monitoring',
        name:'monitoring',
        component:Monitoring,
        props:true
      },
      {
        path:'/monitorEcharts',
        name:'monitorEcharts',
        component:MonitorEcharts,
      },
      
      // {
      //   path:'/environmentManage',
      //   name:'EnvironmentManage',
      //   component:EnvironmentManage
      // },
      // {
      //   path:'/addGlobalConfig',
      //   name:'AddGlobalConfig',
      //   component:AddGlobalConfig
      // },
      // {
      //   path:'baffleConfiguration',
      //   name:'BaffleConfiguration',
      //   component:BaffleConfiguration,
      // },
      // {
      //   path:'/addMock',
      //   name:'addMock',
      //   component:AddMock
      // },
      // {
      //   path:'/standardBasis',
      //   name:'standardBasis',
      //   component:StandardBasis
      // }

    ]
  },

]

// 实例化vue的时候只挂载constantRouter
export default new Router({
  routes: constantRouterMap
});

// // 异步挂载的路由
// export const asyncRouterMap = [
//   {
//     path: '/permission',
//     name: 'LeftMainmeuWithPerm',
//     component: LeftMainmenu,
//     meta: {
//       role: ['admin', 'super_editor']
//     }, 
//     children: [
//       {
//         path: '/machine',
//         name: 'Machine',
//         component: Machine, 
//         meta: {
//           role: ['admin', 'super_editor']
//         }
//       }
//     ]
//   },
//   // 404页面一定要在所有的最后加载，如果在前面默认加载菜单的最后写了404的话，那么下面这些有特定权限的页面也会被拦截到404
//   {
//     path: '*', 
//     redirect: '/404', 
//     hidden: true
//   }
// ];

// router.beforeEach((to, from, next) => {
//   //to and from are Route Object,next() must be called to resolve the hook
//   if (store.getters.token) {    // 判断是否有token
//     if (to.path === '/login') {
//       next({path: '/'});
//     } else {
//       if (store.getters.roles.length === 0) {     // 判断当前用户是否已拉取完user_info信息
//         store.dispatch('GetInfo').then(res => {   // 拉取info
//           const roles = res.data.role;
//           store.dispatch('GenerateRoutes', { roles}).then( () => {    // 生成可访问的路由表
//             router.addRoutes(store.getters.addRoutes)       // 动态添加可访问路由表
//             next({ ...to, replace: true})       // hack方法 确保addRoutes已完成， set the replace: true so the navigation will not leave a history record
//           } )
//         }).catch( err => {
//           console.log(err);
//         });
//       } else {
//         next()      // 当有用户权限的时候，说明所有可访问路由已生成，如访问没权限的界面会自动进入404页面
//       }
//     }
//   } else {
//     if ( whiteList.indexOf(to.path) !== -1 ){     // 在免登陆白名单，直接进入
//       next();
//     } else {
//       next('/login');     //否则全部重定向到登陆页
//     }
//   }
// });
