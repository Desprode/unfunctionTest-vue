<template>
    <div>
        <div align="left" >
            <font size="5" color="#01babc">执行结果详细信息</font>
        </div></br>
    <Tabs type="line">
        <Tab-pane label="测试报告" >
            <div align="left">
                <Button @click="downloadCase()" type="primary">下载报告</Button>
            </div>
            <!-- 页面渲染   -->
            <div v-html='content'>{{content}}</div>
        </Tab-pane>
        <!---------------------分割线-------------------------->
        <Tab-pane label="压力机日志">
            <Table border  ref="selection" :columns="columns"  :data="tableData" class="myTable"></Table>
        </Tab-pane>
        <!---------------------分割线-------------------------->
        <Tab-pane label="平台日志">
            <Table border  ref="selection" :columns="platfCaseColumns" :data="platfCaseDatas" class="myTable"></Table>
        </Tab-pane>
        <!---------------------分割线-------------------------->
        <Tab-pane label="执行结果">
            <FormItem label="执行结果是否通过：" align="left" >
                <Select v-model="result_is_pass" style="width:200px" align="center">
                        <Option value="true" >是</Option>
                        <Option value="false" >否</Option>
                </Select>
            </FormItem>   
            <FormItem label="测试结论分析描述：" :label-width="120">
                    <Input type="textarea" :autosize="{minRows: 3,maxRows: 7}" placeholder="请输入..."  v-model="result_desc" ></Input>
            </FormItem>
            <Form-item align="center">
                <i-button type="error" @click="cancelResult" style="margin-left: 8px" >取消</i-button>
                <Button type="primary" @click="saveResult">保存</Button>
                <i-button type="primary">提交缺陷</i-button>
            </Form-item>
        </Tab-pane>
    </Tabs>
    <Modal v-model="showDialog" width="800" >
        <p slot="header" style="text-align:left" >
            <Icon type="ios-information-circle"></Icon>
            <span>错误详情</span>
        </p>
        <div style="text-align:left">
            <i-form ref="addValidate" :model="addValidate" :label-width="100" >
                <Row>
                    <i-col span="24">
                        <FormItem label="名称:" prop="sample_name">                      
                            <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{addValidate.sample_name}}</div>
                        </FormItem>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="24">
                        <Form-item label="开始时间：" prop="end_time">
                            <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{addValidate.end_time}}</div>
                        </Form-item>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="24">
                        <Form-item label="返回码：" prop="response_code">
                            <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{addValidate.response_code}}</div>
                        </Form-item>
                    </i-col>                            
                </Row>
                <Row>
                    <i-col span="24">
                        <Form-item label="assert信息：" prop="assert_msg">
                            <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{addValidate.assert_msg}}</div>
                        </Form-item>
                    </i-col>           
                </Row>
                <Row>
                    <i-col span="24">
                        <Form-item label="报文采样：" prop="sample_msg">
                            <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{addValidate.sample_msg}}</div>
                        </Form-item>
                    </i-col>           
                </Row>
            </i-form>
        </div>
        <div slot="footer">
            <Button color="#1c2438"  @click="errorVount()">取消</Button>
            <Button type="primary"   @click="errorVount()" >确认</Button>
        </div>
    </Modal>
    </div>  
