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
                            <Col span="2" class="searchLable">创建人:</Col>
                            <Col span="4">
                                <Select  clearable v-model="creater" placeholder="请输入创建人" filterable remote 
                                        :remote-method="searchCreater" :loading="srchCmploading">
                                    <Option v-for="(option,index) in cmpOpts" :value="option.value" :key="index">{{ option.label }}</Option>
                                </Select>
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
                        <Button @click="addScript"  type="primary">新增</Button>
                        <Button @click="deleteScript" type="error">删除</Button>
                    </div>
                    <Table border  ref="selection" :columns="columns" :data="tableData" class="myTable" @on-row-dblclick="onRowDblClick" @on-selection-change="onSelectionChanged"></Table>
                    <div class="pageBox" v-if="tableData.length">
                        <Page :total="tableDataTotal/tableDataPageLine > 1 ? (tableDataTotal%tableDataPageLine ? parseInt(tableDataTotal/tableDataPageLine)+1 : tableDataTotal/tableDataPageLine)*10 : 1" @on-change="handlePage"  show-elevator ></Page>
                        <p>总共{{tableDataTotal}}条记录</p>
                    </div>
                </div>
            </div>
            <!-- 参数化设置对话框 -->
            <Modal v-model="showParamStatus" width="800" >
                <p slot="header" style="color:rgba(184, 124, 13, 0.637)" >
                    <span>参数化文件设置</span>
                </p>
                <div style="text-align:center">
                    <i-form ref="paramValidate" :model="paramValidate" :rules="paramValidate" :label-width="100" label-position="left">
                        <h3>请勾选可以拆分的参数化文件：</h3>
                        <Row v-for="(item,index) in csvList" :key="index">
                            <Col span="24">
                                <FormItem :label-width="10" prop="fileName">
                                    <Checkbox v-model="item.enable == 'true'?true:false" @on-change="isChecked(index)">{{item.fileName}}</Checkbox>  
                                </FormItem>
                            </Col>
                        </Row>
                    </i-form>
                </div>
                <div slot="footer">
                        <Button color="#1c2438"  @click="cancelParamWin()">取消</Button>
                        <Button type="primary" @click="handleParamSubmit('paramValidate')">确认</Button>
                </div>
            </Modal>
            <!--新建脚本时弹出的对话框begin-->
            <Modal v-model="showDialog" width="800" >
                <p slot="header" style="text-align:center" >
                    <Icon type="ios-information-circle"></Icon>
                    <span>添加脚本</span>
                </p>
                <div style="text-align:center">
                    <i-form ref="addValidate" :model="addValidate" :rules="ruleValidate" :label-width="100" label-position="left">
                        <Row>
                            <i-col span="24">
                                <Form-item label="脚本名称：" prop="script_name">
                                    <i-input v-model="addValidate.script_name"  placeholder="请输入脚本名称" on-blur="checkScriptName();"></i-input>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <Form-item label="物理子系统" >
                                    <Select  clearable v-model="addValidate.app_name" placeholder="请选择物理子系统" 
                                        clearable
                                        filterable 
                                        remote 
                                        :remote-method="searchAppname" 
                                        :loading="srchCmploading"
                                        :transfer=false
                                        >
                                        <Option v-for="(option,index) in appNameOpts" :value="option.label" :key="index" @click.native="setMoreCmpParams(option)">{{ option.label }}</Option>
                                    </Select>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <Form-item label="脚本说明：" prop="memo">
                                    <i-input v-model="addValidate.memo" placeholder="请输入脚本说明"></i-input> 
                                </Form-item>
                            </i-col>                            
                        </Row>
                        <Row>
                            <i-col span="20">
                                <Form-item label="上传文件：" prop="script_filename">
                                    <i-input  v-model="addValidate.script_filename" placeholder="请选择上传文件(.zip格式)" aria-readonly="true"></i-input>
                                </Form-item>                                
                            </i-col>        
                            <i-col span=4 >
                                <Upload ref="upload"
                                        name="file"
                                        action="/myapi/scripts/upload" 
                                        :before-upload="handleUpload" 
                                        :format="['zip']" 
                                        :on-success="uploadSuccess"
                                        :on-format-error="handleFormatError"
                                        v-model="addValidate.script_filename">
                                    <Button icon="ios-cloud-upload-outline">上传文件</Button>
                                </Upload>
                            </i-col>                  
                        </Row>
                    </i-form>
                </div>
                <div slot="footer">
                    <Button color="#1c2438"  @click="cancelAdd()">取消</Button>
                    <Button type="primary"   @click="submitScript('addValidate')">确认</Button>
                </div>
            </Modal>
            <!--新建脚本时弹出的对话框end-->
            <!--script edit editeditediteditediteditbegin-->
            <Modal v-model="showSetScript" width="800">
                <p slot="header" style="color:#f60" >
                    <span>编辑脚本</span>
                </p>
                <Form ref="setValidate" :model="setValidate" :rules="setRuleValidate" :label-width="120">
                    <!-- <FormItem label="脚本ID:" prop="script_id" >                      
                        <Input v-model="setValidate.script_id"></Input>
                    </FormItem> -->
                    <FormItem label="脚本名称:" prop="script_name">                      
                        <Input v-model="setValidate.script_name"></Input>
                    </FormItem>
                    <FormItem label="物理子系统:" prop="app_name">                      
                        <Input v-model="setValidate.app_name" readonly="readonly"></Input>
                    </FormItem>
                    <FormItem label="脚本说明:" prop="memo">                      
                        <Input v-model="setValidate.memo"></Input>
                    </FormItem>
                    <FormItem label="创建时间:" prop="create_time">                      
                        <Input v-model="setValidate.create_time" readonly="readonly"></Input>
                    </FormItem>
                    <i-col span="20">
                        <Form-item label="更新脚本：" prop="script_filename">
                            <i-input  v-model="setValidate.script_filename" placeholder="请选择上传文件(.zip格式)" aria-readonly="true"></i-input>
                        </Form-item>                                
                    </i-col>        
                    <i-col span=4 >
                        <Upload ref="upload"
                                name="file"
                                action="/myapi/scripts/upload" 
                                :before-upload="handleUpload" 
                                :format="['zip']" 
                                :on-success="uploadSuccess"
                                :on-format-error="handleFormatError"
                                v-model="setValidate.script_filename">
                            <Button icon="ios-cloud-upload-outline">上传文件</Button>
                        </Upload>
                    </i-col> 
                </Form>
                <div slot="footer">
                    <Button color="#1c2438" @click="setCancel()">取消</Button>
                    <Button type="primary" @click="editSubmitScript('setValidate')">确认</Button>
                </div>
            </Modal>
            <!--script edit end-->
            <!--script detail detail detail detail begin-->
            <Modal v-model="showSetScript" width="800">
                <p slot="header" style="color:#f60" >
                    <span>脚本详情</span>
                </p>
                <Form ref="setValidate" :model="setValidate" :rules="setRuleValidate" :label-width="120">
                    <FormItem label="脚本ID:" prop="script_id" >                      
                        <Input v-model="setValidate.script_id"></Input>
                    </FormItem>
                    <FormItem label="脚本名称:" prop="script_name">                      
                        <Input v-model="setValidate.script_name"></Input>
                    </FormItem>
                    <FormItem label="脚本大小:" prop="filesize">                      
                        <Input v-model="setValidate.filesize"></Input>
                    </FormItem>
                    <FormItem label="物理子系统:" prop="app_name">                      
                        <Input v-model="setValidate.app_name"></Input>
                    </FormItem>
                    <FormItem label="脚本说明:" prop="memo">                      
                        <Input v-model="setValidate.memo"></Input>
                    </FormItem>
                    <FormItem label="创建时间:" prop="create_time">                      
                        <Input v-model="setValidate.create_time"></Input>
                    </FormItem>
                    <FormItem label="更新时间:" prop="update_time">                      
                        <Input v-model="setValidate.update_time"></Input>
                    </FormItem>
                    <FormItem label="创建人:" prop="script_manager_id">                      
                        <Input v-model="setValidate.script_manager_id"></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button color="#1c2438" @click="setCancel()">取消</Button>
                    <!-- <Button type="primary" @click="editSubmitScript('setValidate')">确认</Button> -->
                </div>
            </Modal>
            <!--script detail end-->

        </Card>
    </div>
