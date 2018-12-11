<template>
<div>
    <div align="left" >
            <font size="5" color="#01babc">实时监控</font>
    </div></br>
    <!--<div align="right" >右对齐，<div align="left" >左对齐-->
            <Button style="float:right" @click="deleteCase" type="error" class="actionBtn">停止</Button>
    <div align="left" >
        <font size="2" color="#01babc">场景名称:</font><Input v-model="senario_name" readonly="readonly" style="width:150px"></Input>
    </div>
    <div align="left" >
        <font size="2" color="#01babc">已运行时间:</font><Input v-model="senario_name" readonly="readonly" style="width:55px"></Input><!-- readonly="readonly"文本框内容不可选中-->
    </div>
    <div align="left">  
        <font size="2" color="#01babc">状态:</font>
        <Select v-model="senario_type" style="width:125px" disabled="disabled" clearable>  <!--disabled="disabled"下拉框内容不可选中-->
            <Option  value="10">预约等待</Option>
            <Option  value="01">测试准备中</Option>
            <Option  value="02">测试执行中</Option>
            <Option  value="03">测试取消</Option>
            <Option  value="00">测试结束</Option>
        </Select>
    </div>
    <div align="left">
        <font size="3" color="#01babc">详细描述:</font>
        <div class="test_box" contenteditable="true"   style="-webkit-user-select:text"><br /></div>
    </div>
    <div align="left">
        <Tabs type="card">
            <!---------------------分割线-------------------------->
            <Tab-pane label="jmeter信息">
                <!--http://128.195.0.14:3000/d/87b2Yucmk/jmeter-dashboard-summary?orgId=1&panelId=45&from={{=starttime}}&to={{=endtime}}&var-testId={{=exe_id}}&refresh=5s&kiosk-->
                <div><iframe id="gIframe1" src="http://128.195.0.14:3000/d/87b2Yucmk/jmeter-dashboard-summary?orgId=1&panelId=45&from={starttime}&to={endtime}&var-testId={exe_id}&refresh=5s&kiosk" width="100%" height="300" frameborder="0"></iframe></div>
                <div><iframe id="gIframe" src="http://128.195.0.14:3000/d/hNfQJhWiz/jmeter-dashboard?orgId=1&from={executor_id}&to={executor_id}&var-testId=${executor_id}&refresh=5s&kiosk" width="100%" height="980" frameborder="0"></iframe></div>
                <!--http://128.195.0.14:3000/d/hNfQJhWiz/jmeter-dashboard?orgId=1&from={{=starttime}}&to={{=endtime}}&var-testId={{=exe_id}}&refresh=5s&kiosk-->
            </Tab-pane>
            <!---------------------分割线-------------------------->
            <Tab-pane label="服务器资源">
            <table border  ref="selection" :data="tableData" width="100%"  border="1" cellspacing="0" cellpadding="2" align="CENTER" height="70"> 
             <tr align="CENTER"> 
                <td rowspan="2">序号</td> 
                <td rowspan="2">ip地址</td> 
                <td rowspan="2">部署单位</td>
                <td rowspan="2">操作系统类型</td>
                <td colspan="3">CPU%</td>
                <td colspan="2">MEM%</td>
                <td colspan="2">IO</td>
                <td colspan="2">network</td>
            </tr> 
            <tr> 
                <td>used</td> 
                <td>sys</td> 
                <td>iowait</td> 
                <td>used</td>
                <td>used-cache%buffer</td>
                <td>IOPS</td>
                <td>IO-read%wirte</td>
                <td>receive</td>
                <td>transmit</td>
            </tr> 
            <tr align="CENTER"> 
                <td>${executor_id}</td> 
                <td>{{executor_id}}</td>
                <td>{{executor_id}}</td>
                <td>{{executor_id}}</td> 
                <td>{{executor_id}}</td>
                <td>{{executor_id}}</td>
                <td>{{executor_id}}</td>
                <td>{{executor_id}}</td>
                <td>{{executor_id}}</td>
                <td>{{executor_id}}</td>
                <td>{{executor_id}}</td>
                <td>{{executor_id}}</td>
                <td>{{executor_id}}</td>
            </tr> 
     </table>
                <!--<Table :columns="columns1" :data="data1"></Table>-->
            </Tab-pane>
            <!---------------------分割线-------------------------->
            <Tab-pane label="压力机资源">
                <Table border  ref="selection" :columns="columns"  :data="tableData" class="myTable"></Table>
            </Tab-pane>
        </Tabs>
    </div>
</div> 
</template>
<script>
export default {
        data () {
            return { 
                executor_id:'',
                formItem: {
                    input: '',
                    select: '',
                    checkbox: [],
                    switch: true,
                    date: '',
                    textarea: ''
                },
                //压力机日志
                columns: [
                    {
                        title: '序号',
                        key: 'machineName'
                    },
                    {
                        title: 'ip',
                        key: 'ip'
                    },
                    {
                        title: '机器名',
                        key: 'senario_name'
                    },
                    {
                        title: '硬件配置',
                        key: 'avg_memory'
                    },
                    {
                        title: '操作系统',
                        key: 'avg_io'
                    },
                    {
                        title: 'CPU%',
                        key: 'error_count'
                    },
                    {
                        title: 'Men%',
                        key: 'jmeter_log_url'
                    },
                    {
                        title: 'IOPS',
                        key: 'jtl_log_url'
                    }
                ],
                tableData: [],
            }
        },
        
        created(){
            //this.listCase();
            this.pressCase();
            this.listCase();
        },
        
        methods:{
            //加载压力机日志
            pressCase: function() {
                let _this = this;
                var executor_id = this.$route.query.executor_id;        //获取上个页面传的id值
                console.log("第二个页面接收的ID",executor_id);
                this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/testresult/agentLog', {
                    data: {
                        executor_id:executor_id,
                    }
                }).then(function (response) {
                    _this.tableData =  response.data.resultList;
                    
                })
                console.log("压力机日志");
            },
            //页面展示
        listCase: function() {
            let _this = this;
            this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/testresult/runtests/list', {
                data: {
                    pageNo:_this.pageNo,
                    pageSize:_this.pageSize,
                }
            }).then(function (response) {
                console.log(response);
                console.log('请求回来的表格数据: ', response.data);
                _this.tableData = response.data.resultList;  
                _this.totalCount = response.headers.totalcount;
                _this.totalPage = response.headers.totalpage;
                console.log(response.headers.totalcount);
                console.log(_this.totalCount);  
                _this.tableData = response.data.resultList;
            })
        },
        }
    }

</script>
<style lang="less" scoped>
    .test_box {
        width: 300px;
        min-height: 50px;
        max-height: 50px;
    }
    .myTable {
    margin-bottom: 15px;
}
</style>
