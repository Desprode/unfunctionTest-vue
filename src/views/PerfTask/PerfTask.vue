<template>
	<div class="pageContent">
        <Card>
            <div class="caseBox">
                <h3 class="Title">
                    <span>非功能任务列表</span>
                </h3>
            
                <Form ref="formValidate" class="formValidate">
                    <div class="rowbox">
                        <Row :gutter="16">
                            <Col span="2" class="searchLable">物理子系统</Col>
                            <Col span="5">
                                <Select
                                    clearable
                                    v-model="sComponent"
                                    placeholder="输入物理子系统中文名称或英文简称"
                                    filterable
                                    remote
                                    :remote-method="srchComponent"
                                    :loading="srchCmploading">
                                    <Option v-for="(option, index) in cmpOpts" :value="option.label" :key="index">{{option.label}}</Option>
                                </Select>
                            </Col>
                            <Col span="2" class="searchLable">任务名称</Col>
                            <Col span="5">
                                <Input clearable v-model="sTaskName" placeholder="输入任务名称"></Input>
                            </Col>
                            <Col span="2" class="searchLable">任务状态</Col>
                            <Col span="5">
                                <Select clearable v-model="sTaskStatus" style="">
                                    <Option v-for="item in taskStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="3">
                                <Button @click="listPTask"  type="primary" icon="ios-search">搜索</Button>
                            </Col>
                        </Row>
                        <Row :gutter="16" v-if="isShowMoreShow">
                            <Col span="2" class="searchLable">任务开始日期</Col>
                            <Col span="9">
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询起始日期" v-model="startDate_s"></DatePicker>
                                </Col>
                                <Col span="1" class="lineBtwTimes">-</Col>
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询截止日期" v-model="startDate_f"></DatePicker>
                                </Col>
                                <Col span="1"></Col>
                            </Col>
                            <Col span="2" class="searchLable">任务结束日期</Col>
                            <Col span="9">
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询起始日期" v-model="endDate_s"></DatePicker>
                                </Col>
                                <Col span="1" class="lineBtwTimes">-</Col>
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询截止日期" v-model="endDate_f"></DatePicker>
                                </Col>
                                <Col span="1"></Col>
                            </Col>
                            <Col span="2"></Col>
                        </Row>
                        <Row :gutter="16" v-if="isShowMoreShow">
                            <Col span="2" class="searchLable">任务来源</Col>
                            <Col span="3">
                                <Select clearable v-model="sTaskSource" style="">
                                    <Option v-for="item in taskSourceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="2" class="searchLable">投产日期</Col>
                            <Col span="9">
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询起始日期" v-model="onlineDate_s"></DatePicker>
                                </Col>
                                <Col span="1" class="lineBtwTimes">-</Col>
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询截止日期" v-model="onlineDate_f"></DatePicker>
                                </Col>
                                <Col span="1"></Col>
                            </Col>
                            <Col span="8"></Col>
                        </Row>   
                    </div>
                    <div class="formValidateMoreBtnBox" :class="isShowMoreShow ?'arrUp':'arrDown'" @click="isShowMoreShow = !isShowMoreShow">
                        <Icon type="chevron-down" color="#fff" ></Icon>
                        <Icon type="chevron-down" color="#fff" ></Icon>
                    </div>
                </Form>
                
                <div class="tableBox">
                    <div class="tableBtnBox">
                        <Button type="success" @click="addPTask" >新建任务</Button>
                        <Button type="warning" @click="listPTask">测试需求</Button>
                        <Button type="primary" @click="listPTask">测试指标</Button>
                        <Button @click="delPTask" type="error">删除</Button>
                    </div>
                    <!-- @on-row-dblclick="onRowDblClick" -->
                    <Table border  ref="selection" :columns="columns" :data="tableData" class="myTable" @on-selection-change="onSelectionChanged"></Table>
                    <div class="pageBox" v-if="tableData.length">
                        <Page :total="parseInt(totalcount)" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
                        <!-- <p>总共{{totalcount}}条记录</p> -->
                    </div>
                </div>
            </div>


            <!--=================================== 新建任务的对话框 ===================================-->
            <Modal v-model="addPTaskModal" width="800">
                <p slot="header" style="text-align:center" >
                    <Icon type="ios-information-circle-outline"></Icon>
                    <span>添加任务</span>
                </p>
                <div style="text-align:center">
                    <Form ref="addValidate" :model="addValidate" :rules="addRuleValidate" :label-width="100" label-position="right">
                        <Form-item label="物理子系统" prop="component_name">
                            <i-select v-model="addValidate.component_name" 
                                placeholder="输入物理子系统中文名称或英文简称" 
                                clearable 
                                filterable 
                                remote 
                                :remote-method="srchComponent" 
                                :loading="srchCmploading" 
                                :transfer=false
                                >
                                <i-option v-for="(option, index) in cmpOpts" :value="option.label" :key="index">{{option.label}}</i-option>
                            </i-select>
                        </Form-item>
                        <Form-item label="任务名称" prop="task_name">
                            <i-input v-model="addValidate.task_name"></i-input>
                        </Form-item>
                        <Row>
                            <i-col span="8">
                                <Form-item label="任务开始日期" prop="perftask_begin_date">
                                    <Date-picker type="date" placeholder="选择日期" v-model="addValidate.perftask_begin_date" format="yyyy-MM-dd"></Date-picker>
                                </Form-item>
                            </i-col>
                            
                            <i-col span="8">
                                <Form-item label="任务结束日期" prop="perftask_end_date">
                                    <Date-picker type="date" placeholder="选择日期" v-model="addValidate.perftask_end_date" format="yyyy-MM-dd"></Date-picker>
                                </Form-item>
                            </i-col>

                            <i-col span="8">
                                <Form-item label="投产日期" prop="online_date">
                                    <Date-picker type="date" placeholder="选择日期" v-model="addValidate.online_date" format="yyyy-MM-dd"></Date-picker>
                                </Form-item>
                            </i-col>
                        </Row>
                    </Form>
                </div>
                <div slot="footer">
                    <Button color="#1c2438" @click="cancel()">取消</Button>
                    <Button type="primary" @click="handleSubmit('addValidate')">确认</Button>
                </div>
            </Modal>


            <!--=================================== 任务编辑的对话框 ===================================-->
            <Modal v-model="editPTaskModal" width="800">
                <p slot="header" style="text-align:center" >
                    <span>任务编辑</span>
                </p>
                <Form ref="editPTaskValidate" :model="editPTaskValidate" :rules="editPTaskRuleVldt" :label-width="120">
                    <FormItem label="物理子系统:" prop="component_name">
                        <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{editPTaskValidate.component_name}}</div>
                    </FormItem>
                    <FormItem label="任务名称:" prop="perftask_name">
                        <Input  v-model="editPTaskValidate.perftask_name"></Input>
                    </FormItem>
                    <Row>
                        <Col span="8">
                            <FormItem label="任务开始日期：" prop="perftask_begin_date">
                                <Date-picker type="date" placeholder="选择日期" v-model="editPTaskValidate.perftask_begin_date" format="yyyy-MM-dd"></Date-picker>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="任务结束日期：" prop="perftask_end_date">
                                <Date-picker type="date" placeholder="选择日期" v-model="editPTaskValidate.perftask_end_date" format="yyyy-MM-dd"></Date-picker>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="投产日期" prop="online_date">
                                <Date-picker type="date" placeholder="选择日期" v-model="editPTaskValidate.online_date" format="yyyy-MM-dd"></Date-picker>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem label="任务状态：" prop="perftask_status">
                                <Select clearable v-model="editPTaskValidate.perftask_status">
                                    <Option v-for="item in taskStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div slot="footer">
                    <Button color="#1c2438" @click="editCancel()">取消</Button>
                    <Button type="primary" @click="handleEditPTaskSubmit('editPTaskValidate')">确认</Button>
                </div>
            </Modal>
            

            <!--=================================== 删除任务的对话框 ===================================-->
            <Modal v-model="delPTaskModal" width="800">
                <p slot="header" style="text-align:center" >
                    <span>请确认是否删除以下任务</span>
                </p>
                <Form ref="delPTaskValidate" :model="delPTaskValidate" :label-width="120">
                    <!-- <ul type="circle"> -->
                    <Row v-for="(pTaskItem,index) in delPTaskValidate.delPTaskList" :key="index">
                        <!-- <li> -->
                        <Col span="3" class="delShowTitle"><Icon type="ios-close" /></Col>
                        <Col span="2" class="delShowTitle">id: </Col>
                        <Col span="1">{{pTaskItem.id}}</Col>
                        <Col span="3" class="delShowTitle">任务名称: </Col>
                        <Col span="13">{{pTaskItem.perftask_name}}</Col>
                        <Col span="2"></Col>
                        <!-- <Divider></Divider> -->
                        <!-- </li> -->
                    </Row>
                    <!-- </ul> -->
                </Form>
                <div slot="footer">
                    <Button color="#1c2438" @click="delCancel()">取消</Button>
                    <Button type="primary" @click="handleDelPTaskSubmit('delPTaskValidate')">确认</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>

