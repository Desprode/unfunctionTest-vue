 <template>
    <div>
        <div align="left">
                <font size="5" color="#330000">实时监控</font>
        </div></br>
                <!--<div align="right" >右对齐，<div align="left" >左对齐  deleteCase-->
                <Button style="float:right" @click="deleteData">停止</Button>
            <div align="left">
                <font size="3" color="#330000">场景名称:{{senario_name}}</font>
            </div></br>
            <div align="left">
                        <font size="3" color="#330000" v-model="result">已运行时间:{{result}}</font>
            </div></br>
            <div align="left">  
                        <font size="3" color="#330000"  v-model="statuszt.exe_description">状态:{{statuszt.exe_description}}</font>
            </div>
            <div align="left">
                <font size="3" color="#330000">详细描述:</font>
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
        let start_time = null;
        let timestamp = null;
        let timestampl = null;
    export default {
        beforeMount(){
        this.stopes= setInterval(getflush,1000)
            let timdate = this
            function getflush(){
                let curDate = new Date();
                //let cuDate = new Date();
                if(start_time != null){
                if(timdate.starttime != 'null'){
                    let cuDate = new Date(start_time);
                    timdate.starttime = Math.ceil(((curDate.getTime() - cuDate.getTime())/1000)+48)
                   var theTime = timdate.starttime
                   var theTime1 = 0;
                   var theTime2 = 0;
                   if(theTime > 60){
                    theTime1 = parseInt(theTime/60);
                    theTime = parseInt(theTime%60);
                    if(theTime1 > 60){
                        theTime2 = parseInt(theTime1/60);
                        theTime1 = parseInt(theTime1%60);
                    }
                   }
                   timdate.result = ""+parseInt(theTime)+"秒"
                   if(theTime1 > 0){
                    timdate.result = ""+parseInt(theTime1)+"分"+timdate.result
                   } 
                   if(theTime2 > 0){
                    timdate.result = ""+parseInt(theTime2)+"小时"+timdate.result
                   }
                } 
            }else if(timdate.start_time == null) {
                    timdate.result = '0.000'
                }
            }
        },
            data () {
                return {
                    senario_name:this.$route.query.senario_name,
                    describe: '',
                    statuszt:'',
                    timedate: '',
                    result:'0.000',
                    starttime:'0.000',
                    wsurl:"ws://128.195.0.12:8080/message/"+this.$route.query.executor_id,         //
                    iframeUrl:"http://128.195.0.14:3000/d/hNfQJhWiz/jmeter-dashboard?orgId=1&from=123456789&to=now&var-testId=123&refresh=5s&kiosk",
                    iframeUrll:"http://128.195.0.14:3000/d/87b2Yucmk/jmeter-dashboard-summary?orgId=1&panelId=45&from=1546910542000&to=now&var-testId=123&refresh=5s&kiosk",
                    formItem: {
                        cmpOpts: [],
                        list: [], 
                        input: '',
                        select: '',
                        taskStatusList: this.$Global.taskStatusList,
                        checkbox: [],
                        switch: true,
                        executor_id:'',
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
                            key: 'cpuNum'
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
                            title: 'MEM%%',
                            key: 'memoryUsedPercent'
                        },
                        {
                            title: 'IOPS',
                            key: 'iops'
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
                                    key: 'memoryUsedPercent',
                                },
                                {
                                    title: 'cache+buffer',
                                    key: 'memoryBufferPercent',
                                },
                            ]
                        },
                        {
                            title: 'IO',
                            align: 'center',
                            children: [
                                {
                                    title: 'IOPS',
                                    key: 'iops',
                                },
                                {
                                    title: 'ioread',
                                    key: 'ioRead',
                                },
                                {
                                    title: 'ioWrite',
                                    key: 'ioWrite',
                                },
                            ]
                        },
                        {
                            title: 'network(KB)',
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
                    intervalFunc:null,
                    intervalFuncc:null,
                    stopes:null,
                }
            },
            beforeDestroy(){
            clearInterval(this.intervalFunc);
            this.intervalFunc = null;

            clearInterval(this.intervalFuncc);
            this.intervalFuncc = null;
            clearInterval(this.stopes);
            this.stopes = null;
        },
            mounted(){
                
            },
            created(){
                //this.pressCase();
                //this.listCase();
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
             console.log("这个里面是什么",res)
             var _cutting = res.substr(0,1); //截取
             if(_cutting =='1'){      // 判断是不是开头是1的数据
             this.describe+=e.data.substr(1)
             this.describe+='\r\n'    //换行
             }else if(_cutting =='0'){   // 判断是不是开头是0的数据
                var status = e.data
                var cuttingl = status.substr(1)   //截取0的数据
                this.statuszt = eval('('+cuttingl+')')
                 if(this.statuszt.exe_time != 'null'){  //不为null展示的this.statuszt.exe_time != 'null'
                    start_time = this.statuszt.exe_time;
                }
                if(this.statuszt.exe_description === '测试开始执行'){ //测试准备中
                    this.timedate = Date.parse(this.statuszt.exe_time);    //13位的时间戳
                    this.iframeUrl ="http://128.195.0.14:3000/d/hNfQJhWiz/jmeter-dashboard?orgId=1&from="+this.timedate+"&to=now&var-testId="+this.$route.query.executor_id+"&refresh=5s&kiosk";
                    this.iframeUrll = "http://128.195.0.14:3000/d/87b2Yucmk/jmeter-dashboard-summary?orgId=1&panelId=45&from="+this.timedate+"&to=now&var-testId="+this.$route.query.executor_id+"&refresh=5s&kiosk";
                    this.intervalFunc = setInterval(this.listCase, 2000);
                    this.intervalFuncc = setInterval(this.pressCase, 2000);
                }if(this.statuszt.exe_description === '计算压力机资源控进程开始'){
                    this.statuszt.exe_description = '测试准备中'
                    start_time = null
                }if(this.statuszt.exe_description === '测试执行结束'){
                    this.intervalFuncc = false
                }
             }
              },
             //停止
        deleteData: function() {                //调用方法将原有数据中对应的id停止
            let _this = this;
            let deaa =[];
                if (this.$route.query.executor_id.includes(this.$route.query.executor_id)) {       //当原有的数据与要停止的数据中有相同的数据时，
                    _this.$Modal.confirm({
                        title:'确认',
                        content: '是否停止该数据',
                        onOk: () => {
                            let deaa = [];
                            deaa.push(this.$route.query.executor_id)
                            this.$http.defaults.withCredentials = false;
                            this.$http.post("/myapi/testresult/runtests/cancel",{
                                header:{},
                                data:{
                                    ids:deaa,
                                }
                            }).then(function(){
                                _this.$Message.info('停止成功');
                                _this.$router.push({path:'/ExeQueue',query:{}});
                                
                            })
                        },
                        onCancel: () => {
                            _this.$Message.info('停止失败');
                        }
                    }); 
                   
                }
        },
                
                 //服务器资源
                 listCase: function() {
                    let _this = this;
                    var executor_id = this.$route.query.executor_id;    //获取上个页面传的id值
                    var senario_id = this.$route.query.senario_id;    //获取上个页面传的场景id值  this.$route.query.senario_type为1的话 不显示后两个列表
                    var timestampl = Math.round(new Date().getTime()/1000);//10位时间戳
                    var timestamp = timestampl - 300;
                    this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/monitor/serverlist', {
                        data: {
                            scenarioId: senario_id,
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
                        var arr = response.data.resultList;
                        for(var i=0;i<arr.length;i++){
                            if(arr[i].cpuUserPercent == null){
                                _this.tableData[i].cpuUserPercent = '--'
                            }else {
                                _this.tableData[i].cpuUserPercent=arr[i].cpuUserPercent*100;
                                 if (String(_this.tableData[i].cpuUserPercent).indexOf('.') > -1)
                                 _this.tableData[i].cpuUserPercent = _this.tableData[i].cpuUserPercent.toFixed(2);
                            }
                            if(arr[i].cpuSysPercent == null){
                                _this.tableData[i].cpuSysPercent = '--';
                            }else {
                                _this.tableData[i].cpuSysPercent=arr[i].cpuSysPercent*100;
                                if (String(_this.tableData[i].cpuSysPercent).indexOf('.') > -1)
                                 _this.tableData[i].cpuSysPercent = _this.tableData[i].cpuSysPercent.toFixed(2);
                            }
                            if(arr[i].cpuIOWaitPercent == null){
                                _this.tableData[i].cpuIOWaitPercent = '--';
                            }else {
                                _this.tableData[i].cpuIOWaitPercent=arr[i].cpuIOWaitPercent*100;
                                if (String(_this.tableData[i].cpuIOWaitPercent).indexOf('.') > -1)
                                 _this.tableData[i].cpuIOWaitPercent = _this.tableData[i].cpuIOWaitPercent.toFixed(2);
                            }
                            if(arr[i].memoryUsedPercent == null){
                                _this.tableData[i].memoryUsedPercent = '--'
                            }else {
                                _this.tableData[i].memoryUsedPercent=arr[i].memoryUsedPercent*100;
                                if (String(_this.tableData[i].memoryUsedPercent).indexOf('.') > -1)
                                 _this.tableData[i].memoryUsedPercent = _this.tableData[i].memoryUsedPercent.toFixed(2);
                            }
                            if(arr[i].memoryBufferPercent == null){
                                _this.tableData[i].memoryBufferPercent = '--';
                            }else {
                                _this.tableData[i].memoryBufferPercent=arr[i].memoryBufferPercent*100 + arr[i].memoryCachePercent*100;
                                if (String(_this.tableData[i].memoryBufferPercent).indexOf('.') > -1)
                                 _this.tableData[i].memoryBufferPercent = _this.tableData[i].memoryBufferPercent.toFixed(2);
                            }
                            if(arr[i].ioRead == null&&arr[i].ioRead == 0){
                                _this.tableData[i].ioRead = '--';
                            }else {
                                _this.tableData[i].ioRead=arr[i].ioRead*100;
                                if (String(_this.tableData[i].ioRead).indexOf('.') > -1)
                                 _this.tableData[i].ioRead = _this.tableData[i].ioRead.toFixed(2);
                            }
                            if(arr[i].ioWrite == null&&arr[i].ioWrite == 0){
                                _this.tableData[i].ioWrite = '--';
                            }else {
                                _this.tableData[i].ioWrite=arr[i].ioWrite*100;
                                if (String(_this.tableData[i].ioWrite).indexOf('.') > -1)
                                 _this.tableData[i].ioWrite = _this.tableData[i].ioWrite.toFixed(2);
                            }
                            if(arr[i].iops == null){
                                _this.tableData[i].iops = '--'
                            }else {
                                _this.tableData[i].iops=arr[i].iops*100;
                                if (String(_this.tableData[i].iops).indexOf('.') > -1)
                                 _this.tableData[i].iops = _this.tableData[i].iops.toFixed(2);
                            }
                            if(arr[i].netRead == null){
                                _this.tableData[i].netRead = '--';
                            }else {
                                _this.tableData[i].netRead=arr[i].netRead/1024;
                                if (String(_this.tableData[i].netRead).indexOf('.') > -1)
                                 _this.tableData[i].netRead = _this.tableData[i].netRead.toFixed(2);
                            }
                            if(arr[i].netWrite == null){
                                _this.tableData[i].netWrite = '--';
                            }else {
                                _this.tableData[i].netWrite=arr[i].netWrite/1024;
                                if (String(_this.tableData[i].netWrite).indexOf('.') > -1)
                                 _this.tableData[i].netWrite = _this.tableData[i].netWrite.toFixed(2);
                            }
                        }
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
                    var executor_id = this.$route.query.executor_id;    //获取上个页面传的id值 '+this.$route.query.executor_id+'
                    var senario_name = this.$route.query.senario_name; 
                    var timestampl = Math.round(new Date().getTime()/1000);//10位时间戳
                    var timestamp = timestampl - 300;
                    this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/monitor/pressureagentlist?executorId='+this.$route.query.executor_id+'&start='+timestamp+'&end='+timestampl+'', {//
                        data: {
                        }
                    }).then(function (response) {
                        console.log(response);
                        console.log('请求回来的表格数据555: ', response.data);
                        _this.tableDatal = response.data.result;  
                        _this.tableDatal = response.data.result;
                        var ccc = response.data.result;
                        for(var i=0;i<ccc.length;i++){
                            if(ccc[i].cpuNum == null){
                                _this.tableDatal[i].cpuNum = '--'
                            }else {
                                var aaa = ccc[i].memSize/1024
                                var cccc = Math.round(aaa)    //四舍五入  Math.ceil() 向上取整
                                console.log(cccc)
                                _this.tableDatal[i].cpuNum = ccc[i].cpuNum+'c'+cccc+'G'
                            }if(ccc[i].cpuUsedPercent == null){
                                _this.tableDatal[i].cpuUsedPercent = '--'
                            }else {
                                _this.tableDatal[i].cpuUsedPercent=ccc[i].cpuUsedPercent*100;
                                if (String(_this.tableDatal[i].cpuUsedPercent).indexOf('.') > -1)
                                 _this.tableDatal[i].cpuUsedPercent = _this.tableDatal[i].cpuUsedPercent.toFixed(2);
                            } 
                            if(ccc[i].memoryUsedPercent == null){
                                _this.tableDatal[i].memoryUsedPercent = '--'
                            }else {
                                _this.tableDatal[i].memoryUsedPercent=ccc[i].memoryUsedPercent*100;
                                if (String(_this.tableDatal[i].memoryUsedPercent).indexOf('.') > -1)
                                 _this.tableDatal[i].memoryUsedPercent = _this.tableDatal[i].memoryUsedPercent.toFixed(2);
                            }
                            if(ccc[i].iops == null){
                                _this.tableDatal[i].iops = '--'
                            }else {
                                _this.tableDatal[i].iops=ccc[i].iops*100;
                                if (String(_this.tableDatal[i].iops).indexOf('.') > -1)
                                 _this.tableDatal[i].iops = _this.tableDatal[i].iops.toFixed(2);
                            }
                        }
                    })
                },
                //压力机资源跳转
                pressonRowDblClick: function(row) {
                    var start = Math.round(new Date().getTime()/1000).toString();//10位时间戳
                    this.pressureAgentInfo.start= start;
                    this.pressureAgentInfo.selected = row.prodIp;
                    this.$router.push({path:'/MonitorEcharts',query:{pressureAgentInfo:this.pressureAgentInfo,row:row}});
                    console.log('这个是',this.pressureAgentInfo)
                },
                //服务器资源跳转
                onRowDblClick: function(row) {
                var start = Math.round(new Date().getTime()/1000).toString();//10位时间戳
                    console.log(row);
                    this.serverInfo.start= start;
                    this.serverInfo.selected = row.prodIp;
                    this.$router.push({path:'/MonitorEcharts',query:{serverInfo:this.serverInfo,row:row}});
                    console.log('这个是',this.serverInfo)
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