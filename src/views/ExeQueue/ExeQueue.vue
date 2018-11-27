<template>
	<div class="pageContent">
        <Card>
            <div class="caseBox">
                <h3 class="Title">
                    <span>执行队列</span>
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
                           
                            <Col span="3">
                                <Button @click="listCase" type="primary" icon="ios-search">搜索</Button>
                            </Col>
                        </Row>
                        <Row :gutter="16" v-if="isShowMoreShow">
                                <Col span="2" class="searchLable">执行人</Col>
                                <Col span="9">
                                    <Input clearable v-model="execution_name" placeholder="输入执行人"></Input>
                                </Col>
                                <!--
                                    <Option v-for="item in taskStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    -->
                                    <Col span="2" class="searchLable">执行状态</Col>
                                <Col span="9">
                                        <Select v-model="exe_status" style="" clearable>
                                        <Option  value="10">执行中</Option>
                                        <Option  value="00">等待执行</Option>
                                    </Select>
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
                        <!--<Button type="success" @click="addCase" >新建任务</Button>
                        <Button type="warning" @click="deleteCase">测试需求</Button>
                        <Button type="primary" @click="listCase">测试指标</Button>
                        <Button @click="deleteCase" type="error">停止</Button>-->
                        <Button @click="deleteCase" type="error" class="actionBtn">停止</Button>
                    </div>
                    <Table border  ref="selection" :columns="columns" :data="tableData" class="myTable" @on-row-dblclick="onRowDblClick" @on-selection-change="onSelectionChanged"></Table>
                    <div class="pageBox" v-if="tableData.length">
                        <Page :total="parseInt(totalCount)" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
                        <p>总共{{totalPage}}页</p>
                    </div>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
export default {
	name: 'TestCase',
    data () {
        return {
            isShowMoreShow:false,   //是否显示更多查询条件
            sComponent:'',
            srchCmploading: false,
            cmpOpts: [],
            list: [], 
            taskStatusList: this.$Global.taskStatusList,  
            execution_name:'',  //执行人
            task_name:'',      //任务名称
            senario_name:'',  //场景名称
            exe_status:'',    //执行状态
            endTime:'',

            columns: [
            {
                type: 'selection',
                width: 50,
                align: 'center'
            },
            {
                title: '执行编号',
                key: 'executor_id',
                width: 130,
                // ellipsis: true, 
                tooltip: true, 
            },
            {
                title: '关联任务',
                width: 200,
                key: 'task_name'//perftask_name
            },
            {
                title: '关联场景',
                key: 'senario_name',//online_date
                width: 200,
            },
            {
                title: '执行人',
                key: 'execution_name',//online_name
                width: 87,
            },
            {
                title: '执行状态',
                key: 'exe_status', //perftask_status
                render: (h, params) => {
                    let _this = this;
                    let texts='';
                    if(params.row.exe_status=='10'){
                         texts = '执行中'
                    }else if(params.row.exe_status=='00'){
                        texts = '等待执行'
                    }
                    return h('div',{
                        props:{
                        },
                    },texts)
                },
                width: 90,
            },
            {
                title: '预设启动时间',
                key: 'start_time',//perftask_begin_date
                width: 150,
            },
            {
                title: '实际启动时间',
                key: 'exe_time',//perftask_end_date
                width: 150,
            },
                // {
                //     title: '创建时间',
                //     key: 'created_date',
                //     width: 150,
                //     align: 'center',
                // },
            ],
            tableData: [],
            tableDAtaTatol:0,
            tableDAtaPageLine:3,
            selectedData:[],
            totalCount:0,                         //共多少条数据
            pageNo:1,                            //当前页
            pageSize:10,                           //每页显示多少条数据
            totalPage:0,                           //共多少页

            /* add by xin */
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
                    this.$http.post('/myapi/testresult/runtests/list', 
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

        deleteCase: function () {
            //console.log("停止多条按钮");
            let selectedData = this.selectedData;      //选中要停止的数据
            let resArr = [];
            let deleteId = [];                       //选中数据的id
            if (selectedData.length > 0) {               //如果有选中的数据
                for (let i in selectedData) {         //进行遍历
                    deleteId.push(selectedData[i].executor_id);  //将选中的而数据的id放入要停止的集合中
                    this.deleteData(deleteId);            //调用停止数据的方法，将tableData中的数据停止
                }
                console.log("停止多条的id",deleteId);
            } else {
                this.$Message.error("请选择要停止的数据")
            }
        }, 
        deleteData:function(deleArr) {                //调用方法将原有数据中对应的id停止
            console.log("停止多台哦数据内容",deleArr)
            let _this = this;
            let tableData = _this.tableData;          //原有的数据
            tableData.forEach((item, index) => {      //对原有的数据进行遍历
                if (deleArr.includes(item.executor_id)) {       //当原有的数据与要停止的数据中有相同的数据时，
                    _this.$Modal.confirm({
                        title:'确认',
                        content: '是否停止该数据',
                        onOk: () => {
                            this.$http.defaults.withCredentials = false;
                            this.$http.post("/myapi/testresult/runtests/cancel",{
                                header:{},
                                data:{
                                    ids:deleArr,
                                }
                            }).then(function(){
                                tableData.splice(index, 1);        //即停止该数据上
                                _this.$Message.info('停止成功');
                            })
                        },
                        onCancel: () => {
                            _this.$Message.info('停止失败');
                        }
                    }); 
                   
                }
            });
        },
            /**选中的数据发生改变 */
        onSelectionChanged: function(data) {
            this.selectedData = data;
            console.log("选中要停止的数据",this.selectedData)
            //console.log(data)
        },
        //页面展示
        listCase: function() {
            let _this = this;
            console.log('表单数据:', _this.component_name,_this.task_name,_this.senario_name,_this.execution_name);
            this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/testresult/runtests/list', {
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

        onSelectionChanged: function(data) {
            this.selectedData = data;
            console.log(data)
        },

        onRowDblClick: function(row) {
            this.$router.push({path:'/Monitoring',query:{executor_id:row.executor_id}});
        },

        // addCase: function() {
            // this.$router.push('addCase')
        // }
        /**添加新数据弹出模态框 */
        addCase:function(){
            this.Deletips = true;
            console.log("显示模态框");
        },
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
                    this.$Message.success('提交成功!');
                     this.Deletips = false;
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