</template>
<script>
    export default {
        data () {
            return {
                //压力机日志
                columns: [
                    {
                        title: '机器名',
                        key: 'machineName'
                    },
                    {
                        title: 'ip',
                        key: 'ip'
                    },
                    {
                        title: 'CPU%',
                        key: 'avg_cpu'
                    },
                    {
                        title: 'MEM%',
                        key: 'avg_memory'
                    },
                    {
                        title: 'IObusy%',
                        key: 'avg_io'
                    },
                    {
                        title: '失败数',
                        key: 'error_count',
                        render:(h,params)=>{
                            return h('div',[
                                h('a',{
                                    props:{
                                        type:'primary',
                                        size:'small'
                                    },
                                    style:{
                                     marginRight:'5px'
                                    },
                                    on:{
                                        click:()=> {
                                            if(params.row.error_count !==0){
                                                this.downloadCount(params.row.error_count)
                                            }
                                        }
                                    }
                                },params.row.error_count)
                            ])
                        }
                    },
                    {
                        title: 'jmeter日志',
                        key:'jmeterlog',
                        render:(h,params)=>{
                            return h('div',[
                                h('a',{
                                    props:{
                                        type:'primary',
                                        size:'small'
                                    },
                                    style:{
                                     marginRight:'5px'
                                    },
                                    on:{
                                        click:()=> {
                                            this.downloadLog(params.row.jmeterlog)
                                        }
                                    }
                                },params.row.jmeterlog)
                            ])
                        }
                    },
                    {
                        title: 'JTL日志',
                        key: 'jtl_log_url'
                    }
                ],
                tableData: [],
                //平台日志
                platfCaseColumns: [
                    {
                        title: '开始时间',
                        key: 'start_time'
                    },
                    {
                        title: '步骤名称',
                        key: 'step_name',
                        render:(h,params) =>{
                        let _this = this;
                        return h('span',_this.$Global.detailsStepMap[params.row.step_name])
                        }
                    },
                    {
                        title: '结束时间',
                        key: 'end_time'
                    },
                    {
                        title: '状态',
                        key: 'exit_code',
                        render:(h,params) =>{
                        let _this = this;
                        return h('span',_this.$Global.detailsMap[params.row.exit_code])
                        }
                    }
                ],
                platfCaseDatas: [],
                /**=============================返回数===============================*/
                addValidate: {
                    sample_name: '',
                    end_time: '',
                    assert_msg:'',
                    sample_msg: '',
                    response_code:'',
                },
                /** ============================执行结果============================ */
                showSetType:'',
                content:'',
                file_path:'',
                showDialog:false,
                executor_id:'',
                result_is_pass:'',  //执行结果是否通过：
                result_desc:''     //测试结论分析描述：                                   
            }
        },
        
        created(){
            this.listCase();
            this.pressCase();
            this.platfCase();
            this.resulCase();
        },
        
        methods:{
            //加载测试报告
            listCase: function() {
                let _this = this;
                var executor_id = this.$route.query.executor_id;  
                //this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/testresult/report', {
                    data: {
                        executor_id:executor_id
                    }
                }).then(function (response) {
                    _this.tableData =  response.data.resultList;
                    _this.content   =  response.data.resultList[0].content;
                })
                console.log("测试报告");
            },
            //加载压力机日志
             pressCase: function(){
                let _this = this;
                var executor_id = this.$route.query.executor_id;        //获取上个页面传的id值
                console.log("第二个页面接收的ID",executor_id);
                //this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/testresult/agentLog', {
                    data: {
                        executor_id:executor_id,
                    }
                }).then(function (response) {
                    _this.tableData =  response.data.resultList;
                    
                })
                console.log("压力机日志");
            },
            //加载平台日志
            platfCase: function() {
                let _this = this;
                var executor_id = this.$route.query.executor_id;
                //this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/testresult/platformLog', {
                    data: {
                        executor_id:executor_id,
                    }
                }).then(function (response) {
                    _this.platfCaseDatas =  response.data.resultList;
                })
                console.log("平台日志");
            },
            //加载执行结果
            resulCase: function() {
                let _this = this;
                var executor_id = this.$route.query.executor_id;
                //this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/testresult/result', {
                    data: {
                        executor_id:executor_id,
                    }
                }).then(function (response) {
                    _this.tableDatasw =  response.data.resultList;
                    console.log("111212", _this.tableDatasw);
                    _this.result_is_pass = response.data.resultList[0].result_is_pass.toString();
                    _this.result_desc = response.data.resultList[0].result_desc;
                    console.log("是否通过", _this.result_is_pass);
                    console.log("描述", _this.result_desc);
                })
                console.log("执行结果");
            },
            /**保存功能*/
            saveResult:function () {
                let _this = this;
                var executor_id = this.$route.query.executor_id;
                //this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/testresult/saveResult', {
                    data: {
                        executor_id:executor_id,
                        result_is_pass:_this.result_is_pass,
                        result_desc:_this.result_desc
                    }
                }).then(function (response) {
                    console.log("12121212response",response);
                    _this.tableDatas =  response.data.result;
                    // _this.result_is_pass = response.data.resultList.result_is_pass.toString();
                    // _this.result_desc = response.data.resultList.result_desc;
                    if(response.status == 500){
                        _this.$Message.error('服务端错误!');
                    }else{
                        if("ok" == response.data.result){
                            _this.$Message.success('保存成功!');
                            console.log("修改成功");
                            _this.resulCase();
                        }else{
                            _this.$Message.error('保存失败,'+response.data.err_desc);
                            return;
                        }
                    }
                })
                console.log("保存功能");
            },
            //取消
            cancelResult:function(){
                window.history.go(-1);
            },
            //失败数
            downloadCount:function(error_count){
                let _this = this;
                _this.showDialog=true;
                var executor_id = this.$route.query.executor_id;
                this.$http.post('/myapi/testresult/error', {
                    data: {
                        executor_id:executor_id,
                    }
                }).then(function (response) {
                    _this.addValidate.sample_name =  response.data.resultList[0].sample_name;
                    _this.addValidate.end_time =  response.data.resultList[0].end_time;
                    _this.addValidate.assert_msg =  response.data.resultList[0].assert_msg;
                    _this.addValidate.sample_msg =  response.data.resultList[0].sample_msg;
                    _this.addValidate.response_code =  response.data.resultList[0].response_code;
                    console.log("111212", response.data.resultList);
                })
            },
            errorVount:function(){
                this.showDialog=false;
            },
            /**日志下载*/
            downloadLog:function(jmeterlog){
                let _this = this;
                console.log("jmeterlog",jmeterlog);
                var executor_id = this.$route.query.executor_id;
                this.$http.post('/myapi/testresult/downloadjmterlog',{
                    data:{
                        executor_id:executor_id,
                    }
                }).then(function(response){
                    var blob = new Blob([response.data]);
                    if (window.navigator.msSaveOrOpenBlob) {
                        // 兼容IE10
                        navigator.msSaveBlob(blob,jmeterlog)
                    } else {
                        let url = window.URL.createObjectURL(blob);
                        let link = document.createElement('a');
                        link.style.display = 'none';
                        link.href = url;
                        link.setAttribute('download',jmeterlog);
                        document.body.appendChild(link);
                        link.click();
                    }
                })
            },
            /**报告下载*/
            downloadCase:function(){
                let _this = this;
                var executor_id = this.$route.query.executor_id;
                //this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/testresult/download',{
                    data:{
                        executor_id:executor_id,
                    }
                }).then(function(response){
                    //console.log("script编辑接口response.data",response.data);
                    //_this.tableData =  response.data.resultList.file_path;
                    console.log("111222",response.data);
                    var blob = new Blob([response.data]);
                    if (window.navigator.msSaveOrOpenBlob) {
                        // 兼容IE10
                        navigator.msSaveBlob(blob,'report.xlsx')
                    } else {
                        let url = window.URL.createObjectURL(blob);
                        let link = document.createElement('a');
                        link.style.display = 'none';
                        link.href = url;
                        link.setAttribute('download','report.xlsx');
                        document.body.appendChild(link);
                        link.click();
                    }
                })
                
            }
    }
    }
