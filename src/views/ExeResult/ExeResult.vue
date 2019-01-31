<template>
	<div class="pageContent">
        <div class="caseBox">
            <h3 class="Title">
                <span>执行结果</span>
            </h3>
            <Form  ref="formValidate" :model="formValidate" class="formValidate">
                <div class="rowbox">
                    <Row :gutter="16">
                        <Col span="2" class="searchLable">任务名称:</Col>
                        <Col span="4">
                            <Input clearable v-model="formValidate.task_name" placeholder="请输入任务名称"></Input>
                        </Col>
                        <Col span="2" class="searchLable">场景名称:</Col>
                        <Col span="4">
                            <Input clearable v-model="formValidate.senario_name" placeholder="请输入场景名称"></Input>
                        </Col>
                        <Col span="2" class="searchLable">场景类型:</Col>
                        <Col span="4">
                            <Select v-model="formValidate.type_name" clearable>
                                <Option value="混合交易" >混合交易</Option>
                                <Option value="单交易基准" >单交易基准</Option>
                                <Option value="单交易负载" >单交易负载</Option>
                            </Select>
                        </Col>
                        <Col span="6">
                            <Button @click="listCase" type="primary" icon="ios-search">查询</Button>
                            <Button @click="handleReset('formValidate')">重置</Button>
                        </Col>
                    </Row>
                    <Row :gutter="16" v-show="isShowMoreShow">
                        <Col span="2" class="searchLable">执行状态:</Col>
                        <Col span="4">
                            <Select v-model="formValidate.exe_status" clearable>
                                <Option v-for="item in exeStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="2" class="searchLable">执行人:</Col>
                        <Col span="4">
                            <!-- <Input clearable v-model="execution_name" placeholder="请输入执行人"></Input> -->
                            <Select 
                                v-model="formValidate.execution_name"
                                placeholder="请输入执行人" 
                                clearable
                                filterable
                                remote
                                :remote-method="searchByUser"
                                :loading="execution"
                                @on-open-change="executioName" 
                                @keyup.enter.native= listCase()>
                                <Option v-for="(opts,index) in searchCreatorOpts"  :value="opts.id" :key="index">{{opts.member_name}}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row :gutter="16" v-show="isShowMoreShow">
                        <Col span="2" class="searchLable">开始日期:</Col>
                        <Col span="4">
                            <Col span="50">
                                <DatePicker type="datetime" placeholder="请选择查询日期" v-model="formValidate.start_time"></DatePicker>
                            </Col>
                            </Col>
                        <Col span="2" class="searchLable">结束日期:</Col>
                        <Col span="4">
                                <DatePicker type="datetime" placeholder="请选择查询日期" v-model="formValidate.end_time"></DatePicker>
                            </Col>
                        <Col span="2"></Col>
                    </Row>
                </div>
                <div class="formValidateMoreBtnBox" :class="isShowMoreShow ?'arrUp':'arrDown'" @click="isShowMoreShow = !isShowMoreShow">
                    <Icon type="chevron-down" color="#fff" ></Icon>
                    <Icon type="chevron-down" color="#fff" ></Icon>
                </div>
            </Form>
            <div align="left">
                <Button @click="aggregCase" type="success">聚合报告</Button>
                <Button @click="deleteCase" type="error">删除结果</Button>
                <!-- <Button @click="aggregCasess" type="success"  >测试报告</Button> -->
            </div>
            <div class="tableBox">
                <Table border :loading="isLoading" ref="selection" :columns="columns" :data="tableData" class="myTable" 
                @on-select="onSelect" @on-select-cancel="onSelectCancel" show-header></Table>
                <div class="pageBox" v-if="tableData.length">
                    <Page :total="parseInt(totalCount)" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
                    <p>总共{{totalPage}}页</p>
                </div>
            </div>
        </div>
        <!-- ========================================聚合报告===================================================== -->
        <Modal v-model="showAddModal" width="1100px">
            <p slot="header" style="color:#f60"  >
                <span>生成聚合报告预编译</span>
            </p>
            <div ref="setValidate" :model="setValidate">
                <div align="left" >
                    <font size="5" >报告名称:{{setValidate.task_name}}报告</font>
                </div>
                <div class="formValidateMoreBtnBox" :class="isShowMore ?'arrUp':'arrDown'" @click="isShowMore = !isShowMore">
                    <Icon type="chevron-down" color="#fff" >展开</Icon>
                    <Icon type="chevron-down" color="#fff" >关闭</Icon>
                </div>
                <div v-for="(Item,index) in setValidates" :key="index" style="display:inline-block">
                    <Form ref="setValidate" :model="setValidate" >
                        <div style="float:left;width:150px">
                            <Button color="#1c2438"  @click="moveUp(index)">上移</Button>
                            <Button color="#1c2438"  @click="moveDown(index)">下移</Button>
                        </div>
                        <div style="float:left;width:900px" >
                            <FormItem label="场景名称：" align="left" >
                                <Input placeholder="Enter something..." style="width:300px" v-model="Item.senario_name"></Input>
                            </FormItem>
                            <div v-show="isShowMore">
                                <FormItem label="执行结果" align="left" style="color:rgb(245, 4, 16)">
                                    执行是否成功：
                                    <Input  style="width:80px" v-model="Item.result_is_pass" readonly></Input>
                                    测试结果分析描述：
                                    <Input  style="width:400px" v-model="Item.result_desc" readonly></Input>
                                </FormItem>
                                <FormItem label="报告显示内容" align="left" style="color:rgb(223, 73, 14)">
                                    显示性能数据表：
                                    <Select style="width:80px" v-model="Item.data_sgeet">
                                        <Option value="1">是</Option>
                                        <Option value="0">否</Option>
                                    </Select>
                                    显示性能曲线图：
                                    <Select style="width:80px" v-model="Item.diagram">
                                        <Option value="1">是</Option>
                                        <Option value="0">否</Option>
                                    </Select>
                                    显示资源监控图：
                                    <Select style="width:80px" v-model="Item.control_chart">
                                        <Option value="1">是</Option>
                                        <Option value="0">否</Option>
                                    </Select>
                                    显示失败事务分析：
                                    <Select style="width:80px" v-model="Item.analysis_things">
                                        <Option value="1">是</Option>
                                        <Option value="0">否</Option>
                                    </Select>
                                </FormItem>
                            </div>
                        </div>
                    </Form>
                </div>
                <div class="tableBox">
                    <Table border  ref="selection" :columns="aggregColumns" :data="aggregTableData" class="myTable" ></Table>
                </div>
            </div>
            <div slot="footer" >
                    <Button color="#1c2438"  @click="cancel">取消</Button>
                    <Button type="primary" @click="saveResult">生成报告</Button>
            </div>
            <Spin size="large" fix v-if="spinShow">正在生成报告，请稍等...</Spin>
        </Modal>
    </div>
