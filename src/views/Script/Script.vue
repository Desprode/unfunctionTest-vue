<template>
	<div class="pageContent">
        <Card>
            <div class="caseBox">
                <h3 class="Title">
                    <span>脚本管理</span>
                </h3>
            
                <Form ref="formValidate"   class="formValidate">
                    <div class="rowbox">
                        <Row :gutter="16">
                            <Col span="2" class="searchLable">脚本名称:</Col>
                            <Col span="4">
                                <Input clearable v-model="script_name" placeholder="输入脚本名称"></Input>                                
                            </Col>
                            <Col span="2" class="searchLable">物理子系统:</Col>
                            <Col span="4">
                                <Input clearable v-model="app_name" placeholder="请输入物理子系统"></Input>
                            </Col>
                            <Col span="2" class="searchLable">创建者:</Col>
                            <Col span="4">
                                <Select  clearable v-model="creater" placeholder="请输入创建者" filterable remote 
                                        :remote-method="searchCreater" :loading="srchCmploading">
                                    <Option v-for="(option,index) in creater" :value="option.value" :key="index">{{ option.label }}</Option>
                                </Select>
                                 <!-- <Select
                                    clearable
                                    v-model="sComponent"
                                    placeholder="输入物理子系统中文名称或英文简称"
                                    filterable
                                    remote
                                    :remote-method="srchComponent"
                                    :loading="srchCmploading">
                                    <Option v-for="(option, index) in cmpOpts" :value="option.value" :key="index">{{option.label}}</Option>
                                </Select> -->
                            </Col>
                            <Col span="6">
                                <Button @click="listCase" type="primary" icon="ios-search">搜索</Button>
                                <Button @click="handleReset('formValidate')" type="default"  ghost>清除条件</Button>
                            </Col>
                        </Row>
                    </div>                    
                </Form>
                
                <div class="tableBox">
                    <div class="tableBtnBox">                       
                        <Button @click="addCase"  type="primary">新增</Button>
                        <Button @click="deleteCase" type="error">删除</Button>
                        <!-- <Button @click="" >编辑</Button>
                        <Button @click="" >参数化设置</Button>
                        <Button @click="" >下载</Button> -->
                    </div>
                    <Table border  ref="selection" :columns="columns" :data="tableData" class="myTable" @on-row-dblclick="onRowDblClick" @on-selection-change="onSelectionChanged"></Table>
                    <div class="pageBox" v-if="tableData.length">
                        <Page :total="tableDAtaTatol/tableDAtaPageLine > 1 ? (tableDAtaTatol%tableDAtaPageLine ? parseInt(tableDAtaTatol/tableDAtaPageLine)+1 : tableDAtaTatol/tableDAtaPageLine)*10 : 1" @on-change="handlePage"  show-elevator ></Page>
                        <p>总共{{tableDAtaTatol}}条记录</p>
                    </div>
                </div>
            </div>


            <!-- /* add by xin */ -->
            <!--新建任务时弹出的对话框-->
            <Modal v-model="Deletips" width="760" @on-ok="handleSubmit(addValidate)" @on-cancel="cancel()">
                <p slot="header" style="text-align:center" >
                    <Icon type="ios-information-circle"></Icon>
                    <span>添加脚本</span>
                </p>
                <div style="text-align:center">
                    <i-form ref="addValidate" :model="addValidate" :rules="ruleValidate" :label-width="100" label-position="left">
                        <Row>
                            <i-col span="24">
                                <Form-item label="脚本名称：" prop="script_name">
                                    <i-input v-model="addValidate.script_name"  placeholder="请输入脚本名称"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <!-- <Form-item label="物理子系统：" prop="taskName" >
                                    <i-input v-model="addValidate.app_name" placeholder="请输入物理子系统"></i-input>
                                </Form-item> -->
                                <Form-item label="物理子系统" prop="app_name">
                                    <i-select v-model="addValidate.app_name" placeholder="请选择物理子系统">
                                        <i-option value="card1">(N-CIS)贷记卡发卡</i-option>
                                        <i-option value="card2">(N-CIS)贷记卡发卡</i-option>
                                        <i-option value="card3">(N-CIS)贷记卡发卡</i-option>
                                    </i-select>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <Form-item label="脚本说明：" prop="desc">
                                    <i-input v-model="addValidate.desc" placeholder="请输入脚本说明"></i-input> 
                                </Form-item>
                            </i-col>                            
                        </Row>
                        <Row>
                            <i-col span="20">
                                <Form-item label="上传文件：" prop="script_filename">
                                    <i-input  v-model="addValidate.script_filename" placeholder="请选择上传文件(.zip格式)"></i-input>
                                </Form-item>                                
                            </i-col>        
                            <i-col span=4 >
                                <Upload action="//jsonplaceholder.typicode.com/posts/" 
                                        :before-upload="handleUpload" 
                                        :format="['zip']" 
                                        :on-format-error="handleFormatError"
                                        v-model="addValidate.script_filename">
                                    <Button icon="ios-cloud-upload-outline">上传文件</Button>
                                </Upload>
                            </i-col>                  
                        </Row>
                    </i-form>
                </div>
                <!-- <div slot="footer">
                    <Button color="#1c2438" @click="handleSubmit('addValidate')">确认</Button>
                    <Button type="primary" @click="cancel()">取消</Button>
                </div> -->
            </Modal>
        </Card>
    </div>
