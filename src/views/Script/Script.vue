<template>
	<div class="pageContent">
        <Card>
            <div class="caseBox">
                <h3 class="Title">
                    <span>脚本管理</span>
                </h3>
                <Form ref="formValidate"   class="formValidate" >
                    <div class="rowbox">
                        <Row :gutter="16">
                            <Col span="2" class="searchLable">物理子系统:</Col>
                            <Col span="4">
                                <!-- <Input clearable v-model="app_name" placeholder="请输入物理子系统"></Input> -->
                                <Select
                                    v-model="app_name"
                                    placeholder="输入物理子系统中文名称或英文简称"
                                    clearable
                                    filterable
                                    remote
                                    :remote-method="searchAppname"
                                    :loading="srchCmploading"
                                    @on-open-change="searchName" 
                                    @keyup.enter.native= listCase()>
                                    <Option v-for="(option, index) in appNameOpts" :value="option.label" :key="index">{{option.label}}</Option>
                                </Select>
                            </Col>
                            <Col span="2" class="searchLable">脚本名称:</Col>
                            <Col span="4">
                                <Input clearable v-model="script_name" placeholder="请输入脚本名称"></Input>                                
                            </Col>
                            <Col span="2" class="searchLable">创建人:</Col>
                            <Col span="4">
                                <Select
                                    v-model="creater" 
                                    placeholder="请输入创建人" 
                                    clearable 
                                    filterable remote 
                                    :remote-method="searchCreater" 
                                    :loading="srchCmploading" 
                                    @on-open-change="executioName" 
                                    @keyup.enter.native= listCase()>
                                    <Option v-for="(option,index) in cmpOpts" :value="option.value" :key="index">{{ option.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="6">
                                <Button @click="listCase" type="primary" icon="ios-search">查询</Button>
                                <Button @click="handleReset" type="default"  ghost>重置</Button>
                            </Col>
                        </Row>
                    </div>                    
                </Form>
                <div class="tableBox">
                    <div class="tableBtnBox">                       
                        <Button @click="addScript"  type="primary">新增</Button>
                        <Button @click="deleteScript" type="error">删除</Button>
                    </div>
                    <Table border :loading="isLoading" ref="selection" :columns="columns" :data="tableData" class="myTable" @on-row-click="onSelectionChanged" show-header></Table>
                    <div class="pageBox" v-if="tableData.length">
                        <Page :total="tableDataTotal/tableDataPageLine > 1 ? (tableDataTotal%tableDataPageLine ? parseInt(tableDataTotal/tableDataPageLine)+1 : tableDataTotal/tableDataPageLine)*10 : 1" @on-change="handlePage"  show-elevator ></Page>
                        <p>总共{{tableDataTotal}}条记录</p>
                    </div>
                </div>
            </div>
            <!-- 参数化设置对话框 begin  -->
            <Modal v-model="showParamStatus" width="800" >
                <p slot="header" style="color:rgba(184, 124, 13, 0.637)" >
                    <span>参数化文件设置</span>
                </p>
                <div style="text-align:center">
                    <i-form ref="paramValidate" :model="paramValidate" :rules="paramValidate" :label-width="100" >
                        <h3>请勾选可以拆分的参数化文件：</h3><br>
                            <Col span="8" v-for="(item,index) in csvList" :key="index" >
                                <FormItem :label-width="20" prop="fileName" style="float:left">
                                    <Checkbox v-model="item.enable == 'true'?true:false" @on-change="isChecked(index)">{{item.fileName}}</Checkbox>  
                                </FormItem>
                                <br v-if="index/3 ==0">
                            </Col>
                           <Row  v-for="(item,index11) in csvList" :key="index11">
                            </Row> 
                    </i-form>
                </div>
                <div slot="footer">
                        <Button color="#1c2438"  @click="cancelParamWin()">取消</Button>
                        <Button type="primary" @click="handleParamSubmit('paramValidate')">确认</Button>
                </div>
            </Modal>
            <!-- 参数化设置对话框 end  -->
            <!--新建脚本时弹出的对话框begin-->
            <Modal v-model="showDialog" width="800" >
                <p slot="header" style="text-align:center" >
                    <Icon type="ios-information-circle"></Icon>
                    <span>添加脚本</span>
                </p>
                <div style="text-align:left">
                    <i-form ref="addValidate" :model="addValidate" :rules="ruleValidate" :label-width="100" >
                        <Row>
                            <i-col span="24">
                                <Form-item label="脚本名称：" prop="script_name">
                                    <i-input v-model="addValidate.script_name"  placeholder="请输入脚本名称" @on-blur="checkScriptName()" ></i-input>
                                    <span v-if="scriptFlag" class="ivu-form-item-error-tip" >脚本名称不能重复！</span>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="24">
                                <Form-item label="物理子系统：" prop="app_name">
                                    <Select  
                                        v-model="addValidate.app_name" 
                                        placeholder="请选择物理子系统" 
                                        clearable
                                        filterable 
                                        remote 
                                        :remote-method="searchAppname" 
                                        :loading="srchCmploading"
                                        @on-open-change="searchName" 
                                        @keyup.enter.native= listCase()>
                                        <Option v-for="(optio, index) in appNameOpts" :value="optio.label" :key="index">{{optio.label}}</Option>
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
                                    <i-input  v-model="addValidate.script_filename" placeholder="请选择上传文件(.zip格式)" @click="" aria-readonly="true"></i-input>
                                </Form-item>                                
                            </i-col>        
                            <i-col span=4 >
                                <Upload ref="upload"
                                        name="file"
                                        action="/myapi/scripts/upload"
                                        :before-upload="handleUpload"
                                        :format="['zip']" 
                                        :on-success="uploadSuccess"
                                        :on-progress="uploadProgress"
                                        :show-upload-list="false"
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
                    <Button type="primary"   @click="submitScript('addValidate')" >确认</Button>
                </div>
            </Modal>
            <!--编辑脚本时弹出的对话框 end-->
            <!--script edit editeditediteditediteditbegin-->
            <Modal v-model="showSetScript" width="800">
                <p slot="header" style="color:#f60" >
                    <span>编辑脚本</span>
                </p>
                <Form ref="setValidate" :model="setValidate" :rules="setRuleValidate" :label-width="120">
                    <FormItem label="脚本名称:" prop="script_name">                      
                        <Input v-model="setValidate.script_name" ></Input>
                        <!-- <span v-if="scriptFlag" class="ivu-form-item-error-tip" >脚本名称不能重复！</span>                         -->
                    </FormItem>
                    <FormItem label="物理子系统:" prop="app_name">                      
                        <!-- <Input v-model="setValidate.app_name" readonly="readonly"></Input> -->
                        <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{setValidate.app_name}}</div>
                    </FormItem>
                    <FormItem label="脚本说明:" prop="memo">                      
                        <Input v-model="setValidate.memo"></Input>
                    </FormItem>
                    <FormItem label="文件大小:" prop="script_filesize">                      
                        <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{setValidate.script_filesize}}</div>
                    </FormItem>
                    <FormItem label="创建时间:" prop="created_time">                      
                        <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{setValidate.created_time}}</div>
                    </FormItem>
                    <FormItem label="更新时间:" prop="modified_time">                      
                            <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{setValidate.modified_time}}</div>
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
                                :show-upload-list="false"
                                :on-progress="uploadProgress"
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
                <Spin size="large" fix v-if="spinShow"></Spin>
            </Modal>
            <!--script edit end
            script detail detail detail detail begin  now not use
            <Modal v-model="showDetail" width="800">
                <p slot="header" style="color:#f60" >
                    <span>脚本详情</span>
                </p>
                <Form ref="setValidate" :model="setValidate" :rules="setRuleValidate" :label-width="120">
                    <FormItem label="脚本ID:"  >                     
                        <Input v-model="setValidate.script_id"></Input>
                        <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{setValidate.script_id}} </div>
                    </FormItem>
                    <FormItem label="脚本名称:" prop="script_name">                      
                        <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{setValidate.script_name}} </div>
                    </FormItem>
                    <FormItem label="脚本大小:" prop="filesize">                      
                        <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{setValidate.filesize}} </div>
                    </FormItem>
                    <FormItem label="物理子系统:" prop="app_name">                      
                        <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{setValidate.app_name}} </div>
                    </FormItem>
                    <FormItem label="脚本说明:" prop="memo">                      
                        <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{setValidate.memo}} </div>
                    </FormItem>
                    <FormItem label="创建时间:" prop="create_time">                      
                        <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{setValidate.create_time}} </div>
                    </FormItem>
                    <FormItem label="更新时间:" prop="update_time">                      
                        <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{setValidate.update_time}} </div>
                    </FormItem>
                    <FormItem label="创建人:" prop="script_manager_id">                      
                        <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{setValidate.script_manager_id}} </div>
                    </FormItem>
                </Form>
                 <div slot="footer">
                    <Button color="#1c2438" @click="setCancel()">取消</Button>
                    <Button type="primary" @click="editSubmitScript('setValidate')">确认</Button>
                </div> 
            </Modal>
            script detail end-->
            <!-- 删除提示 -->
            <Modal v-model="doDeleteas" width="600">
                <p slot="header" style="color:#f60" >
                    <span>该脚本关联的场景如下，如删除脚本对应的场景将一并删除，请确认是否删除？</span>
                </p>
                <Table border ref="selection" :columns="setValiColumns" :data="setValidates" class="myTable" show-header></Table>
                <div slot="footer">
                    <Button color="#1c2438" @click="setCancel()">取消</Button>
                    <Button type="primary" @click="doDelete()">确认</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>

