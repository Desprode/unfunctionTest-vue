<template>
	<div class="pageContent">
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
                                <Select v-model="type_name" >
                                    <Option value="混合交易" >混合交易</Option>
                                    <Option value="单交易基准" >单交易基准</Option>
                                    <Option value="单交易负载" >单交易负载</Option>
                                </Select>
                            </Col>
                            <Col span="3">
                                <Button @click="listCase" type="primary" icon="ios-search">查询</Button>
                            </Col>
                        </Row>
                        <Row :gutter="16" v-show="isShowMoreShow">
                            <Col span="2" class="searchLable">执行状态</Col>
                            <Col span="5">
                                <Select v-model="exe_status" >
                                    <Option v-for="item in exeStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="2" class="searchLable">执行人</Col>
                            <Col span="5">
                                <Input clearable v-model="execution_name" placeholder="输入执行人"></Input>
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
                <div align="left">
                    <Button @click="aggregCase" type="success"  >聚合报告</Button>
                    <Button @click="deleteCase" type="error">删除结果</Button>
                    <!-- <Button @click="loadCase" type="error">负载测试</Button>
                    <Button @click="baseCase" type="error">基准测试</Button> -->
                </div>
                <div class="tableBox">
                    <Table border  ref="selection" :columns="columns" :data="tableData" class="myTable"  @on-row-dblclick="onRowDblClick" @on-selection-change="onSelectionChanged"></Table>
                    <div class="pageBox" v-if="tableData.length">
                        <Page :total="parseInt(totalCount)" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
                        <p>总共{{totalPage}}页</p>
                    </div>
                </div>
            </div>
            <!-- ========================================聚合报告===================================================== -->
            <Modal v-model="showAddModal" width="1100px">
                <p slot="header" style="color:#f60" >
                    <span>生成聚合报告预编译</span>
                </p>
                <div style="text-align:center;height:240px" >
                    <Form label-width="80">
                        <FormItem label="报告名称" align="left">
                            <Input placeholder="Enter something..." style="width:400px">{{task_name}}}</Input>
                        </FormItem>
                    </Form>
                    <div style="float:left;width:100px">
                        <Button color="#1c2438"  @click="">上移</Button><br/>
                        <Button color="#1c2438"  @click="">下移</Button>
                    </div>
                    <div style="float:left;width:900px">
                        <Form >
                            <FormItem label="场景名称" align="left" >
                                <Input placeholder="Enter something..." style="width:300px">{{senario_name}}</Input>
                            </FormItem>
                            <div v-show="isShowMore">
                                <FormItem label="执行结果" align="left" style="color:rgb(245, 4, 16)">
                                    执行是否成功：
                                    <Select style="width:80px">
                                        <Option>{{result_is_pass}}</Option>
                                    </Select>
                                    测试结果分析描述：
                                    <Input placeholder="Enter something..." style="width:400px">{{err_desc}}</Input>
                                </FormItem>
                                <FormItem label="报告显示内容" align="left" style="color:rgb(223, 73, 14)">
                                    显示性能数据表：
                                    <Select style="width:80px">
                                        <Option value="0">否</Option>
                                        <Option value="1">是</Option>
                                    </Select>
                                    显示性能曲线图：
                                    <Select style="width:80px">
                                        <Option value="0">否</Option>
                                        <Option value="1">是</Option>
                                    </Select>
                                    显示资源监控图：
                                    <Select style="width:80px">
                                        <Option value="0">否</Option>
                                        <Option value="1">是</Option>
                                    </Select>
                                    显示失败事务分析：
                                    <Select style="width:80px">
                                        <Option value="0">否</Option>
                                        <Option value="1">是</Option>
                                    </Select>
                                </FormItem>
                            </div>
                        </Form>
                    </div>
                    <div class="formValidateMoreBtnBox" :class="isShowMore ?'arrUp':'arrDown'" @click="isShowMore = !isShowMore">
                        <Icon type="chevron-down" color="#fff" ></Icon>
                        <Icon type="chevron-down" color="#fff" ></Icon>
                    </div>
                </div>
                <Table border  ref="index" :columns="columnss" :data="tableDatas" class="myTable"></Table>
                <div slot="footer">
                    <Button color="#1c2438"  @click="cancel">取消</Button>
                    <Button type="primary" @click="handleSubmit('addValidate')">生成报告</Button>
                </div>
            </Modal>
    </div>
</template>

