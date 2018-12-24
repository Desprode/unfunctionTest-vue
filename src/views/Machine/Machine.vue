<template>
	<div class="pageContent">
        <Card>
            <div class="caseBox">
                <h3 class="Title">
                    <span>机器管理</span>
                </h3>
                <Form ref="formValidate"   class="formValidate">
                    <div class="rowbox">
                        <Row :gutter="16">
                            <Col span="2" class="searchLable">机器名称:</Col>
                            <Col span="4">
                                <Input clearable v-model="machineName" placeholder="输入机器名称"></Input>                                
                            </Col>
                            <Col span="2" class="searchLable">IP:</Col>
                            <Col span="4">
                                <Input clearable v-model="ip" placeholder="请输入IP"></Input>
                            </Col>
                            <Col span="2" class="searchLable">机器状态:</Col>
                            <Col span="4">
                                <Input clearable v-model="state" placeholder="请输入机器状态"></Input>
                            </Col>
                            <Col span="6">
                                <Button @click="listCase" type="primary" icon="ios-search">查询</Button>
                                <Button @click="handleReset('formValidate')" type="default"  ghost>重置</Button>
                            </Col>
                        </Row>
                    </div>                    
                </Form>
                <div class="tableBox">
                    <div class="tableBtnBox">                       
                        <Button @click="addMachine"  type="primary">新增</Button>
                        <Button @click="deleteMachine" type="error">删除</Button>
                    </div>
                    <Table border  ref="selection" :columns="columns" :data="tableData" class="myTable" @on-selection-change="onSelectionChanged"></Table>
                    <div class="pageBox" v-if="tableData.length">
                        <Page :total="tableDataTotal/tableDataPageLine > 1 ? (tableDataTotal%tableDataPageLine ? parseInt(tableDataTotal/tableDataPageLine)+1 : tableDataTotal/tableDataPageLine)*10 : 1" @on-change="handlePage"  show-elevator ></Page>
                        <p>总共{{tableDataTotal}}条记录</p>
                    </div>
                </div>
            </div>
            <!--新建机器时弹出的对话框begin-->
            <Modal v-model="Deletips" width="800" >
                <p slot="header" style="text-align:center" >
                    <Icon type="ios-information-circle"></Icon>
                    <span>添加机器</span>
                </p>
                <div style="text-align:center">
                    <i-form ref="addValidate" :model="addValidate" :rules="ruleValidate" :label-width="100" label-position="left">
                        <Row>
                            <i-col span="24">
                                <Form-item label="机器名称：" prop="machineName">
                                    <i-input v-model="addValidate.machineName"  placeholder="请输入机器名称"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <Form-item label="IP：" prop="ip">
                                    <i-input v-model="addValidate.ip"  placeholder="请输入IP"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <Form-item label="CPU：" >
                                    <i-input v-model="addValidate.cpu"  placeholder="请输入CPU"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <Form-item label="内存：" prop="mem">
                                    <i-input v-model="addValidate.mem"  placeholder="请输入内存"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <Form-item label="用户名：" prop="userName">
                                    <i-input v-model="addValidate.userName"  placeholder="请输入用户名"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <Form-item label="密码：" prop="userPwd">
                                    <i-input v-model="addValidate.userPwd"  placeholder="请输入密码" type="password"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <FormItem label="类型:" prop="type">
                                    <Select v-model="addValidate.type" placeholder="请输入类型" clearable>
                                        <Option value="1">http</Option>
                                        <Option value="2">tuxedo</Option>
                                        <Option value="3">java</Option>                      
                                    </Select>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <FormItem label="操作系统:" prop="osVersion">
                                    <Select v-model="addValidate.osVersion" placeholder="请输入类型" clearable>
                                        <Option value="Linux">Linux</Option>
                                        <Option value="Windows">Windows</Option>
                                        <Option value="AIX">AIX</Option>                      
                                    </Select>
                                </FormItem>
                            </i-col>
                        </Row>
                        
                    </i-form>
                </div>
                <div slot="footer">
                    <Button color="#1c2438"  @click="cancel()">取消</Button>
                    <Button type="primary"   @click="handleSubmit('addValidate')">确认</Button>
                </div>
            </Modal>
            <!--新建机器时弹出的对话框end-->
            <!--编辑机器时弹出的对话框begin-->
            <Modal v-model="editMachineStatus" width="800" >
                <p slot="header" style="text-align:center" >
                    <Icon type="ios-information-circle"></Icon>
                    <span>编辑机器</span>
                </p>
                <div style="text-align:center">
                    <i-form ref="addValidate" :model="addValidate" :rules="ruleValidate" :label-width="100" label-position="left">
                        <Row>
                            <i-col span="24">
                                <Form-item label="机器名称：" prop="machineName">
                                    <i-input v-model="addValidate.machineName"  placeholder="请输入机器名称"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <Form-item label="IP：" prop="ip">
                                    <i-input v-model="addValidate.ip"  placeholder="请输入IP"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <Form-item label="CPU：" >
                                    <i-input v-model="addValidate.cpu"  placeholder="请输入CPU"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <Form-item label="内存：" prop="mem">
                                    <i-input v-model="addValidate.mem"  placeholder="请输入内存"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <Form-item label="用户名：" prop="userName">
                                    <i-input v-model="addValidate.userName"  placeholder="请输入用户名"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <Form-item label="密码：" prop="userPwd">
                                    <i-input v-model="addValidate.userPwd"  placeholder="请输入密码" type="password"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <FormItem label="类型:" prop="type">
                                    <Select v-model="addValidate.type" placeholder="请输入类型" clearable>
                                        <Option value="1">http</Option>
                                        <Option value="2">tuxedo</Option>
                                        <Option value="3">java</Option>                      
                                    </Select>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <FormItem label="操作系统:" prop="osVersion">
                                    <Select v-model="addValidate.osVersion" placeholder="请输入类型" clearable>
                                        <Option value="Linux">Linux</Option>
                                        <Option value="Windows">Windows</Option>
                                        <Option value="AIX">AIX</Option>                      
                                    </Select>
                                </FormItem>
                            </i-col>
                        </Row>
                        
                    </i-form>
                </div>
                <div slot="footer">
                    <Button color="#1c2438"  @click="cancel()">取消</Button>
                    <Button type="primary"   @click="handleEdit('addValidate')">确认</Button>
                </div>
            </Modal>
            <!--编辑机器时弹出的对话框end-->
        </Card>
    </div>
