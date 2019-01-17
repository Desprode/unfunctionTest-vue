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
                        key: 'error_count'
                    },
                    {
                        title: 'jmeter日志',
                        key:'jmeterlog',
                        render:(h,params)=>{
                            //href="/testresult/downloadjmeterlog/1715?executorid=1547695895761&infoid=17"
                            //let url = params.row.jmeter_log_url
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
                /** ============================执行结果============================ */
                showSetType:'',
                content:'',
                file_path:'',
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
            /**日志下载*/
            downloadLog:function(jmeterlog){
                let _this = this;
                console.log("jmeterlog",jmeterlog);
                var executor_id = this.$route.query.executor_id;
                this.$http.post('/myapi/testresult/download',{
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