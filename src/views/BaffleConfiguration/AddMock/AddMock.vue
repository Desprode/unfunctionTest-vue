<template>
    <div>
        <h3 class="Title">
            <span>新增挡板信息</span>
        </h3>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
            <!-- <FormItem label="选择项目" prop="projectId">
                <Select v-model="formValidate.projectId" placeholder="Select your project">
                    <Option value="project1">项目1</Option>
                    <Option value="project2">项目2</Option>
                    <Option value="project3">项目3</Option>
                </Select>
            </FormItem> -->
            <FormItem label="挡板类型" prop="mockType">
                <Select v-model="formValidate.mockType" placeholder="Select your BaffleType">
                    <Option value="type1">新一代P8</Option>
                    <Option value="type2">Restful</Option>
                </Select>
            </FormItem>
            <FormItem label="挡板名称" prop="mockName">
                <Input v-model="formValidate.mockName" placeholder="Enter your BaffleName"></Input>
            </FormItem>
            <FormItem label="交易码" prop="interfaceId" v-if="formValidate.mockType == 'type1'">
                <Input v-model="formValidate.interfaceId" placeholder="Enter your interfaceId"></Input>
            </FormItem>
            <FormItem label="URI" prop="interfaceId" v-if="formValidate.mockType == 'type2'">
                <Input v-model="formValidate.interfaceId" placeholder="Enter your interfaceId"></Input>
            </FormItem>
            <FormItem label="配置方式" prop="configType">
                <Select v-model="formValidate.configType" placeholder="Select your configType">
                    <Option value="json">JSON</Option>
                    <Option value="xml">XML</Option>
                    <Option value="k-v">K-V</Option>
                    <Option value="config1">普通字符</Option>
                </Select>
            </FormItem>
            <Card style="width:80%; margin-left:100px">
                <div style="text-align:left" v-for="(item,i) in formValidate.details" :key="item.id">
                    <h3 class="trendsMock">挡板{{item.id}} <a @click="removeMock(i)">X</a></h3>
                    <FormItem label="请求报文特征">
                        <Input v-model="formValidate.details[i].requestMsgFeature" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
                    </FormItem>
                    <FormItem label="响应报文">
                        <Input v-model="formValidate.details[i].responseMsg" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
                    </FormItem>
                    <!-- <hr> -->
                    <!-- <br> --> 
            </div>
            <Button type="primary" @click="addMock">新增</Button>
            </Card>
            <br>
            <FormItem label="生效环境">
                <CheckboxGroup v-model="temp_effectNnv">
                    <Checkbox label="开发测试环境"></Checkbox>
                    <Checkbox label="自动化测试环境"></Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
                <Button @click="backMockCollocation" style="margin-left: 8px">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import mix from "./AddMock-mixins.js";
export default {
  mixins: [mix]
};
</script>

<style>
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
.trendsMock{
    background-color: #eff4f8;
    padding: 5px 10px;
    margin-bottom: 10px;
    font-weight: 400px;
    font-size: 14px;
    color:#01babc;
    border-radius:10px;
}
.trendsMock a{
    float: right;
}
</style>
