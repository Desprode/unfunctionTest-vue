<template>
  <div>

    <Sider  ref="SiderBox" collapsible :collapsed-width="65" v-model="isCollapsed" class="siderBox"  hide-trigger>
      <Menu :active-name="currentMenu" theme="dark" width="auto" :class="menuitemClasses" @on-open-change="onOpenChange" ref="side_menu" class="siderMenu">
        <MenuItem name="1-1" >
          <router-link to="/" />
          <Icon type="ios-keypad"></Icon>
          <span>任务管理</span>
        </MenuItem>
        <MenuItem name="1-2">
          <router-link to="/script" />
          <Icon type="ios-paper-outline"></Icon>
          <span>脚本管理</span>
        </MenuItem>
        <MenuItem name="1-3">
          <router-link to="/senario" />
          <Icon type="ios-settings"></Icon>
          <span>场景管理</span>
        </MenuItem>
        <MenuItem name="1-4">
          <router-link to="/exequeue" />
          <Icon type="ios-barcode-outline" />
          <span>执行队列</span>
        </MenuItem>
        <MenuItem name="1-5">
          <router-link to="/exeresult" />
          <Icon type="ios-analytics" />
         <span>执行结果</span>
        </MenuItem>
        <Submenu name="2">
          <template slot="title"><Icon type="ios-cog" />插件管理</template>
          <MenuItem name="2-1">
            <router-link to="/userpluginmgr" />
            用户插件管理
          </MenuItem>
          <MenuItem name="2-2">
            <router-link to="/syspluginmgr" />
            系统插件管理
          </MenuItem>
        </Submenu>
        <!-- <MenuItem name="1-6">
          <Icon type="ios-cog" />
          <span>插件管理</span>
          <MenuItem name="1-6">
            <Icon type="ios-cog" />
            <span>插件管理1</span>
            <router-link to="/perftask" />
          </MenuItem>
        </MenuItem> -->
        <MenuItem name="1-7">
          <router-link to="/machine" />
          <Icon type="ios-keypad" />
          <span>机器管理</span>
        </MenuItem>

        
        <!-- <MenuItem name="1-11" >
          <router-link  to="/InterfaceCase" />
          <Icon type="ios-navigate"></Icon>
          <span>接口管理</span>
        </Submenu> -->
        <!-- <MenuItem name="1-12">
          <router-link to="/environmentManage" />
          <Icon type="ios-keypad"></Icon>
          <span>环境管理</span>
        </MenuItem> -->
        <!-- <MenuItem name="1-8">
          <router-link to="/AddGlobalConfig" />
          <Icon type="ios-analytics"></Icon>
          <span>全局配置</span>
        </MenuItem> -->
        <!-- <MenuItem name="1-9">
          <router-link to="/baffleConfiguration" />
          <Icon type="ios-book-outline" />
          <span>挡板配置</span>
        </MenuItem> -->
        <!-- <MenuItem name="1-10">
          <router-link to="/standardBasis" />
          <Icon type="ios-barcode-outline" />
         <span>依据标准</span>
        </MenuItem> -->
      </Menu>
      <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '-12px 8px 0 0'}" type="chevron-left" size="24" class="triggerBtn" color="white" ></Icon>
    </Sider>
    <!--<div >hhh</div>-->
  </div>
</template>
<script>
  export default {
    name: 'sider',
    data(){
      return{
        isCollapsed: false,
        pathActive:{
          agile:["1","1-1"],
          demand:["1","1-2"],
          product:["1","1-3"],
          iteration:["1","1-4"],
          development:["1","1-5"],
          defect:["1","1-6"],
          overView:["1","1-7"],
          'agile/detail':["1","1-8"],

        },
        OpenNames:[],//["1"]
        currentMenu:"1-1",//1-1
      }
    },
    methods:{
      collapsedSider () {
        this.$refs.SiderBox.toggleCollapse();
      },
      onOpenChange(name){
        console.log(name)
        //设置菜单展开子菜单的数组name
      },
      side_menu(param){
        let ON = this.pathActive[param][0];
        if(this.OpenNames.indexOf(ON) == -1){
          this.OpenNames.push(ON);
        }
        this.currentMenu = this.pathActive[param][1];
        this.$nextTick(()=>{
          this.$refs.side_menu.updateOpened();
          this.$refs.side_menu.updateActiveName();
        })
      },
    },


    computed: {
      rotateIcon () {
        return [
          'menu-icon',
          this.isCollapsed ? 'rotate-icon' : ''
        ];
      },
      menuitemClasses: function () {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      },

    },

  }
</script>
<style lang="less">
  .siderBox.ivu-layout-sider {
    width: 180px !important;
    min-width: 180px !important;
    max-width: 180px !important;
    flex: 0 0 180px !important;
  }
  .siderBox.ivu-layout-sider-collapsed {
    width: 65px !important;
    min-width: 65px !important;
    max-width: 65px !important;
    flex: 0 0 65px !important;
  }

  .siderBox {
    height:100%;
    overflow-y:auto;
    overflow-x:hidden;
    background: #333333;
    //
    .siderMenu li a {
      position:absolute;
      left:0;
      top: 0;
      width: 100%;
      height:100%;
      z-index:10;
    }
    .siderMenu li>span{
      padding-bottom: 1px;
    }



    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu) {
      color: white;
      background-color:#01babc;
    }
    //#01babc;// 需要的*****鼠标移上去的颜色

    .siderMenu {
      background: transparent;
    }
    .layout-con{
      height: 100%;
      width: 100%;
    }
    .triggerBtn {
      position:absolute;
      right:0;
      top:50%;
      z-index: 901;
      cursor: pointer;

    }
    .menu-icon{
      transition: all .3s;
    }
    .rotate-icon{
      transform: rotate(-180deg);
    }

    .menu-item span{
      display: inline-block;
      overflow: hidden;
      width: 85px;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: bottom;
      transition: width .2s ease .2s;
    }
    .menu-item i{
      transform: translateX(0px);
      transition: font-size .2s ease, transform .2s ease;
      vertical-align: middle;
      font-size: 16px;
    }


    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover{
      background-color:#01babc;
    }
    .collapsed-menu span{
      width: 0px;
      transition: width .2s ease;
    }
    .collapsed-menu i{
      transform: translateX(5px);
      transition: font-size .2s ease .2s, transform .2s ease .2s;
      vertical-align: middle;
      font-size: 22px;
    }


  }

  .ivu-layout-sider-children {
    height: 100%;
    padding-top: .1px;
    margin-top: -.1px;
    background: #32323a !important;
  }
  .siderBox .ivu-menu-item {
    border: none !important;
    border-left: none !important;
    border-right: none !important;
    border-top: none !important;
    border-bottom: 1px solid #232328 !important;
    padding: 9px 24px !important;
    text-align: left;
  }
  .siderBox .ivu-menu-item-selected {
    background: #01babc !important;
    color: #ebf7f7 !important;
    border-left: 3px solid #ffdf7b !important;
    border-right: 1px solid #00cccc !important;
    border-top: 1px solid #00cccc !important;
    border-bottom: 1px solid #00cccc !important;
  }

  // .router-span {
  //   display: block;
  //   width: 100%;
  //   height: 100%;
  // }

</style>
