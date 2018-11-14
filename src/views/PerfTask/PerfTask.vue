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
                                    <Select v-model="sTaskStatus" style="">
                                    <Option v-for="item in taskStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="3">
                                <Button @click="listCase"  type="primary" icon="ios-search">搜索</Button>
                            </Col>
                        </Row>
                        <Row :gutter="16" v-if="isShowMoreShow">
                            <Col span="2" class="searchLable">任务开始日期</Col>
                            <Col span="9">
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询起始日期" v-model="startTime_s"></DatePicker>
                                </Col>
                                <Col span="1" style="text-align: center; padding: 14px 0px">-</Col>
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询截止日期" v-model="startTime_f"></DatePicker>
                                </Col>
                                <Col span="1"></Col>
                            </Col>
                            <Col span="2" class="searchLable">任务结束日期</Col>
                            <Col span="9">
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询起始日期" v-model="endTime_s"></DatePicker>
                                </Col>
                                <Col span="1" style="text-align: center; padding: 14px 0px">-</Col>
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询截止日期" v-model="endTime_f"></DatePicker>
                                </Col>
                                <Col span="1"></Col>
                            </Col>
                            <Col span="2"></Col>
                        </Row>
                        <Row :gutter="16" v-if="isShowMoreShow">
                            <Col span="2" class="searchLable">显示已删除</Col>
                            <Col span="10">
                                <Input v-model="createUser" placeholder="是否显示已删除任务"></Input>
                            </Col>
                            <Col span="2" class="searchLable">投产日期</Col>
                            <Col span="10">
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询起始日期" v-model="createTime_s"></DatePicker>
                                </Col>
                                <Col span="1" style="text-align: center; padding: 14px 0px">-</Col>
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询截止日期" v-model="createTime_f"></DatePicker>
                                </Col>
                                <Col span="1"></Col>
                            </Col>
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
                        <Button type="primary" @click="listCase">测试指标</Button>
                        <Button @click="deleteCase" type="error">删除</Button>
                    </div>
                    <Table border  ref="selection" :columns="columns" :data="tableData" class="myTable" @on-row-dblclick="onRowDblClick" @on-selection-change="onSelectionChanged"></Table>
                    <div class="pageBox" v-if="tableData.length">
                        <Page :total="parseInt(totalcount)" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
                        <!-- <p>总共{{totalcount}}条记录</p> -->
                    </div>
                </div>
            </div>


            <!-- /* add by xin */ -->
            <!--===================================新建任务时弹出的对话框===============-->
            <Modal v-model="Deletips" width="1000">
                <p slot="header" style="text-align:center" >
                    <Icon type="ios-information-circle"></Icon>
                    <span>添加任务</span>
                </p>
                <div style="text-align:center">
                    <i-form ref="addValidate" :model="addValidate" :rules="ruleValidate" :label-width="100" label-position="left">
                        <Row>
                            <i-col span="24">
                                <Form-item label="物理子系统" prop="component_name">
                                    <i-select v-model="addValidate.component_name" placeholder="请选择所在地">
                                        <i-option value="card1">(N-CIS)贷记卡发卡</i-option>
                                        <i-option value="card2">(N-CIS)贷记卡发卡</i-option>
                                        <i-option value="card3">(N-CIS)贷记卡发卡</i-option>
                                    </i-select>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <Form-item label="任务名称" prop="task_name">
                                    <i-input v-model="addValidate.task_name"></i-input>
                                </Form-item>
                            </i-col>
                    </Row>
                        <Row>
                            <i-col span="8">
                                    <Form-item label="投产日期" prop="start_time">
                                        <Date-picker type="date" placeholder="选择日期" v-model="addValidate.start_time"></Date-picker>
                                </Form-item>
                            </i-col>
                            
                            <i-col span="8">
                                    <Form-item label="任务开始日期" prop="start_time">
                                    <Date-picker type="date" placeholder="选择日期" v-model="addValidate.start_time"></Date-picker>
                                </Form-item>
                            </i-col>
                            
                            <i-col span="8">
                                <Form-item label="任务结束日期" prop="finish_time">
                                    <Date-picker type="date" placeholder="选择日期" v-model="addValidate.finish_time"></Date-picker>
                                </Form-item>
                            </i-col>
                        </Row>
                    
                    </i-form>
                </div>
                <div slot="footer">
                    <Button color="#1c2438" @click="handleSubmit('addValidate')">确认</Button>
                    <Button type="primary" @click="cancel()">取消</Button>
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
            isShowMoreShow:false,
            sComponent:'',                  //物理子系统
            srchCmploading: false,
            cmpOpts: [],
            list: [], 
            sTaskStatus:'',                  //任务状态
            taskStatusList: this.$Global.taskStatusList,
            sTaskName:'',                       //任务名称
            startTime_s:'',                        //开始时间
            startTime_f:'',
            endTime_s:'',                         //结束时间
            endTime_f:'',
            createTime_s:'',                      //投产日期
            createTime_f:'',
            createUser:'',     
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
                },
                {
                    title: '任务状态',
                    key: 'perftask_status',
                    width: 90,
                    render : (h, params)=>{
                        let _this = this
                        //console.log('$Global.taskStatusList: ', _this.$Global.taskStatusList);
                        //console.log('$Global.taskStatusMap: ', _this.$Global.taskStatusMap);
                        //console.log('00-------', _this.$Global.taskStatusMap['00']);
                        //console.log('params:', params);
                        return h('span', _this.$Global.taskStatusMap[params.row.perftask_status]);
                    }
                },
                {
                    title: '任务开始日期',
                    key: 'perftask_begin_date',
                    width: 110,
                },
                {
                    title: '任务结束日期',
                    key: 'perftask_end_date',
                    width: 110,
                },
                // {
                //     title: '创建时间',
                //     key: 'created_date',
                //     width: 150,
                //     align: 'center',
                // },
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
            totalcount:0,                         //共多少条数据
            pageno:1,                            //当前页
            pagesize:10,                           //每页显示多少条数据
            selectedData:[],

            /* add by xin */
            /**===================================模态框表单验证数据 =========================*/
            Deletips:false, 
            addValidate: {
                    component_name: '',
                    task_name: '',
                    start_time: '',
                    finish_time: '',
                },
            ruleValidate: {
                task_name: [
                    { required: true, message: '此项为必填项', trigger: 'blur' }
                ],
                component_name: [
                    { required: true, message: '此项为必填项', trigger: 'change' }
                ],
                start_time: [
                    { required: true, type: 'date', message: '此项为必填项', trigger: 'change' }
                ],
                finish_time: [
                    { required: true, type: 'date', message: '此项为必填项', trigger: 'change' }
                ]
            },
        }
    },
    created(){
        this.listCase();
    },
    methods: {
        show:function(ev){
            alert(ev.keyCode)
        },
        srchComponent:function(query){
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
                            endTime:''
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
        // srchComponent: function(query) {       //输入查询条件时查询方法
        //     this.cmpOpts = [];                   //下拉框预选项中的数据
        //     if (query !== '') {                 //如果输入的条件不为空
        //         this.srchCmploading = true;       
        //         setTimeout(() => {
        //             this.srchCmploading = false;

        //             let _this = this
        //             //console.log('srchComponent');
        //             //console.log('list-before: ', this.list);
        //             //console.log('query: ', query)

        //             this.$http.defaults.withCredentials = false;
        //             this.$http.post('/myapi/component/search',     //发送请求
        //             {
        //                 headers: {
        //                 },
        //                 data: {
        //                     name: query,
        //                     endTime: '',
        //                 },
                        
        //             }
        //             ).then(function (response) {           //请求回来的数据
        //                 //console.log('response:', response);
        //                 //console.log('response.data: ', response.data);
        //                 _this.list = response.data.resultList;
        //                 //console.log('list-after: ', _this.list);
        //                 const list = _this.list.map(item => {     //进行遍历
        //                     return {
        //                         value: item.id,                   //将id和name取出
        //                         label: item.name
        //                     };
        //                 });
        //                 _this.cmpOpts = list                      //取出的id和name赋值到预选项的列表中
        //                 //console.log('this.cmpOpts:', _this.cmpOpts);
        //             })
        //         }, 200);
        //     } else {
        //         this.cmpOpts = [];                               //否则的话预选项为空
        //     }
        // },

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
                   tableData.splice(index,1);        //即删除该数据
                }
            });
        },
        /**加载表格中的数据 */
        listCase: function() {
            let _this = this;
            //console.log('listPerfTask');
            console.log('物理子系统:', _this.sComponent);
            console.log("任务名称",_this.sTaskName);
            console.log("任务状态",_this.sTaskStatus);
            this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/perftask/list', {
                header: {},
                data: {
                    component_name: _this.sComponent,
                    perftask_name:_this.sTaskName,                  //任务名称
                    perftask_begin_date_s:_this.startTime_s,            //任务开始日期
                    perftask_begin_date_f:_this.startTime_f,
                    perftask_end_date_s:_this.endTime_s,                 //任务结束日期
                    perftask_end_date_f:_this.endTime_f,
                    online_date_s:_this.createTime_s,
                    online_date_f:_this.createTime_f,
                    perftask_status:_this.sTaskStatus,               //任务状态

                    pageno:this.pageno,                             //当前页码
                    pagesize:this.pagesize                           //当前页面大小
                    
                }
            }).then(function (response) {
                console.log("列表请求回来的分页数据",response.headers);
                console.log("请求回来的模糊查询数据",response.data);
                //console.log('response:',response);
                //console.log('response.data: ', response.data);
                _this.totalcount = response.headers.totalcount               //将总的数据条数赋值后渲染
                _this.tableData = response.data.resultList;
            })
        },
        /**分页查询功能----切换每页大小 */
        pageSizeChange:function(pagesize){
            //console.log("页码大小切换",pagesize);
            this.pagesize = pagesize;                     //改变当前页大小后
            this.listCase();                                 //重新请求数据
        },
        /**分页查询功能----切换当前页 */
        pageChange:function(pageno){
            //console.log("页码切换",pageno);
            this.pageno = pageno; 
            this.listCase();
        },
        findCase: function(id) {
            let _this = this
            //console.log('findCase')
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
                    id: id
                }
            }).then(function (response) {
                //console.log('response')
                //console.log(response.data.data)
            })
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

        // addCase: function() {
            // this.$router.push('addCase')
        // }
        /**添加新数据弹出模态框 */
        addCase:function(){
            this.Deletips = true;
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
            //console.log(this.addValidate);
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('提交成功!');
                     this.Deletips = false;
                     //this.$refs.addValidate.$el.input.value = ''
                   //console.log("确认按钮之后", this.$refs.addValidate.$el)
                } else {
                    this.$Message.error('表单验证失败!');
                }
            });
        },     
        /**模态框弹出取消事件 */
        cancel () {
            this.$Message.info('点击了取消');
            this.Deletips = false;
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
