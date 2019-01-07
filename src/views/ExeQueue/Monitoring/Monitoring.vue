<template>
    <div>
        <div align="left">
                <font size="5" color="#01babc">实时监控</font>
        </div></br>
                <!--<div align="right" >右对齐，<div align="left" >左对齐  deleteCase-->
                <Button style="float:right" @click="" type="error" class="actionBtn">停止</Button>
            <div align="left">
                <font size="3" color="#01babc">场景名称:{{senario_name}}</font>
            </div></br>
            <div align="left">
                        <font size="3" color="#01babc">已运行时间:{{statuszt.exe_time}}</font>
            </div></br>
            <div align="left">  
                        <font size="3" color="#01babc"  v-model="statuszt.exe_description">状态:{{statuszt.exe_description}}</font>
            </div>
            <div align="left">
                <font size="3" color="#01babc">详细描述:</font>
                <Input style="width:400px"  readonly="readonly"  type="textarea" :autosize="{minRows:2,maxRows:3}" v-model="describe">{{describe}}</Input>
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
                    <Table border  ref="selection" :columns="columns"  :data="tableDatal" class="myTable" @on-row-dblclick="pressonRowDblClick"></Table>
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
                    describe: '',
                    cuttingl: '',
                    timestamp:'',
                    timestampl:'',
                    statuszt:'',
                    wsurl:"ws://128.195.0.12:8080/message/"+this.$route.query.executor_id,
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
                        describe:'',
                        cuttingl: '',
                        timestamp:'',
                        timestampl:'',
                        statuszt:'',
                        textarea: ''
                    },
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
                    selectedData:[],
                    totalCount:0,                         //共多少条数据
                    pageNo:1,                            //当前页
                    pageSize:10,                           //每页显示多少条数据
                    totalPage:0,                           //共多少页
                    serverInfo: {},
                    pressureAgentInfo: {},
                    //jsonobj: {},
                    starttime:'',

                }
            },
            
            created(){
                this.pressCase();
                this.listCase();
                this.initWs();
    
                this.getServerInfo();
                this.getPressureaAgentInfo();
            },
            methods:{ 
                //服务器资源信息
                getServerInfo: function() {
                    console.log("服务器资源信息");
                    let _this = this;
                    this.$http.defaults.withCredentials = false;
                    console.log(_this.$route.query);
                    this.$http.get('/myapi/monitor/serverlistinfo?scenarioId='+this.$route.query.senario_id, {
                    }).then(function (response) {
                        console.log(response);
                        let result = response.data.resultList;
                        let funDescList = [];
                        let subsys = [];

                        for(let i = 0, len = result.length; i < len; i++){       //遍历响应回的数据
                            let tmp = result[i].funDesc;                         //讲每个funDesc赋值给tmp
                            let flag = true;                                     //命名一个中间量
                            for(let j = 0; j < funDescList.length; j++){         //遍历funDescList数组
                                if(tmp == funDescList[j]){                       //如果tmp与funDescList中的一个值相等时
                                    flag = false;                              //中间量命名为赋值为true
                                    break;
                                }
                            }

                            if(flag === true){                             //只要中间量为true，tmp将一直被放入funDescList中
                                funDescList.push(tmp);
                            }
                        }

                        for(let i = 0, len = funDescList.length; i < len; i++){
                            let funDesc = funDescList[i];
                            let ip = [];
                            for(let j = 0, len1 = result.length; j < len1; j++){
                                if(funDesc == result[j].funDesc){
                                    ip.push(result[j].prodIp)
                                }
                            }
                            let text = {};                     //定义一个空的对象
                            text.funDesc = funDesc;              //将funDesc放入
                            text.ip = ip;                       //将ip放入
                            subsys.push(text);                 //将组成的新对象放入subsys中
                        }

                        //TODO  时间在选择列表中一并获取
                        _this.serverInfo.subsys = subsys;
                        console.log("getserverInfo");
                        console.log("serverInfo",_this.serverInfo);
                        console.log(subsys);
                    });
                },
            //压力机信息
                getPressureaAgentInfo: function() {
                    console.log("压力机信息");
                    let _this = this;
                    this.$http.defaults.withCredentials = false;
                    this.$http.get('/myapi/monitor/pressureagentlistinfo?executorId='+this.$route.query.executor_id, {
                    }).then(function (response) {
                        console.log(response);
                        let result = response.data.resultList;
                        let subsys = [];
                        let funDesc = result[0].funDesc;

                        let ip = [];
                        for(let j = 0, len1 = result.length; j < len1; j++){
                                 ip.push(result[j].prodIp)
                        }
                        let text = {};
                        text.funDesc = funDesc;
                        text.ip = ip;
                        subsys.push(text);

                        //TODO  时间在选择列表中一并获取
                        _this.pressureAgentInfo.subsys = subsys;
                        console.log("pressureAgentInfo",_this.pressureAgentInfo);
                         console.log("getpressInfo");
                        console.log(subsys);
                    });
                },

              initWs() {
               this.ws =new WebSocket(this.wsurl)
               this.ws.onmessage = this.getmessage
              },
              getmessage(e){
            var res = e.data
             console.log(this.res)
             var _cutting = res.substr(0,1);
             console.log("截取==================="+ _cutting)
             if(_cutting =='1'){
                this.describe = e.data
                console.log("formItem.describe==================="+ this.describe)
             }else if(_cutting =='0'){
                var status = e.data
                console.log("这个是==================="+ status)
                var cuttingl = status.substr(1)
                console.log("截取0的==================="+ cuttingl)
                this.statuszt = eval('('+cuttingl+')')
                console.log("点出来的状态==================="+ this.statuszt.exe_description)
                
             }
            
              },
                
                 //服务器资源
                 listCase: function() {
                    let _this = this;
                    var timestamp = Math.round(new Date().getTime()/1000).toString();//10位时间戳
                    console.log("时间：",timestamp);
                    var timestampl =  timestamp - 300;
                    console.log("时间2：",timestampl);
                    var executor_id = this.$route.query.executor_id;    //获取上个页面传的id值
                    console.log("第二个页面接收的ID",executor_id);
                    this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/monitor/serverlist', {
                        data: {
                            scenarioId: 370,
                            start:timestamp,
                            end: timestampl,
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
                pressCase: function() {
                    let _this = this;
                    var startl = Math.round(new Date().getTime()/1000).toString();//10位时间戳
                    console.log("时间：",startl);
                    var endl =  startl - 300;
                    console.log("时间2：",endl);
                    var executor_id = this.$route.query.executor_id;    //获取上个页面传的id值 '+this.$route.query.executor_id+'
                    console.log("第二个页面接收的ID",executor_id);
                    var senario_name = this.$route.query.senario_name; 
                    console.log("第二个页面接收的场景名称",senario_name);
                    this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/monitor/pressureagentlist?executorId='+this.$route.query.executor_id+'&start='+startl+'&end='+endl+'', {
                        data: {
                        }
                    }).then(function (response) {
                        console.log(response);
                        console.log('请求回来的表格数据555: ', response.data);
                        _this.tableDatal = response.data.result;  
                        _this.tableDatal = response.data.result;
                    })
                },
                //压力机资源跳转
                pressonRowDblClick: function(row) {
                    var start = Math.round(new Date().getTime()/1000).toString();//10位时间戳
                    this.pressureAgentInfo.start= start;
                    this.pressureAgentInfo.selected = row.prodIp;
                    if(this.pressureAgentInfo === ''){
                        this.getPressureaAgentInfo();
                    }
                    this.$router.push({path:'/MonitorEcharts',query:{pressureAgentInfo:this.pressureAgentInfo}});
                },
                //服务器资源跳转
                onRowDblClick: function(row) {
                var start = Math.round(new Date().getTime()/1000).toString();//10位时间戳
                    console.log(row);
                    this.serverInfo.start= start;
                    this.serverInfo.selected = row.prodIp;
                    if(this.serverInfo === ''){
                        this.getServerInfo();
                    }
                    this.$router.push({path:'/MonitorEcharts',query:{serverInfo:this.serverInfo}});
                }
            }
        }
    
    </script>>
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