</script>
<style lang="less" scoped>
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
    .pageContent{
        margin:-16px;
    }
    .demo-spin-icon-load{
            animation: ani-demo-spin 1s linear infinite;
        }
    .rowbox{
        width:100%;
        margin: 0px auto;
    }
    .myTable {
        margin-bottom: 15px;
    }
    .caseInputBox{
        display: flex;
    }
    .serchBtnBox{
        position: relative;
    }
    
    .caseBoxRow{
        padding-bottom:10px;
    }
    .serchBtn{
        position: absolute;
        left:0;
        top:50%;
        transform: translate(50%, -65%);
    }
    .editStaticDiv {
        font-size: 14px;
        padding-top: 8px;
    }
    .formValidate {
        margin:0 auto;
        width: 100%;
        margin-left: 0;
    
    }
    .caseBox{
     padding-top:10px;
    }
    .tableBox{
        padding-top: 20px;
    }
    .tableBtnBox{
        padding-top:0;
        padding-bottom:10px;
        text-align: left;
    }
    .pageBox {
        padding-bottom:20px;
        padding-top:20px;
        overflow: hidden;
    }
    .pageBox ul{
        float: right;
    }
    .pageBox p{
        float:left;
        line-height: 32px;
        font-size:12px;
    }
    
    .formValidateMoreBtnBox {
        text-align: center;
        height: 16px;
        background: #e9eaec;
        position: relative;
        width: 10%;
        margin: 0 auto;
        cursor: pointer;
        margin-top: 10px;
    }
    
    /* add by q */
    .arrUp{
        transform: rotate(-180deg);
        transform-origin: center center;
    }
    .arrDown{
        transform: rotate(0deg);
        transform-origin: center center;
    }
    
    .formValidateMoreBtnBox {
        text-align: center;
        height: 16px;
        background: #01babc;
        position: relative;
        width: 8%;
        margin: 0 auto;
        cursor: pointer;
        margin-top: 10px;
    }
    
    .formValidateMoreBtnBox .ivu-icon {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -30%);
        -ms-transform: translate(-50%, -30%);
        -webkit-transform: translate(-50%, -30%);
    }
    
    .formValidateMoreBtnBox .ivu-icon:first-of-type {
        transform: translate(-50%, -60%);
        -ms-transform: translate(-50%, -60%);
        -webkit-transform: translate(-50%, -60%);
    }
    
    .formValidateMoreBtnBox .ivu-icon:last-of-type {
        transform: translate(-50%, -20%);
        -ms-transform: translate(-50%, -20%);
        -webkit-transform: translate(-50%, -20%);
    }
    
    .searchLable {
        padding-top: 10px;
        padding-bottom: 25px;
        text-align: right;
        font-size: 12px;
    }

    /* add by xin */
    /*三个操作按钮样式*/
    .btnOpera{
    margin-top: 30px;
    text-align: left;
    display: flex;
    }
    .btnOpera .btn_border{
            width: 50px;
        margin-right: 10px;
    }
    .ivu-table-cell {
        padding-left: 4px;
        padding-right: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        box-sizing: border-box;
    }
    </style>
    