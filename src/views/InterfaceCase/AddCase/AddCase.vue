<template>
  <div id="addCase">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
      <div>
        <Tabs type="card" :value="isTrue?'basic':'describe'">
          <TabPane label="基本信息" name="basic">

            <div class="tabBox">
              <Row>
                <Col span="12">
                  <FormItem label="接口ID/名称" prop="interfaceId">
                    <Input v-model="formValidate.interfaceId" placeholder="Enter your ID/name"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="迭代版本" prop="version">
                    <Select v-model="formValidate.version" placeholder="Select your visions">
                      <Option value="version1" >迭代1</Option>
                      <Option value="version2">迭代2</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <FormItem label="协议配置">
                <Row>
                  <Col span="4">
                    <FormItem prop="protocolType">
                      <Select v-model="formValidate.protocolConfig.protocolType">
                        <Option value="http" >http</Option>
                        <Option value="https">https</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="4">
                    <FormItem prop="method">
                      <Select v-model="formValidate.protocolConfig.configItem.method">
                        <Option value="post" >post</Option>
                        <Option value="get">get</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="16">
                    <FormItem prop="address">
                    <Input v-model="formValidate.protocolConfig.configItem.address">
                      <Select v-model="select1" slot="prepend" style="width:150px" placeholder="Select your address">
                        <Option value="address1">localhost</Option>
                        <Option value="shanghai">London</Option>
                        <Option value="shenzhen">Sydney</Option>
                      </Select>
                    </Input>
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>

              <FormItem label="测试描述" prop="interfaceDesc">
                <Input v-model="formValidate.interfaceDesc " type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
              </FormItem>
              <FormItem label="报文类型" prop="type">
                <Select v-model="formValidate.requestMsg.type" placeholder="Select your messageType">
                  <Option value="form">FORM表单</Option>
                  <Option value="json">JSON</Option>
                  <Option value="xml">XML</Option>
                </Select>
              </FormItem>
              <FormItem>
                <table v-if="formValidate.requestMsg.type == 'form'">
                  <thead>
                  <tr>
                    <th>键</th>
                    <th>值</th>
                    <th>描述</th>
                    <th>操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,i) in tableNum" :key="item.id">
                    <td>
                      <Input type="text" v-model="tableNum[i].key" @on-focus="insertItem(i)"></Input>
                    </td>
                    <td>
                      <Input type="text" v-model="tableNum[i].value"></Input>
                    </td>
                    <td>
                      <Input type="text" v-model="tableNum[i].desc"></Input>
                    </td>
                    <td style="width:120px">
                      <Button type="error" size="small" @click="removeTable(i)">删除</Button>

                    </td>
                  </tr>
               <!------  <tr>
                    <td>
                      <Button type="text" size="small" @click="addTable" shape="circle">+</Button>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>----------------------->
                  </tbody>
                </table>
                <Input v-model="formValidate.requestMsg.messageBody" v-if="formValidate.requestMsg.type !== 'form'" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something...原始xml/原始json"></Input>
              </FormItem>
            </div>
          </TabPane>
          <!----------------分割线------------------>
          <TabPane label="前置动作">
            <div v-for="(item,i) in formValidate.preProcess" :key="item.order" class="penAction">
              <div class="tabBox ">
                <FormItem>
                  <Row>
                    <Col span="4" >
                      <h2>{{'动作'+(i+1)}}</h2>
                    </Col>
                    <Col span="4" offset="20" align="right">
                      <FormItem>
                        <Button type="text" shape="circle" @click="removePre(i)">X</Button>
                      </FormItem>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem>
                  <Select v-model="formValidate.preProcess[i].processType" placeholder="Select your execute" @on-change="changeExecute(i,$event)" label-in-value>
                    <Option value="SQL">执行SQL</Option>
                    <Option value="CASE">执行案例</Option>
                    <Option value="SHELL">执行脚本</Option>
                  </Select>
                </FormItem>
                <div v-if="formValidate.preProcess[i].processType == 'CASE'" >
                  <FormItem>
                    <Select v-model="formValidate.preProcess[i].configItem.caseID" placeholder="Select your case">
                      <Option value="case1">case1</Option>
                      <Option value="case2">case2</Option>
                    </Select>
                  </FormItem>
                </div>

                <FormItem v-else-if="formValidate.preProcess[i].processType == 'SHELL'" >
                  <Select v-model="formValidate.preProcess[i].configItem.script" placeholder="Select your DB">
                    <Option value="DB1">DB1</Option>
                    <Option value="DB2">DB2</Option>
                  </Select>
                </FormItem>

                <FormItem v-else-if="formValidate.preProcess[i].processType == 'SQL'" >
                  <Select v-model="formValidate.preProcess[i].configItem.DB" placeholder="Select your DB">
                    <Option value="DB1">DB1</Option>
                    <Option value="DB2">DB2</Option>
                  </Select>
                </FormItem>
                <!--输入框-->
                <Input  v-if="formValidate.preProcess[i].processType == 'SQL'" v-model="formValidate.preProcess[i].configItem.SQL" style="padding-left: 100px" type="textarea" placeholder="Enter something..." />
              </div>
            </div>
            <FormItem>
              <Row>
                <Col span="4" offset="18" align="right">
                  <Button type="primary" size="small" @click="addPreInput" shape="circle">+</Button>
                </Col>
              </Row>
            </FormItem>
          </TabPane>
          <!----------------分割线------------------>
          <TabPane label="后置动作">
            <div v-for="(item,i) in formValidate.postProcess" :key="item.order" class="penAction">
              <div class="tabBox ">
                <FormItem>
                  <Row>
                    <Col span="4" >
                      <h2>{{'动作'+(i+1)}}</h2>
                    </Col>
                    <Col span="4" offset="20" align="right">
                      <FormItem>
                        <Button type="text" shape="circle" @click="removePost(i)">X</Button>
                      </FormItem>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem>
                  <Select v-model="formValidate.postProcess[i].processType" placeholder="Select your execute" @on-change="changeExecute(i,$event)" label-in-value>
                    <Option value="SQL">执行SQL</Option>
                    <Option value="CASE">执行案例</Option>
                    <Option value="SHELL">执行脚本</Option>
                  </Select>
                </FormItem>
                <div v-if="formValidate.postProcess[i].processType == 'CASE'" >
                  <FormItem>
                    <Select v-model="formValidate.postProcess[i].configItem.caseID" placeholder="Select your case">

                      <Option value="case1">case1</Option>
                      <Option value="case2">case2</Option>
                    </Select>
                  </FormItem>
                </div>
                <FormItem  v-else-if="formValidate.postProcess[i].processType == 'SHELL'" >
                  <Select v-model="formValidate.postProcess[i].configItem.script" placeholder="Select your DB">
                    <Option value="DB1">DB1</Option>
                    <Option value="DB2">DB2</Option>
                  </Select>
                </FormItem>
                <FormItem v-else-if="formValidate.postProcess[i].processType == 'SQL'">
                  <Select v-model="formValidate.postProcess[i].configItem.DB" placeholder="Select your DB">
                    <Option value="DB1">DB1</Option>
                    <Option value="DB2">DB2</Option>
                  </Select>
                </FormItem>
                <!--输入框-->
                <Input  v-if="formValidate.postProcess[i].processType == 'SQL'" v-model="formValidate.postProcess[i].configItem.SQL" style="padding-left: 100px" type="textarea" placeholder="Enter something..." />
              </div>
            </div>
            <FormItem>
              <Row>
                <Col span="4" offset="18" align="right">
                  <Button type="primary" size="small" @click="addPostInput" shape="circle">+</Button>
                </Col>
              </Row>
            </FormItem>
          </TabPane>
          <!----------------分割线------------------>
          <TabPane label="检查点"><br/>
            <div class="tabBox">
              <FormItem label="响应报文检查点" prop="checkPoints" >
                <Input v-model="formValidate.checkPoints "  type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
              </FormItem>
            </div>
          </TabPane>
          <!----------------分割线------------------>
          <TabPane label="参数化"><br/>
            <div class="tabBox">
              <FormItem label="参数SQL">
                <Select v-model="formValidate.table" placeholder="Select your table">
                  <Option value="table1">db1</Option>
                  <Option value="table2">db2</Option>
                </Select>
              </FormItem>
              <FormItem labal="">
                <!--输入框-->
                <Input v-model="formValidate.describe " type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="delete from tabl1 where ...;"></Input>
                <br/>
              </FormItem>
              <FormItem label="参数文件">
                <Input type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="delete from tabl1 where ...;"></Input>
                <br/>
              </FormItem>
            </div>
          </TabPane>
          <!----------------分割线------------------>
          <TabPane label="执行日志" name="describe">
            <div class="tabBox">
              <FormItem label="执行信息" prop="describe" >
                <Input v-model="formValidate.describe "  type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="Enter something..."></Input>
              </FormItem>
            </div>
          </TabPane>
        </Tabs>
      </div>
      <div class="bottom">
        <hr/>
        <FormItem class="bottomFormItem">
          <Row>
            <Col span="5">
              <Button type="success" style="width: 100px" @click="handleSubmit('formValidate')">保存</Button>
            </Col>
            <Col span="5" style="line-height:30px">
              <Checkbox v-model="formValidate.ciFlag">加入持续集成</Checkbox>
            </Col>
            <Col span="5" >
              <Button type="info" style="width: 100px" @click="execution">执行</Button>
            </Col>
            <Col span="5" offset="1">
              <Select v-model="formValidate.effectNnv" placeholder="Select your .. ">
                <Option value="develop ">开发环境</Option>
                <Option value="automation ">自动化测试环境</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
      </div>
    </Form>
  </div>
</template>

<script>
  import mix from "./AddCase-mixins.js";
  export default {
    mixins: [mix]
  };
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
  .penAction {
    /* border: 1px solid #eee; */
    /* box-shadow: 1px 1px 10px #087779; */
    /* border-radius: 10px; */
    width: 90%;
    margin: 0px 20px 15px 40px;
    box-sizing: border-box;
    padding-top: 20px;
    padding-bottom: 10px;
    background: #eff4f8;
    border-bottom: 6px solid rgba(1,186,188,.5);
    border-radius: 25px 25px 40px 40px;
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
</style>