<script>
export default {
	name: 'TestCase',
    data () {
        return {
            isShowMoreShow:false,               //是否显示更多查询条件
            isShowMore:false,               //是否显示更多查询条件  聚合报告
            srchCmploading: false,
            exeStatusList: this.$Global.exeStatusList,  
            result_is_pass:'',                  //执行是否通过
            err_desc:'',                        //测试结果分析描述
            showAddModal:false,                 //聚合窗口
            executor_id:'',                     //执行编号
            component_name:'',                  //物理子系统
            task_name:'',                       //关联任务
            senario_name:'',                    //场景名称
            type_name:'',                       //场景类型
            execution_name:'',                  //执行人
            exe_status:'',                      //执行状态
            start_time:'',                      //开始日期
            end_time:'',                        //结束日期
            //执行结果信息展示
            columns: [
            	{
                    title: '#',
                    type: 'index',
                    align: 'center',
                    width: 50,
                },
                {
                    type: 'selection',
                    width: 50,
                    align: 'center',
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
                    ellipsis: true, 
                },
                {
                    title: '关联任务',
                    key: 'task_name',
                    ellipsis: true, 
                },
                {
                    title: '场景名称',
                    key: 'senario_name',
                    ellipsis: true, 
                },
                {
                    title:'场景类型',
                    key:'type_name',
                    width:100,
                },
                {
                    title: '执行人',
                    key: 'execution_name',
                    width:90,
                },
                {
                    title: '执行状态',
                    key: 'exe_status',
                    width:100,
                    render:(h,params) =>{
                        let _this = this;
                        return h('span',_this.$Global.exeStatusMap[params.row.exe_status])
                    }
                },
                {
                    title: '开始日期',
                    key: 'start_time',
                    width:150,
                },
                {
                    title: '结束日期',
                    key: 'end_time',
                    width:150,
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
            //聚合报告信息展示
            columnss:[
                {
                    title: '序号',
                    type: 'index',
                    align: 'center',
                    width: 80
                },
                {
                    title: '测试需求描述',
                    key: 'name',
                    align: 'center',
                },
                {
                    title: '是否满足需求',
                    key: 'type',
                    align: 'center',
                },
                {
                    title: '备注描述',
                    key: 'age',
                    align: 'center',
                    ellipsis: true
                },
            ],
            tableDatas:[
                {
                    name:'json',
                    type:'1',
                    age:'11'
                }
            ],
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
                            this.$http.defaults.withCredentials = false;
                            this.$http.post("/myapi/testresult/del",{
                                header:{},
                                data:{
                                    ids:deleArr,
                                }
                            }).then(function(){
                                tableData.splice(index, 1);        //即删除该数据上
                                _this.$Message.info('删除成功');
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
        //页面展示
        listCase: function() {
            let _this = this;
            this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/testresult/list', {
                data: {
                    task_name:_this.task_name,
                    senario_name:_this.senario_name,
                    execution_name:_this.execution_name,
                    exe_status:_this.exe_status,
                    type_name:_this.type_name,
                    pageno:_this.pageNo,
                    pagesize:_this.pageSize,
                }
            }).then(function (response) {
                _this.tableData =  response.data.resultList;
                _this.totalCount = response.headers.totalcount;
                _this.totalPage = response.headers.totalpage;
                
            })
        },
        //聚合报告
        aggregCase:function(){
            let _this = this;
            let selectedData = this.selectedData;      //选中要聚合的数据
            let resArr = [];
            let deleteId = [];                       //选中数据的id
            if (selectedData.length > 0) {               //如果有选中的数据
                for (let i in selectedData) {         //进行遍历
                    //deleteId.push(selectedData[i].executor_id);  //将选中的而数据的id放入集合中
                    //this.$http.post('/myapi/testresult/mergeReport', {
                    //    data: {
                    //        executor_id:_this.selectedData[i].executor_id,
                    //    },
                    //}).then(function (response) {
                    //    _this.tableData =  response.data.resultList;                      
                    //}),
                    this.showAddModal = true;
                }
            } else {
                this.$Message.error("请选择要聚合的数据")
            }
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
            //console.log(data)
        },

        onRowDblClick: function(data) {
            console.log(data.executor_id);
            this.$router.push({path:'/details',query:{executor_id:data.executor_id}});
        },

        /**详情信息展示跳转 */
        detailCase:function(index){
            let _this = this;
            let tableData = _this.tableData;
            console.log("第一个页面传递的ID",tableData[index].executor_id);
            this.$router.push({
                path:'/details',
                query:{executor_id:tableData[index].executor_id}
            });
        },
        //负载测试
        loadCase:function(){
            let _this = this;
            let tableData = _this.tableData;
            this.$router.push({
                path:'/load',
                query:{}
            });
        },
        //基准测试
        baseCase:function(){
            let _this = this;
            let tableData = _this.tableData;
            this.$router.push({
                path:'/base',
                query:{}
            });
        },
           
        /**模态框弹出取消事件 */
        cancel:function () {
            this.showAddModal = false;
        },
        /**清除搜索条件 */
        handleReset:function (name) {
            console.log(this.$refs)
            this.$refs[name].listCase();
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

