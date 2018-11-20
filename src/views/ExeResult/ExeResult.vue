<template>
	<div class="pageContent">
        <Card>
            <div class="caseBox">
                <h3 class="Title">
                    <span>执行结果</span>
                </h3>
                <Form ref="formValidate" class="formValidate">
                    <div class="rowbox">
                        <Row :gutter="16">
                            <Col span="2" class="searchLable">任务名称</Col>
                            <Col span="5">
                                <Input clearable v-model="task_name" placeholder="输入任务名称"></Input>
                            </Col>
                            <Col span="2" class="searchLable">场景名称</Col>
                            <Col span="5">
                                <Input clearable v-model="senario_name" placeholder="输入场景名称"></Input>
                            </Col>
                            <Col span="2" class="searchLable">场景类型</Col>
                            <Col span="5">
                                    <Select v-model="type_name" style="">
                                    <Option v-for="item in taskStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="3">
                                <Button @click="listCase" type="primary" icon="ios-search">搜索</Button>
                            </Col>
                        </Row>
                        <Row :gutter="16" v-show="isShowMoreShow">
                            <Col span="2" class="searchLable">执行状态</Col>
                            <Col span="5">
                                    <Select v-model="exe_status" style="">
                                    <Option v-for="item in taskStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="2" class="searchLable">执行人</Col>
                            <Col span="5">
                                <Select
                                    clearable
                                    v-model="execution_name"
                                    placeholder="输入执行人名称"
                                    filterable
                                    remote
                                    :remote-method="srchComponent"
                                    :loading="srchCmploading">
                                    <Option v-for="(option, index) in cmpOpts" :value="option.label" :key="index">{{option.label}}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row :gutter="17" v-show="isShowMoreShow">
                            <Col span="2" class="searchLable">开始日期</Col>
                            <Col span="5">
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询起始日期" v-model="start_time"></DatePicker>
                                </Col>
                                <Col span="1" style="text-align: center; padding: 14px 0px">-</Col>
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询截止日期" v-model="start_time"></DatePicker>
                                </Col>
                                <Col span="1"></Col>
                            </Col>
                            <Col span="2" class="searchLable">结束日期</Col>
                            <Col span="5">
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询起始日期" v-model="end_time"></DatePicker>
                                </Col>
                                <Col span="1" style="text-align: center; padding: 14px 0px">-</Col>
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询截止日期" v-model="end_time"></DatePicker>
                                </Col>
                            </Col>
                            <Col span="2"></Col>
                        </Row>
                    </div>
                    <div class="formValidateMoreBtnBox" :class="isShowMoreShow ?'arrUp':'arrDown'" @click="isShowMoreShow = !isShowMoreShow">
                        <Icon type="chevron-down" color="#fff" ></Icon>
                        <Icon type="chevron-down" color="#fff" ></Icon>
                    </div>
                </Form>
                
                <div class="tableBox">
                    <div class="tableBtnBox">
                        <Button type="success" @click="addCase" >聚合报告</Button>
                        <Button @click="deleteCase" type="error">删除结果</Button>
                    </div>
                    <Table border  ref="selection" :columns="columns" :data="tableData" class="myTable" @on-row-dblclick="onRowDblClick" @on-selection-change="onSelectionChanged"></Table>
                    <div class="pageBox" v-if="tableData.length">
                        <Page :total="tableDAtaTatol/tableDAtaPageLine > 1 ? (tableDAtaTatol%tableDAtaPageLine ? parseInt(tableDAtaTatol/tableDAtaPageLine)+1 : tableDAtaTatol/tableDAtaPageLine)*10 : 1" show-elevator></Page>
                        <p>总共{{tableDAtaTatol}}条记录</p>
                    </div>
                </div>
            </div>


            <!-- /* add by xin */ -->
            <!--===================================新建任务时弹出的对话框===============-->
            <!--<Modal v-model="Deletips" width="1000">
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
                                <Form-item label="任务名称" prop="perftask_name">
                                    <i-input v-model="addValidate.perftask_name"></i-input>
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
            </Modal>-->
        </Card>
    </div>
</template>

