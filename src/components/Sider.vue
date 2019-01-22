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
          <MenuItem name="2-2" v-show="hasSysPlgnMng">
            <router-link to="/syspluginmgr" />
            系统插件管理
          </MenuItem>
        </Submenu>
        <MenuItem name="1-7" v-show="hasMchnMng">
          <router-link to="/machine" />
          <Icon type="ios-keypad" />
          <span>机器管理</span>
        </MenuItem>
      </Menu>
      <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '-12px 8px 0 0'}" type="chevron-left" size="24" class="triggerBtn" color="white" ></Icon>
    </Sider>
    <!--<div >hhh</div>-->
  </div>
</template>
<script>
  import global_ from 'header/global'
  import cookie_ from 'header/cookie'
  import axios from 'axios'

  export default {
    name: 'sider',
    data(){
      return{
        hasSysPlgnMng: false, 
        hasMchnMng: false, 
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
    created () {
      let userName = this.$Global.getCookie('username');
      console.log("userName: ", userName);
      let _this = this;

      if (userName == '' || userName == null || userName == undefined) {
          //验证用户是否登陆，发送请求获取，有可能用户在其他页面做过登陆操作。
          axios.get(global_.login2_url + '/api/checkLogin', { params: {} }).then((parm) => {
            let parmdata = parm.data;
            // console.log(parmdata.nickname+"!!!!!!!!!");
            cookie_.setCookie('nickname', parmdata.nickname, 'd30');
            cookie_.setCookie('username', parmdata.username, 'd30');

            console.log('*** sider.vue *** parmdata.username: ', parmdata.username);

            this.getUsrPermissions(parmdata.username);
          }).catch((error) => {})
      } else {
        console.log('*** sider.vue *** userName: ', userName);
        this.getUsrPermissions(userName);
      }
    }, 
    methods:{
      /**获取用户权限信息 */
      getUsrPermissions(username) {
        let _this = this;

        axios.post('/myapi/user/getUserPermissions', {
            userId: username,
        }).then(function (response) {
            if (response.data.result == "fail") {
                // resp = {'result': 'fail'};
                // resp.set('result', 'fail');
            } else if (response.data.result == "ok") {
                // console.log("get user permissions: ", response);
                let results = response.data.resultList;
                // console.log("results: ", results);

                _this.$Global.userPermissions = [];
                // console.log("userPermissions before: ", _this.userPermissions);
                for (let perm in results) {
                    // console.log("perm: ", results[perm].name);
                    _this.$Global.userPermissions.push(results[perm].name);

                    if ( results[perm].name == 'apts_nfunSysPlgnMng' ) {
                      console.log("apts_nfunSysPlgnMng True !!!");
                      _this.hasSysPlgnMng = true;
                    } else if ( results[perm].name == 'apts_nfunMchnMng' ) {
                      console.log("apts_nfunMchnMng True !!!");
                      _this.hasMchnMng = true;
                    }
                }
                console.log("***_this.$Global.userPermissions *** ", _this.$Global.userPermissions);

                // 这段代码保留，勿删
                // let sysPlgnMng = _this.$Global.userPermissions.findIndex(n => n == "apts_nfunSysPlgnMng");
                // console.log("*** getUsrPermissions *** sysPlgnMng: ", sysPlgnMng);
                // let mchnMng = _this.$Global.userPermissions.findIndex(n => n == "apts_nfunMchnMng");
                // console.log("*** getUsrPermissions *** mchnMng: ", mchnMng);
            }
        })
      }, 

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

  .ivu-menu-submenu {
    text-align: start;
  }
  .ivu-menu-submenu .ivu-menu-item {
    text-align: center;
    font-size: small;
  }

  // .router-span {
  //   display: block;
  //   width: 100%;
  //   height: 100%;
  // }

</style>
