<template>
  <div id="addCase">
      <div class="caseBox">
          <h3 class="Title">
              <span>实时监控</span>
          </h3>
    <Form ref="formValidate" class="formValidatel">
      <div>
        <Tabs type="card" :value="isTrue?'basic':'describe'">
          <TabPane label="基本信息" name="basic">
                <Table border  ref="selection" :columns="columns" :data="tableData" class="myTable" @on-selection-change="onSelectionChanged"></Table>
          </TabPane>
          <!----------------分割线------------------>
          <TabPane label="前置动作">
                <Table border  ref="selection" :columns="columns" :data="tableData" class="myTable" @on-selection-change="onSelectionChanged"></Table>
          </TabPane>
          <!----------------分割线------------------>
          <TabPane label="后置动作">
                <Table border  ref="selection" :columns="columns" :data="tableData" class="myTable" @on-selection-change="onSelectionChanged"></Table>
          </TabPane>
        </Tabs>
      </div>
    </Form>
    </div>
  </div>
</template>

<script>
</script>

<style scoped>
  #addCase {
    height: 100%;
    margin-top:-20px;
    margin-left:-20px;
  }
  .ivu-form {
    height: 100%;
  }
  .tabBox {
    width: 90%;
  }
  .ivu-layout-content {
    padding-top: 10px;
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
  .ivu-tabs-content {
    height: 100%;
  }
  .ivu-tabs .ivu-tabs-bar {
    margin-bottom: 0px;
  }
  .bottom {
    height: 14px;
  }
  .bottomFormItem {
    margin-top: 5px;
    margin-bottom: 5px;
  }
th{
      height:20px;  
  }
.formValidatel {
	margin:0 auto;
	width: 100%;
	margin-left: 0;

}
.caseBox{
 padding-top:10px;
}
.myTable {
    margin-bottom: 15px;
}
</style>