</template>

<script>
export default {
    name: 'TestCase',
    data () {
        return {
            /**==============================聚合报告====================================*/
            setValidate:{
                task_name:'',                       //关联任务
                senario_name:'',                    //场景名称
                result_is_pass:'',                  //是否通过
                result_desc:'',                     //结果描述 
                data_sgeet:'',                      //显示性能数据表
                diagram:'',                         //显示性能曲线图
                control_chart:'',                   //显示资源监控图
                analysis_things:'',                  //显示失败事务分析
                id:'',
            },
            setValidates:[],
            spinShow:false,
            isShowMore:false,                   //聚合报告弹框
            execution:false,
            /**-----------聚合报告信息展示-----------*/
            metrics_desc:'',                    //测试需求描述
            create_time:'',
            metrics_type:'',
            aggregColumns:[
                {
                    type: 'index',
                    width: 60,
                    align: 'center', 
                },
                {
                    title: '需求类型',
                    key: 'metrics_type',
                    width: 150,
                    render : (h, params)=>{
                        let _this = this;
                        let demandType = _this.$Global.demandTypeList;
                        return h('span', _this.$Global.demandTypeMap[params.row.metrics_type]);
                    }
                },  
                {
                    title: '需求描述',
                    key: 'metrics_desc',
                },
                {
                    title: '是否通过',
                    key: 'metrics_type',
                    width: 100,
                    render:(h,params) => {
                        if(params.row.$isEdit){
                            return h('input',{
                                style: {
                                    'text-align':'center',
                                    width: params.column._width+'px',
                                    height: '48px',
                                    border: '0',
                                    outline:'none',
                                    cursor: 'pointer',
                                },
                                domProps: {
                                    value: params.row.metrics_type,
                                    autofocus: true
                                },
                                on: {
                                    input: function (event) {
                                        params.row.metrics_type = event.target.value
                                    }
                                }
                            });
                        }else{
                            return h('div',params.row.metrics_type)
                        }
                        
                    } 
                },
                {
                    title: '备注描述',
                    key: 'metrics_desc',
                    render:(h,params) => {
                        if(params.row.$isEdit){
                            return h('input',{
                                style: {
                                    'text-align':'center',
                                    width: params.column._width+'px',
                                    height: '48px',
                                    border: '0',
                                    outline:'none',
                                    cursor: 'pointer',
                                    // 'background-color':'#f8f8f9'
                                },
                                domProps: {
                                    value: params.row.metrics_desc,
                                    autofocus: true
                                },
                                on: {
                                    input: function (event) {
                                        params.row.metrics_desc = event.target.value
                                    }
                                }
                            });
                        }else{
                            return h('div',params.row.metrics_desc)
                        }
                        
                    } 
                },
                {
                    title: '操作',
                    key: 'opration',
                    width:80,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    // type: 'primary',
                                    type: params.row.$isEdit ? 'success' : 'primary', 
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        if (params.row.$isEdit) {
                                            this.demandEditSave(params.row);
                                        } else {
                                            this.handleDemandEdit(params.row);
                                        }
                                    }
                                }
                            }, params.row.$isEdit ? '保存' : '编辑'),   // '保存'
                        ])
                    }
                }
            ],
            aggregTableData:[],
            /**==============================执行结果====================================*/
            isShowMoreShow:false,               //是否显示更多查询条件
            exeStatusList: this.$Global.exeStatusList,  //执行状态
            id:'',                              //任务id
            perftaskNameLoading:false,
            searchCreatorOpts:[],
            showAddModal:false,                 //聚合窗口
            formValidate:{
                executor_id:'',                     //执行编号
                component_name:'',                  //物理子系统
                task_name:'',                       //关联任务
                senario_name:'',                    //场景名称
                type_name:'',                       //场景类型
                execution_name:'',                  //执行人
                member_name:'',
                exe_status:'',                      //执行状态
                start_time:'',                      //开始日期
                end_time:'',                        //结束日期
            },
            
            //执行结果信息展示
            columns: [
            	{
                    type: 'selection',
                    width: 50,
                    align: 'center',
                    key:'id'
                },
                {
                    title: '执行编号',
                    key: 'executor_id',
                    tooltip: true, 
                    width:130,
                },
                {
                    title: '物理子系统',
                    key: 'component_name',
                    // ellipsis: true, 
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%', 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    whiteSpace: 'nowrap'
                                }, 
                                domProps: {
                                    title: params.row.component_name
                                }
                            }, params.row.component_name)
                        ]);
                    }
                },
                {
                    title: '关联任务',
                    key: 'task_name',
                    // ellipsis: true,  
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%', 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    whiteSpace: 'nowrap'
                                }, 
                                domProps: {
                                    title: params.row.task_name
                                }
                            }, params.row.task_name)
                        ]);
                    }
                },
                {
                    title: '场景名称',
                    key: 'senario_name',
                    // ellipsis: true,  
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%', 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    whiteSpace: 'nowrap'
                                }, 
                                domProps: {
                                    title: params.row.senario_name
                                }
                            }, params.row.senario_name)
                        ]);
                    }
                },
                {
                    title:'场景类型',
                    key:'type_name',
                },
                {
                    title: '执行人',
                    key: 'execution_name',
                },
                {
                    title: '执行状态',
                    key: 'exe_status',
                    render:(h,params) =>{
                        let _this = this;
                        return h('span',_this.$Global.exeStatusMap[params.row.exe_status])
                    }
                },
                {
                    title: '开始日期',
                    key: 'exe_time',
                    sortable: true
                },
                {
                    title: '结束日期',
                    key: 'end_time',
                    sortable: true
                },
                {
                    title: '操作',
                    key: 'opration',
                    width: 80,
                    render: (h, item) => {
                        return h('div', [
                        h('Button', {
                                        props: {
                                            type:"primary",
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.detailCase(item.index);
                                            }
                                        }
                                    }, '详情')
                        ])
                                            
                    }
                }
            ],
            tableData: [],
            exeresListPage:[],                   //翻页保留数据
            tableDAtaTatol:0,
            tableDAtaPageLine:3,
            selectedData:[],                    //选中的项的数组
            totalCount:0,                         //共多少条数据
            pageNo:1,                            //当前页
            pageSize:10,                           //每页显示多少条数据
            totalPage:0,                           //共多少页
        }
    },
    created(){
        this.listCase();
    },
    methods: {
        //页面展示
        listCase: function() {
            let _this = this;
            _this.isLoading=true;
            console.log("_this.monitorListPage,",_this.monitorListPage);
            this.$http.post('/myapi/testresult/list', {
                data: {
                    task_name:_this.formValidate.task_name,
                    senario_name:_this.formValidate.senario_name,
                    user_id:_this.formValidate.execution_name,
                    exe_status:_this.formValidate.exe_status,
                    type_name:_this.formValidate.type_name,
                    exe_time:_this.formValidate.start_time,
                    end_time:_this.formValidate.end_time,
                    pageno:_this.pageNo,
                    pagesize:_this.pageSize,
                    pageChecked:_this.monitorListPage,
                }
            }).then(function (response) {
                let result =  response.data.result;
                console.log("result: ", response.data);
                _this.tableData =  response.data.resultList;
                _this.totalCount = response.headers.totalcount;
                _this.totalPage = response.headers.totalpage;
                _this.isLoading=false;
            })
        },
        /**创建人远程查询 */
        searchByUser:function(query){
            let _this = this;
            console.log("query",query);
            this.$http.post('/myapi/user/search',{
                header:{},
                data:{
                    member_name:query
                }
            }).then(function(response){
                console.log("远程查询创建人",response);
                _this.searchCreatorOpts = response.data.resultList.map(item=>{
                    return {
                        id:item.id,
                        username:item.username,
                        member_name:item.member_name,
                    }
                })
            })
        },
        /**下拉选自动查询 */
        executioName:function(){
            let _this = this;
            this.$http.post('/myapi/user/search',{
                header:{},
                data:{
                    member_name:''
                }
            }).then(function(response){
                _this.searchCreatorOpts = response.data.resultList.map(item=>{
                    return {
                        id:item.id,
                        username:item.username,
                        member_name:item.member_name,
                    }
                })
            })
        },
        /*删除按钮功能*/
        deleteCase: function () {
            //console.log("删除多条按钮");
            let selectedData = this.selectedData;      //选中要删除的数据
            let resArr = [];
            let deleteId = [];                       //选中数据的id
            if (selectedData.length > 0) {               //如果有选中的数据
                for (let i in selectedData) {         //进行遍历
                    deleteId.push(selectedData[i].executor_id);  //将选中的而数据的id放入要删除的集合中
                    this.deleteData(deleteId);            //调用删除数据的方法，将tableData中的数据删除
                }
            } else {
                this.$Message.error("请选择要删除的数据")
            }
        },
        deleteData:function(deleArr) {                //调用方法将原有数据中对应的id删除
            console.log("删除多条数据内容",deleArr)
            let _this = this;
            let tableData = _this.tableData;          //原有的数据
            tableData.forEach((item, index) => {      //对原有的数据进行遍历
                if (deleArr.includes(item.executor_id)) {       //当原有的数据与要删除的数据中有相同的数据时，
                    _this.$Modal.confirm({
                        title:'确认',
                        content: '是否删除该数据',
                        onOk: () => {
                            this.$http.post("/myapi/testresult/del",{
                                header:{},
                                data:{
                                    ids:deleArr,
                                }
                            }).then(function(response){
                                //tableData.splice(index, 1);        //即删除该数据上
                                _this.$Message.info('删除成功');
                                for (let i in deleArr) {
                                    for (let index in tableData) {
                                        if (tableData[index].id == deleArr[i]) {
                                            tableData.splice(index, 1);        //删除表格中展示的数据
                                            break;
                                        }
                                    }
                                }
                                _this.listCase(); 
                            })
                        },
                        onCancel: () => {
                            _this.$Message.info('删除失败');
                        }
                    }); 
                   
                }
            });
        },
        //上移
        moveUp:function(index){
            if(index ===0){
                this.$Message.info('到顶了！');
            }else{
                this.setValidates.push(this.setValidates.shift())
            }
        },
        //下移
        moveDown:function(index){
            if(index === (this.setValidates.length -1)){
                this.$Message.info('到底了！');
            }else{
                this.setValidates.unshift(this.setValidates.pop())
            }
        },
        //聚合报告
        aggregCase:function(){
            let _this = this;
            this.setValidates = [];                         //初始化Form表单
            let selectedDataList = this.selectedData;       //选中要聚合的数据
            
            console.log("selectedDataList",selectedDataList);
            //定义数组和集合
            let resArr = [];
            let id = [];                              
            let senario_name = [];
            let task_name = [];
            let result_is_pass = [];
            let result_desc = [];
            let executor_id = [];
            if (this.selectedData.length > 0) {                  //如果有选中的数据
                for (let i in selectedDataList) {               //进行遍历
                    //放入数组
                    id.push(_this.selectedData[i].id);    
                    executor_id.push(_this.selectedData[i].executor_id);
                    senario_name.push(_this.selectedData[i].senario_name);
                    task_name.push(_this.selectedData[i].task_name);
                    result_is_pass.push(_this.selectedData[i].result_is_pass.toString());
                    result_desc.push(_this.selectedData[i].result_desc);
                    //放入集合中
                    let aggregData ={};  
                    aggregData.result_desc = _this.selectedData[i].result_desc;
                    aggregData.result_is_pass  = _this.selectedData[i].result_is_pass.toString() =="1"?"是":"否";
                    aggregData.senario_name  = _this.selectedData[i].senario_name;
                    aggregData.executor_id = _this.selectedData[i].executor_id;
                    aggregData.data_sgeet = _this.setValidate.data_sgeet = "1";
                    aggregData.diagram = _this.setValidate.diagram = "1";
                    aggregData.control_chart = _this.setValidate.control_chart = "1";
                    aggregData.analysis_things = _this.setValidate.analysis_things = "1";

                    _this.setValidate.task_name = _this.selectedData[i].task_name;
                    _this.setValidate.id = _this.selectedData[i].id;
                    _this.setValidates.push(aggregData);
                    
                    console.log("aggregData",aggregData);
                }
                //判断集合中的最大值和最小值，是否有不同的任务id
                if(Math.max.apply(null,id) === Math.min.apply(null,id) ){   
                    this.showAddModal=true;
                    this.$http.post('/myapi/metrics/list', {
                    header: {},
                    data: {
                        perftask_id: selectedDataList[0].id, 
                    }
                    }).then(function (response) {
                        _this.aggregTableData =  response.data.resultList;
                        console.log("_this.aggregTableData",_this.aggregTableData);
                    })
                }else{
                    this.$Message.error("请选择相同的任务进行聚合！")
                }
            } else {
                this.$Message.error("请选择要聚合的数据")
            }
        },
        /**生成聚合报告*/
        saveResult:function () {
            let _this = this;
            _this.spinShow=true;
            let setValidates = _this.setValidates;                  //获取页面数据
            console.log("****************",setValidates);
            this.$http.post('/myapi/testresult/merge', {
                data:_this.setValidates
            }).then(function (response) {
                _this.result = response.data.result;
                console.log("result: ",response.data.result);
                if(_this.result == "ok"){
                    _this.mergeCase();
                    _this.spinShow=false;
                }else{
                    _this.$Message.info('生成失败');
                    _this.spinShow=false;
                }
            })
            
        },
        /**聚合报告页面跳转 */
        mergeCase:function(){
            let _this = this;
            let selectedDataList = this.selectedData;       //选中要聚合的数据
            console.log("setValidates123456",selectedDataList[0].id);
            this.$router.push({
                path:'/merge',
                query:{perftask_id:selectedDataList[0].id}
            });
        },
        /**切换页码 */
        pageChange:function(pageNo){
            let _this = this;
            console.log(pageNo,"qwqwqw");
            _this.pageNo = pageNo;
            _this.listCase();
        },
        /**切换页面大小 */
        pageSizeChange:function(pageSize){
            console.log(pageSize);
            this.pageSize = pageSize;
            this.listCase();
        },
         /**选中的数据发生改变 */
        onSelect: function(row,selection) {
            this.selectedData.push(selection);
            console.log("选中要删除的数据",row,selection)
        },
         /**选中的数据发生改变 */
        onSelectCancel:function(row,selection){
            let _this = this;
            for(var i=0;i<_this.selectedData.length;i++){
                if(_this.selectedData[i].senario_id == selection.senario_id){
                    _this.selectedData.splice(i,1);
                }
            }
            console.log("取消选中要删除的数据",row,selection)
        },
        /**详情信息展示跳转 */
        detailCase:function(index){
            let _this = this;
            let tableData = _this.tableData;
            console.log("第一个页面传递的ID",tableData[index].executor_id);
            this.$router.push({
                path:'/details',
                query:{
                    executor_id:tableData[index].executor_id,
                    info_id:tableData[index].info_id
                }
            });
        },
        aggregCasess:function(){
            this.$router.push({
                path:'/load',
                query:{}
            });
        },
        /**模态框弹出取消事件 */
        cancel:function () {
            this.showAddModal = false;
        },
        /**数据编辑 */
        handleDemandEdit: function(row) {
            if (this.metricsEditingNo != 0) {
                console.log("row: ", row);
                this.$Message.error("存在尚未保存的测试需求，请先保存后再编辑下一个需求！")
            } else {
                this.metricsEditingNo = this.metricsEditingNo + 1;
                 console.log("row: ", row);
                this.$set(row, '$isEdit', true);
                // console.log(row);
            }
        },
        /**数据保存 */
        demandEditSave: function(row) {
            if (row.metrics_desc == '') {
                this.$Message.error("需求描述不能为空");
            } else {
                this.$set(row, '$isEdit', false)
                // console.log('^^^ row:', row);

                let _this = this;

                if ( row['id'] ) {
                    console.log("^^^ row has id, it is an edit ^^^");

                    // this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/metrics/edit',{
                        header:{},
                        data:{
                            id: row.id, 
                            metrics_desc: row.metrics_desc,
                        }
                    }).then(function(response){
                        if (response.data.result == "fail") {
                            let errDesc = _this.handleErrCode(response);

                            _this.$Message.error(errDesc);
                            // console.log("^^^ metricsTblDataCopy: ", _this.metricsTblDataCopy);
                            _this.$set(row, 'metrics_desc', _this.metricsTblDataCopy[row._index].metrics_desc); // 临时性的
                            _this.metricsEditingNo = _this.metricsEditingNo - 1;
                        } else if (response.data.result == "ok") {
                            _this.$set(_this.metricsTableData, row._index, row);    // 真实的修改
                            _this.metricsEditingNo = _this.metricsEditingNo - 1;
                        }
                    })
                } else {
                    console.log("^^^ row has not id, it is an add ^^^");
                    // console.log("^^^ _this: ", _this);

                    // this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/metrics/add',{
                        header:{},
                        data:{
                            perftask_id: _this.selectedData[0].id, 
                            metrics_type: row.metrics_type,
                            metrics_desc: row.metrics_desc,
                        }
                    }).then(function(response){
                        if (response.data.result == "fail") {
                            let errDesc = _this.handleErrCode(response);

                            _this.$Message.error(errDesc);
                            _this.metricsTableData.splice(row._index, 1);
                            _this.metricsEditingNo = _this.metricsEditingNo - 1;
                        } else if (response.data.result == "ok") {
                            let newDemandMtrc = {
                                'id': response.data.resultMap.id, 
                                'metrics_type': row.metrics_type, 
                                'metrics_desc': row.metrics_desc, 
                                'is_add': false, 
                                '$isEdit': false
                            };
                            _this.$set(_this.metricsTableData, row._index, newDemandMtrc);
                            _this.metricsEditingNo = _this.metricsEditingNo - 1;
                            // console.log("^^^ _this.metricsTableData: ", _this.metricsTableData);
                        }
                    })
                }
            }
        },
        /**清除搜索条件 */
        handleReset:function (name) {
            //this.$refs[name].resetFields(); 
            let _this = this;
            _this.formValidate.executor_id='',                     //执行编号
            _this.formValidate.component_name='',                  //物理子系统
            _this.formValidate.task_name='',                       //关联任务
            _this.formValidate.senario_name='',                    //场景名称
            _this.formValidate.type_name='',                       //场景类型
            _this.formValidate.execution_name='',                  //执行人
            _this.formValidate.member_name='',
            _this.formValidate.exe_status='',                      //执行状态
            _this.formValidate.start_time='',                      //开始日期
            _this.formValidate.end_time='',                        //结束日期
            this.listCase();
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
</style>

