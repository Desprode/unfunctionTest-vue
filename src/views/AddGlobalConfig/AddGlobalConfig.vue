<template>
  <div class="global">
  <h3 class="Title">
      <span>全局配置</span>
  </h3>
    <Form ref="globalForm" :model="globalForm" :label-width="120">
      <FormItem label="接口默认协议:" prop="interfaceProtocol">
        <Row class="selectwidth">
          <Col span="12"  style="padding-right:10px">
            <Select v-model="globalForm.interfaceProtocol.protocol1" @on-change="changePro1" placeholder="please select">
              <Option value="http">HTTP</Option>
            </Select>
          </Col>
          <Col span="12">
            <Select v-model="globalForm.interfaceProtocol.protocol2" @on-change="changePro2"  placeholder="please select way">
              <Option value="post">POST</Option>
              <Option value="get">GET</Option>
            </Select>
          </Col>
        </Row>

        <!--<Row>
          <Col span="12">
            <Select v-model="model12" filterable multiple>
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>-->
      </FormItem>


      <FormItem label="授权/登录报文(login):" prop="authorLoginMsg" >
        <Input v-model="globalForm.authorLoginMsg " type="textarea" :autosize="{minRows: 4,maxRows: 8}" placeholder="post http://128.192.11.30/login/"></Input>
      </FormItem>

      <FormItem label="通用请求Header:" prop="commonReqHeader">
        <Input v-model="globalForm.commonReqHeader " type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="token=login.token"></Input>
      </FormItem>

      <FormItem label="通用变量:" prop="commonVar">
        <Input v-model="globalForm.commonVar " type="textarea" :autosize="{minRows: 4,maxRows: 8}" placeholder="$date=20180101"></Input>
      </FormItem>

      <FormItem label="检查点默认配置:" prop="checkPointConfig">
        <Input v-model="globalForm.checkPointConfig" type="textarea" :autosize="{minRows: 4,maxRows: 8}" placeholder="/tx/txheader/sys_resp_code=000000"></Input>
      </FormItem>
      <br/><br/>
      <FormItem>
         <Button type="success" size="large" @click="submitForm('globalForm')" style="width: 35%">保    存</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  export default {
    name: "addGlobalConfig",
    data(){
      return{
        globalForm:{
          projectId:'',  //项目编号
          interfaceProtocol:{ //接口默认协议
              protocol1:'',   //选择POST方式
              protocol2:''    //选择GET方式
          }, 
          authorLoginMsg:'',  //授权/登陆报文
          commonReqHeader:'', //通用请求header 
          commonVar:'', //通用变量
          checkPointConfig:''  //检查点默认配置
        },
        header:{  //请求报文header部分
          txCode: 'addGlobalConfig',//
          projectId: '',//项目Id
          projectName:'ares',//项目名
          userId:'admin',//用户Id
          reqTime: '', //请求时间
          sysTraceId: '', //交易流水号
        },
      }
    },
    
    methods:{
      submitForm(formName) {
         this.$refs[formName].validate((valid) => {
           //console.log(1111)
           //confirm("保存成功!")
           if (valid) {
              //将检查点保存到vuex中
              this.$store.state.checkPointConfig  = this.globalForm.checkPointConfig

              this.$http.defaults.withCredentials = false
              this.$http.post( 'configHandler',{ header:this.header, data:this.globalForm })
               // confirm("保存成功!")
                .then(res=>{
                  if(res.body!==0){
                    this.$Message.info("提交成功");
                  } else{
                    this.$Message.info("提交失败");
                  }
                })
              } else {
                console.log('error submit!!');
                return false;
             }
          });
        },
      //将接口默认协议的选中项保存到vuex中
      changePro1(){
        this.$store.state.newProtocol = this.globalForm.interfaceProtocol.protocol1
        console.log('pro1')
      },
      changePro2(){  //方式POST/GET
        this.$store.state.newWay = this.globalForm.interfaceProtocol.protocol2
        console.log('pro2')
      },
      getProjectId(){
          this.header.projectId = this.$store.state.newPro
        },
        getReqTime() { //获取请求时间
          //yyyymmddhhmmssSSS
          const dt = new Date()
          const y = dt.getFullYear()
          const m = (dt.getMonth() + 1 + '').padStart(2, '0')
          const d = (dt.getDate() + '').padStart(2, '0')

          const hh = (dt.getHours() + '').padStart(2, '0')
          const mm = (dt.getMinutes() + '').padStart(2, '0')
          const ss = (dt.getSeconds() + '').padStart(2, '0')
          const SSS = (dt.getMilliseconds() + '').padStart(3, '0')
          this.header.reqTime = y + m + d + hh + mm + ss + SSS
          //  alert(`${y}-${m}-${d} ${hh}:${mm}:${ss} ${SSS}`)
          //  alert(this.reqTime)
        },
        getSysTraceId() { //获取交易流水号
          this.getReqTime();
          var randomNum = '';
          for (var i = 0; i < 5; i++) {
            randomNum += Math.floor(10 * Math.random());
          }
          // alert(randomNum)
          this.header.sysTraceId = this.header.reqTime + randomNum
          //  console.log(this.sysTraceId)
        }
      },
    created(){
      this.getProjectId();
      this.getSysTraceId();
    },

  }
</script>

<style>
  .global{
    font-size: 14px;
  }
  .Title{
    text-align: left;
    font-weight: 400;
    font-size: 14px;
    position: relative;
    padding-left: 0;
    padding-bottom: 7px;
    border-bottom: 2px solid #01babc;
    margin-top:0px;
    margin-bottom: 20px;
}
.Title span{
    padding-right: 26px;
    padding-top: 8px;
    padding-bottom: 8px;
    background-color: #01babc; 
    border-radius: 0px 38px 38px 0px;
    color:#fff;
    padding-left: 26px;
}
.Title::before{
    content: '';
    position: absolute;
    left:12px;
    top:1px;
    width:4px;
    height: 60%;
    background-color: #fff;
    border-radius: 2px;
}
</style>