</template>

<script>
export default {
	name: 'TestCase',
    data () {
        return {
            /* 窗口设置开关 */
            showParamStatus:false,
            showDialog:false,
            showDetail:false,
            showSetScript:false,

            srchCmploading: false,
            cmpOpts: [],
            appNameOpts: [],
            list: [], 
            sTaskStatus:'',
            taskStatusList: this.$Global.taskStatusList,  
            interfaceId:'',
            sTaskName:'',
            script_name:'',

            ITM_id:'',
            cloud_id:'',
            //脚本信息
            script_filename:'',
            script_filepath:'',
            script_id:'',
            filesize:'',
            rowid:'',
            csvinfo:{},
            csvList:[],

            app_name:'',
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
                    title: '创建人',
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
                    width:250,
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
                                        this.showSetScript = true;
                                        console.log(item.row);
                                        let _this = this;
                                        this.$http.defaults.withCredentials = false;
                                        this.$http.post('/myapi/scripts/checkEdit',{
                                            data:{
                                                id:item.row.id,
                                            }
                                        }).then(function(response){
                                            console.log("script编辑接口",response.data);
                                            _this.setValidate.script_name= response.data.resultList[0].script_name;
                                            _this.setValidate.script_id= response.data.resultList[0].script_id;
                                            _this.setValidate.app_name= response.data.resultList[0].app_name;
                                            _this.setValidate.memo= response.data.resultList[0].memo;
                                            _this.setValidate.create_time= response.data.resultList[0].created_time;
                                            _this.setValidate.script_filename= response.data.resultList[0].script_filename;
                                            _this.filesize=response.data.resultList[0].filesize,
                                            _this.script_filepath=response.data.resultList[0].script_filepath,
                                            _this.script_id=response.data.resultList[0].script_id,
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
                                        this.showParamStatus = true;
                                        console.log(item.row);
                                        let _this = this;
                                        this.$http.defaults.withCredentials = false;
                                        this.$http.post('/myapi/scripts/param',{
                                            data:{
                                                id:item.row.id,
                                            }
                                        }).then(function(response){
                                            console.log("script编辑接口response.data",response.data);
                                            _this.rowid=response.data.executor_id;
                                            _this.csvList = response.data.resultList;
                                            console.log("_this.csvList======"+_this.csvList);
                                        })
                                    }
                                }
                            },'参数设置'),
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
                                        this.showDetail = true;
                                        console.log(item.row);
                                        let _this = this;
                                        this.$http.defaults.withCredentials = false;
                                        this.$http.post('/myapi/scripts/view',{
                                            data:{
                                                id:item.row.id,
                                            }
                                        }).then(function(response){
                                            console.log("script编辑接口response.data",response.data);
                                            _this.setValidate.script_name= response.data.resultList[0].script_name;
                                            _this.setValidate.script_id= response.data.resultList[0].script_id;
                                            _this.setValidate.app_name= response.data.resultList[0].app_name;
                                            _this.setValidate.memo= response.data.resultList[0].memo;
                                            _this.setValidate.create_time= response.data.resultList[0].created_time;
                                            _this.setValidate.script_filename= response.data.resultList[0].script_filename;
                                            _this.setValidate.update_time= response.data.resultList[0].updated_time;
                                            _this.setValidate.filesize= response.data.resultList[0].filesize;
                                            // _this.setValidate.update_time= response.data.resultList[0].updated_time;
                                            
                                        })
                                    }
                                }
                            },'详情'),
                            h('Button', {
                                props: {
                                    type: 'default',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {

                                        this.handleDownload(item.row.id,item.row.script_filename);
                                        
                                        
                                    }
                                }
                            }, '下载')
                        ])  
                    }
                }
            ],
            tableData: [],
            tableDataTotal:0,
            tableDataPageLine:0,
            selectedData:[],
            formValidate: {
            },
            paramValidate:{
            },
            addValidate: {
                    script_name: '',
                    app_name: '',
                    app_id:'',
                    memo: '',
                    script_filename: ''
                },
            ruleValidate: {
                script_name: [
                    { required: true, message: '此项为必填项', trigger: 'blur' }
                ],
                // app_name: [
                //     { required: true, message: '此项为必填项', trigger: 'blur' }
                // ],
                // memo: [
                //     { required: true, message: '此项为必填项', trigger: 'blur' }
                // ],
                script_filename: [
                    { required: true, message: '此项为必填项', trigger: 'blur' }
                ]
            },
            setValidate:{
                script_id:'',
                script_name:'',
                app_name:'',
                memo:'',                                
                create_time:'',                                       
                script_filename:'',
                update_time:'',
                script_manager_id:'' ,
                filesize:''                                      
            },
            setRuleValidate:{
                script_name:[
                    {required:false,message:'',trigger:'blur'}
                ],
                // app_name:[
                //     {required:true,message:'',trigger:'blur'}
                // ],
                // memo:[
                //     {required:true,message:'这是必输字段',trigger:'blur'}
                // ],
                script_filename:[
                    {required:true,message:'这是必输字段',trigger:'blur'}
                ],
            },
        }
    },
    created(){
        this.listCase();
    },
    methods: {
        handleDownload:function(rowid,fileName){
            let _this = this;
            this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/scripts/download',{
                data:{
                    id:rowid,
                }
            }).then(function(response){
                //服务端文件不存在的情况判断
                if("fail" == response.data.result){
                    _this.$Message.error(response.data.err_desc);
                    return;
                }
                //console.log("script编辑接口response.data",response.data);
               // let fileName = item.row.script_filename // 文件地址
                var blob = new Blob([response.data])
                if (window.navigator.msSaveOrOpenBlob) {
                    // 兼容IE10
                    navigator.msSaveBlob(blob, fileName)
                } else {
                    let url = window.URL.createObjectURL(blob);
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                }
            })
        },
        handleFormatError:function(file){
            this.$Message.error(file.name + '文件格式不正确,请上传zip格式的文件!');
        },
        handleUpload:function(file){
            var reg=new RegExp("[^a-zA-Z0-9\_\-\u4e00-\u9fa5]","i");
            var fname = file.name.substr(0,file.name.indexOf('.'))
            if(reg.test(fname)==true){
                this.$Message.error(file.name+"包含特殊字符,请检查后在上传!"); 
                return false;
            }
            let _this = this;
            _this.addValidate.script_filename=file.name;
            _this.setValidate.script_filename=file.name;
        },
        uploadSuccess:function(res,file) {
            console.log(res)
            if(res.result == "success"){
                this.filesize = res.resultList[0].filesize;
                this.script_filename = res.resultList[0].script_filename;
                this.script_filepath = res.resultList[0].script_filepath;
                this.script_id = res.resultList[0].script_id;
            }
        },
        //the param set checkbox when onclick change the value to oppsite  
        isChecked:function(){
            if(this.csvList[index].enable == true || this.csvList[index].enable == 'true'){
                this.csvList[index].enable = false;
            }else{
                this.csvList[index].enable=true;
            }
        },
        setMoreCmpParams: function(obj) {
            this.addValidate.app_id = obj.value;
            this.addValidate.app_name = obj.label;
        }, 
        searchAppname: function(query){
            this.appNameOpts = [];
            if (query !== '') {
                this.srchCmploading = true;
                setTimeout(() => {
                    this.srchCmploading = false;
                    let _this = this
                    this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/component/searchFromITM', 
                    {
                        data: {
                            kw: query,
                            page: 1, 
                            limit: 10, 
                        },                        
                    }
                    ).then(function (response) {
                        console.log('response:', response);
                        console.log('response.data: ', response.data);
                        _this.list = response.data.resultList;
                        console.log('list-after: ', _this.list);
                        const list = _this.list.map(item => {
                            return {
                                // value: item.id,
                                // label: item.comp_name
                                value: item.id,
                                // cloud_id: item.cloud_id, 
                                label: item.com_name
                            };
                        });
                        _this.appNameOpts = list
                        console.log('this.appNameOpts:', _this.appNameOpts);
                    })
                }, 200);
            } else {
                this.appNameOpts = [];
            }
        },
        searchCreater: function(query) {
            this.cmpOpts = [];
            if (query !== '') {
                this.srchCmploading = true;
                setTimeout(() => {
                    this.srchCmploading = false;
                    let _this = this
                    this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/user/search', 
                    {
                        data: {
                            name: _this.creater,                            
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
                                label: item.member_name
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
        deleteScript: function() {
            console.log("删除多条按钮");
            let selectedData=this.selectedData;      //选中要删除的数据
            let resArr = [];                         
            let deleteId = [];                     //选中数据的id
            if(selectedData.length>0){               //如果有选中的数据
                for(let i in selectedData){         //进行遍历
                    //idstr = selectedData[i].id +",";
                    deleteId.push(selectedData[i].id);  //将选中的而数据的id放入要删除的集合中
                    console.log(deleteId);
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
                            this.$http.defaults.withCredentials = false;
                            this.$http.post("/myapi/scripts/delete",{
                                data:{
                                   // ids:deleArr,
                                    id:deleArr[0],
                                }
                            }).then(function(response){
                                if(response.status == 500){
                                    _this.$Message.error('服务端错误!');
                                }else{
                                    tableData.splice(index, 1);        //即删除该数据上
                                    _this.$Message.info('删除成功');
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
            this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/scripts/list', {
                header: {
                },
                data: {
                    script_name: _this.script_name,
                    app_name:_this.app_name,
                    script_manager_id:_this.creater,
                    pageNo: _this.pageNo==''?1:_this.pageNo,
                    pageSize: 15                    
                }
            }).then(function (response) {
                console.log('response:');
                console.log(response);
                console.log('response.data: ', response.data);
                _this.tableData = response.data.resultList;
                _this.tableDataTotal = response.data.pagination.totalCount;
                _this.tableDataPageLine = response.data.pagination.pageSize
            })
        },
        handlePage:function(val){
            let _this = this;
            _this.pageNo = val;
            console.log(val);
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
        checkScriptName: function() {
            let _this = this;
             //检查脚本名称是否重复
            console.log("开始验证脚本名称");
            this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/scripts/checkName',{
                data:{
                    script_name:_this.addValidate.script_name,
                }
            }).then(function(response){
                if(response.status == 500){
                    _this.$Message.error('服务端错误!');
                }else{
                    console.log("检查脚本响应数据",response);
                    var flag = response.data.result;
                    console.log("检查脚本响应数据flag",flag);
                    if("fail" == flag){
                        console.log("检查脚本响应数据flag22",flag);
                        _this.$Message.error('脚本名称重复!');
                        return ;
                    }
                }
               
            })
        },

        onSelectionChanged: function(data) {
            this.selectedData = data;
            console.log(data)
        },

        onRowDblClick: function(row) {
            //this.$router.push({path:'/addScript',query:{id:row.id}});
        },

        
        /**添加新数据弹出模态框 */
        addScript:function(){
            this.showDialog = true;
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
        //参数化设置提交
        handleParamSubmit (name) {
            this.$refs[name].validate((valid) => {
                let _this = this;
                if (valid) {
                    this.$http.defaults.withCredentials = false;
                    this.$http.post("/myapi/scripts/doParam",{
                        data:{
                            id:_this.rowid,
                            csvList:_this.csvList,
                        },
                    }).then(function(response){
                        if(response.status == 500){
                            _this.$Message.error('服务端错误!');
                        }else{
                            if(response.data.result=="success"){
                                _this.$Message.success('设置成功!');
                            }else{
                                this.$Message.error("设置失败!");
                            }
                            _this.showParamStatus = false;
                        }
                    })
                } else {
                    this.$Message.error('表单验证失败!');
                }
                console.log(_this);                 //方法接口写好时再清空之前输入的
                 //this.$refs[name].resetFields();
            });
        },
        /***模态框弹出时确定事件: 验证表单提交 */
        submitScript (name) {
            let _this = this;
            console.log(this.addValidate);
            //提交添加请求
            this.$refs[name].validate((valid) => {
                if (valid) {
                    console.log("开始添加");
                    console.log("app_name0000000"+_this.addValidate.app_name);
                    this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/scripts/add',{
                        data:{
                            script_name:_this.addValidate.script_name,
                            app_name:_this.addValidate.app_name,
                            app_id:_this.addValidate.app_id,
                            memo:_this.addValidate.memo,
                            script_filename:_this.addValidate.script_filename,
                            filesize:_this.filesize,
                            script_filepath:_this.script_filepath,
                            script_id:_this.script_id,
                        }
                    }).then(function(response){
                        console.log("响应回来的数据",response);
                        if(response.status == 500){
                            _this.$Message.error('服务端错误!');
                        }else{
                            if("success" == response.data.result){
                                _this.$Message.success('添加成功！');
                            }else{
                                _this.$Message.error('添加失败'+response.data.err_desc);
                            }
                            _this.showDialog = false;
                            _this.$refs[name].resetFields();
                        }
                    })
                } else {
                    _this.$Message.error('表单验证失败!');
                }
            });
        }, 
        //编辑提交
        editSubmitScript (name) {
            let _this = this;
            console.log(this.setValidate);
            //提交添加请求
            this.$refs[name].validate((valid) => {
                if (valid) {
                    console.log("开始修改");
                    console.log("app_name0000000"+_this.setValidate.app_name);
                    this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/scripts/edit',{
                        data:{
                            id:_this.rowid,
                            script_name:_this.setValidate.script_name,
                            app_name:_this.setValidate.app_name,
                            memo:_this.setValidate.memo,
                            script_filename:_this.setValidate.script_filename,
                            filesize:_this.filesize,
                            script_filepath:_this.script_filepath,
                            script_id:_this.script_id,
                        }
                    }).then(function(response){
                        if(response.status == 500){
                            _this.$Message.error('服务端错误!');
                        }else{
                            if("fail" == response.data.result){
                                _this.$Message.error('修改失败!');
                                return;
                            }else{
                                _this.$Message.success('修改成功!');
                                _this.showSetScript = false;
                                console.log("修改成功");
                                _this.$refs[name].resetFields();   
                            }
                        }
                    })
                } else {
                    _this.$Message.error('表单验证失败!');
                }
            });
        },         
        
        /**模态框弹出取消事件 */
        cancelAdd () {
            this.$Message.info('您取消了添加脚本!');
            this.showDialog = false;
        },
        cancelParamWin () {
            this.$Message.info('您取消了参数化设置!');
            this.showParamStatus = false;
        },
        //取消脚本编辑
        setCancel:function(){
            this.showSetScript = false;
            this.showDetail = false;
        },
        /**清除搜索条件 */
        handleReset (name) {
            let _this = this;
            _this.app_name='';
            _this.script_name='';
            _this.creater='';
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
