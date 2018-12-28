<template>
    <div>
        <Card>
            <Form :label-width="50" laabe-position="right">
                <Row>
                    <Col span="12">
                        <FormItem label="服务器">
                            <Select v-model="model" @on-change="funsChange">
                                <Option v-for="(item,index) in subsys" :key="index" :value="item.funDesc">{{item.funDesc}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="24" v-if="prodIPRow">
                        <FormItem label="服务器地址"  :label-width="80">
                            <Select v-model="prodIPList" multiple @on-change="prodIPChange">
                                <Option v-for="item in prodIP" :value="item" :key="item">{{item}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12" v-else>
                        <FormItem label="服务器地址"  :label-width="80">
                            <Select v-model="prodIPList" multiple @on-change="prodIPChange">
                                <Option v-for="item in prodIP" :value="item" :key="item">{{item}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    
                </Row>
                <!-- <Row>
                    <FormItem label="服务器地址"  :label-width="100">
                        <Select v-model="model" v-for="item in prodIPs" :value="item" :key="item">
                            <Option value="01">否</Option>
                            <Option value="02">是</Option>
                        </Select>
                    </FormItem>
                </Row> -->
                <Row>
                    <Col span="11">
                        <FormItem label="CPU">
                            <Select multiple>
                                <Option placeholder="Select CPU Mode" v-for="item in CPU" :value="item.label" :key="item.value">{{item.label}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="内存">
                            <Select multiple>
                                <Option placeholder="Select Memory Mode" v-for="item in Memory" :value="item.label" :key="item.value">{{item.label}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="2">
                         <Button @click="confirm" type="primary">确定</Button>
                    </Col>
                </Row> 
            </Form>
            <Row>
                <Col>
                    <div id="container_cpu" :style="{width: '1000px',  height:'500px'}" ></div>
                </Col>
            </Row>
             <Row>
                <Col>
                    <div id="container_mem" :style="{width: '1000px',  height:'500px'}" ></div>
                </Col>
            </Row>
                    <div id="container_io" :style="{width: '1000px',  height:'500px'}" ></div>
                    <div id="container_net" :style="{width: '1000px',  height:'500px'}" ></div>
                    <Button @click="returnBack">返回</Button>
            
        </Card>
    </div>
</template>
<script>

    export default {
        data (){
            return {
                model:'',
                prodIPList:[],
                prodIPListSend:[],
                CPU:[
                    {
                        value:'users',
                        label:'users'
                    },
                    {
                        value:'sys',
                        label:'sys'
                    },
                    {
                        value:'wait',
                        label:'wait'
                    },
                ],
                Memory:[
                    {
                        value:'buffer',
                        label:'buffer'
                    },
                    {
                        value:'cache',
                        label:'cache'
                    }
                ],
                "start":1545025050,
				"selected":"128.196.52.135",
                funDescID:0,
                subsys:[
						{
						"funDesc":"分类一",
						"ip":["128.196.52.134","128.196.52.135","128.196.52.136"]
						},
						{
						"funDesc":"分类二",
						"ip":["128.196.53.145","128.196.53.146","128.196.53.147"]
						},
						{
						"funDesc":"分类三",
						"ip":["128.196.53.148","128.196.52.124","128.196.52.132","128.196.52.133"]
						}
                    ],
                prodIP:[],
                prodIPRow:'',
                funDesc:[],
                value1:[],
                //CPU
                myChart_cpu:'',
                option_cpu:'',
                legendvar_cpu: [],
                datapos_cpu: [],
                chartdata_cpu: [],
                legend_cpu: [],

                //MEM
                myChart_mem: '',
                option_mem: '',
                legendvar_mem: [],
                datapos_mem: [],
                chartdata_mem: [],
                legend_mem: [],

                //IO
                myChart_io: '',
                option_io: '',
                legendvar_io: [],
                datapos_io: [],
                chartdata_io: [],
                legend_io: [],

                 //NET
                myChart_net: '',
                option_net: '',
                legendvar_net: [],
                datapos_net: [],
                chartdata_net: [],
                legend_net: [],

                //当前选用的IP和模式
                cpumode: ["user", "system", "Used", "iowait"],
                memmode: ["buffer", "cache", "free", "used"],
                iomode: ["IOPS", "read", "write"],
                ipmode: ["128.196.52.134","128.196.52.135"],//选择后的结果


                 //需前一界面传入
                iplist: ["128.196.52.134","128.196.52.135"],
                //host: "128.195.0.12:8080",
                funDesc: [],
                startTime: 0,


                interval: 5,
                timeRange: 3600, //监控时长
                timeRangeFlag: false, //是否选择监控时长标志，否则开始时间为传入的启动时间
                BeginTime: 0, //监控开始时间

                flushFlag: true,//全局定时刷新标志
                timeSectionFlag: false,//日历时段选择，复用刷新函数，但是不能定时刷新

                intervalFunc:'',
            }
        },
         mounted(){
            // this.updatedisk();
            this.initAll();

            this.initCpu();
            this.updateChart_cpu(this.BeginTime,'1545121419');

            this.initMem();
            this.updateChart_mem(this.BeginTime,'1545121419');

            this.initIo();
            this.updateChart_io(this.BeginTime,'1545121419');

            this.initNet();
            this.updateChart_net(this.BeginTime,'1545121419');

            setInterval(this.realTimeCl, 5000);
        },
        created () {
            
        },
        methods: {
            returnBack:function(){
                this.$router.back(-1);
            },
            /**服务器改变时，服务器地址随之改变 */
            funsChange:function(){
                console.log("选项改变了");
                console.log(this.model);
                let _this = this;
                _this.subsys.map(item=>{
                    console.log(item.funDesc);
                    if(item.funDesc == _this.model){
                        _this.prodIP = item.ip;
                    }
                })
                _this.prodIPListSend.push(_this.prodIPList);
                _this.prodIPList = [];
                console.log(_this.prodIPListSend);
            },
            prodIPChange:function(){
                if(this.prodIPList.length > 2){
                    this.prodIPRow = true;
                    console.log(this.prodIPRow);
                }else{
                    this.prodIPRow = false;
                    console.log(this.prodIPRow);
                }
            },
            confirm:function(){
                for(var i=0;i<this.subsys.length;i++){
                    console.log(this.subsys[i].funDesc);
                    this.funDescID = i ;
                    console.log(this.funDescID);
                    for(var j=0;j<this.subsys[i].ip.length;j++){
                        console.log(this.subsys[i].ip[j]);
                    }
                }
                console.log(this.model);
                console.log(this.prodIPList);
            },
            initAll(){
            this.BeginTime = "1545121119";
            },

            initCpu(){
                this.myChart_cpu =this.$echarts.init(document.getElementById('container_cpu'),'infographic');
                console.log("firstin");
                console.log(this);
                let _this = this;
                this.myChart_cpu.on('dataZoom', function (params) {
                    _this.flushFlag = false;
                });

                this.myChart_cpu.on('restore', function (params) {
                    _this.flushFlag = true;
                    _this.timeSectionFlag = false;
                });

                this.myChart_cpu.on('legendselectchanged', function (obj) {
                    var selected = obj.selected;
                    var legend2 = obj.name;

                    // 使用 legendToggleSelect Action 会重新触发 legendselectchanged Event，导致本函数重复运行
                    // 使得 无 selected 对象
                    if (selected != undefined) {
                        console.log("abc");
                        console.log(this);
                        console.log(selected);
                        //多选反选，但倒数第二个会全选中
                        if (_this.isFirstUnSelect(selected)) {
                            console.log("isFirstUnSelect");
                            console.log(selected);
                            var legend = [];
                            for (name in selected) {
                                if (selected.hasOwnProperty(name)) {
                                legend.push({ name: name });
                                }
                            }

                            _this.myChart_cpu.dispatchAction({
                                type: 'legendToggleSelect',
                                batch: legend
                            });
                        } else if (_this.isAllUnSelected(selected)) {
                    
                            var legend = [];
                            for (name in selected) {
                                if (selected.hasOwnProperty(name)) {
                                legend.push({ name: name });
                                }
                            }

                            _this.myChart_cpu.dispatchAction({
                                type: 'legendSelect',
                                batch: legend
                            });

                        }
                    }

                });

                
                // 指定图表的配置项和数据
                this.option_cpu = {
                    title: {
                        text: 'CPU',
                        x: 'center'
                    },
                    //backgroundColor: 'rgba(131, 175, 155, 0.05)', //rgba设置透明度0.1
                    tooltip: {
                        trigger: 'axis',
                        textStyle:{
                            align:'left'
                            }
                    },
                    legend: {
                        orient: 'vertical',//'horizontal', // 'vertical'
                        //		x: 'right', // 'center' | 'left' | {number},
                        y: 'center', // 'center' | 'bottom' | {number}
                        type: 'scroll',
                        right: 1,
                        top: '20%',
                        bottom: '10%',
                        data: this.legend_cpu,
                        formatter: function (name) {
                            let legendtext;
                            for (let i = 0, len = _this.chartdata_cpu.length; i < len; i++) {
                                let total = Number(0);
                                if ((_this.chartdata_cpu[i].name) === name) {
                                    let dataLen = _this.chartdata_cpu.length;
                                    for (var j = 0; j < dataLen; j++) {
                                        total += parseFloat((_this.chartdata_cpu[i].data[j])[1]);
                                    }
                                    legendtext = name + ' ' + ((total / dataLen)).toFixed(2) + '%';
                                }
                            }
                            return legendtext;
                        }
                    },
                    grid: {
                        //    left: '3%',
                        right: '25%',
                        //    bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        },
                        /*	axisLabel:{
                                textStyle:{fontSize:10}
                            }*/
                    },
                    yAxis: {
                        type: 'value',
                        //	max: 100,
                        name: 'CPU使用率(%)'
                    },
                    series: this.chartdata_cpu
                };
                this.myChart_cpu.setOption(this.option_cpu);
                window.addEventListener("resize",this.myChart_cpu.resize);
            },

            initMem(){
                this.myChart_mem =this.$echarts.init(document.getElementById('container_mem'),'infographic');

                let _this = this;
                this.myChart_mem.on('dataZoom', function (params) {
                    console.log("aaaad");
                    _this.flushFlag = false;
                });

                this.myChart_mem.on('restore', function (params) {
                    _this.flushFlag = true;
                    _this.timeSectionFlag = false;
                });

                this.myChart_mem.on('legendselectchanged', function (obj) {
                    var selected = obj.selected;
                    var legend2 = obj.name;

                    // 使用 legendToggleSelect Action 会重新触发 legendselectchanged Event，导致本函数重复运行
                    // 使得 无 selected 对象
                    if (selected != undefined) {
                        console.log("abc");
                        console.log(this);
                        console.log(selected);
                        //多选反选，但倒数第二个会全选中
                        if (_this.isFirstUnSelect(selected)) {
                            console.log("isFirstUnSelect");
                            console.log(selected);
                            var legend = [];
                            for (name in selected) {
                                if (selected.hasOwnProperty(name)) {
                                legend.push({ name: name });
                                }
                            }

                            _this.myChart_mem.dispatchAction({
                                type: 'legendToggleSelect',
                                batch: legend
                            });
                        } else if (_this.isAllUnSelected(selected)) {			
                            var legend = [];
                            for (name in selected) {
                                if (selected.hasOwnProperty(name)) {
                                legend.push({ name: name });
                                }
                            }

                            _this.myChart_mem.dispatchAction({
                                type: 'legendSelect',
                                batch: legend
                            });
                        }
                    }
                });
                
                // 指定图表的配置项和数据
                this.option_mem = {
                    title: {
                        text: 'MEM使用情况',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                        textStyle:{
        　		　	  	align:'left'
        　　　　		}
                    },
                    //backgroundColor: 'rgba(131, 175, 155, 0.05)', //rgba设置透明度0.1
                    legend: {
                        orient: 'vertical',//'horizontal', // 'vertical'
                        //		x: 'right', // 'center' | 'left' | {number},
                        y: 'center', // 'center' | 'bottom' | {number}
                        type: 'scroll',
                        right: 1,
                        top: '20%',
                        bottom: '10%',
                        data: this.legend_mem,
                        formatter: function (name) {
                            var legendtext;
                            for (var i = 0; i < _this.chartdata_mem.length; i++) {
                                var total = Number(0);
                                if ((_this.chartdata_mem[i].name) == name) {
                                    for (var j = 0; j < _this.chartdata_mem[i].data.length; j++) {
                                        total += parseFloat((_this.chartdata_mem[i].data[j])[1]);
                                    }
                                    legendtext = name + ' ' + ((total / _this.chartdata_mem[i].data.length)).toFixed(2) + "%";
                                }
                            }
                            return legendtext;
                        }
                    },
                    grid: {
                        //    left: '3%',
                        right: '25%',
                        //    bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        //   max: 100,
                        name: '内存使用率(%)'
                    },
                    series: this.chartdata_mem
                };
                this.myChart_mem.setOption(this.option_mem);
            },

            initIo(){
                this.myChart_io = this.$echarts.init(document.getElementById('container_io'),'infographic');

                let _this = this;
                this.myChart_io.on('dataZoom', function (params) {
                    _this.flushFlag = false;
                });

                this.myChart_io.on('restore', function (params) {
                    _this.flushFlag = true;
                    _this.timeSectionFlag = false;
                });

                this.myChart_io.on('legendselectchanged', function (obj) {
                    var selected = obj.selected;
                    var legend2 = obj.name;

                    // 使用 legendToggleSelect Action 会重新触发 legendselectchanged Event，导致本函数重复运行
                    // 使得 无 selected 对象
                    if (selected != undefined) {
                        console.log("abc");
                        console.log(this);
                        console.log(selected);
                        //多选反选，但倒数第二个会全选中
                        if (_this.isFirstUnSelect(selected)) {
                            console.log("isFirstUnSelect");
                            console.log(selected);
                            var legend = [];
                            for (name in selected) {
                                if (selected.hasOwnProperty(name)) {
                                legend.push({ name: name });
                                }
                            }

                            _this.myChart_io.dispatchAction({
                                type: 'legendToggleSelect',
                                batch: legend
                            });
                        } else if (_this.isAllUnSelected(selected)) {			
                            var legend = [];
                            for (name in selected) {
                                if (selected.hasOwnProperty(name)) {
                                legend.push({ name: name });
                                }
                            }

                            _this.myChart_io.dispatchAction({
                                type: 'legendSelect',
                                batch: legend
                            });
                        }
                    }
                });
                
                // 指定图表的配置项和数据
                this.option_io = {
                title: {
                        text: 'IO',
                        x: 'center'
                    },
                    //backgroundColor: 'rgba(131, 175, 155, 0.05)', //rgba设置透明度0.1
                    tooltip: {
                        trigger: 'axis',
                        textStyle:{
        　		　	  	align:'left'
        　　　　		}
                    },
                    legend: {
                        orient: 'vertical',//'horizontal', // 'vertical'
                        //		x: 'right', // 'center' | 'left' | {number},
                        y: 'center', // 'center' | 'bottom' | {number}
                        type: 'scroll',
                        right: 1,
                        top: '20%',
                        bottom: '10%',
                        data: this.legend_io,
                        //	formatter: '{name}'
                        formatter: function (name) {
                            var legendtext;
                            for (var i = 0; i < _this.chartdata_io.length; i++) {
                                var total = Number(0);
                                if ((_this.chartdata_io[i].name) == name) {
                                    for (var j = 0; j < _this.chartdata_io[i].data.length; j++) {
                                        total += parseFloat((_this.chartdata_io[i].data[j])[1]);
                                    }
                                    legendtext = name + ' ' + ((total / _this.chartdata_io[i].data.length)).toFixed(2);
                                }
                            }
                            return legendtext;
                        }
                    },
                    grid: {
                        //    left: '3%',
                        right: '25%',
                        //    bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: [
                        {
                            gridIndex: 0,
                            type: 'value',
                            //	max: 100,
                            name: 'IOPS',
                        },
                        {
                            //	gridIndex: 1,
                            type: 'value',
                            //	max: 100,
                            name: 'MB',
                        },
                        /*	{
                                gridIndex: 2,
                                type: 'value',
                                //	max: 100,
                                name: 'write MB',
                                inverse: true
                            },*/
                    ],
                    series: this.chartdata_io
                };
                this.myChart_io.setOption(this.option_io);
            },
            
            initNet(){
                this.myChart_net =this.$echarts.init(document.getElementById('container_net'),'infographic');

                let _this = this;
                this.myChart_net.on('dataZoom', function (params) {
                    _this.flushFlag = false;
                });

                this.myChart_net.on('restore', function (params) {
                    _this.flushFlag = true;
                    _this.timeSectionFlag = false;
                });

                this.myChart_net.on('legendselectchanged', function (obj) {
                    var selected = obj.selected;
                    var legend2 = obj.name;

                    // 使用 legendToggleSelect Action 会重新触发 legendselectchanged Event，导致本函数重复运行
                    // 使得 无 selected 对象
                    if (selected != undefined) {
                        //多选反选，但倒数第二个会全选中
                        if (_this.isFirstUnSelect(selected)) {
                            var legend = [];
                            for (name in selected) {
                                if (selected.hasOwnProperty(name)) {
                                legend.push({ name: name });
                                }
                            }

                            _this.myChart_net.dispatchAction({
                                type: 'legendToggleSelect',
                                batch: legend
                            });
                        } else if (_this.isAllUnSelected(selected)) {			
                            var legend = [];
                            for (name in selected) {
                                if (selected.hasOwnProperty(name)) {
                                legend.push({ name: name });
                                }
                            }

                            _this.myChart_net.dispatchAction({
                                type: 'legendSelect',
                                batch: legend
                            });
                        }
                    }
                });
                
                // 指定图表的配置项和数据
                this.option_net = {
                    title: {
                        text: 'Net',
                        x: 'center'
                    },
                    //backgroundColor: 'rgba(131, 175, 155, 0.05)', //rgba设置透明度0.1
                    tooltip: {
                        trigger: 'axis',
                        textStyle:{
        　		　	  	align:'left'
        　　　　		}
                    },
                    legend: {
                        orient: 'vertical',//'horizontal', // 'vertical'
                        //		x: 'right', // 'center' | 'left' | {number},
                        y: 'center', // 'center' | 'bottom' | {number}
                        type: 'scroll',
                        right: 1,
                        top: '20%',
                        bottom: '10%',
                        data: this.legend_net,
                        formatter: function (name) {
                            var legendtext;
                            for (var i = 0; i < _this.chartdata_net.length; i++) {
                                var total = Number(0);
                                if ((_this.chartdata_net[i].name) == name) {
                                    for (var j = 0; j < _this.chartdata_net[i].data.length; j++) {
                                        total += parseFloat((_this.chartdata_net[i].data[j])[1]);
                                    }

                                    legendtext = name + ' ' + ((total / _this.chartdata_net[i].data.length)).toFixed(2);
                                }
                            }
                            return legendtext;
                        }
                    },
                    grid: {
                        //    left: '3%',
                        right: '25%',
                        //    bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        //	max: 100,
                        name: 'KB'
                    },
                    series: this.chartdata_net
                };
                this.myChart_net.setOption(this.option_net);
            },
            updateChart_cpu(fromTime, toTime) {
                    console.log("shuaxin");
                    console.log(this.cpumode);
                    console.log(this.ipmode);
                    console.log(fromTime);
                    console.log(toTime);

                    //	var url1 = 'http://128.195.0.34:9090/api/v1/query_range?query=avg%20by%20(instance%2Cmode)%20(irate(node_cpu%7Bmode%3D~%22system%7Cuser%7Cidle%7Ciowait%22%2C%20instance%3D~%22(128.196.52.134%7C128.196.52.135%7C128.196.52.136%7C128.196.53.145%7C128.196.53.146%7C128.196.53.147).*%22%2C%20systemName%3D%22(N-CPXS)%E7%A5%A8%E4%BA%A4%E6%89%80%E7%9B%B4%E8%BF%9E%E7%B3%BB%E7%BB%9F%22%7D%5B1m%5D))&start=' + lasttwohour + '&end=' + now + '&step=' + interval;
                let url = '/myapi/monitor/realtime?type=cpu&ips=' + this.iplist + '&startTime=' + fromTime + '&endTime=' + toTime + '&step=' + this.interval;
                console.log(url);
                let _this = this;
                this.$http.defaults.withCredentials = false;
                this.$http.get(url,{
                }).then(function(response){
                    console.log(response);
                    let result = response.data;
                    if (result.status != "success" || result.data.result.length == 0) {
                        return;
                    }

                    _this.chartdata_cpu.splice(0, _this.chartdata_cpu.length);//清空数据
                    _this.legend_cpu.splice(0, _this.legend_cpu.length);
                    _this.datapos_cpu.splice(0, _this.datapos_cpu.length);
                    _this.legendvar_cpu.splice(0, _this.legendvar_cpu.length);

                    let metric = result.data.result;console.log(metric);
                    for (let i = 0, len = metric.length; i < len; i++) {
                        let data1 = [];

                        let idleflag = false;
                        if (metric[i].metric.mode.indexOf("idle") != -1) {
                                idleflag = true;
                            }

                        for (let j = 0, vallen = metric[i].values.length; j < vallen; j++) {
                            let text = [];
                            let tmp = metric[i].values[j][1] * 100;

                            if (idleflag === true) {
                                tmp = 100 - tmp;
                            }

                            text.push(metric[i].values[j][0] * 1000);
                            if (String(tmp).indexOf('.') > -1)
                                text.push(tmp.toFixed(2));
                            else
                                text.push(tmp);


                            data1.push(text);
                        }
                        _this.datapos_cpu.push(data1);
                        let maohaopos = metric[i].metric.instance.indexOf(":");
                        let tmpstr = metric[i].metric.instance;
                        if(maohaopos !== -1)
                            tmpstr = tmpstr.substring(0, maohaopos);
                        if (idleflag === true) {
                            _this.legendvar_cpu[i] =  tmpstr + "Used";
                        } else {
                            _this.legendvar_cpu[i] = tmpstr + metric[i].metric.mode;
                        }
                    }

                    for (let i = 0, dataLen = _this.datapos_cpu.length; i < dataLen; i++) {

                        let flag = false;
                        //匹配mode
                        for (let a = 0; a < _this.cpumode.length; a++) {
                            if (_this.legendvar_cpu[i].indexOf(_this.cpumode[a]) != -1) {

                                for (let b = 0; b < _this.ipmode.length; b++) {
                                    if (_this.legendvar_cpu[i].indexOf(_this.ipmode[b]) != -1) {
                                        flag = true;
                                    }
                                }
                            }
                        }

                        if (flag == false) {
                            continue;
                        }

                        let text = {};
                        text.data = _this.datapos_cpu[i];
                        text.name = _this.legendvar_cpu[i];
                        text.type = 'line';
                        text.showSymbol = false;
                        text.hoverAnimation = false;
                        text.smooth = false;

                        _this.chartdata_cpu.push(text);
                        _this.legend_cpu.push(text.name);

                    }
                    console.log(_this.chartdata_cpu);
                    console.log(_this.legend_cpu);
                    _this.myChart_cpu.setOption(_this.option_cpu);
                }); //http 结束
            },

            updateChart_mem(fromTime, toTime) {
                    console.log("shuaxin");
                    console.log(this.cpumode);
                    console.log(this.ipmode);
                    console.log(fromTime);
                    console.log(toTime);

                    //	var url1 = 'http://128.195.0.34:9090/api/v1/query_range?query=avg%20by%20(instance%2Cmode)%20(irate(node_cpu%7Bmode%3D~%22system%7Cuser%7Cidle%7Ciowait%22%2C%20instance%3D~%22(128.196.52.134%7C128.196.52.135%7C128.196.52.136%7C128.196.53.145%7C128.196.53.146%7C128.196.53.147).*%22%2C%20systemName%3D%22(N-CPXS)%E7%A5%A8%E4%BA%A4%E6%89%80%E7%9B%B4%E8%BF%9E%E7%B3%BB%E7%BB%9F%22%7D%5B1m%5D))&start=' + lasttwohour + '&end=' + now + '&step=' + interval;
                let url =  '/myapi/monitor/realtime?type=mem&ips=' + this.iplist + '&startTime=' + fromTime + '&endTime=' + toTime + '&step=' + this.interval;
                console.log(url);
                let _this = this;
                this.$http.defaults.withCredentials = false;
                this.$http.get(url,{
                }).then(function(response){
                    console.log(response);
                    let result = response.data;
                    if (result.status != "success" || result.data.result.length == 0) {
                        return;
                    }

                    _this.chartdata_mem.splice(0, _this.chartdata_mem.length);//清空数据
                    _this.legend_mem.splice(0, _this.legend_mem.length);
                    _this.datapos_mem.splice(0, _this.datapos_mem.length);
                    _this.legendvar_mem.splice(0, _this.legendvar_mem.length);

                    let metric = result.data.result;console.log(metric);
                    for (let i = 0, len = metric.length; i < len; i++) {
                        let data1 = [];

                        for (let j = 0, vallen = metric[i].values.length; j < vallen; j++) {
                            let text = [];
                            let tmp = metric[i].values[j][1] * 100;
                            text[0] = metric[i].values[j][0] * 1000;
                            if (String(tmp).indexOf('.') > -1)
                                text[1] = tmp.toFixed(2);
                            else
                                text[1] = tmp;
                            data1[j] = text;
                        }
                        _this.datapos_mem[i] = data1;
                        let maohaopos = metric[i].metric.instance.indexOf(":");
                        let tmpstr = metric[i].metric.instance;
                        if(maohaopos !== -1)
                            tmpstr = tmpstr.substring(0, maohaopos);
                        _this.legendvar_mem[i] = tmpstr + metric[i].metric.mode.substring(5);
                    }

                    for (let i = 0; i < _this.datapos_mem.length; i++) {

                        let flag = false;
                        //匹配mode
                        for (let a = 0; a < _this.memmode.length; a++) {
                            if (_this.legendvar_mem[i].indexOf(_this.memmode[a]) != -1) {

                                for (let b = 0; b < _this.ipmode.length; b++) {
                                    if (_this.legendvar_mem[i].indexOf(_this.ipmode[b]) != -1) {
                                        flag = true;
                                    }
                                }
                            }
                        }

                        if (flag == false) {
                            continue;
                        }

                        let text = {};
                        text.data = _this.datapos_mem[i];
                        text.name = _this.legendvar_mem[i];
                        text.type = 'line';
                        text.showSymbol = false;
                        text.hoverAnimation = false;
                        text.smooth = false;

                        _this.chartdata_mem.push(text);
                        _this.legend_mem.push(text.name);

                    }

                    _this.myChart_mem.setOption(_this.option_mem);
                }); //http 结束
            },

            updateChart_io(fromTime, toTime) {
                    console.log("shuaxin");
                    console.log(this.cpumode);
                    console.log(this.ipmode);
                    console.log(fromTime);
                    console.log(toTime);

                    //	var url1 = 'http://128.195.0.34:9090/api/v1/query_range?query=avg%20by%20(instance%2Cmode)%20(irate(node_cpu%7Bmode%3D~%22system%7Cuser%7Cidle%7Ciowait%22%2C%20instance%3D~%22(128.196.52.134%7C128.196.52.135%7C128.196.52.136%7C128.196.53.145%7C128.196.53.146%7C128.196.53.147).*%22%2C%20systemName%3D%22(N-CPXS)%E7%A5%A8%E4%BA%A4%E6%89%80%E7%9B%B4%E8%BF%9E%E7%B3%BB%E7%BB%9F%22%7D%5B1m%5D))&start=' + lasttwohour + '&end=' + now + '&step=' + interval;
                let url = '/myapi/monitor/realtime?type=io&ips=' + this.iplist + '&startTime=' + fromTime + '&endTime=' + toTime + '&step=' + this.interval;
                console.log(url);
                let _this = this;
                this.$http.defaults.withCredentials = false;
                this.$http.get(url,{
                }).then(function(response){
                    console.log(response);
                    let result = response.data;
                    if (result.status != "success" || result.data.result.length == 0) {
                        return;
                    }

                    _this.chartdata_io.splice(0, _this.chartdata_io.length);//清空数据
                    _this.legend_io.splice(0, _this.legend_io.length);
                    _this.datapos_io.splice(0, _this.datapos_io.length);
                    _this.legendvar_io.splice(0, _this.legendvar_io.length);

                    let metric = result.data.result;console.log(metric);
                    for (let i = 0, len = metric.length; i < len; i++) {
                        let data1 = [];
                        let axisflag = false;
                        if (metric[i].metric.mode.indexOf("ioRead") != -1) {	//TODO 后端现在传的是ioRead、ioWrite，加起来是IOPS，没有传吞吐量
                            axisflag = true;
                        }  
                                
                        for (let j = 0, vallen = metric[i].values.length; j < vallen; j++) {
                            let text = [];
                            let tmp = Number(0);
                            //	if (metric[i].metric.mode.search("IOPS") != -1) {
                            if (axisflag === true) {	//TODO 后端现在传的是ioRead、ioWrite，加起来是IOPS，没有传吞吐量
                                tmp = metric[i].values[j][1];
                            } else {
                                tmp = (metric[i].values[j][1] / 1024) / 1024;//MB
                            }

                            text[0] = metric[i].values[j][0] * 1000;
                            /*	if (String(tmp).indexOf('.') > -1)
                                    text.push(tmp.toFixed(2));
                                else */
                            text[1] = tmp;


                            data1[j] = text;
                        }
                        _this.datapos_io[i] = data1;

                        let maohaopos = metric[i].metric.instance.indexOf(":");
                        //	legendvar_io[i] = metric[i].metric.instance.substring(0, maohaopos) + metric[i].metric.mode;
                        let tmpstr = metric[i].metric.instance;
                        if(maohaopos !== -1)
                            tmpstr = tmpstr.substring(0, maohaopos);
                        _this.legendvar_io[i] = tmpstr + metric[i].metric.mode + 'IOPS'; //TODO 后端现在传的是ioRead、ioWrite，加起来是IOPS，没有传吞吐量
                    }

                    for (let i = 0; i < _this.datapos_io.length; i++) {

                        let flag = false;
                        //匹配mode
                        for (let a = 0; a < _this.iomode.length; a++) {
                            if (_this.legendvar_io[i].indexOf(_this.iomode[a]) != -1) {

                                for (let b = 0; b < _this.ipmode.length; b++) {
                                    if (_this.legendvar_io[i].indexOf(_this.ipmode[b]) != -1) {
                                        flag = true;
                                    }
                                }
                            }
                        }

                        if (flag == false) {
                            continue;
                        }

                        let text = {};
                        text.data = _this.datapos_io[i];
                        text.name = _this.legendvar_io[i];
                        text.type = 'line';
                        text.showSymbol = false;
                        text.hoverAnimation = false;
                        text.smooth = false;
                        if (text.name.indexOf("IOPS") != -1) {
                            text.yAxisIndex = 0;
                        } else {
                            text.yAxisIndex = 1;
                        }
                        _this.chartdata_io.push(text);
                        _this.legend_io.push(text.name);

                    }

                    _this.myChart_io.setOption(_this.option_io);
                }); //http 结束
            },

            updateChart_net(fromTime, toTime) {
                    console.log("shuaxin");
                    console.log(this.ipmode);
                    console.log(fromTime);
                    console.log(toTime);

                    //	var url1 = 'http://128.195.0.34:9090/api/v1/query_range?query=avg%20by%20(instance%2Cmode)%20(irate(node_cpu%7Bmode%3D~%22system%7Cuser%7Cidle%7Ciowait%22%2C%20instance%3D~%22(128.196.52.134%7C128.196.52.135%7C128.196.52.136%7C128.196.53.145%7C128.196.53.146%7C128.196.53.147).*%22%2C%20systemName%3D%22(N-CPXS)%E7%A5%A8%E4%BA%A4%E6%89%80%E7%9B%B4%E8%BF%9E%E7%B3%BB%E7%BB%9F%22%7D%5B1m%5D))&start=' + lasttwohour + '&end=' + now + '&step=' + interval;
                let url = '/myapi/monitor/realtime?type=net&ips=' + this.iplist + '&startTime=' + fromTime + '&endTime=' + toTime + '&step=' + this.interval;
                console.log(url);
                let _this = this;
                this.$http.defaults.withCredentials = false;
                this.$http.get(url,{
                }).then(function(response){
                    console.log(response);
                    let result = response.data;
                    if (result.status != "success" || result.data.result.length == 0) {
                        return;
                    }

                    _this.chartdata_net.splice(0, _this.chartdata_net.length);//清空数据
                    _this.legend_net.splice(0, _this.legend_net.length);
                    _this.datapos_net.splice(0, _this.datapos_net.length);
                    _this.legendvar_net.splice(0, _this.legendvar_net.length);

                    let metric = result.data.result;
                    for (let i = 0, len = metric.length; i < len; i++) {
                        let data1 = [];

                        for (let j = 0, vallen = metric[i].values.length; j < vallen; j++) {
                            let text = [];
                            var tmp = (metric[i].values[j][1] / 1024);//KB
                            text[0] = metric[i].values[j][0] * 1000;
                            if (String(tmp).indexOf('.') > -1)
                                text[1] = tmp.toFixed(2);
                            else
                                text[1] = tmp;
                            data1[j] = text;
                        }
                        _this.datapos_net[i] = data1;
                        let maohaopos = metric[i].metric.instance.indexOf(":");
                        let tmpstr = metric[i].metric.instance;
                        if(maohaopos !== -1)
                            tmpstr = tmpstr.substring(0, maohaopos);
                        _this.legendvar_net[i] = tmpstr + metric[i].metric.mode;
                    }

                    for (let i = 0; i < _this.datapos_net.length; i++) {

                        let flag = false;
                        //匹配mode
                        for (let b = 0; b < _this.ipmode.length; b++) {
                            if (_this.legendvar_net[i].indexOf(_this.ipmode[b]) != -1) {
                                flag = true;
                            }
                        }

                        if (flag == false) {
                            continue;
                        }

                        let textdata = {};
                        textdata.data = _this.datapos_net[i];
                        textdata.name = _this.legendvar_net[i];
                        textdata.type = 'line';
                        textdata.showSymbol = false;
                        textdata.hoverAnimation = false;
                        textdata.smooth = false;

                        _this.chartdata_net.push(textdata);
                        _this.legend_net.push(textdata.name);
                    }

                    _this.myChart_net.setOption( _this.option_net );
                }); //http 结束
            },

            isFirstUnSelect(selected){
                var unSelectedCount = 0;
                console.log("isfirst");
                console.log(this);
                console.log(selected);
                for (name in selected) {
                    if (!selected.hasOwnProperty(name)) {
                        continue;
                    }

                    if (selected[name] == false) {
                        ++unSelectedCount;
                    }
                }
                return unSelectedCount == 1;
            },

            isAllUnSelected(selected) {
                var selectedCount = 0;
                for (name in selected) {
                    if (!selected.hasOwnProperty(name)) {
                        continue;
                    }

                    // 所有 selected Object 里面 true 代表 selected， false 代表 unselected
                    if (selected[name] == true) {
                        ++selectedCount;
                    }
                }
                return selectedCount == 0;
            },

            //刷新间隔
            getFlushInterval(from, to) {
                let pos = to - from;
                if (pos < 1800)
                    return 5;

                if (pos < 3600)
                    return 10;

                if (pos < 7200)
                    return 20;

                if (pos < 10800)
                    return 30;

                if (pos < 21600)
                    return 60;

                if (pos < 86400)
                    return 120;

                return 300;

            },
            //定时刷新
            realTimeCl(){
                var time = new Date();
                var to = parseInt(time.getTime() / 1000);

                if (this.timeRangeFlag == true) {
                    this.BeginTime = to - this.timeRange;
                }
                var tmp = this.getFlushInterval(this.BeginTime, to);

                console.log(this.timeSectionFlag); console.log(this.flushFlag); console.log(tmp); console.log(this.interval);
                if (this.interval != tmp) {
                    this.interval = tmp;
                    if (this.interval < 5)
                        this.interval = 5;
                    clearInterval(this.intervalFunc);
                    this.intervalFunc = setInterval(this.realTimeCl, this.interval * 1000);
                }

                if ((this.timeSectionFlag == false) && (this.flushFlag == true)) {
                    this.updateChart_cpu(this.BeginTime, to);
                    this.updateChart_mem(this.BeginTime, to);
                    this.updateChart_io(this.BeginTime, to);
                    this.updateChart_net(this.BeginTime, to);
                //	updateChart_disk(BeginTime, to);
                }
            },

            selectUpdate(){
            //判断是否有没选择的，把选择项传到ipmode、cpumode、memmode

            //为了避免选择刷新时和定时刷新冲突，暂停定时刷新
            flushFlag = false;

            for (var i = 0; i < this.datapos_cpu.length; i++) {
                var flag = false;
                //匹配mode
                for (var a = 0; a < this.cpumode.length; a++) {
                    if (this.legendvar_cpu[i].indexOf(this.cpumode[a]) != -1) {

                        for (var b = 0; b < this.ipmode.length; b++) {
                            if (this.legendvar_cpu[i].indexOf(this.ipmode[b]) != -1) {
                                flag = true;
                            }
                        }
                    }
                }
                if (flag == false) {
                    continue;
                }

                var text = {};
                text.data = this.datapos_cpu[i];
                text.name = this.legendvar_cpu[i];
                text.type = 'line';
                text.showSymbol = false;
                text.hoverAnimation = false;
                text.smooth = false;

                this.chartdata_cpu.push(text);
                this.legend_cpu.push(this.legendvar_cpu[i]);

            }

            this.myChart_cpu.clear();
            this.myChart_cpu.setOption(this.option_cpu);

            this.chartdata_mem.splice(0, this.chartdata_mem.length);
            this.legend_mem.splice(0, this.legend_mem.length);
            this.memmode.splice(0, this.memmode.length);

            for (var i = 0; i < this.datapos_mem.length; i++) {
                var flag = false;
                //匹配mode
                for (var a = 0; a < this.memmode.length; a++) {
                    if (this.legendvar_mem[i].indexOf(this.memmode[a]) != -1) {

                        for (var b = 0; b < this.ipmode.length; b++) {
                            if (this.legendvar_mem[i].indexOf(this.ipmode[b]) != -1) {
                                flag = true;
                            }
                        }
                    }
                }
                if (flag == false) {
                    continue;
                }

                var text = {};
                text.data = this.datapos_mem[i];
                text.name = this.legendvar_mem[i];
                text.type = 'line';
                text.showSymbol = false;
                text.hoverAnimation = false;
                text.smooth = false;

                this.chartdata_mem.push(text);
                this.legend_mem.push(this.legendvar_mem[i]);

            }
            this.myChart_mem.clear();
            this.myChart_mem.setOption(this.option_mem);

            this.chartdata_io.splice(0, this.chartdata_io.length);
            this.legend_io.splice(0, this.legend_io.length);
            for (var i = 0; i < this.datapos_io.length; i++) {
                var flag = false;
                //匹配mode
                for (var a = 0; a < this.iomode.length; a++) {
                    if (this.legendvar_io[i].indexOf(this.iomode[a]) != -1) {

                        for (var b = 0; b < this.ipmode.length; b++) {
                            if (this.legendvar_io[i].indexOf(this.ipmode[b]) != -1) {
                                flag = true;
                            }
                        }
                    }
                }
                if (flag == false) {
                    continue;
                }

                var text = {};
                text.data = this.datapos_io[i];
                text.name = this.legendvar_io[i];
                text.type = 'line';
                text.showSymbol = false;
                text.hoverAnimation = false;
                text.smooth = false;
                if (text.name.indexOf("IOPS") != -1) {
                    text.yAxisIndex = 0;
                } else {
                    text.yAxisIndex = 1;
                }

                this.chartdata_io.push(text);
                this.legend_io.push(this.legendvar_io[i]);
            }
            this.myChart_io.clear();
            this.myChart_io.setOption(this.option_io);

            this.chartdata_net.splice(0, this.chartdata_net.length);
            this.legend_net.splice(0, this.legend_net.length);
            for (var i = 0; i < this.datapos_net.length; i++) {
                var flag = false;
                //匹配mode
                for (var b = 0; b < this.ipmode.length; b++) {
                    if (this.legendvar_net[i].indexOf(this.ipmode[b]) != -1) {
                        flag = true;
                    }
                }
                if (flag == false) {
                    continue;
                }

                var text = {};
                text.data = this.datapos_net[i];
                text.name = this.legendvar_net[i];
                text.type = 'line';
                text.showSymbol = false;
                text.hoverAnimation = false;
                text.smooth = false;

                this.chartdata_net.push(text);
                this.legend_net.push(this.legendvar_net[i]);
            }
            this.myChart_net.clear();
            this.myChart_net.setOption(this.option_net);

            //恢复定时刷新
            flushFlag = true;

            },
                
        }
    }
</script>
<style scoped>
</style>