<script>
export default {
	name: 'TestCase',
    data () {
        const validateScriptName = function(rule, value, callback) {
            var flag = this.checkScriptName();
            console.log("flag",flag);
            if(flag){
                callback(new Error('脚本名称重复!'));
            }else{
                callback();
            }
            // callback();
        };
        return {
            scriptFlag:true,
            isdisabledFn:false,
            /* 窗口设置开关 */
            showParamStatus:false,
            showDialog:false,
            showDetail:false,
            showSetScript:false,
            doDeleteas:false,
            srchCmploading: false,
            spinShow:false,
            // 删除校验弹框
            setValiColumns:[
                {
                    title: '序号',
                    width: 60,
                    type:'index',
                    align: 'center',
                },
                {
                    title: '场景名称',
                    key:'senario_name',
                    align: 'center',
                }
            ],
            setValidates:[],
            cmpOpts: [],
            appNameOpts: [],
            list: [], 
            sTaskStatus:'',
            taskStatusList: this.$Global.taskStatusList,  
            interfaceId:'',
            sTaskName:'',
            script_name:'',
            id:'',
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
                    title: '选择',
                    align: 'center',
                    width: 60,
                    key:'checkBox',
                    render:(h,params)=>{
                        return h('div',[
                            h('Checkbox',{  
                                props:{
                                    value:params.row.checkBox
                                },
                                on:{
                                    'on-change':(e)=>{
                                        console.log("状态：",e,"id:",params.row.id,"index",params.index)
                                        this.id=params.row.id;
                                        this.tableData.forEach((items)=>{
                                            //先取消所有对象的勾选，checkBox设置为false
                                            this.$set(items,'checkBox',false)
                                        });
                                        //再将勾选的对象的checkBox设置为true
                                        this.tableData[params.index].checkBox =e
                                    }
                                }
                            })
                        ])
                    }                    
                },
                {
                    title: '脚本名称',
                    key: 'script_name',
                    width: 220,
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
                                    title: params.row.script_name
                                }
                            }, params.row.script_name)
                        ]);
                    }
                },
                {
                    title: '物理子系统',
                    width: 250,
                    key: 'app_name',
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
                                    title: params.row.app_name
                                }
                            }, params.row.app_name)
                        ]);
                    }
                },
                {
                    title: '脚本文件',
                    key: 'script_filename',
                    width: 205,
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
                                    title: params.row.script_filename
                                }
                            }, params.row.script_filename)
                        ]);
                    }
                },
                {
                    title: '创建人',
                    key: 'script_manager_name',
                    width: 80,                    
                },
                {
                    title: '更新时间',
                    key: 'modified_time',
                    width: 160,
                    align: 'center',
                    sortable: true
                },
                {
                    title: '操作',
                    key: 'opration',
                    width:200,
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
                                        //console.log(item.row);
                                        let _this = this;
                                        // this.$http.defaults.withCredentials = false;
                                        this.$http.post('/myapi/scripts/checkEdit',{
                                            data:{
                                                id:item.row.id,
                                            }
                                        }).then(function(response){
                                            console.log("script编辑接口",response.data);
                                            if(response.data.err_desc ==="脚本关联场景正在运行，不可以修改"){
                                                _this.showSetScript = false;
                                                _this.$Message.error("脚本关联场景正在运行，暂时无法编辑，请稍侯再试！")
                                                return;
                                            }else {
                                                _this.showSetScript = true;
                                                _this.spinShow = false;
                                                _this.setValidate.script_name= response.data.resultList[0].script_name;
                                                _this.setValidate.script_id= response.data.resultList[0].script_id;
                                                _this.setValidate.app_name= response.data.resultList[0].app_name;
                                                _this.setValidate.memo= response.data.resultList[0].memo;
                                                _this.setValidate.created_time= response.data.resultList[0].created_time;
                                                _this.setValidate.modified_time= response.data.resultList[0].modified_time;
                                                _this.setValidate.script_filename= response.data.resultList[0].script_filename;
                                                _this.setValidate.script_filesize=response.data.resultList[0].script_filesize,
                                                _this.script_filepath=response.data.resultList[0].script_filepath,
                                                _this.script_id=response.data.resultList[0].script_id,
                                                _this.rowid=response.data.resultList[0].id
                                            }
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
                                        console.log(item.row);
                                        let _this = this;
                                        _this.csvList=[];
                                        // this.$http.defaults.withCredentials = false;
                                        this.$http.post('/myapi/scripts/param',{
                                            data:{
                                                id:item.row.id,
                                            }
                                        }).then(function(response){
                                            if(response.data.resultList.length ==0){
                                                console.log("_=--=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=");
                                                _this.$Message.error("当前脚本无参数化文件，无法进行配置，请确认后在重试！"); 
                                                _this.showParamStatus = false;
                                            }else{
                                                _this.showParamStatus = true;
                                                console.log("script编辑接口response.data",response.data.resultList);
                                                _this.rowid=response.data.executor_id;
                                                _this.csvList = response.data.resultList;
                                                console.log("_this.csvList======",_this.csvList);
                                            }
                                            
                                        })
                                    }
                                }
                            },'参数设置'),
                            h('Button', {
                                props: {
                                    type: 'default',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.handleDownload(item.row.id,item.row.script_filepath);
                                        //console.log("item.row.script_filepath",item.row.script_filepath);
                                        //window.location.href(item.row.script_filepath)
                                    }
                                    // href:item.row.script_filepath
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
                    {required: true, message: '此项为必填项', trigger: 'blur' }
                ],
                app_name: [
                    { required: true, message: '此项为必填项', trigger: 'blur' }
                ],
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
                created_time:'',                                       
                script_filename:'',
                update_time:'',
                script_manager_id:'' ,
                filesize:''                                      
            },
            setRuleValidate:{
                script_name: [
                    {required: true, message: '此项为必填项', trigger: 'blur' }
                ],
                app_name:[
                    {required:true,message:'这是必输字段',trigger:'blur'}
                ],
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
        
        listCase: function() {
            let _this = this;
            _this.isLoading=true;
            // this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/scripts/list', {
                header: {
                },
                data: {
                    script_name: _this.script_name,
                    app_name:_this.app_name,
                    script_manager_id:_this.creater,
                    pageNo: _this.pageNo==''?1:_this.pageNo,
                    pageSize: 10                    
                }
            }).then(function (response) {
                console.log('response:');
                //console.log(response);
                console.log('response.data: ', response.data);
                _this.tableData = response.data.resultList;
                _this.tableDataTotal = response.data.pagination.totalCount;
                _this.tableDataPageLine = response.data.pagination.pageSize
                _this.isLoading=false;
            })
        },
        //下载
        handleDownload:function(rowid,script_filepath){
            let _this = this;
            console.log("script_filepath",script_filepath);
            let a = document.createElement('a')
            a.href = script_filepath;
            a.click();
            
        },
        uploadPro:function(file){
            console.log("file",file.name);
        },
        //文件格式验证失败
        handleFormatError:function(file){
            this.$Message.error(file.name + '文件格式不正确,请上传zip格式的文件!');
        },
        // //移除文件时
        // uploadRemove(){
        //     this.$refs.upload.clearFiles();
        // },
        //文件上传时方法
        uploadProgress:function(res,file){
            this.$Spin.show({
                render: (h) => {
                    return h('div', [
                        h('Icon', {
                            'class': 'demo-spin-icon-load',
                            props: {
                                type: 'ios-loading',
                                size: 26
                            }
                        }),
                        h('div', '脚本正在上传解析中，请稍侯...')
                    ])
                }
            });
        },
        //上传前方法
        handleUpload:function(file){
            var reg=new RegExp("[^a-zA-Z0-9-\_\u4e00-\u9fa5]","i");
            var fname = file.name.substr(0,file.name.indexOf('.'))
            if(reg.test(fname)==true){
                this.$Message.error(file.name+"包含特殊字符,请检查后在上传!"); 
                return false;
            }
            let _this = this;
            _this.addValidate.script_filename=file.name;
            _this.addValidate.id=file.id;
            _this.setValidate.script_filename=file.name;
        },
        uploadSuccess:function(res,file) { 
            console.log("返回信息",file);
            if(res.result == "success"){
                this.$Spin.hide();
                this.$Message.info(file.response.err_desc);
                this.filesize = res.resultList[0].script_filesize;
                this.script_filename = res.resultList[0].script_filename;
                this.script_filepath = res.resultList[0].script_filepath;
                this.script_id = res.resultList[0].script_id;
            }else if(res.result =="fail"){
                this.$Spin.hide();
                this.$Message.error(file.response.err_desc); 
            }
        },
        //the param set checkbox when onclick change the value to oppsite  
        isChecked:function(index){
            if(this.csvList[index].enable == true || this.csvList[index].enable == 'true'){
                this.csvList[index].enable = false;
            }else{
                this.csvList[index].enable=true;
            }
            // console.log("this.csvList[index].enable:"+this.csvList[index].enable);
        },
        setMoreCmpParams: function(obj) {
            console.log("obj".obj)
            this.addValidate.app_id = obj.value;
            this.addValidate.app_name = obj.label;
        }, 
        //物理子系统查询
        searchName:function(){
            let _this = this
            this.$http.post('/myapi/component/searchFromITM', {
                data: {
                    kw: '',
                    page: 1, 
                    limit: 10, 
                },                        
            }).then(function (response) {
                console.log("物理子系统",response.data);
                _this.appNameOpts  = response.data.resultList.map(item => {
                    return {
                        value: item.id,
                        label: item.com_name
                    };
                });
            })
        },
        //物理子系统输入查询
        searchAppname: function(query){
            let _this = this
            this.$http.post('/myapi/component/searchFromITM', {
                data: {
                    kw: query,
                    page: 1, 
                    limit: 10, 
                },                        
            }).then(function (response) {
                console.log('list-after: ', _this.list);
                _this.appNameOpts = response.data.resultList.map(item => {
                    return {
                        value: item.id,
                        cloud_id: item.cloud_id, 
                        label: item.com_name
                    }
                })
            })
        },
        //创建人查询
        searchCreater: function(query) {
            let _this = this;
            this.$http.post('/myapi/user/search', {
                header:{},
                data: {
                    member_name: query                            
                },                        
            }
            ).then(function (response) {
                console.log("response",response.data);
                _this.cmpOpts = response.data.resultList.map(item => {
                    return {
                        value: item.id,
                        label: item.member_name
                    };
                });
            })
        },
        //创建人下拉查询
        executioName:function(){
            let _this = this;
            this.$http.post('/myapi/user/search', {
                header:{},
                data: {
                    member_name: ''                            
                },                        
            }
            ).then(function (response) {
                _this.cmpOpts = response.data.resultList.map(item => {
                    return {
                        value: item.id,
                        label: item.member_name
                    };
                });
            })
        },
        /*删除校验*/
        deleteScript: function() {
            let _this = this;
            console.log(_this.id);
            this.$http.post("/myapi/scripts/delete",{
                data:{
                    id:_this.id
                }
            }).then(function(response){
                console.log("response.data.result",response.data);
                if(response.data.result == "success1"){
                    _this.doDeleteas=true;
                    _this.setValidates=response.data.resultList;
                }else if(response.data.result == "success0"){
                    _this.$Modal.confirm({
                        title:'确认',
                        content: '是否删除该数据',
                        onOk: () => {
                            _this.doDelete();
                        },
                        onCancel: () => {
                        }
                    }); 
                }else{
                    _this.$Message.info("该脚本关联的场景正在执行中，脚本不可删除，请稍侯再试。");
                }
            })
        }, 
        //删除方法
        doDelete:function(){
            let _this = this;
            console.log("_this.id",_this.id);
            this.$http.post("/myapi/scripts/dodelete",{
                header:{},
                data:{
                    id:_this.id
                }
            }).then(function(response){
                if(response.data.result == "success"){
                    _this.$Message.info('删除成功');
                    _this.doDeleteas=false;
                }else{
                    _this.$Message.info('删除失败');
                    _this.doDeleteas=false;
                }
                _this.listCase(); 
            })
        },
        
        handlePage:function(val){
            let _this = this;
            _this.pageNo = val;
            //console.log(val);
            _this.listCase();
        },

        findCase: function(id) {
            let _this = this
            console.log('findCase')
            // this.$http.defaults.withCredentials = false;
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
            // this.$http.defaults.withCredentials = false;
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
        checkScriptName() {
            let _this = this;
            let val = _this.addValidate.script_name;
             //检查脚本名称是否重复
            console.log("开始验证脚本名称");
            // this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/scripts/checkName',{
                data:{
                    script_name:val,
                }
            }).then(function(response){
                    _this.scriptFlag = response.data.result=="fail";
                    console.log(" _this.scriptFlag",_this.scriptFlag);
            })
        },

        onSelectionChanged: function(data) {
            this.selectedData = data;
            console.log("11112132",this.selectedData)
        },
        //双击方法
        // onRowDblClick: function(row) {
        //     this.$router.push({path:'/script_detail',query:{script_id:row.id}});
        // },

        
        /**添加新数据弹出模态框 */
        addScript:function(){
            //初始化表单
            this.addValidate={};
            // this.$refs.resetFields();
            let _this = this;
            _this.$refs.upload.clearFiles();
            this.showDialog = true;
            console.log("显示模态框");
        },
        //参数化设置提交
        handleParamSubmit (name) {
            this.$refs[name].validate((valid) => {
                let _this = this;
                console.log("4a5454as54da5sdasd",name);
                if (valid) {
                    // this.$http.defaults.withCredentials = false;
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
                        }
                    })
                } else {
                    this.$Message.error('表单验证失败!');
                }
                console.log(_this);                 //方法接口写好时再清空之前输入的
                 //this.$refs[name].resetFields();
            });
            this.showParamStatus = false;
        },
        /***模态框弹出时确定事件: 验证表单提交 */
        submitScript (name,scriptFlag) {
            let _this = this;
            _this.scriptFlag =this.scriptFlag;
            _this.isdisabledFn = true;
            //提交添加请求
            console.log("_this.scriptFlag",_this.scriptFlag);
            if (_this.scriptFlag == true) {
                _this.$Message.error('脚本名称重复，请修改!');
            } else if( _this.scriptFlag != true){
                this.$http.post('/myapi/scripts/add',{
                    data:{
                        script_name:_this.addValidate.script_name,
                        app_name:_this.addValidate.app_name,
                        app_id:_this.addValidate.app_id,
                        memo:_this.addValidate.memo,
                        script_filename:_this.addValidate.script_filename,
                        script_filesize:_this.filesize,
                        script_filepath:_this.script_filepath,
                        script_id:_this.script_id,
                    }
                }).then(function(response){
                    console.log("响应回来的数据1111111",response);
                    if("success" == response.data.result){
                        _this.$Message.success('添加成功！');
                        _this.listCase();
                    }else{
                        _this.$Message.error(response.data.err_desc);
                    }
                    _this.isdisabledFn = false;
                    _this.showDialog = false;
                    _this.$refs[name].resetFields();
                }).catch(function(error){
                    _this.isdisabledFn = false;
                    console.log("error:"+error);
                    _this.$Message.error('服务端错误!');
                })
            }else{
                _this.isdisabledFn = false;
                _this.$Message.error('表单验证失败!');
            }
        }, 
        //编辑提交
        editSubmitScript (name) {
            let _this = this;
            console.log(this.setValidate);
            _this.spinShow = true;
            //提交添加请求
            this.$refs[name].validate((valid) => {
                if (valid) {
                    console.log("开始修改");
                    console.log("app_name0000000"+_this.setValidate.app_name);
                    this.$http.post('/myapi/scripts/edit',{
                        data:{
                            id:_this.rowid,
                            script_name:_this.setValidate.script_name,
                            app_name:_this.setValidate.app_name,
                            memo:_this.setValidate.memo,
                            script_filename:_this.setValidate.script_filename,
                            script_filesize:_this.filesize,
                            script_filepath:_this.script_filepath,
                            script_id:_this.script_id,
                        }
                    }).then(function(response){
                        if(response.status == 500){
                            _this.$Message.error('服务端错误!');
                        }else{
                            if("fail" == response.data.result){
                                console.log('修改失败,'+response.data.err_desc);
                                _this.$Message.error('修改失败,'+response.data.err_desc);
                                return;
                            }else{
                                _this.$Message.success('修改成功!');
                                _this.showSetScript = false;
                                console.log("修改成功");
                                _this.listCase();
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
        cancelAdd:function (file) {
            let _this = this;
            console.log("file",_this.script_id);
            this.$http.post('/myapi/scripts/cancle', {
                header: {
                },
                data: {
                    script_id: _this.script_id
                }
            }).then(function (response) {
                console.log('response.data: ', response.data);
            })
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
            this.doDeleteas = false;
        },
        
        /**清除搜索条件 */
        handleReset () {
            let _this = this;
            // _this.$refs.cre.clearSingleSelect();
            _this.app_name='';
            _this.script_name='';
            _this.creater='';
            console.log("11111");
            
            // console.log(this.$refs[name])
            //this.$refs[name].resetFields();
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
.demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
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
.editStaticDiv {
    font-size: 12px;
    padding-top: 10px;
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
.editStaticDiv {
    font-size: 12px;
    padding-top: 6px;
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