<script>
export default {
	name: 'TestCase',
    data () {
        return {
            /**==================== 搜索框数据 ====================*/
            isShowMoreShow:false,
            sComponent:'',          // 物理子系统
            srchCmploading: false,
            cmpOpts: [],
            list: [], 
            sTaskStatus:'',         // 任务状态
            taskStatusList: this.$Global.taskStatusList,
            taskSourceList: this.$Global.taskSourceList,
            sTaskName:'',           // 任务名称
            startDate_s:'',         // 任务开始日期
            startDate_f:'',
            endDate_s:'',           // 任务结束日期
            endDate_f:'',
            sTaskSource:'',         // 任务来源
            onlineDate_s:'',        // 投产日期
            onlineDate_f:'',  

            /**==================== 列表数据 ====================*/
            columns: [
            	{
                    type: 'selection',
                    width: 50,
                    align: 'center'
                },
                {
                    title: 'id',
                    key: 'id',
                    width: 60,
                },
                {
                    title: '物理子系统',
                    key: 'component_name',
                    width: 210, 
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
                    title: '任务名称',
                    width: 210,
                    key: 'perftask_name', 
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
                                    title: params.row.perftask_name
                                }
                            }, params.row.perftask_name)
                        ]);
                    }
                },
                {
                    title: '投产日期',
                    key: 'online_date',
                    width: 100,
                    render : (h, params)=>{
                        let _this = this;
                        return h('span', _this.$Global.formatDate(new Date(params.row.online_date), 'yyyy-MM-dd'));
                    }
                },
                {
                    title: '任务状态',
                    key: 'perftask_status',
                    width: 90,
                    render : (h, params)=>{
                        let _this = this
                        //console.log('params:', params);
                        return h('span', _this.$Global.taskStatusMap[params.row.perftask_status]);
                    }
                },
                {
                    title: '任务开始日期',
                    key: 'perftask_begin_date',
                    width: 110,
                    render : (h, params)=>{
                        let _this = this;
                        return h('span', _this.$Global.formatDate(new Date(params.row.perftask_begin_date), 'yyyy-MM-dd'));
                    }
                },
                {
                    title: '任务结束日期',
                    key: 'perftask_end_date',
                    width: 110,
                    render : (h, params)=>{
                        let _this = this;
                        return h('span', _this.$Global.formatDate(new Date(params.row.perftask_end_date), 'yyyy-MM-dd'));
                    }
                },
                {
                    title: '任务来源',
                    key: 'ptask_source',
                    width: 90,
                    render : (h, params)=>{
                        let _this = this
                        return h('span', _this.$Global.taskSourceMap[params.row.ptask_source]);
                    }
                },
                {
                    title: '操作',
                    key: 'opration',
                    width:130,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                    // type: 'text', 
                                    // size: 'small', 
                                    // icon: 'ios-create-outline', 
                                    // icon: 'ios-paper-outline', 
                                },
                                style: {
                                    marginRight: '5px'
                                    // content-size:
                                },
                                on: {
                                    click: () => {
                                        this.editPTaskModal = true;
                                        // console.log('params.row: ', params.row);
                                        this.editPTaskValidate.index = params.row._index;
                                        this.editPTaskValidate.id = params.row.id;
                                        this.editPTaskValidate.component_name = params.row.component_name;
                                        this.editPTaskValidate.perftask_name = params.row.perftask_name;
                                        this.editPTaskValidate.perftask_begin_date = params.row.perftask_begin_date;
                                        this.editPTaskValidate.perftask_end_date = params.row.perftask_end_date;
                                        this.editPTaskValidate.online_date = params.row.online_date;
                                        this.editPTaskValidate.perftask_status = params.row.perftask_status;
                                        this.editPTaskValidate.ptask_source = params.row.ptask_source;
                                            // if (params.row.$isEdit) {
                                            //     this.handleSave(params.row);
                                            // } else {
                                            //     this.handleEdit(params.row);
                                            // }
                                    }
                                }
                            }, '编辑'),        // params.row.$isEdit ? '保存' : '编辑'
                            // h('Button', {
                            //                 props: {
                            //                     type: 'error',
                            //                     size: 'small'
                            //                 },
                            //                 style: {
                            //                     marginRight: '5px'
                            //                 },
                            //                 on: {
                            //                     click: () => {
                            //                         this.remove(params.index);
                            //                         //console.log(params)
                            //                     }
                            //                 }
                            //             }, '删除'),
                            h('Button', {
                                props: {
                                    type: 'default',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        //console.log("文档")
                                    }
                                }
                            }, '文档')
                        ])
                                            
                    }
                }
            ],
            tableData: [],
            totalcount:0,               // 共多少条数据
            pageno:1,                   // 当前页
            pagesize:10,                // 每页显示多少条数据
            selectedData:[],
            
            /**==================== 新建任务弹出框数据 ====================*/
            addPTaskModal:false, 
            addValidate: {
                component_name: '',         // 物理子系统
                task_name: '',              // 任务名称
                perftask_begin_date: '',    // 任务开始日期
                perftask_end_date: '',      // 任务结束日期
                online_date: '',            // 投产日期
            },
            addRuleValidate: {
                task_name: [
                    { required: true, message: '此项为必填项', trigger: 'blur' }
                ], 
                component_name: [
                    { required: true, message: '此项为必填项', trigger: 'change' }
                ], 
                perftask_begin_date: [
                    { required: true, type: 'date', message: '此项为必填项', trigger: 'change' }
                ], 
                perftask_end_date: [
                    { required: true, type: 'date', message: '此项为必填项', trigger: 'change' }
                ], 
                online_date: [
                    { required: true, type: 'date', message: '此项为必填项', trigger: 'change' }
                ],
            },

            /**==================== 任务编辑弹出框数据 ====================*/
            editPTaskModal: false, 
            editPTaskValidate: {
                index: '',                  // 列表中的索引号
                id: '',                     // 任务编号
                component_name: '',         // 物理子系统
                perftask_name: '',          // 任务名称——可编辑
                perftask_begin_date: '',    // 任务开始日期——可编辑
                perftask_end_date: '',      // 任务结束日期——可编辑
                online_date: '',            // 投产日期——可编辑
                perftask_status: '',        // 任务状态——可编辑
                ptask_source: '',           // 任务来源
            },
            editPTaskRuleVldt: {
                task_name: [
                    { required: true, message: '此项为必填项', trigger: 'blur' }
                ], 
                perftask_begin_date: [
                    { required: true, type: 'date', message: '此项为必填项', trigger: 'change' }
                ], 
                perftask_end_date: [
                    { required: true, type: 'date', message: '此项为必填项', trigger: 'change' }
                ], 
                online_date: [
                    { required: true, type: 'date', message: '此项为必填项', trigger: 'change' }
                ],
                perftask_status: [
                    { required: true, message: '此项为必填项', trigger: 'change' }
                ],
            },

            /**==================== 删除任务弹出框数据 ====================*/
            delPTaskModal: false, 
            delPTaskValidate: {
                delPTaskList: [],                  // 待删除的任务列表
            },
        }
    },
    created(){
        this.listPTask();
    },
    methods: {
        show:function(ev){
            alert(ev.keyCode)
        },

        /**==================== 物理子系统检索 ====================*/
        srchComponent:function(query){
            // console.log("now in srchComponent, this is ", this);
            this.cmpOpts = [];
            if(query !== ''){
                this.srchCmploading = true;
                setTimeout(()=>{
                    this.srchCmploading = false;
                    let _this = this;
                    this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/component/search',{
                        headers:{},
                        data:{
                            name:query,
                            endDate:''
                        },
                    }).then(function(response){
                        //console.log('下拉框请求的响应',response);
                        _this.list = response.data.resultList;
                        _this.cmpOpts = _this.list.map(item =>{
                            return {
                                value:item.id,
                                label :item.name
                            }
                        });
                        //console.log('赋值给预选项',_this.cmpOpts);
                    })
                },200)
            }else{
                this.cmpOpts = [];
            }
        },
        

        /**==================== 任务列表相关事件 ====================*/
        listPTask: function() {
            let _this = this;
            console.log("任务来源:", _this.sTaskSource);
            this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/perftask/list', {
                header: {},
                data: {
                    component_name: _this.sComponent,           // 物理子系统名称
                    perftask_name: _this.sTaskName,             // 任务名称
                    perftask_begin_date_s: _this.startDate_s,   // 任务开始日期
                    perftask_begin_date_f: _this.startDate_f,
                    perftask_end_date_s: _this.endDate_s,       // 任务结束日期
                    perftask_end_date_f: _this.endDate_f,
                    online_date_s: _this.onlineDate_s,
                    online_date_f: _this.onlineDate_f,
                    perftask_status: _this.sTaskStatus,         // 任务状态
                    ptask_source: _this.sTaskSource,            // 任务来源

                    pageno:this.pageno,                         // 当前页码
                    pagesize:this.pagesize                      // 当前页面大小
                    
                }
            }).then(function (response) {
                console.log("列表请求回来的分页数据",response.headers);
                console.log("请求回来的模糊查询数据",response.data);
                let result = response.data.result;
                console.log("result: ", result);
                if (result == "ok"){
                    console.log("******** result ok *********");
                }
                _this.totalcount = response.headers.totalcount               //将总的数据条数赋值后渲染
                _this.tableData = response.data.resultList;
                // console.log("*****************_this.tableData: ", _this.tableData);
                // console.log("~~~~~~~~~~~~~~~~~~~columns: ", _this.columns);
            })
        },
        /**分页查询功能----切换每页大小 */
        pageSizeChange:function(pagesize){
            //console.log("页码大小切换",pagesize);
            this.pagesize = pagesize;                     //改变当前页大小后
            this.listPTask();                                 //重新请求数据
        },
        /**分页查询功能----切换当前页 */
        pageChange:function(pageno){
            //console.log("页码切换",pageno);
            this.pageno = pageno; 
            this.listPTask();
        },
        
        setCiFlag: function() {
            let _this = this
            let ids = []
            this.selectedData.forEach(e => {
                ids.push(e.id)
            });
            //console.log('setCiFlag')
            this.$http.defaults.withCredentials = false;
            this.$http.post('caseHandler', {
                header: {
                    txCode:'setCiFlag',
                    sysTransId:'20181010153628000165432',
                    projectId:'1001',
                    projectName:'res',
                    reqTime:'153628001',
                    userId:'admin',
                },
                data: {
                    ids: ids
                }
            })           
        },

        onSelectionChanged: function(data) {
            this.selectedData = data;
            //console.log(data)
        },

        // onRowDblClick: function(row) {
        //     this.$router.push({path:'/addCase',query:{id:row.id}});
        // },
        
        // /**点击保存之后的事件 */
        // handleSave(row){
        //     //console.log("这是保存",row)
        // },
        // /**点击编辑之后的事件 */
        // handleEdit(row){
        //     //console.log("这是编辑",row)
        // },

        // /**删除一条数据 */
        // remove(index){
        //     this.tableData.splice(index,1);
        //     //console.log("这是删除一条数据",row);
        // },

        /**==================== 新建任务相关事件 ====================*/
        /**添加新数据弹出模态框 */
        addPTask:function(){
            this.addPTaskModal = true;
        },
        handleSubmit (name) {
            let _this = this;
            // console.log("**********************this: ", _this);
            
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/perftask/add', {
                        header: {},
                        data: {
                            component_name: _this.addValidate.component_name,   // 物理子系统名称
                            task_name: _this.addValidate.task_name,             // 任务名称
                            perftask_begin_date: _this.addValidate.perftask_begin_date,   // 任务开始日期
                            perftask_end_date: _this.addValidate.perftask_end_date,    // 任务结束日期
                            online_date: _this.addValidate.online_date,
                            perftask_source: "2",
                        }
                    }).then(function (response) {
                        if (response.data.result == "fail") {
                            let errDesc = "";
                            if (response.data.err_code != null) {
                                errDesc = errDesc + "errCode: " + response.data.err_code;
                            } else {
                                errDesc = "no errCode";
                            }

                            if (response.data.err_desc != null) {
                                errDesc = errDesc + " —— errDesc: " + response.data.err_desc;
                            } else {
                                errDesc = errDesc + " —— no errDesc";
                            }

                            _this.$Message.error(errDesc);
                            _this.addPTaskModal = false;
                        } else if (response.data.result == "ok") {
                            // console.log("**********************addValidate: ", _this.addValidate);
                            _this.addValidate.perftask_name = _this.addValidate.task_name;
                            _this.addValidate.id = response.data.resultMap.id;
                            _this.addValidate.perftask_status = response.data.resultMap.perftask_status;
                            _this.addValidate.ptask_source = '2';
                            console.log("**********************addValidate: ", _this.addValidate);
                            _this.$Message.success('提交成功!');
                            _this.addPTaskModal = false;
                            _this.tableData.push(_this.addValidate);
                            // console.log('tableData after: ', _this.tableData);
                        }
                    })
                } else {
                    _this.$Message.error('表单验证失败!');
                }
            });
        },     
        cancel () {
            this.$Message.info('点击了取消');
            this.addPTaskModal = false;
        },

        /**==================== 编辑任务相关事件 ====================*/
        handleEditPTaskSubmit (editPTaskData) {
            let _this = this;
            // console.log("**********************this: ", _this);
            // console.log("perftask_name: ", _this.editPTaskValidate.perftask_name);
            
            this.$refs[editPTaskData].validate((valid) => {
                if (valid) {
                    this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/perftask/edit', {
                        header: {},
                        data: {
                            id: _this.editPTaskValidate.id, 
                            perftask_name: _this.editPTaskValidate.perftask_name,
                            perftask_begin_date: _this.editPTaskValidate.perftask_begin_date,
                            perftask_end_date: _this.editPTaskValidate.perftask_end_date,
                            online_date: _this.editPTaskValidate.online_date,
                            perftask_status: _this.editPTaskValidate.perftask_status, 
                        }
                    }).then(function (response) {
                        _this.$Message.success('提交成功!');
                        _this.editPTaskModal = false;
                        // console.log('tableData before: ', _this.tableData);
                        // console.log('index: ', _this.editPTaskValidate.index);
                        _this.$set(_this.tableData, _this.editPTaskValidate.index, _this.editPTaskValidate);
                        // console.log('tableData after: ', _this.tableData);
                    })
                } else {
                    _this.$Message.error('表单验证失败!');
                }
            });
        }, 
        editCancel () {
            this.$Message.info('点击了取消');
            this.editPTaskModal = false;
        }, 

        /**==================== 删除任务相关事件 ====================*/
        /*删除按钮功能*/
        delPTask: function() {
            let selectedData=this.selectedData;      //选中要删除的数据
            console.log("selectedData", selectedData);

            if(selectedData.length>0){               //如果有选中的数据
                this.delPTaskModal = true;
                console.log("***********");
                console.log("before: ", this.delPTaskValidate);
                this.delPTaskValidate.delPTaskList = selectedData;
                console.log("this.delPTaskValidate.delPTaskList: ", this.delPTaskValidate.delPTaskList);
            }else{
                    this.$Message.error("请选择要删除的数据")
            }
        }, 
        handleDelPTaskSubmit (delPTaskData) {
            let _this = this;
            let tableData = _this.tableData;
            let delList = _this.delPTaskValidate.delPTaskList;
            // console.log("== delList: ", delList);
            let delIds = [];

            for (let i in delList) {
                // console.log("~~ i: ", i);
                // console.log("^^ delitem id : ", delList[i].id);
                delIds.push(delList[i].id);  //将选中的而数据的id放入要删除的集合中
            }
            // console.log("** delIds: ", delIds);
            
            this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/perftask/del', {
                header: {},
                data: {
                    ids: delIds
                }
            }).then(function (response) {
                _this.$Message.success('删除成功!');
                _this.delPTaskModal = false;
                for (let i in delIds) {
                    // console.log("delIds[i]: ", delIds[i]);
                    for (let index in tableData) {
                        // console.log("tableData[index].id: ", tableData[index].id);
                        if (tableData[index].id == delIds[i]) {
                            // console.log("==now equal==");
                            tableData.splice(index, 1);        //删除表格中展示的数据
                            break;
                        }
                    }
                    // tableData.forEach((item,index) => {      //对原有的数据进行遍历
                    //     if(item.id == id){       //当原有的数据与要删除的数据中有相同的数据时，
                    //         // console.log("tableData index:", index);
                    //         tableData.splice(index, 1);        //删除表格中展示的数据
                    //     }
                    // });
                }
            })
        }, 
        delCancel () {
            this.$Message.info('点击了取消');
            this.delPTaskModal = false;
        },

        /**清除搜索条件 */
        handleReset (name) {
            //console.log(this.$refs)
            this.$refs[name].resetFields();
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
// .actionBtn{
//     width: 16%;
// }
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

.lineBtwTimes {
    text-align: center; 
    padding: 9px 0px
}

.editStaticDiv {
    font-size: 12px;
    padding-top: 6px;
}

.delStaticDiv {
    font-size: 12px;
    padding-top: 8px;
}

.delShowTitle {
    // padding-left: 40px;
    padding-right: 15px;
    padding-bottom: 15px;
    text-align: right;
    font-size: 12px;
    font-weight: bold;
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