</template>

<script>
export default {
	name: 'TestCase',
    data () {
        return {
            // isShowMoreShow:false,
            srchCmploading: false,
            cmpOpts: [],
            list: [], 
            sTaskStatus:'',
            taskStatusList: this.$Global.taskStatusList,  
            interfaceId:'',
            sTaskName:'',
            script_name:'',
            app_name:'',
            creater:'',
            startTime:'',
            endTime:'',
            createUser:'',
            pageNo:'',
            columns: [
                {
                    title: '#',
                    type: 'index',
                    align: 'center',
                    width: 60
                },
            	{
                    type: 'selection',
                    width: 40,
                    align: 'center'
                },
                {
                    title: '脚本名称',
                    key: 'script_name',
                    width: 220,
                    sortable: true
                    // ellipsis: true, 
                    //tooltip: true, 
                },
                {
                    title: '物理子系统',
                    width: 250,
                    key: 'app_name'
                },
                {
                    title: '脚本文件',
                    key: 'script_filename',
                    width: 205,
                },
                {
                    title: '创建者',
                    key: 'script_manager_name',
                    width: 80,                    
                },
                {
                    title: '创建时间',
                    key: 'created_time',
                    width: 160,
                    align: 'center',
                    sortable: true
                },
                {
                    title: '操作',
                    key: 'opration',
                    width:100,
                    render: (h, params) => {
                        return h('div', [
                        h('Icon', {
                                    props: {
                                        type: 'edit'
                                    },
                                    style: {
                                        fontSize: '20px',
                                        color:'#559DF9'
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
                                    }) ,                       
                        
                        h('Icon', {
                                        props: {
                                            type: 'settings',
                                        },
                                        style: {
                                            fontSize: '20px', // 改变icon的样式
                                            color: '#559DF9'
                                        },
                                        on: {
                                            click: () => {
                                                console.log("场景化设置")
                                            }
                                        }
                                    }),
                        h('Icon',{
                            props:{
                                type: 'ios-download',
                            },
                            style: {
                                fontSize: '20px',
                                color:'559DF9'                                
                            },
                            on: {
                                click: () =>{
                                    console.log('下载')
                                }
                            }
                        })
                        ])
                    }
                }
            ],
            tableData: [],
            tableDAtaTatol:0,
            tableDAtaPageLine:0,
            selectedData:[],

            /* add by xin */
            Deletips:false, 
            formValidate: {

            },
            addValidate: {
                    script_name: '',
                    app_name: '',
                    desc: '',
                    script_filename: '',
                },
            ruleValidate: {
                script_name: [
                    { required: true, message: '此项为必填项', trigger: 'blur' }
                ],
                app_name: [
                    { required: true, message: '此项为必填项', trigger: 'change' }
                ],
                desc: [
                    { required: true, type: 'date', message: '此项为必填项', trigger: 'change' }
                ],
                script_filename: [
                    { required: true, type: 'date', message: '此项为必填项', trigger: 'change' }
                ]
            },
        }
    },
    created(){
        this.listCase();
    },
    methods: {
        handleFormatError:function(file){
            // this.$Notice.warning({
            //     title: '文件格式不正确',
            //     desc: file.name + '文件格式不正确,请上传zip格式的文件!'
            // });
            this.$Message.error(file.name + '文件格式不正确,请上传zip格式的文件!');

        },
        handleUpload:function(file){
            //var reg = /[~!@#$%^&*()/\|,<>?"'();:+-=\[\]{}]/;
            // var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
            //     regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
            // console.log(file.name)
            // console.log(regEn.test(file.name))
            // console.log(regCn.test(file.name))
            
            // if(regEn.test(file.name) || regCn.test(file.name)){
            //    this.$Message.error(file.name+"包含特殊字符,请检查后在上传!"); 
            // }
            // return false;
        },
        searchCreater: function(query) {
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
                    this.$http.post('/myapi/component/search', 
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

        /* add by xin */
        /*删除按钮功能*/
        deleteCase: function() {
            console.log("删除多条按钮");
            let selectedData=this.selectedData;      //选中要删除的数据
            let resArr = [];                         
            let deleteId = [];                       //选中数据的id
            if(selectedData.length>0){               //如果有选中的数据
                for(let i in selectedData){         //进行遍历
                    deleteId.push(selectedData[i].id);  //将选中的而数据的id放入要删除的集合中
                   
                    console.log(deleteId);
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

        listCase: function() {
            let _this = this;
            // console.log('listPerfTask');
            this.$http.defaults.withCredentials = false;
            console.log('111执行展示列表...');
            this.$http.post('/myapi/scripts/list', {
                header: {
                    // txCode:'listCase',
                    // sysTransId:'20181010153628000165432',
                    // projectId:'1001',
                    // projectName:'res',
                    //reqTime:'153628001',
                    // userId:'admin',
                },
                data: {
                    script_name: _this.script_name,
                    app_name:_this.app_name,
                    //  creater:_this.creator,
                    pageNo: _this.pageNo==''?1:_this.pageNo,
                    pageSize: 15                    
                }
            }).then(function (response) {
                console.log('response:');
                console.log(response);
                console.log('response.data: ', response.data);
                _this.tableData = response.data.resultList;
                _this.tableDAtaTatol = response.data.pagination.totalCount;
                _this.tableDAtaPageLine = response.data.pagination.pageSize
            })
        },
        handlePage:function(value){
            let _this = this;
            _this.pageNo = value;
            console.log(value);
            _this.listCase();
        },

        findCase: function(id) {
            let _this = this
            console.log('findCase')
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
                console.log('response')
                console.log(response.data.data)
            })
        },
        
        setCiFlag: function() {
            let _this = this
            let ids = []
            this.selectedData.forEach(e => {
                ids.push(e.id)
            });
            console.log('setCiFlag')
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
            console.log(data)
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
            console.log("显示模态框");
        },
        /**点击保存之后的事件 */
        handleSave(row){
            console.log("这是保存",row)
        },
        /**点击编辑之后的事件 */
        handleEdit(row){
            console.log("这是编辑",row)
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
            this.$Message.info('您取消了添加脚本!');
            this.Deletips = false;
        },
        /**清除搜索条件 */
        handleReset (name) {
            let _this = this;
            _this.app_name='';
            _this.script_name='';
            // console.log(this.$refs[name])
            // this.$refs[name].resetFields()
            //this.$emit('on-reset')
            //this.script_name='';
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
.ivu-table-cell {
    padding-left: 4px;
    padding-right: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    box-sizing: border-box;
}
</style>