</template>

<script>
export default {
	name: 'TestCase',
    data () {
        return {
            rowid:'',
            srchCmploading: false,
            cmpOpts: [],
            list: [], 
            sTaskStatus:'',
            machineTypeStatus: this.$Global.machineTypeStatus,
            machineOS:this.$Global.machineOS,  
            interfaceId:'',
            sTaskName:'',
            machineName:'',
            ip:'',
            state:'',//机器状态
            creater:'',
            param:'',
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
                    width: 50,
                    align: 'center'
                },
                {
                    title: '机器名称',
                    key: 'machineName',
                    width: 120,
                },
                {
                    title: 'IP',
                    width: 120,
                    key: 'ip'
                },
                {
                    title: 'CPU',
                    key: 'cpu',
                    width: 70,
                },
                {
                    title: '内存',
                    key: 'mem',
                    width: 70,                    
                },
                {
                    title: '机器状态',
                    key: 'state',
                    width: 100,                    
                },
                {
                    title: '类型',
                    key: 'type',
                    width: 80, 
                    render : (h, params)=>{
                        let _this = this
                        //console.log('params:', params);
                        return h('span', _this.$Global.machineTypeStatus[params.row.type]);
                    }                   
                },
                {
                    title: '操作系统',
                    key: 'osVersion',
                    width: 100,                    
                },
                {
                    title: '执行开始时间',
                    key: 'lastUpdateTime',
                    width: 160,
                    align: 'center',
                    sortable: true
                },
                {
                    title: '启用时间',
                    key: 'createTime',
                    width: 160,
                    align: 'center',
                    sortable: true
                },
                {
                    title: '操作',
                    key: 'opration',
                    width:220,
                    render: (h, item) => {
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
                                    this.deployMachine(item.row.ip,item.row.userName,item.row.userPwd);   
                                }
                            }
                        },'部署'),
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
                                    this.editMachineStatus = true;                                    
                                    console.log(item.row);
                                    let _this = this;
                                    // this.$http.defaults.withCredentials = false;
                                    this.$http.post('/myapi/machine/view',{
                                        data:{
                                            id:item.row.id,
                                        }
                                    }).then(function(response){
                                        console.log("machine编辑接口",response.data);
                                        _this.addValidate.machineName= response.data.resultList[0].machineName;
                                        _this.addValidate.ip= response.data.resultList[0].ip;
                                        _this.addValidate.cpu= response.data.resultList[0].cpu;
                                        _this.addValidate.mem= response.data.resultList[0].mem;
                                        _this.addValidate.userName= response.data.resultList[0].userName;
                                        _this.addValidate.userPwd= response.data.resultList[0].userPwd;
                                        _this.addValidate.state= response.data.resultList[0].state;
                                        _this.addValidate.type= response.data.resultList[0].type;
                                        _this.addValidate.osVersion= response.data.resultList[0].osVersion;
                                        // _this.filesize=response.data.resultList[0].filesize,
                                        // _this.script_filepath=response.data.resultList[0].script_filepath,
                                        // _this.script_id=response.data.resultList[0].script_id,
                                        _this.rowid=response.data.resultList[0].id
                                    })
                                }
                            }
                        },'编辑'),
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
                                    this.restartMachine(item.row.id,item.row.ip,item.row.userName,item.row.userPwd); 
                                }
                            }
                        },'重启'),
                        h('Button', {
                            props: {
                                type: 'default',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    //console.log("文档")
                                    this.stopMachine(item.row.id,item.row.ip,item.row.userName,item.row.userPwd); 
                                }
                            }
                        }, '停止')
                        ])
                    }
                }
            ],
            tableData: [],
            tableDataTotal:0,
            tableDataPageLine:0,
            selectedData:[],
            Deletips:false, 
            editMachineStatus:false,
            formValidate: {

            },
            addValidate: {
                    machineName: '',
                    ip: '',
                    cpu:'',
                    mem:'',
                    userName:'',
                    userPwd:'',
                    type:'',
                    osVersion:''
                },
            ruleValidate: {
                machineName: [
                    { required: true, message: '此项为必填项', trigger: 'blur' }
                ],
                ip: [
                    { required: true, message: '此项为必填项', trigger: 'change' }
                ],
                userName: [
                    { required: true, message: '此项为必填项', trigger: 'blur' }
                ],
                userPwd: [
                    { required: true, message: '此项为必填项', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '此项为必填项', trigger: 'change' }
                ],
                osVersion: [
                    { required: true, message: '此项为必填项', trigger: 'change' }
                ]
            },
        }
    },
    created(){
        this.listCase();
    },
    methods: {
        //deploy  the machine  begin
        deployMachine (ip,userName,userPwd) {
            let _this = this;
            _this.$Spin.show({
                    render: (h) => {
                        return h('div', [
                            h('Icon', {
                                'class': 'demo-spin-icon-load',
                                props: {
                                    type: 'load-c',
                                    size: 18
                                }
                            }),
                            h('div', '机器'+ip+'部署中...')
                        ])
                    }
                });
            this.$http.post('/myapi/machine/exe',{
                data:{
                    ip:ip,
                    userName:userName,
                    userPwd:userPwd
                }
            }).then(function(response){
                _this.$Spin.hide();
                if(response.status == 500){
                    _this.$Message.error('服务端错误!');
                }else{
                    if("ok" == response.data.result){
                        _this.$Message.success(ip+'部署成功！');
                    }else{
                        _this.$Message.error(ip+'部署失败,'+response.data.err_desc);
                    }
                    _this.listCase();
                }
            }).catch(function(response){
                _this.$Spin.hide();
            })
        },  
        //restart the machine 
        restartMachine (id,ip,userName,userPwd) {
            let _this = this;
            _this.$Spin.show({
                    render: (h) => {
                        return h('div', [
                            h('Icon', {
                                'class': 'demo-spin-icon-load',
                                props: {
                                    type: 'load-c',
                                    size: 18
                                }
                            }),
                            h('div', '机器'+ip+'重启中...')
                        ])
                    }
                });
            this.$http.post('/myapi/machine/resetAgent',{
                data:{
                    id:id,
                    ip:ip,
                    userName:userName,
                    userPwd:userPwd
                }
            }).then(function(response){
                _this.$Spin.hide();
                if(response.status == 500){
                    _this.$Message.error('服务端错误!');
                }else{
                    if("ok" == response.data.result){
                        _this.$Message.success(ip+'重启成功！');
                    }else{
                        _this.$Message.error(ip+'重启失败,'+response.data.err_desc);
                    }
                    _this.listCase();
                    
                }
            }).catch(function(response){
                _this.$Spin.hide();
            })
        },  
        // stop the machine begin
        stopMachine (id,ip,userName,userPwd) {
            let _this = this;
            _this.$Spin.show({
                    render: (h) => {
                        return h('div', [
                            h('Icon', {
                                'class': 'demo-spin-icon-load',
                                props: {
                                    type: 'load-c',
                                    size: 18
                                }
                            }),
                            h('div', '机器'+ip+'停止中...')
                        ])
                    }
                });
            this.$http.post('/myapi/machine/stopAgent',{
                data:{
                    id:id,
                    ip:ip,
                    userName:userName,
                    userPwd:userPwd
                }
            }).then(function(response){
                _this.$Spin.hide();
                if(response.status == 500){
                    _this.$Message.error('服务端错误!');
                }else{
                    if("ok" == response.data.result){
                        _this.$Message.success(ip+'停止成功！');
                    }else{
                        _this.$Message.error(ip+'停止失败,'+response.data.err_desc);
                    }
                    _this.listCase();
                }
            }).catch(function(response){
                _this.$Spin.hide();
            })
        },  
        // stop the machine end
        /*删除按钮功能*/
        deleteMachine: function() {
            console.log("删除多条按钮");
            let selectedData=this.selectedData;      //选中要删除的数据
            let resArr = [];                         
            let deleteId = [];                       //选中数据的id
            if(selectedData.length>0){               //如果有选中的数据
                for(let i in selectedData){         //进行遍历
                    deleteId.push(selectedData[i].id);  //将选中的而数据的id放入要删除的集合中
                    // console.log(deleteId);
                    this.deleteData(deleteId);            //调用删除数据的方法，将tableData中的数据删除
                } 
            }else{
                this.$Message.error("请选择要删除的数据")
            }
        }, 
        deleteData(deleArr){                //调用方法将原有数据中对应的id删除
            console.log("删除后台数据内容",deleArr)
            let _this = this;
            let tableData = _this.tableData;          //原有的数据
            tableData.forEach((item, index) => {      //对原有的数据进行遍历
                if (deleArr.includes(item.id)) {       //当原有的数据与要删除的数据中有相同的数据时，
                    _this.$Modal.confirm({
                        title:'确认',
                        content: '是否删除该数据',
                        onOk: () => {
                            // this.$http.defaults.withCredentials = false;
                            this.$http.post("/myapi/machine/delete",{
                                header:{},
                                data:{
                                    ids:deleArr,
                                }
                            }).then(function(response){
                                if(response.status == 500){
                                    _this.$Message.error('服务端错误!');
                                }else{
                                    if(response.data.result == "fail"){
                                        _this.$Message.error('删除失败!'+response.data.err_desc);    
                                    }else{
                                        tableData.splice(index, 1);        //即删除该数据上
                                        _this.$Message.info('删除成功');    
                                    }
                                }
                            })
                        },
                        onCancel: () => {
                            _this.$Message.info('删除失败');
                        }
                    }); 
                   
                }
            });
        },
        listCase: function() {
            let _this = this;
            // this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/machine/list', {
                header: {
                },
                data: {
                    machineName: _this.machineName,
                    ip:_this.ip,
                    state:_this.state,
                    pageNo: _this.pageNo==''?1:_this.pageNo,
                    pageSize: 15                    
                }
            }).then(function (response) {
                if(response.status == 500){
                    _this.$Message.error('服务端错误!');
                }else{
                    console.log('response.data: ', response.data);
                    _this.tableData = response.data.resultList;
                    _this.tableDataTotal = response.data.pagination.totalCount;
                    _this.tableDataPageLine = response.data.pagination.pageSize 
                }
            })
        },
        handlePage:function(value){
            let _this = this;
            _this.pageNo = value;
            console.log(value);
            _this.listCase();
        },
        /**添加新数据弹出模态框 */
        addMachine:function(){
            this.Deletips = true;
            console.log("显示模态框");
        },
        onSelectionChanged: function(data) {
            this.selectedData = data;
            console.log(data)
        },
        setParam:function(){
            this.paramStatus = true;
            console.log("参数化设置!");
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
            let _this = this;
            console.log(this.addValidate);
            //提交添加请求
            this.$refs[name].validate((valid) => {
                if (valid) {
                    console.log("开始添加");
                    // this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/machine/add',{
                        data:{
                            machineName: _this.addValidate.machineName,
                            ip: _this.addValidate.ip,
                            cpu:_this.addValidate.cpu,
                            mem:_this.addValidate.mem,
                            userName:_this.addValidate.userName,
                            userPwd:_this.addValidate.userPwd,
                            type:_this.addValidate.type,
                            osVersion:_this.addValidate.osVersion
                        }
                    }).then(function(response){
                        if(response.status == 500){
                            _this.$Message.error('服务端错误!');
                        }else{
                            if("ok" == response.data.result){
                                _this.$Message.success('添加成功！');
                            }else{
                                _this.$Message.error('添加失败'+response.data.err_desc);
                            }
                            _this.Deletips = false;
                            _this.$refs[name].resetFields();
                        }
                    })
                } else {
                    _this.$Message.error('表单验证失败!');
                }
            });
        },  
        /***edit the amchine details */
        handleEdit (name) {
            let _this = this;
            console.log(this.addValidate);
            //提交添加请求
            this.$refs[name].validate((valid) => {
                if (valid) {
                    console.log("begin edit");
                    // this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/machine/edit',{
                        data:{
                            id:_this.rowid,
                            machineName: _this.addValidate.machineName,
                            ip: _this.addValidate.ip,
                            cpu:_this.addValidate.cpu,
                            mem:_this.addValidate.mem,
                            userName:_this.addValidate.userName,
                            userPwd:_this.addValidate.userPwd,
                            type:_this.addValidate.type,
                            osVersion:_this.addValidate.osVersion
                        }
                    }).then(function(response){
                        if(response.status == 500){
                            _this.$Message.error('服务端错误!');
                        }else{
                            if("ok" == response.data.result){
                                _this.$Message.success('编辑成功！');
                            }else{
                                _this.$Message.error('编辑失败'+response.data.err_desc);
                            }
                            _this.editMachineStatus = false;
                            _this.$refs[name].resetFields();
                        }
                    })
                } else {
                    _this.$Message.error('表单验证失败!');
                }
            });
        },       
        /**模态框弹出取消事件 */
        cancel () {
            // this.$Message.info('您取消了添加机器!');
            this.Deletips = false;
            this.editMachineStatus=false;
        },
        /**清除搜索条件 */
        handleReset (name) {
            let _this = this;
            _this.ip='';
            _this.machineName='';
            _this.creater='';
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
.demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
</style>
