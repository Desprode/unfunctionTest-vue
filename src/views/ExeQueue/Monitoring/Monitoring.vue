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
                <Input style="width:550px"  readonly="readonly"  type="textarea" :autosize="{minRows:2,maxRows:3}" v-model="describe">{{describe}}</Input>
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
                    <Table border :loading="serverInfoLoading" ref="selection" :columns="columns1"  :data="serverInfotableData" class="myTable" @on-row-dblclick="onRowDblClick"></Table>
                    <div class="pageBox" v-if="serverInfotableData.length">
                        <Page :total="parseInt(totalCount)" show-elevator show-total show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" @submit.native.prevent></Page>
                        <p>总共{{totalPage}}页</p>
                    </div>
                </Tab-pane>
                <!---------------------分割线-------------------------->
                <Tab-pane label="压力机资源">
                    <Table border :loading="pressureLoading" ref="selection" :columns="columns"  :data="pressuretableData" class="myTable" @on-row-dblclick="pressonRowDblClick"></Table>
                </Tab-pane>
            </Tabs>
        </div>
    </div> 
</template>
<script> 
  //  var websocket = null;
    export default {
        beforeMount(){
            console.log("monitor beforeMount");
        },
        data () {
                return {
                    serverInfoLoading:true,
                    pressureLoading:true,
                    senario_name:this.$route.query.senario_name,
                    describe: '',
                    statuszt:'',
                    timedate: '',   //开始时间的13为时间戳
                    result:'0秒',
                    wsurl:"ws://128.195.0.12:8080/message/"+this.$route.query.executor_id,         //
                    iframeUrl: '',//"http://128.195.0.14:3000/d/hNfQJhWiz/jmeter-dashboard?orgId=1&from=123456789&to=now&var-testId=123&refresh=5s&kiosk",
                    iframeUrll: '',//"http://128.195.0.14:3000/d/87b2Yucmk/jmeter-dashboard-summary?orgId=1&panelId=45&from=1546910542000&to=now&var-testId=123&refresh=5s&kiosk",
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
                    //压力机
                    columns: [
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
                            title: '机器名',
                            key: 'servPartName'
                        },
                        {
                            title: '硬件配置',
                            key: 'cpuNum',
                            render: (h, params) => {
                                let texts='';
                                if(params.row.cpuNum == null){
                                    texts = '--';
                                }else{
                                    texts = params.row.cpuNum + 'C' + Math.round(parseInt(params.row.memSize)/1024) + 'G';
                                }
                                return h('div',{
                                    props:{
                                    },
                                },texts);
                            }
                        },
                        {
                            title: '操作系统',
                            key: 'osVersion'
                        },
                        {
                            title: 'CPU%',
                            key: 'cpuUsedPercent',
                            render: (h, params) => {
                                let texts='';
                                if(params.row.cpuUsedPercent == null){
                                    texts = '--';
                                }else{
                                    let tmp = parseFloat(params.row.cpuUsedPercent) * 100;
                                    texts = tmp.toFixed(2);
                                }
                                return h('div',{
                                    props:{
                                    },
                                },texts);
                            }
                        },
                        {
                            title: 'MEM%',
                            key: 'memoryUsedPercent',
                            render: (h, params) => {
                                let texts='';
                                if(params.row.memoryUsedPercent == null){
                                    texts = '--';
                                }else{
                                    let tmp = parseFloat(params.row.memoryUsedPercent) * 100;
                                    texts = tmp.toFixed(2);
                                }
                                return h('div',{
                                    props:{
                                    },
                                },texts);
                            }
                        },
                        {
                            title: 'IOPS',
                            key: 'iops',
                            render: (h, params) => {
                                let texts='';
                                if(params.row.iops == null){
                                    if(params.row.ioRead != null && params.row.ioRead != null){
                                        texts = (parseFloat(params.row.ioRead) + parseFloat(params.row.ioWrite)).toFixed(2);
                                    }else{
                                        texts = '--';
                                    }
                                }else{
                                    texts = params.row.iops.toFixed(2);
                                }
                                return h('div',{
                                    props:{
                                    },
                                },texts);
                            }                            
                        }
                    ],
                    pressuretableData: [],
                    //服务器
                    columns1: [
                        {
                            title: '序号',
                            type: 'index2',
                            align: 'center',
                            width: 60,
                            render: (h, params) => {
                                let texts = params.index + (this.pageNo - 1) * this.pageSize + 1;
                                return h('div',{
                                    props:{
                                    },
                                },texts);
                            }
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
                            title: '操作系统',
                            key: 'osVersion'
                        },
                        {
                            title: 'CPU%',
                            align: 'center',
                            children: [
                                {
                                    title: 'Used',
                                    key: 'cpuUsedPercent',
                                    render: (h, params) => {
                                        let texts='';
                                        if(params.row.cpuUsedPercent == null){
                                            texts = '--';
                                        }else{
                                            let tmp = parseFloat(params.row.cpuUsedPercent) * 100;
                                            texts = tmp.toFixed(2);
                                        }
                                        return h('div',{
                                            props:{
                                            },
                                        },texts);
                                    }
                                },
                                {
                                    title: 'Sys',
                                    key: 'cpuSysPercent',
                                    render: (h, params) => {
                                        let texts='';
                                        if(params.row.cpuSysPercent == null){
                                            texts = '--';
                                        }else{
                                            let tmp = parseFloat(params.row.cpuSysPercent) * 100;
                                            texts = tmp.toFixed(2);
                                        }
                                        return h('div',{
                                            props:{
                                            },
                                        },texts);
                                    }
                                },
                                {
                                    title: 'iowait',
                                    key: 'cpuIOWaitPercent',
                                     render: (h, params) => {
                                        let texts='';
                                        if(params.row.cpuIOWaitPercent == null){
                                            texts = '--';
                                        }else{
                                            let tmp = parseFloat(params.row.cpuIOWaitPercent) * 100;
                                            texts = tmp.toFixed(2);
                                        }
                                        return h('div',{
                                            props:{
                                            },
                                        },texts);
                                    }
                                }
                            ]
                        },
                        {
                            title: 'MEM%',
                            align: 'center',
                            children: [
                                {
                                    title: 'Used',
                                    key: 'memoryUsedPercent',
                                    render: (h, params) => {
                                        let texts='';
                                        if(params.row.memoryUsedPercent == null){
                                            texts = '--';
                                        }else{
                                            let tmp = parseFloat(params.row.memoryUsedPercent) * 100;
                                            texts = tmp.toFixed(2);
                                        }
                                        return h('div',{
                                            props:{
                                            },
                                        },texts);
                                    }
                                },
                                {
                                    title: 'cache+buffer',
                                    key: 'memoryBufferPercent',
                                    render: (h, params) => {
                                        
                                        let texts='';
                                        if(params.row.memoryBufferPercent == null){
                                            texts = '--';
                                        }else{
                                            let tmp = (parseFloat(params.row.memoryBufferPercent) + parseFloat(params.row.memoryCachePercent))* 100;
                                            texts = tmp.toFixed(2);
                                        }
                                        return h('div',{
                                            props:{
                                            },
                                        },texts);
                                    }
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
                                    render: (h, params) => {
                                        let texts='';
                                        if(params.row.iops == null){
                                            if(params.row.ioRead != null && params.row.ioRead != null){
                                                texts = (parseFloat(params.row.ioRead) + parseFloat(params.row.ioWrite)).toFixed(2);
                                            }else{
                                                texts = '--';
                                            }
                                        }else{
                                            texts = params.row.iops.toFixed(2);
                                        }
                                        return h('div',{
                                            props:{
                                            },
                                        },texts);
                                    }
                                },
                                {
                                    title: 'IORead',
                                    key: 'ioRead',
                                    render: (h, params) => {
                                        let texts='';
                                        if(params.row.ioRead == null){
                                            texts = '--';
                                        }else{
                                            texts = params.row.ioRead.toFixed(2);
                                        }
                                        return h('div',{
                                            props:{
                                            },
                                        },texts);
                                    }
                                },
                                {
                                    title: 'IOWrite',
                                    key: 'ioWrite',
                                    render: (h, params) => {
                                        let texts='';
                                        if(params.row.cpuSysPercent == null){
                                            texts = '--';
                                        }else{
                                            texts = params.row.ioWrite.toFixed(2);
                                        }
                                        return h('div',{
                                            props:{
                                            },
                                        },texts);
                                    }
                                },
                            ]
                        },
                        {
                            title: 'Network(KB)',
                            align: 'center',
                            children: [
                                {
                                    title: 'netRead',
                                    key: 'netRead',
                                    render: (h, params) => {
                                        let texts='';
                                        if(params.row.netRead == null){
                                            texts = '--';
                                        }else{
                                            texts = (params.row.netRead /1024).toFixed(2);
                                        }
                                        return h('div',{
                                            props:{
                                            },
                                        },texts);
                                    }
                                },
                                {
                                    title: 'netWrite',
                                    key: 'netWrite',
                                    render: (h, params) => {
                                        let texts='';
                                        if(params.row.netWrite == null){
                                            texts = '--';
                                        }else{
                                            texts = (params.row.netWrite /1024).toFixed(2);
                                        }
                                        return h('div',{
                                            props:{
                                            },
                                        },texts);
                                    }
                                },
                            ]
                        }
                    ],
                    serverInfotableData: [],
                    tableDAtaTatol:0,
                    tableDAtaPageLine:3,
                    selectedData:[],
                    totalCount:0,                         //共多少条数据
                    pageNo:1,                            //当前页
                    pageSize:10,                           //每页显示多少条数据
                    totalPage:0,                           //共多少页
                    serverInfo: {},
                    pressureAgentInfo: {},
                    intervalFunc: '',

                    stopes: '',
                    intervalJmeter: '',
                    el_time: '', //已开始时间
                    ws: '',
                    JmeterSummaryUrl:'http://128.195.0.14:3000/d/87b2Yucmk/jmeter-dashboard-summary?orgId=1&panelId=45',
                    JmeterUrl:'http://128.195.0.14:3000/d/hNfQJhWiz/jmeter-dashboard?orgId=1',
                }
            },
        beforeDestroy(){
            console.log("monitor beforeDestroy");

            clearInterval(this.intervalFunc);
            this.intervalFunc = null;
            clearInterval(this.intervalJmeter);
            this.intervalJmeter = null;
            clearInterval(this.stopes);
            this.stopes = null;
            clearTimeout(this.timeout);
            this.el_time = '';
            this.ws.close();
            this.ws = null;
        },
        mounted(){
            console.log("mounted");
            console.log(this.el_time);
    
        },
        created(){
                console.log("monitor created");
                console.log(this);
                //this.pressCase();
                //this.listCase();
                this.initWs();
    
                this.getServerInfo();
                this.getPressureaAgentInfo();
        },
        methods:{
            getflush: function(){
                console.log("start time",this.el_time);
                if(this.el_time !== ''){    // ==的话 ''与0一样
                    
                   var theTime = this.el_time;
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
                   this.result = ""+parseInt(theTime)+"秒"
                   if(theTime1 > 0){
                        this.result = ""+parseInt(theTime1)+"分"+this.result
                   } 
                   if(theTime2 > 0){
                        this.result = ""+parseInt(theTime2)+"小时"+this.result
                   }
                   this.el_time++;console.log("el time",this.el_time);
                } 
                else if(this.el_time === '') {
                    this.result = '0秒'
                    console.log("el time",this.el_time);
                }
            }, 
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
                        if(result.length == 0)
                            return;
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
                console.log(this);
                this.ws =new WebSocket(this.wsurl);
                this.ws.onmessage = this.getmessage;console.log("ws",this.ws);
            },


            getmessage(e){
                var res = e.data
                console.log("这个里面是什么",res)
                var _cutting = res.substr(0,1); //截取
                if(_cutting =='1'){      // 判断是不是开头是1的数据
                    this.describe = e.data.substr(1) + '\n' + this.describe;  //将后端返回的日志倒叙
                    //this.describe+='\r\n'    //换行
                    if(e.data.indexOf('执行监控进程结束') != -1){ //监控起来后就显示资源
                        console.log("test1");
                        console.log(this);
                        console.log(this.intervalFunc);
                        this.updateResource();
                        if(this.intervalFunc == ''){
                            console.log("test2");
                            this.intervalFunc = setInterval(this.updateResource, 10000);
                            console.log("this.intervalFunc",this.intervalFunc);
                        }
                    }
                }else if(_cutting =='0'){   // 判断是不是开头是0的数据
                    var status = e.data
                    var cuttingl = status.substr(1)   //截取0的数据
                    this.statuszt = eval('('+cuttingl+')');
                    if(this.statuszt.el_time != undefined){
                        this.el_time = this.statuszt.el_time;
                        console.log(this.statuszt);
                        console.log(this.el_time);
                    }
                    if(this.statuszt.exe_time != 'null'){
                        this.timedate = Date.parse(this.statuszt.exe_time);   //13位的时间戳
                    }
                /*    if(this.statuszt.exe_time != 'null' && this.start_time == ''){  //不为null展示的this.statuszt.exe_time != 'null'
                        this.start_time = this.statuszt.exe_time;
                        console.log(this.statuszt.exe_time);
                        console.log(this.start_time);
                    } */
                    if(this.statuszt.exe_description.indexOf('测试开始执行') != -1){ //测试准备中
                        this.statuszt.exe_description = '场景正在执行';
                   
                        if(this.stopes == '')
                            this.stopes = setInterval(this.getflush,1000);

                        this.iframeUrl = this.JmeterUrl + "&from="+this.timedate+"&to=now&var-testId="+this.$route.query.executor_id+"&refresh=5s&kiosk";
                        this.iframeUrll = this.JmeterSummaryUrl + "&from="+this.timedate+"&to=now&var-testId="+this.$route.query.executor_id+"&refresh=5s&kiosk";
                        if(this.intervalJmeter == '')    
                            this.intervalJmeter= setInterval(this.flushJmeter,60*1000);
                    }if(this.statuszt.exe_description.indexOf('计算压力机资源控进程开始') != -1){
                        this.statuszt.exe_description = '测试准备中';
                        
                    }if(this.statuszt.exe_description.indexOf('测试执行结束') != -1){
                        if(this.statuszt.el_time != undefined){
                            this.el_time = this.statuszt.el_time;
                        }
                        this.getflush();
                        clearInterval(this.stopes);
                        this.stopes = '';
                       
                        setTimeout(this.StopTimer(), 60000);//为了防止应用返回较慢，设置1分钟后停止刷新，过期不候
                    //    this.StopTimer();
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
                        content: '是否停止该测试',
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
                            _this.$Message.info('已取消停止');
                        }
                    }); 
                   
                }
            },

            updateResource: function(){
                this.listCase();
                this.pressCase();
            },        
                 //服务器资源
            listCase: function() {
                let _this = this;
                _this.serverInfoLoading =true;
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
                    setTimeout(()=>{
                        _this.serverInfoLoading = false;
                        console.log('请求回来的表格数据: ', response.data);
                        _this.totalCount = response.headers.totalcount;
                        _this.totalPage = response.headers.totalpage;
                        _this.serverInfotableData = response.data.resultList;
                        console.log("_this.serverInfotableData",_this.serverInfotableData);
                    },1500)
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

                /**停止外呼操作，场景结束，主动停止时调用，页面关闭在destory里 */
                StopTimer:function(){
                    console.log("this.intervalFunc",this.intervalFunc);
                    clearInterval(this.intervalFunc);
                    this.intervalFunc = null;
                    
                    clearInterval(this.intervalJmeter);
                    this.intervalJmeter = null;
                    this.iframeUrl = this.JmeterUrl + "&from="+this.timedate+"&to=now&var-testId="+this.$route.query.executor_id+"&refresh=3600s&kiosk";
                    this.iframeUrll = this.JmeterSummaryUrl + "&from="+this.timedate+"&to=now&var-testId="+this.$route.query.executor_id+"&refresh=3600s&kiosk";
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
                        setTimeout(()=>{
                            _this.pressureLoading = false;
                            console.log('请求回来的表格数据555: ', response.data);
                            _this.pressuretableData = response.data.result;  
                        },1500)
                    })
                },

                flushJmeter: function(){
                    if(this.timedate == null)
                        return;

                    let nowTime = (new Date()).getTime();
                    let tmp = nowTime - this.timedate;
                    //大于1小时
                    if(tmp > 3600 * 1000){
//                        this.iframeUrl ="http://128.195.0.14:3000/d/hNfQJhWiz/jmeter-dashboard?orgId=1&from="+this.timedate+"&to=now&var-testId="+this.$route.query.executor_id+"&refresh=60s&kiosk";
                        this.iframeUrll = this.JmeterSummaryUrl + "&from="+this.timedate+"&to=now&var-testId="+this.$route.query.executor_id+"&refresh=60s&kiosk"; 
                        clearInterval(this.intervalJmeter);
                        this.intervalJmeter = null;
                    }else if(tmp > 600 * 1000){
                        this.iframeUrll = this.JmeterSummaryUrl + "&from="+this.timedate+"&to=now&var-testId="+this.$route.query.executor_id+"&refresh=10s&kiosk";
                    }
                    
                },
                //压力机资源跳转
                pressonRowDblClick: function(row) {
                    var start = Math.round(new Date().getTime()/1000).toString();//10位时间戳
                    if(this.timedate != ''){
                        this.pressureAgentInfo.start= Math.round(parseInt(this.timedate)/1000).toString();
                    }else{
                        this.pressureAgentInfo.start= start;
                    }
                    this.pressureAgentInfo.selected = row.prodIp;
                    this.$router.push({path:'/MonitorEcharts',query:{pressureAgentInfo:this.pressureAgentInfo,row:row}});
                    console.log('这个是',this.pressureAgentInfo)
                },
                //服务器资源跳转
                onRowDblClick: function(row) {
                    var start = Math.round(new Date().getTime()/1000).toString();//10位时间戳
                    console.log(row);
                    if(this.timedate != ''){
                        this.serverInfo.start= Math.round(parseInt(this.timedate)/1000).toString();
                    }else{
                        this.serverInfo.start= start;
                    }
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