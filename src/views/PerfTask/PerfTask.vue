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
                        <Button type="success" @click="addCase" >新建任务</Button>
                        <Button type="warning" @click="deleteCase">测试需求</Button>
                        <Button type="primary" @click="listPTask">测试指标</Button>
                        <Button @click="deleteCase" type="error">删除</Button>
                    </div>
                    <Table border  ref="selection" :columns="columns" :data="tableData" class="myTable" @on-row-dblclick="onRowDblClick" @on-selection-change="onSelectionChanged"></Table>
                    <div class="pageBox" v-if="tableData.length">
                        <Page :total="parseInt(totalcount)" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
                        <!-- <p>总共{{totalcount}}条记录</p> -->
                    </div>
                </div>

                <!-- <Modal v-model="addModal" 
                    title="Common Modal dialog box title" 
                    @on-ok="ok()" 
                    @on-cancle="cancle()">
                    <p>Content of dialog</p>
                </Modal> -->
            </div>


            <!--=================================== S 新建任务时弹出的对话框 S ===================================-->
            <Modal v-model="AddPTask" width="800">
                <p slot="header" style="text-align:center" >
                    <Icon type="ios-information-circle-outline"></Icon>
                    <span>添加任务</span>
                </p>
                <div style="text-align:center">
                    <Form ref="addValidate" :model="addValidate" :rules="ruleValidate" :label-width="100" label-position="right">
                        <!-- <Row>
                            <i-col span="24"> -->
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
                            <!-- </i-col>
                        </Row> -->
                        <!-- <Row>
                            <i-col span="24"> -->
                        <Form-item label="任务名称" prop="task_name">
                            <i-input v-model="addValidate.task_name"></i-input>
                        </Form-item>
                            <!-- </i-col>
                        </Row> -->
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

                            <!-- <i-col span="3"></i-col> -->
                        </Row>
                    
                    </Form>
                </div>
                <div slot="footer">
                    <Button color="#1c2438" @click="handleSubmit('addValidate')">确认</Button>
                    <Button type="primary" @click="cancel()">取消</Button>
                </div>
            </Modal>
            <!--=================================== F 新建任务时弹出的对话框 F ===================================-->
        </Card>
    </div>
</template>

<script>
export default {
	name: 'TestCase',
    data () {
        return {
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
            createUser:'',  
            addModal: false,    
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
                    width: 220,
                    // ellipsis: true, 
                    tooltip: true, 
                },
                {
                    title: '任务名称',
                    width: 220,
                    key: 'perftask_name'
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
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                    if (params.row.$isEdit) {
                                                        this.handleSave(params.row);
                                                    } else {
                                                        this.handleEdit(params.row);
                                                    }
                                            }
                                        }
                                    },params.row.$isEdit ? '保存' : '编辑'),
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

            
            /**=================================== S 模态框表单验证数据 S ===================================*/
            AddPTask:false, 
            addValidate: {
                    component_name: '', 
                    task_name: '', 
                    perftask_begin_date: '', 
                    perftask_end_date: '', 
                    online_date: '', 
                },
            ruleValidate: {
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
            /**=================================== F 模态框表单验证数据 F ===================================*/
        }
    },
    created(){
        this.listPTask();
    },
    methods: {
        show:function(ev){
            alert(ev.keyCode)
        },
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
        

        /* add by xin */
        /*删除按钮功能*/
        deleteCase: function() {
            //console.log("删除多条按钮");
            let selectedData=this.selectedData;      //选中要删除的数据
            let resArr = [];                         
            let deleteId = [];                       //选中数据的id
            if(selectedData.length>0){               //如果有选中的数据
                for(let i in selectedData){         //进行遍历
                    deleteId.push(selectedData[i].id);  //将选中的而数据的id放入要删除的集合中
                   
                    //console.log(deleteId);
                    this.deleteData(deleteId);            //调用删除数据的方法，将tableData中的数据删除
                } 
            }else{
                    this.$Message.error("请选择要删除的数据")
            }
        }, 
        deleteData(deleArr){                //调用方法将原有数据中对应的id删除
            let tableData = this.tableData;          //原有的数据
            tableData.forEach((item,index) => {      //对原有的数据进行遍历
                if(deleArr.includes(item.id)){       //当原有的数据与要删除的数据中有相同的数据时，
                   this.$Modal.confirm({
                        title:'确认',
                        content: '是否删除该数据',
                        onOk: () => {
                            tableData.splice(index, 1);        //即删除该数据上
                            this.$Message.info('删除成功');
                        },
                        onCancel: () => {
                            this.$Message.info('删除失败');
                        }
                    });
                }
            });
        },
        /**加载表格中的数据 */
        listPTask: function() {
            let _this = this;
            //console.log('listPerfTask');
            // console.log('物理子系统:', _this.sComponent);
            // console.log("任务名称",_this.sTaskName);
            // console.log("任务状态",_this.sTaskStatus);
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
                    perftask_status: _this.sTaskStatus,         //任务状态
                    ptask_source: _this.sTaskSource,

                    pageno:this.pageno,                         //当前页码
                    pagesize:this.pagesize                      //当前页面大小
                    
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

        onRowDblClick: function(row) {
            this.$router.push({path:'/addCase',query:{id:row.id}});
        },


        /**添加新数据弹出模态框 */
        addCase:function(){
            this.AddPTask = true;
            //console.log("显示模态框");
        },
        /**点击保存之后的事件 */
        handleSave(row){
            //console.log("这是保存",row)
        },
        /**点击编辑之后的事件 */
        handleEdit(row){
            //console.log("这是编辑",row)
        },
        /**删除一条数据 */
        remove(index){
            this.tableData.splice(index,1);
            //console.log("这是删除一条数据",row);
        },

        /***==========模态框弹出时确定事件: 验证表单提交 ===================*/
        handleSubmit (name) {
            let _this = this;
            console.log("**********************this: ", _this);
            
            // console.log(_this.addValidate.component_name);
            // console.log(_this.addValidate.task_name);
            // console.log(_this.addValidate.perftask_begin_date);
            // console.log(_this.addValidate.perftask_end_date);
            // console.log(_this.addValidate.online_date);
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
                        console.log("**********************addValidate: ", _this.addValidate);
                        console.log('response: ', response)
                        console.log('response.data.resultMap: ', response.data.resultMap);
                        _this.addValidate.perftask_name = _this.addValidate.task_name;
                        _this.addValidate.id = response.data.resultMap.id;
                        _this.addValidate.perftask_status = response.data.resultMap.perftask_status;
                        console.log("**********************addValidate: ", _this.addValidate);
                        _this.$Message.success('提交成功!');
                        _this.AddPTask = false;
                        console.log('tableData before: ', _this.tableData);
                        _this.tableData.push(_this.addValidate);
                        console.log('tableData after: ', _this.tableData);
                    })
                     //this.$refs.addValidate.$el.input.value = ''
                   //console.log("确认按钮之后", this.$refs.addValidate.$el)
                } else {
                    _this.$Message.error('表单验证失败!');
                }
            });
        },     
        /**模态框弹出取消事件 */
        cancel () {
            this.$Message.info('点击了取消');
            this.AddPTask = false;
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
