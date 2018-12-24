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
            <Table border  ref="selection" :columns="columnss" :data="tableDatas" class="myTable"></Table>
        </Tab-pane>
        <!---------------------分割线-------------------------->
        <Tab-pane label="执行结果">
            <FormItem label="执行结果是否通过：" align="left" >
                <Select v-model="result_is_pass" style="width:200px" align="center">
                        <Option value="1" >是</Option>
                        <Option value="0" >否</Option>
                        <Option value="as" >待确定</Option>
                </Select>
            </FormItem>   
            <FormItem label="测试结论分析描述：">
                <Row>
                    <i-col span="13">
                         <i-input type="textarea" :autosize="{minRows: 3,maxRows: 7}" placeholder="请输入..." v-model="result_desc" ></i-input>
                    </i-col>
                </Row>
            </FormItem>
            <Form-item align="center">
                <i-button type="error" style="margin-left: 8px">取消</i-button>
                <i-button type="primary" @click="saveResult">保存</i-button>
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
                formItem: {
                    html:'',
                    input: '',
                    select: '',
                    radio: 'male',
                    checkbox: [],
                    switch: true,
                    date: '',
                    time: '',
                    slider: [20, 50],
                    textarea: ''
                },
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
                        key: 'jmeter_log_url'
                    },
                    {
                        title: 'JTL日志',
                        key: 'jtl_log_url'
                    }
                ],
                tableData: [],
                //平台日志
                columnss: [
                    {
                        title: '步骤名称',
                        key: 'step_name'
                    },
                    {
                        title: '开始时间',
                        key: 'start_time'
                    },
                    {
                        title: '结束时间',
                        key: 'end_time'
                    },
                    {
                        title: '错误码',
                        key: 'exit_code'
                    }
                ],
                tableDatas: [],
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
                    _this.tableDatas =  response.data.resultList;
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
                    _this.tableDatas =  response.data.resultList;
                    _this.result_is_pass = response.data.resultList[0].result_is_pass.toString();
                    console.log("是否通过", _this.result_is_pass);
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
                    _this.tableDatas =  response.data.resultList;
                    if(_this.tableDatas=="ok"){
                        _this.$Message.info('保存成功');
                    }else{
                        _this.$Message.info('保存失败');
                    }
                    console.log(_this.tableDatas)
                    
                })
                console.log("保存功能");
            },
            /**下载*/
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