<script>
export default {
	name: 'TestCase',
    data () {
        return {
            isShowMoreShow:false,               //是否显示更多查询条件
            sComponent:'',
            srchCmploading: false,
            cmpOpts: [],
            list: [], 
            taskStatusList: this.$Global.taskStatusList,  
            
            executor_id:'',                     //执行编号
            component_name:'',                  //物理子系统
            task_name:'',                       //关联任务
            senario_name:'',                    //场景名称
            type_name:'',                       //场景类型
            execution_name:'',                  //执行人
            exe_status:'',                      //执行状态
            start_time:'',                      //开始日期
            end_time:'',                        //结束日期
            columns: [
            	{
                    type: 'selection',
                    width: 50,
                    align: 'center'
                },
                {
                    title: '执行编号',
                    key: 'executor_id',
                    tooltip: true, 
                    width: 130,
                },
                {
                    title: '物理子系统',
                    key: 'component_name',
                    tooltip: true, 
                },
                {
                    title: '关联任务',
                    key: 'task_name'
                },
                {
                    title: '场景名称',
                    key: 'senario_name',
                },
                {
                    title:'场景类型',
                    key:'type_name',
                    width: 90,
                },
                {
                    title: '执行人',
                    key: 'execution_name',
                    width: 80,
                },
                {
                    title: '执行状态',
                    key: 'exe_status',
                    width: 90,
                },
                {
                    title: '开始日期',
                    key: 'start_time',
                },
                {
                    title: '结束日期',
                    key: 'end_time',
                },
                {
                    title: '操作',
                    key: 'opration',
                    width: 80,
                    render: (h, params) => {
                        return h('div', [
                        h('Button', {
                                        props: {
                                            type:"primary",
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                console.log("详情")
                                            }
                                        }
                                    }, '详情')
                        ])
                                            
                    }
                }
            ],

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

            tableData: [],
            tableDAtaTatol:0,
            tableDAtaPageLine:3,
            selectedData:[],                    //选中的项的数组
            totalCount:0,                         //共多少条数据
            pageNo:1,                            //当前页
            pageSize:10,                           //每页显示多少条数据
            totalPage:0,                           //共多少页
            Deletips:false,
        }
    },
    created(){
        this.listCase();
    },
    methods: {
        srchComponent: function(query) {
            this.cmpOpts = [];
            if (query !== '') {
                this.srchCmploading = true;
                setTimeout(() => {
                    this.srchCmploading = false;

                    let _this = this
                    console.log('srchComponent');
                    console.log('list-before: ', this.list);
                    console.log('query: ', query)

                    this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/component/list', 
                    {
                        headers: {
                        },
                        data: {
                            name: query,
                            endTime: '',
                        },
                        
                    }
                    ).then(function (response) {
                        console.log('response:', response);
                        console.log('response.data: ', response.data);
                        _this.list = response.data.resultList;
                        console.log('list-after: ', _this.list);
                        const list = _this.list.map(item => {
                            return {
                                value: item.id,
                                label: item.name
                            };
                        });
                        _this.cmpOpts = list
                        console.log('this.cmpOpts:', _this.cmpOpts);
                    })
                }, 200);
            } else {
                this.cmpOpts = [];
            }
        },

        /*删除按钮功能*/
        deleteCase: function() {
            console.log("删除多条按钮");
            let selectedData=this.selectedData;      //选中要删除的数据
            let resArr = [];                         
            let deleteId = [];                       //选中数据的id
            if(selectedData.length>0){               //如果有选中的数据
                for(let i in selectedData){         //进行遍历
                    deleteId.push(selectedData[i].executor_id);  //将选中的而数据的id放入要删除的集合中
                    console.log(deleteId);
                    this.deleteData(deleteId);            //调用删除数据的方法，将tableData中的数据删除
                } 
            }else{
                    this.$Message.error("请选择要删除的数据")
            }
        }, 
        deleteData(deleArr) {                //调用方法将原有数据中对应的id删除
            let tableData = this.tableData;          //原有的数据
            tableData.forEach((item, index) => {      //对原有的数据进行遍历
                if (deleArr.includes(item.executor_id)) {       //当原有的数据与要删除的数据中有相同的数据时，
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
        //页面展示
        listCase: function() {
            let _this = this;
            console.log('表单数据:', _this.component_name,_this.task_name,_this.senario_name,_this.execution_name);
            this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/testresult/list', {
                data: {
                    component_name: _this.component_name,
                    task_name:_this.task_name,
                    senario_name:_this.senario_name,
                    execution_name:_this.execution_name,
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
        /**选中的数据发生改变 */
        onSelectionChanged: function(data) {
            this.selectedData = data;
            console.log(data)
        },

        onRowDblClick: function(row) {
            this.$router.push({path:'/addCase',query:{id:row.id}});
        },

        /**添加新数据弹出模态框 */
        addCase:function(){
            this.Deletips = true;
            console.log("显示模态框");
        },
        /**点击保存之后的事件 
        handleSave(row){
            console.log("这是保存",row)
        },
        /**点击编辑之后的事件 
        handleEdit(row){
            console.log("这是编辑",row)
        },*/
        /**删除一条数据 */
        remove(index){
            this.tableData.splice(index,1);
            console.log("这是删除一条数据",row);
        },


        /***模态框弹出时确定事件: 验证表单提交 */
        handleSubmit (name) {
            console.log(this.addValidate);
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('聚合成功!');
                     this.Deletips = false;
                     //this.$refs.addValidate.$el.input.value = ''
                   console.log("确认按钮之后", this.$refs.addValidate.$el)
                } else {
                    this.$Message.error('报告聚合失败!');
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
            console.log(this.$refs)
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

