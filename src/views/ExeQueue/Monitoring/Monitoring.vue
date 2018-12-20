<template>
<div>
    <div align="left">
            <font size="5" color="#01babc">实时监控</font>
    </div></br>
            <!--<div align="right" >右对齐，<div align="left" >左对齐  deleteCase-->
            <Button style="float:right" @click="" type="error" class="actionBtn">停止</Button>
    <div>
        <div align="left">
            <font size="3" color="#01babc">场景名称:{{senario_name}}</font>
        </div></br>
        <div align="left">
                    <font size="3" color="#01babc">已运行时间:</font>
        </div></br>
        <div align="left">  
                    <font size="3" color="#01babc">状态:</font>
        </div>
        <div align="left">
            <font size="3" color="#01babc">详细描述:</font>
            <Input style="width:400px"  readonly="readonly" name="mass" type="textarea" :autosize="{minRows:2,maxRows:3}"></Input>
        </div>
    </div>
    <div align="left">
        <Tabs type="card">
            <!---------------------分割线-------------------------->   <!--from 开始时间  to 当前的时间 毫秒时间  var-testId 1544519062251   %executor_id%-->
            <Tab-pane label="jmeter信息">
                <div><iframe id="gIframe1" :src="iframeUrll" width="100%" height="300" frameborder="0"></iframe></div>
                <div><iframe :src="iframeUrl" id="gIframe"  width="100%" height="980" frameborder="0"></iframe></div>
            </Tab-pane>
            <!---------------------分割线-------------------------->
            <Tab-pane label="服务器资源">
                <Table border  ref="selection" :columns="columns1"  :data="tableData" class="myTable" @on-row-dblclick="onRowDblClick"></Table>
                <div class="pageBox" v-if="tableData.length">
                    <Page :total="parseInt(totalCount)" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
                    <p>总共{{totalPage}}页</p>
                </div>
            </Tab-pane>
            <!---------------------分割线-------------------------->
            <Tab-pane label="压力机资源">
                <Table border  ref="selection" :columns="columns"  :data="tableDatal" class="myTable"></Table>
            </Tab-pane>
        </Tabs>
    </div>
</div> 
</template>
<script> 
var websocket = null;
export default {
        data () {
            return { 
                senario_name:this.$route.query.senario_name,
                iframeUrl:"http://128.195.0.14:3000/d/hNfQJhWiz/jmeter-dashboard?orgId=1&from=1544519137048&to=1544519451289&var-testId="+this.$route.query.executor_id+"&refresh=5s&kiosk",
                 iframeUrll:"http://128.195.0.14:3000/d/87b2Yucmk/jmeter-dashboard-summary?orgId=1&panelId=45&from={1544519137048}&to={1544519451289}&var-testId="+this.$route.query.executor_id+"&refresh=5s&kiosk",
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
                        type: 'index',
                        align: 'center',
                        width: 60
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
                        key: 'osVersion'
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
                tableDatal: [],
                columns1: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 60
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
                tableData: [],
                tableDAtaTatol:0,
                tableDAtaPageLine:3,
                totalCount:0,                         //共多少条数据
                pageNo:1,                            //当前页
                pageSize:10,                           //每页显示多少条数据
                totalPage:0,                           //共多少页
            }
        },
        
        created(){
            this.pressCase();
            this.listCase();
            this.initWs();
        },
        
        methods:{
       initWs() {
        //check if your browser supports WebSocket
        console.log("开始了++++++");
		if ('WebSocket' in window) {//{{executor_id}}
            websocket = new WebSocket("ws://128.195.0.12:8080/message/"+this.$route.query.executor_id+"");
		}
		else {
			alert('Sorry, websocket not supported by your browser.')
        }
        // 连接发生错误的回调方法
        websocket.onerror = function () {
			setMessageContent("error!");
            wsVue.opened = false;
        };
        //message received callback    结束
		websocket.onmessage = function (event) {
            console.log("开始了1++++++",event.data);
            console.log("开始了2++++++",str);
            var str = event.data;
             var mas =str.substr(0,1);
             if(mas =='1'){
           //  var  aaa = event.data
           //  console.log("开始了3++++++",aaa);
             }else if(mas =='0'){
            // var  bbb = event.data
            // console.log("开始了4++++++",bbb);
             }
        }
        //socket closed callback  连接关闭等待回调方法
		websocket.onclose = function () {
			setMessageContent("websocket closed");
            wsVue.opened = false;
        }
        window.onbeforeunload = function () {
			websocket.close();
		}
    },
    //click to close the websocket  关闭连接
	 closeWS() {
		websocket.close();
		wsVue.opened = false;
	},

	//click to open the websocket
	 openWS() {
		initWs();
        },
        
        //click to send message
	sendMsg() {
		var message = document.getElementById('text').value;
		websocket.send(message);
	},
            
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
             //服务器资源
             listCase: function() {
                let _this = this;
                var executor_id = this.$route.query.executor_id;    //获取上个页面传的id值
                console.log("第二个页面接收的ID",executor_id);
                this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/monitor/serverlist', {
                    data: {
                        scenarioId: 350,
                        start: 1545206338,
                        end: 1545206538,
                        pageNo:_this.pageNo,
                        pageSize:_this.pageSize,
                    }
                }).then(function (response) {
                    console.log(response);
                    console.log('请求回来的表格数据: ', response.data);
                    _this.tableData = response.data.resultList;  
                    _this.totalCount = response.totalCount;
                    _this.totalPage = response.totalPage;
                    console.log(_this.totalCount);
                    console.log(response.totalCount);  
                    console.log(_this.totalPage);    
                    console.log(response.totalPage);
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
            //压力机资源
           // listCase: function() {
           //     let _this = this;
           //     var executor_id = this.$route.query.executor_id;    //获取上个页面传的id值
            //    console.log("第二个页面接收的ID",executor_id);
            //    this.$http.defaults.withCredentials = false;// ?executorId=1543568019509&start=1543567995&end=1543568195
           //     this.$http.post('http://128.192.219.85:8080/monitor/pressureagentlist', {
            //        data: {
            //            executorId: executor_id,
            //            start: 1543567995,
             //           end: 1543568195,
             //       }
             //   }).then(function (response) {
             //       console.log(response);
             //       console.log('请求回来的表格数据222: ', response.data);
             //       _this.tableData = response.data.resultList;   
              //      _this.tableData = response.data.resultList;
              //  })
         //   },
            pressCase: function() {
                let _this = this;
                var executor_id = this.$route.query.executor_id;    //获取上个页面传的id值 '+this.$route.query.executor_id+'
                console.log("第二个页面接收的ID",executor_id);
                var senario_name = this.$route.query.senario_name; 
                console.log("第二个页面接收的场景名称",senario_name);
                this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/monitor/pressureagentlist?executorId=1543568019509&start=1543567995&end=1543568195', {
                    data: {
                    }
                }).then(function (response) {
                    console.log(response);
                    console.log('请求回来的表格数据555: ', response.data);
                    _this.tableDatal = response.data.result;  
                    _this.tableDatal = response.data.result;
                })
            },
            onRowDblClick: function(row) {
            this.$router.push({path:'/ExeQueue',query:{executor_id:row.executor_id}});
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
