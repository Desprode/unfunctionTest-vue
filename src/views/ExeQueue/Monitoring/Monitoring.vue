<template>
<div>
    <div align="left" >
            <font size="5" color="#01babc">实时监控</font>
    </div></br>
    <div v-model="addPTaskModal" width="800">
        <div style="text-align:left">
            <!--<div align="right" >右对齐，<div align="left" >左对齐-->
                <Button style="float:right" @click="deleteCase" type="error" class="actionBtn">停止</Button>
                <form ref="editPTaskValidate" :model="editPTaskValidate" :label-width="100" :data="tableData" label-position="right">
                        <FormItem label="场景名称:" prop="execution_name">
                                <Input  v-model="editPTaskValidate.execution_name" style="width:150px" readonly="readonly"></Input><!-- readonly="readonly"文本框内容不可选中-->
                        </FormItem>
                        <FormItem label="已运行时间:" prop="perftask_name">
                                <Input  v-model="perftask_name" style="width:150px" readonly="readonly"></Input>
                        </FormItem>
                        <FormItem label="任务状态：" prop="perftask_status">
                                <Select clearable v-model="perftask_status" style="width:125px" disabled="disabled">
                                    <Option v-for="item in taskStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option><!--disabled="disabled"下拉框内容不可选中-->
                                </Select>
                        </FormItem>
                        <FormItem label="详细描述:" prop="senario_name">
                                <Input style="width:400px"  readonly="readonly"  v-model="senario_name" type="textarea" :autosize="{minRows:2,maxRows:3}"></Input>
                        </FormItem>
                    </form>
        </div>
    </div>
    <div align="left">
        <Tabs type="card">
            <!---------------------分割线-------------------------->   <!--from 开始时间  to 当前的时间 毫秒时间  var-testId 1544519062251   %executor_id%-->
            <Tab-pane label="jmeter信息">
                <!--http://128.195.0.14:3000/d/87b2Yucmk/jmeter-dashboard-summary?orgId=1&panelId=45&from={{=starttime}}&to={{=endtime}}&var-testId={{=exe_id}}&refresh=5s&kiosk-->
                <div><iframe id="gIframe1" src="http://128.195.0.14:3000/d/87b2Yucmk/jmeter-dashboard-summary?orgId=1&panelId=45&from={starttime}&to={endtime}&var-testId={exe_id}&refresh=5s&kiosk" width="100%" height="300" frameborder="0"></iframe></div>
                <div><iframe id="gIframe" src="http://128.195.0.14:3000/d/hNfQJhWiz/jmeter-dashboard?orgId=1&from=1544519137048&to=1544519451289&var-testId=%executor_id%&refresh=5s&kiosk" width="100%" height="980" frameborder="0"></iframe></div>
                <!--http://128.195.0.14:3000/d/hNfQJhWiz/jmeter-dashboard?orgId=1&from={{=starttime}}&to={{=endtime}}&var-testId={{=exe_id}}&refresh=5s&kiosk-->
            </Tab-pane>
            <!---------------------分割线-------------------------->
            <Tab-pane label="服务器资源">
                <Table border  ref="selection" :columns="columns1"  :data="tableDatal" class="myTable"></Table>
                <div class="pageBox" v-if="tableDatal.length">
                    <Page :total="parseInt(totalCount)" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
                    <p>总共{{totalPage}}页</p>
                </div>
            </Tab-pane>
            <!---------------------分割线-------------------------->
            <Tab-pane label="压力机资源">
                <Table border  ref="selection" :columns="columns"  :data="tableData" class="myTable"></Table>
                <div class="pageBox" v-if="tableData.length">
                    <Page :total="parseInt(totalCount)" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
                    <p>总共{{totalPage}}页</p>
                </div>
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
                cmpOpts: [],
                formItem: {
                    cmpOpts: [],
                    list: [], 
                    input: '',
                    select: '',
                    taskStatusList: this.$Global.taskStatusList,
                    checkbox: [],
                    switch: true,
                    date: '',
                    executor_id:'',
                    textarea: ''
                },
                //压力机日志
                columns: [
                    {
                        title: '序号',
                        key: 'executor_id'
                    },
                    {
                        title: 'ip',
                        key: 'prodIp'
                    },
                    {
                        title: '机器名',
                        key: 'servPartName'
                    },
                    {
                        title: '硬件配置',
                        key: 'execution_name'
                    },
                    {
                        title: '操作系统',
                        key: 'osVersion'
                    },
                    {
                        title: 'CPU%',
                        key: 'cpuUsedPercent'
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
                columns1: [
                    {
                        title: '序号',
                        key: 'executor_id'
                    },
                    {
                        title: 'IP地址',
                        key: 'prodIp'
                    },
                    {
                        title: '部署单元',
                        key: 'funDesc'
                    },
                    {
                        title: '操作系统类型',
                        key: 'osVersion'
                    },
                    {
                        title: 'CPU%',
                        align: 'center',
                        children: [
                            {
                                title: 'used',
                                key: 'cpuUserPercent',
                            },
                            {
                                title: 'sys',
                                key: 'cpuSysPercent',
                            },
                            {
                                title: 'Iowait',
                                key: 'cpuIOWaitPercent',
                            }
                        ]
                    },
                    {
                        title: 'MEM%',
                        align: 'center',
                        children: [
                            {
                                title: 'used',
                                key: 'memoryBufferPercent',
                            },
                            {
                                title: 'used-cache%buffer',
                                key: 'memoryCachePercent',
                            },
                        ]
                    },
                    {
                        title: 'IO',
                        align: 'center',
                        children: [
                            {
                                title: 'IOPS',
                                key: 'ioRead',
                            },
                            {
                                title: 'IO-read%wirte',
                                key: 'ioWrite',
                            },
                        ]
                    },
                    {
                        title: 'network',
                        align: 'center',
                        children: [
                            {
                                title: 'receive',
                                key: 'netRead',
                            },
                            {
                                title: 'transmit',
                                key: 'netWrite',
                            },
                        ]
                    }
                ],
                tableDatal: [],
                tableDAtaTatol:0,
                tableDAtaPageLine:3,
                selectedData:[],
                totalCount:0,                         //共多少条数据
                pageNo:1,                            //当前页
                pageSize:10,                           //每页显示多少条数据
                totalPage:0,                           //共多少页
                editPTaskValidate: {
                index: '',                  // 列表中的索引号
                id: '',                     // 任务编号
                execution_name: '',         // 物理子系统
                perftask_name: '',          // 任务名称——可编辑
                perftask_begin_date: '',    // 任务开始日期——可编辑
                perftask_end_date: '',      // 任务结束日期——可编辑
                online_date: '',            // 投产日期——可编辑
                perftask_status: '',        // 任务状态——可编辑
                ptask_source: '',           // 任务来源
            },
            }
        },
        
        created(){
            //this.srchComponent();
            this.pressCase();
           // this.listCase();
        },
        
        methods:{
            //srchComponent: function(query) {
            //this.cmpOpts = [];
           // if (query !== '') {
           //     this.srchCmploading = true;
            //    setTimeout(() => {
            //        this.srchCmploading = false;

            //        let _this = this
            //        var executor_id = this.$route.query.executor_id;        //获取上个页面传的id值
             //   console.log("第三个页面接收的ID",executor_id);
             //       console.log('srchComponent');
             //       console.log('list-before: ', this.list);
             //       console.log('query: ', query)

             //       this.$http.defaults.withCredentials = false;
             //       this.$http.post('/myapi/testresult/runtests/list', 
              //      {
              //          headers: {
              //          },
              //          data: {
              //              name: query,
              //              endTime: '',
               //         },
                        
               //     }
               //     ).then(function (response) {
                //        console.log('response:', response);
                //        console.log('response.data: ', response.data);
                //        _this.list = response.data.resultList;
                //        console.log('list-after: ', _this.list);
                //        const list = _this.list.map(item => {
                 //           return {
                 //               value: item.executor_id,
                  //              label: item.task_name
                 //           };
                 //       });
                 //       _this.cmpOpts = list
                 //       console.log('666this.cmpOpts:', _this.cmpOpts);
                  //  })
             //   }, 200);
           // } else {
             //   this.cmpOpts = [];
            //    console.log('666this.cmpOpts:',this.cmpOpts);
           // }
       // },
            //加载压力机日志
           // pressCase: function() {
           //     let _this = this;
           //     var executor_id = this.$route.query.executor_id;        //获取上个页面传的id值
           //     console.log("第二个页面接收的ID",executor_id);
           //     this.$http.defaults.withCredentials = false;
           //     this.$http.post('', {
            //        data: {
            //            executor_id:executor_id,///myapi/testresult/agentLog
            //        }
             //   }).then(function (response) {
            //        _this.tableData =  response.data.resultList;
                    
             //   })
             //   console.log("压力机日志");
          //  },
             //服务器资源
            pressCase: function() {
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
                    _this.tableDatal = response.data.resultList;  
                    _this.totalCount = response.headers.totalcount;
                    _this.totalPage = response.headers.totalpage;
                    console.log(response.headers.totalcount);
                    console.log(_this.totalCount);  
                    _this.tableDatal = response.data.resultList;
                })
            },
             /**切换页码 */
             pageChange:function(pageNo){
                console.log(pageNo);
                this.pageNo = pageNo;
                this.pressCase();
            },
            /**切换页面大小 */
            pageSizeChange:function(pageSize){
                console.log(pageSize);
                this.pageSize = pageSize;
                this.pressCase();
            },
            //压力机资源
            listCase: function() {
                let _this = this;
                this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/testresult/runtests/list', {
                    data: {
                        execution_name: _this.editPTaskValidate.execution_name,
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
            /**切换页码 */
            pageChange:function(pageNo){
                console.log(pageNo);
                this.pageNo = pageNo;
                this.listCase();
            },
            /**切换页面大小 */
            pageSizeChange:function(pageSize){
                console.log(pageSize);
                this.pageSize = pageSize;
                this.listCase();
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
</style>
