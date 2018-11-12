<template>
  <Layout class="wrap">
    <!--引入头部-->
    <myheader :isgo="false" :apptype="apptype" ></myheader/>
    <div style="height: 10px;background:#01babc;"></div>
    <Content class="Content">
      <!-- 开始 -->
      <Layout  class="contentBox">
        <Mysider v-show="isShowAside" />
        <!--内容样式--> 
        <Layout class="main">
        <Content>
          <div class="container">
            <Form ref="proForm" :model="proForm">
              <div class="pageContent">
                <!-- <div class="curPosition">
                  <FormItem prop="pro">
                    <Row>
                      <Col span="15" align="left" >
                        <Icon type="navicon-round" style="color: rgb(1,186,188); font-size:16px" />
                        <span>选择项目</span>
                        <Select v-model="proForm.pro" style="width:300px" @on-change="changePro">
                          <Option value="project1">项目1</Option>
                          <Option value="project2">项目2</Option>
                        </Select>
                      </Col>
                    </Row>
                  </FormItem>
                </div> -->
                <!-- <div class="detailContBox ivu-card ivu-card-bordered">
                  <Card > -->
                <div style="padding: 16px">
                  <router-view></router-view>
                </div>
                  <!-- </Card>
                </div> -->
              </div>
            </Form>
          </div>
        </Content>
        </Layout>
      </Layout>
      <!-- 结束 -->
    </Content>
    <!--尾部组件-->
    <myfoot class="footer"></myfoot>
  </Layout>
</template>
<script>
  import myheader from 'header';
  import myfoot from 'foot';
  import Mysider from '@/components/Sider'

  export default {
    data () {
      return {
        apptype:'app08',
        isShowAside: true,
        proForm:{pro:''}       
      }
    },
    components:{
      myheader,
      myfoot,
      Mysider
    },
    methods:{
      changePro(){          
        this.$store.state.newPro = this.proForm.pro
        console.log(this.proForm.pro)
      }
    }

  }
</script>
<style scoped>
  .header{
    height: 64px !important;
    background: #fff !important;
  }

  .header .h_menu .h_menu_btn_all
  .btn_selected, .header .h_menu .h_menu_btn_all .h_menu_btn:hover {
    color: #01babc;
  }


  .wrap {
    height:100%;
  }
  .Content {
    position:relative;
  }
  .contentBox {
    position:absolute;
    left:0;
    top:0;
    width: 100%;
    height:100%;

    flex-direction: row !important;
  }
  .my_foot{
    background: #32323a;
  }
  .container{
    padding: 0 16px 16px;
    background: #fff;
  }


  .pageContent{
    background: #edf6fb;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    border:1px solid #d7dde4;
    margin-top: 10px;
  }
  .curPosition{
    margin: 10px 0;
    font-size: 14px;
    padding-left: 10px;
  }
  .ivu-form-item {
    margin-bottom: 0px;
    vertical-align: top;
    zoom: 1;
  }
  .ivu-form-item-content {
    line-height: 0px;
    font-size: 14px;
  }
  .curPosition span{
    margin-left: 6px;
  }

  .detailContBox{
    position: relative;
  }
  .ivu-card-bordered{
    border: 1px solid #dddee1;
    border-color: #e9eaec;
  }
  .ivu-card{
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    transition: all .2s ease-in-out;
  }
  
  .main{
    height: 100%;
      overflow: auto;
      position: relative;
  }
</style>
