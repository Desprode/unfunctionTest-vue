<template>
	<div class="pageContent">
        <div class="caseBox">
            <h3 class="Title">
                <span>场景管理</span>
            </h3>
           <!--==================================form 表单============================================-->
            <Form ref="formValidate" class="formValidate" :label-width="80" v-show="isbouterAlive">
                <div class="rowbox">
                    <Row class="caseBoxRow">
                        <Col span="7">
                            <FormItem label="场景类型:">
                                <Select v-model="senario_type" clearable>
                                    <Option  value="01">单交易基准</Option>
                                    <Option  value="02">单交易负载</Option>
                                    <Option  value="03">混合场景</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="7">
                            <FormItem label="场景名称:">
                                <Input v-model="senario_name" placeholder="输入场景名称"></Input>
                            </FormItem>
                        </Col>
                        <Col span="7">
                            <FormItem label="创建人:">
                               <Input v-model="senario_creator" placeholder="输入场景创建人"></Input>
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <Button @click="listCase" type="primary" icon="ios-search" class="actionBtn">查询</Button>
                        </Col>
                    </Row>
                    <Row class="caseBoxRow" v-show="isShowMore">
                        <Col span="8">
                            <FormItem label="关联任务:">
                                <Select v-model="perf_task" placeholder="至少输入一个字段查询" clearable filterable remote :remote-method="perftaskNameRemote" :loading="perftaskNameLoading">
                                    <Option v-for="(opts,index) in searchOpts"  :value="opts.perfTaskID" :key="index">{{opts.perfTaskName}}</Option>
                                </Select>
                                <!-- <Input v-model="perftask_name" placeholder="输入关联任务"></Input> -->
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="关联脚本:">
                                <Select v-model="script" placeholder="至少输入一个字段查询" clearable filterable remote :remote-method="perfScriptRemote" :loading="perftaskNameLoading">
                                    <Option v-for="(opts,index) in searchOpts"  :value="opts.scriptID" :key="index">{{opts.scriptName}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>  
                </div>
                <div class="formValidateMoreBtnBox" :class="isShowMore ?'arrUp':'arrDown'" @click="isShowMore = !isShowMore">
                    <Icon type="chevron-down" color="#fff" ></Icon>
                    <Icon type="chevron-down" color="#fff" ></Icon>
                </div>
            </Form>
            <div align="left">
                <Button @click="addCase()" type="primary"  class="actionBtn">创建场景</Button>
                <Button @click="deleteCase" type="error" class="actionBtn">批量删除</Button>
            </div>
            <div class="tableBox">
                <Table border  ref="selection" :columns="columns" :data="tableData" class="myTable"  @on-selection-change="onSelectionChanged"></Table>
                <div class="pageBox" v-if="tableData.length">
                    <Page :total="parseInt(totalCount)" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
                    <p>总共{{totalPage}}页</p>
                </div>
            </div>
        </div>


        <!--========================================创建场景模态框：=================================-->
        <Modal v-model="showAddModal" width="800">
            <p slot="header" style="color:#f60" >
                <span>新增</span>
            </p>
            <div style="text-align:center">
            <Form ref="addValidate" :model="addValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="场景类型:" prop="senario_type">
                   <Select v-model="addValidate.senario_type" placeholder="请选择场景类型" clearable>
                        <Option value="01">单交易基准</Option>
                        <Option value="02">单交易负载</Option>
                        <Option value="03">混合场景</Option>                      
                    </Select>
                </FormItem>
                <FormItem label="场景名称:" prop="senario_name">                      
                   <Input v-model="addValidate.senario_name" placeholder="请输入场景名称"></Input>
                </FormItem>
                <FormItem label="场景描述:" prop="fie">
                    <Input placeholder="请填写场景描述"  v-model="addValidate.fie" type="textarea" name="senario_desc" :autosize='true' id="field_senario_desc"></Input>
                </FormItem>
                <FormItem label="关联任务:" prop="ref_task_name">
                    <Select v-model="addValidate.ref_task_name" placeholder="至少输入一个字段查询" clearable filterable remote :remote-method="perftaskRemote" :loading="perftaskLoading" @on-change="perftaskOptChange" :label-in-value="true" @on-clear="perftaskClear">
                        <Scroll :on-reach-bottom="perftaskReachBottom">
                            <Option v-for="(opts,index) in perftaskOpts" :value="opts.value" :key="index">{{opts.label}}</Option>    
                        </Scroll>                
                    </Select>
                </FormItem>
                <FormItem label="关联脚本:" prop="ref_script_name">
                   <Select v-model="addValidate.ref_script_name" placeholder="请选择脚本" clearable :disabled="isDisabled" filterable remote :remote-method="refscriptRemote" :loading="perftaskLoading" >
                            <Option v-for="(opts,index) in scriptOpts" :value="opts.value" :key="index">{{opts.label}}</Option>          
                    </Select>
                </FormItem>
            </Form>
            </div>
            <div slot="footer">
                <Button color="#1c2438"  @click="Addcancel()">取消</Button>
                <Button type="primary" @click="handleSubmit('addValidate')">确认</Button>
            </div>
        </Modal>

        <!--=======================================执行操作模态框：===================================-->
        <Modal v-model="showExeModal" width="800">
            <p slot="header" style="color:#f60" >
                <span>执行时间设置</span>
            </p>
            <Form ref="eveValidate" :model="eveValidate" :rules="eveRuleValidate" :label-width="100" label-position="left">
                <FormItem label="执行类型" prop="exeType">
                    <RadioGroup v-model="eveValidate.exeType" vertical >
                        <Radio label="00" checked>立即执行</Radio>
                        <Radio label="01">定时执行</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="预设启动时间" v-show="eveValidate.exeType=='01'?true:false">
                    <DatePicker type="datetime" placeholder="选择日期" v-model="eveValidate.exeDateTime"></DatePicker>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button color="#1c2438" @click="exeCancel()">取消</Button>
                <Button type="primary" @click="exeOk()">确认</Button>
            </div>
        </Modal>

        <!--======================================场景设置模态框======================================-->
        <Modal v-model="showSetModal" width="800">
            <p slot="header" style="color:#f60" >
                <span>编辑场景</span>
            </p>
            <Form ref="setValidate" :model="setValidate" :rules="setRuleValidate" :label-width="120">
                <h2>基本属性</h2>
                <FormItem label="场景名称:" prop="senario_name">                      
                   <Input v-model="setValidate.senario_name"></Input>
                </FormItem>
                <FormItem label="场景描述:" prop="senario_desc">
                    <Input placeholder="请填写场景描述"  v-model="setValidate.senario_desc" type="textarea" :autosize="{minRows:2,maxRows:5}"></Input>
                </FormItem>
                <h2>压力机配置</h2> 
                <FormItem label="每台压力机最大并发用户数：" prop="max_conusrs_perpm">
                    <Input v-model="setValidate.max_conusrs_perpm" :number="true"></Input>
                </FormItem>
                <h2>运行设置</h2>
                <FormItem label="持续时长（分钟）：" prop="duration" v-if="showSetType=='03'?true:false">
                    <Input v-model="setValidate.duration" :number="true"></Input>
                </FormItem>
                <Row>
                    <Col span="10"  v-if="showSetType =='02'?true:false">
                        <FormItem label="每个线程组并发数：" prop="per_threads">
                            <Input v-model="setValidate.per_threads" :number="true"></Input>
                        </FormItem>
                    </Col>
                    <Col span="10"  v-if="showSetType !='03'?true:false">
                        <FormItem label="每个线程组运行时常：" prop="per_duration">
                            <Input v-model="setValidate.per_duration" :number="true"></Input>
                        </FormItem>
                    </Col>
                    <Col span="10"  v-if="showSetType =='01'?true:false">
                        <FormItem label="间隔(毫秒)" prop="base_pacing">
                            <Input v-model="setValidate.base_pacing" :number="true"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row v-if="showSetType !='03'?true:false">
                    <Col span="10" offset="2">
                        <span>线程组个数：</span>
                        <span>{{setValidate.thread_groups_num}}</span>
                    </Col>
                    <Col span="10">
                        <span>运行时长:</span>
                        <span>{{totalTime}}</span>
                    </Col>
                </Row>
                <h2>线程组配置</h2>
                <br>
                 <Row v-for="(threadItem,index) in threadList" :key="index">
                    <Col span="8">
                        <FormItem :label-width="10" prop="thread_name">
                            <Checkbox v-model="threadItem.enable == 'true'?true:false" @on-change="isChecked(index)">{{threadItem.thread_name}}</Checkbox>  
                        </FormItem>
                    </Col>
                    <Col span="8" v-if="showSetType=='03'?true:false">
                        <FormItem label="组件并发数:" prop="thread_num">
                            <Input v-model="threadItem.thread_num"></Input>
                        </FormItem>
                    </Col>
                    <Col span="8" v-if="showSetType=='03'?true:false">
                        <FormItem label="间隔（毫秒）:">
                            <Input v-model="threadItem.pacing"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button color="#1c2438" @click="setCancel()">取消</Button>
                <Button type="primary" @click="setOk('setValidate')">确认</Button>
            </div>
        </Modal>
        <!--=================================监控配置模态框============================================-->
        <Modal v-model="showWathcModal" width="830">
            <p slot="header" style="color:#f60" >
                <span>监控配置</span>
            </p>
            <Form ref="moniterValidate" :model="moniterValidate" :label-width="80">
                <Row class="caseBoxRow">
                    <Col span="8">
                        <FormItem label="场景类型:" prop="inviro_type">
                            <Select v-model="moniterValidate.inviro_type" placeholder="---请选择---" clearable>
                                <Option value="01">组件组装非功能(CPT)_南湖</Option>
                                <Option value="02">组件组装非功能(CPT)_洋桥</Option>
                                <Option value="03">应用组装非功能(PT1+PT2)_南湖</Option>                      
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="物理子系统" prop="sComponent">
                            <Input v-model="moniterValidate.sComponent">
                            </Input>
                        </FormItem>
                    </Col>
                    <Col span="6" offset="1">
                        <Button @click="moniterCase" type="primary" icon="ios-search">查询</Button>
                        <Button @click="moniterReset('moniterValidate')">清除条件</Button>
                    </Col>
                </Row>
            </Form>
            <div align="left">
                <Button @click="moniterSave" type="primary">保存并修改</Button>
            </div>
            <Table border  ref="selection" :columns="moniterColumns" :data="tableData" class="myTable"  @on-selection-change="moniterSelectionChanged"></Table>
                <div class="pageBox" v-if="tableData.length">
                    <Page :total="parseInt(totalCount)" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
                    <p>总共{{totalPage}}页</p>
                </div>
            <div slot="footer">
                <Button color="#1c2438" @click="moniterCancel">取消</Button>
                <Button type="primary" @click="moniterOk('setValidate')">确认</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    name: 'TestCase',
    data () { 
        return {
            
            isbouterAlive: true,
            senario_name:'',                                      //场景名称             
            senario_type:'',                                      //场景类型
            senario_creator:'',                                  //创建人
            perf_task:'',                                    //关联任务
            perftaskNameLoading:false,
            script:'',                                      //脚本名称
            isShowMore:false,                                   //是否显示更多查询条件
            searchOpts:[],
            searchList:[],
            /**============新增模态框数据=========== */
            showAddModal:false,                  //新建窗口
            perftaskOpts:[],                     //关联任务下拉选项
            perftaskList:[],
            scriptOpts:[],                      //关联脚本下拉选项
            scriptList:[],
            perftaskLoading:false,
            isDisabled:true,                   //关联脚本下拉框是否禁用
            id:'',
            pNo:1,
            addValidate: {                                     
                    senario_type: '',                 
                    senario_name: '',   
                    fie: '',
                    ref_task_name: '',
                    ref_script_name: '',
            },
            ruleValidate: {        
                senario_name: [                
                    { required: true, message: '场景名称不能为空', trigger: 'blur' }              
                ],        
                senario_type: [                 
                    { required: true, message: '请选择场景类型', trigger: 'change' }            
                ],
                fie: [                 
                    { required: false, message: '描述不能为空', trigger: 'change' }            
                ],
                ref_task_name: [                 
                    { type:'number',required: true, message: '请选择任务', trigger: 'change' }     //默认校验的是string类型，select默认value是number类型，进行校验时需修改类型为number       
                ],
                ref_script_name: [                 
                    { type:'number',required: true, message: '请选择脚本', trigger: 'change' }            
                ],        
            },
            /*=================================表格数据========================*/
            columns: [                                                
            	{
                    type: 'selection',
                    width: 40,
                    align: 'center'
                },
                {
                    title: 'ID',
                    key: 'senario_id',
                    width: 60,
                },
                {
                    title: '关联任务',
                    key: 'perftask_name',
                    ellipsis: true, 
                    width:110,
                },
                {
                    title: '场景名称',
                    key: 'senario_name',
                    width:175,
                    ellipsis: true, 
                },
                {
                    title: '关联脚本',
                    key: 'script_name',
                    width:100,
                    align: 'center',
                    ellipsis: true, 
                },
                {
                    title: '场景类型',
                    key: 'senario_type',
                    width:100,
                    align: 'center',
                    render:(h,params) =>{
                        let _this = this;
                        //console.log("场景类型",h,params);
                        return h('span',_this.$Global.senarioType[params.row.senario_type])
                    }
                },
                {
                    title: '持续时长(分钟)',
                    key: 'duration',
                    width:120,
                    align: 'center',
                    render:(h,params)=>{
                        let _this = this;
                        //console.log("持续时长",params,params.row.duration,params.row.thread_groups_num,(params.row.duration * params.row.thread_groups_num));
                        if(params.row.senario_type == '03'){
                            return h('span',params.row.duration)
                        }else{
                            return h('span',(params.row.duration * params.row.thread_groups_num))
                        }
                    }
                },
                {
                    title: '线程组并发数',
                    key: 'threads_total',
                    width:110,
                    align: 'center',
                },
                {
                    title: '更新时间',
                    key: 'update_time',
                    width:148,
                    align: 'center',
                },
                {
                    title:'操作',
                    key:'operAtion',
                    width:160,
                    align: 'center',
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
                                        this.showWathcModal = true;
                                    }
                                }
                            },  '编辑'),
                            h('Button', {
                                props: {
                                    size: 'small',
                                    type:'success',
                                    icon:'ios-play',
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.showExeModal = true;
                                    }
                                }
                            }),
                            h('Button', {
                                props: {
                                    size: 'small',
                                    type:'info',
                                    icon:'ios-bookmarks',
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.showSetModal = true;
                                        console.log(item.row);
                                        this.showSetType =  item.row.senario_type;
                                        let _this = this;
                                        this.$http.defaults.withCredentials = false;
                                        this.$http.post('/myapi/senario/view',{
                                            header:{},
                                            data:{
                                                senario_id:item.row.senario_id,
                                            }
                                        }).then(function(response){
                                            console.log("view接口",response.data);
                                            _this.setValidate.senario_name= response.data.resultMap.senario_name;
                                            _this.setValidate.senario_desc=response.data.resultMap.senario_desc;
                                            _this.setValidate.max_conusrs_perpm=response.data.resultMap.max_conusrs_perpm;
                                            _this.setValidate.duration = response.data.resultMap.duration;
                                            _this.setValidate.per_threads = response.data.resultMap.threads_total;
                                            _this.setValidate.per_duration = response.data.resultMap.duration;
                                            _this.setValidate.base_pacing = response.data.resultMap.pacing;
                                            _this.setValidate.thread_groups_num = response.data.resultMap.thread_groups_num;
                                            _this.setValidate.senario_type = response.data.resultMap.senario_type;
                                            _this.setValidate.senario_id = response.data.resultMap.senario_id;
                                            _this.threadList = response.data.resultList;
                                        })
                                    }
                                }
                            }),
                            h('Button', {
                                props: {
                                    size:'small',
                                    type:'warning',
                                    icon:'ios-trash',
                                },
                                on: {
                                    click: () => {
                                        this.deleteDataCase(item.index)
                                    }
                                }
                            } ),
                        ])

                    }
                }
            ],
            tableData: [],
            tableDAtaTatol:0,
            tableDAtaPageLine:3,
            selectedData:[],                    //选中的项的数组
            totalCount:0,                         //共多少条数据
            pageNo:1,                            //当前页
            pageSize:10,                           //每页显示多少条数据
            totalPage:0,                           //共多少页
            /**====================执行模态框数据=================== */
            showExeModal:false,                  //执行窗口
            eveValidate: {        
                exeType:'00',                             //执行类型
                exeDateTime:new Date(),                         //执行时间
               

            },
            eveRuleValidate:{
                exeType:[
                    {required:true,message:"",trigger:"change"}
                ],
            },
            /**======================设置模态框数据========================== */
            showSetModal:false,
            showSetType:'',
            threadList:[],
            setValidate:{
                senario_type:'',
                senario_name:'',
                senario_desc:'',
                max_conusrs_perpm:'',                                //每台压力机最大并发数
                per_duration:'',                                       //每个线程运行时长
                base_pacing:'',                                       //间隔
                per_threads:'',                                        //每个线程组并发数
                duration:'',                                           //持续时长
                thread_groups_num:'',                                  //线程组个数
                senario_id:'',
            },
            setRuleValidate:{
                senario_name:[
                    {required:true,message:"这是必输字段",trigger:'blur'}
                ],
                senario_desc:[
                    {required:false,message:'',trigger:'blur'}
                ],
                max_conusrs_perpm:[
                    {type:'number',required:true,message:'',trigger:'blur'}
                ],
                per_duration:[
                    {type:'number',required:true,message:'这是必输字段',trigger:'blur'}
                ],
                base_pacing:[
                    {type:'number',required:true,message:'这是必输字段',trigger:'blur'}
                ],
                per_threads:[
                    {type:'number',required:true,message:'这是必输字段',trigger:'blur'}
                ],
                duration:[
                    {type:'number',required:true,message:'这是必输字段',trigger:'blur'}
                ],
            },
            /**==========================监控模态框数据========================= */
            showWathcModal:false,
            moniterSelectedData:[],
            moniterValidate:{
                inviro_type:'',
                sComponent:'',
            },
            moniterColumns:[
                {
                    type: 'selection',
                    width: 40,
                    align: 'center'
                },
                {
                    title: '#',
                    key: 'senario_id',
                    width: 60,
                },
                {
                    title: '环境类型',
                    key: 'perftask_name',
                    ellipsis: true, 
                    width:180,
                },
                {
                    title: '物理子系统',
                    key: 'senario_name',
                    width:140,
                    ellipsis: true, 
                },
                {
                    title: '部署单元',
                    key: 'script_name',
                    width:180,
                    align: 'center',
                    ellipsis: true, 
                    render:(h,params) => {
                        if(params.row.$isEdit){
                            return h('input',{
                                style: {
                                    'text-align':'center',
                                    width: params.column._width+'px',
                                    height: '48px',
                                    border: '0px',
                                    outline:'none',
                                    cursor: 'pointer',
                                    // 'background-color':'#f8f8f9'
                                },
                                domProps: {
                                    value: params.row.script_name,
                                    autofocus: true
                                },
                                on: {
                                    input: function (event) {
                                        params.row.script_name = event.target.value
                                    }
                                }
                            });
                        }else{
                            return h('div',params.row.script_name)
                        }
                        
                    }
                },
                {
                    title: 'IP',
                    key: 'senario_type',
                    width:120,
                    align: 'center',
                    render:(h,params) =>{
                        let _this = this;
                        //console.log("场景类型",h,params);
                        return h('span',_this.$Global.senarioType[params.row.senario_type])
                    }
                },
                {
                    title: 'Action',
                    key: 'action',
                    align:'center',
                    render: (h, params) => {
                        if(params.row.$isEdit ){
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
                                          this.handleSave(params.row) 
                                    }
                                }
                            },'保存'),
                        
                        ])
                        }else{
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleEdit(params.row)
                                        }
                                    }
                                },'编辑'),
                            
                            ])
                        }
                                            
                    }
                }
                //evnInfo:store.getters.evnList
            ],
        }
    },
    mounted:function () {
      },
    created(){
        this.listCase();
        
    },
    computed: {
      totalTime:function(){
          return this.setValidate.per_duration*this.setValidate.thread_groups_num;
      }, 
    },
    methods: {
        
        /**========================================加载列表中的数据======================================= */
        listCase: function() {
            let _this = this;
            console.log( "表单数据",_this.senario_type,_this.senario_name,_this.senario_creator,_this.is_deleted,_this.perftask_name,_this.script_name);
            this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/senario/list', {
                data: {
                    senario_type: _this.senario_type, 
                    senario_name:_this.senario_name,
                    senario_creator:_this.senario_creator,
                    perf_task:_this.perf_task,
                    script:_this.script,
                    pageno:_this.pageNo,
                    pagesize:_this.pageSize,
                }
            }).then(function (response) {
                console.log(response);
                console.log('请求回来的表格数据: ', response.data.resultList);
                _this.tableData = response.data.resultList;
                _this.totalCount = response.headers.totalcount;
                _this.totalPage = response.headers.totalpage;
                _this.searchOpts = response.data.resultList.map(item=>{
                    return {
                        perfTaskID:item.perf_task,
                        perfTaskName:item.perftask_name,
                        scriptID:item.script,
                        scriptName:item.script_name,
                    }
                })
                console.log("搜索提示选项",_this.searchOpts)
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
        perftaskNameRemote:function(query){
            let _this = this;
            console.log('query',query);
            console.log("搜索关联任务",_this.perf_task);   
            this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/senario/list',{
                header:{},
                data:{
                    perftask_name:query,
                }
            }).then(function(response){
                _this.searchOpts = response.data.resultList.map(item=>{
                    return {
                        perfTaskID:item.perf_task,
                        perfTaskName:item.perftask_name,
                        scriptID:item.script,
                        scriptName:item.script_name,
                    }
                })
            })
        },
        perfScriptRemote:function(query){
            let _this = this;  
            this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/senario/list',{
                header:{},
                data:{
                    script_name:query,
                }
            }).then(function(response){
                _this.searchOpts = response.data.resultList.map(item=>{
                    return {
                        perfTaskID:item.perf_task,
                        perfTaskName:item.perftask_name,
                        scriptID:item.script,
                        scriptName:item.script_name,
                    }
                })
            })
        },
        /**============================删除多条数据========================= */
        deleteCase: function () {
            //console.log("删除多条按钮");
            let selectedData = this.selectedData;      //选中要删除的数据
            let deleteId = [];                       //选中数据的id
            if (selectedData.length > 0) {               //如果有选中的数据
                for (let i in selectedData) {         //进行遍历
                    deleteId.push(selectedData[i].senario_id);  //将选中的而数据的id放入要删除的集合中
                    //console.log(selectedData[i].id);
                    //console.log(deleteId);
                    this.deleteData(deleteId);            //调用删除数据的方法，将tableData中的数据删除
                }
                console.log("删除多条的id",deleteId);
            } else {
                this.$Message.error("请选择要删除的数据")
            }
        }, 
        deleteData:function(deleArr) {                //调用方法将原有数据中对应的id删除
            console.log("删除多台哦数据内容",deleArr)
            let _this = this;
            let tableData = _this.tableData;          //原有的数据
            tableData.forEach((item, index) => {      //对原有的数据进行遍历
                if (deleArr.includes(item.senario_id)) {       //当原有的数据与要删除的数据中有相同的数据时，
                    _this.$Modal.confirm({
                        title:'确认',
                        content: '是否删除该数据',
                        onOk: () => {
                            this.$http.defaults.withCredentials = false;
                            this.$http.post("/myapi/senario/del",{
                                header:{},
                                data:{
                                    ids:deleArr,
                                }
                            }).then(function(){
                                tableData.splice(index, 1);        //即删除该数据上
                                _this.$Message.info('删除成功');
                            })
                        },
                        onCancel: () => {
                            _this.$Message.info('删除失败');
                        }
                    }); 
                   
                }
            });
        },
            /**选中的数据发生改变 */
        onSelectionChanged: function(data) {
            this.selectedData = data;
            console.log("选中要删除的数据",this.selectedData)
            //console.log(data)
        },
        
        /**================================删除一条数据================================ */
        deleteDataCase:function (index){      
            //console.log("删除单条按钮");
            let _this = this;
            let tableData = _this.tableData;
            console.log(tableData[index]);
            _this.$Modal.confirm({
                title:'确认',
                content: `是否删除该数据`,
                onOk: () => {
                    this.$http.defaults.withCredentials = false;
                    this.$http.post("/myapi/senario/del",{
                        header:{},
                        data:{
                            ids:[tableData[index].senario_id],
                        }
                    }).then(function(){
                        tableData.splice(index, 1);
                        _this.$Message.info('删除成功');
                    })
                },
                onCancel:() => {
                    _this.$Message.info('删除失败');
                }
            });       
            
        },

       
        /**添加新数据弹出模态框 */
        addCase:function(){
            this.showAddModal = true;
            this.perftask();
            //console.log("显示模态框");
        },
        /***================================新增模态框事件===========================================*/
        handleSubmit:function (name) {
            let  _this = this;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    console.log("开始添加");
                    this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/senario/add',{
                        data:{
                            senario_type:_this.addValidate.senario_type,
                            senario_name:_this.addValidate.senario_name,
                            senario_desc:_this.addValidate.fie,
                            perf_task:_this.addValidate.ref_task_name,
                            script:_this.addValidate.ref_script_name,
                        }
                    }).then(function(response){
                        console.log("响应回来的数据",response);
                        _this.$Message.success('提交成功!');
                        _this.showAddModal = false;
                        console.log("添加成功");
                        _this.$refs[name].resetFields();
                        _this.isDisabled = true;
                        _this.perftaskOpts = _this.perftaskList;
                    })
                } else {
                    _this.$Message.error('表单验证失败!');
                }
                console.log(_this);                 //方法接口写好时再清空之前输入的
                 //this.$refs[name].resetFields();
            });
            
        },
         /**新增模态框弹出取消事件 */
        Addcancel:function () {
             //this.$Message.info('点击了取消');
            this.showAddModal = false;
        },
        /**通过任务管理加载出来的关联任务 */
        perftask:function(){
            let _this = this;
            this.$http.defaults.withCredentials = false;
            this.$http.post("/myapi/perftask/list",{
                data:{
                    perftask_name:_this.addValidate.ref_task_name,    //第一次请求时关联任务为空
                }
            }).then(function(response){
                // console.log("任务管理请求回的数据",response.data.resultList);
                // console.log("传到后台的任务管理数据",_this.addValidate.ref_task_name);
                _this.perftaskList = response.data.resultList;
                _this.perftaskOpts = _this.perftaskList.map(item=>{
                    return {
                        value:item.id,
                        label:item.perftask_name,
                    }
                })
                console.log("关联任务选项",_this.perftaskOpts);
                console.log('response',response);
            })
        },
        /**远程加载关联任务方法 */
        perftaskRemote:function(query){
            if(query !== ''){
                console.log("输入的参数",query);
                this.perftaskLoading = true;
                setTimeout(() => {
                    this.perftaskLoading = false;
                    let _this = this;
                    this.$http.defaults.withCredentials = false;
                    this.$http.post("/myapi/perftask/list",{
                        data:{
                            perftask_name:query,
                        }
                    }).then(function(response){
                        console.log("任务管理请求回的数据",response.data.resultList);
                        console.log("传到后台的任务管理数据",_this.addValidate.ref_task_name);
                        _this.perftaskOpts =response.data.resultList.map(item=>{
                            return {
                                value:item.id,
                                label:item.perftask_name,
                            }
                        })
                        console.log("关联任务选项",_this.perftaskList);
                    })
                }, 200);
             }else{
                 _this.perftaskOpts = _this.perftaskList;
                 _this.isDisabled = true;
            }
        },
        
        /**关联任务选中项改变时根据id加载對應关联脚本 */
        perftaskOptChange:function(){
            let _this = this;
            _this.id = _this.addValidate.ref_task_name;
            this.$http.defaults.withCredentials = false;
            this.$http.post("/myapi/perftask/taskRelatedScript",{
                data:{
                    id:_this.id
                }
            }).then(function(response){
                console.log("关联脚本返回数据",response.data.resultList,response.data.resultList.length)
                if(response.data.resultList.length == 0){
                    _this.isDisabled = true;
                }else{
                    _this.isDisabled = false;
                    _this.scriptOpts = response.data.resultList.map(item=>{
                        return {
                            value:item.id,
                            label:item.script_name,
                        }
                    })
                }
            })
        },
        perftaskClear:function(){
            console.log("关联任务中的内容被清空了");
            this.addValidate.ref_script_name = '';
            this.isDisabled = true;
            
        },
        /**远程加载关联脚本数据 */
        refscriptRemote:function(query){
            
            if(query !== ''){
                console.log("输入的脚本参数",query);
                this.perftaskLoading = true;
                setTimeout(() => {
                    this.perftaskLoading = false;
                    let _this = this;
                    this.$http.defaults.withCredentials = false;
                    this.$http.post("/myapi/perftask/taskRelatedScript",{
                        data:{
                            script_name:query,
                            id:_this.id,
                        }
                    }).then(function(response){
                        console.log("远程加载管理脚本的数据",response.data.resultList);
                         _this.isDisabled = false;
                        _this.scriptOpts =response.data.resultList.map(item=>{
                                return {
                                    value:item.id,
                                    label:item.script_name,
                                }
                            })
                        console.log("远程加载回来之后关联脚本的数据",_this.scriptOpts)
                    })
                }, 200);
             }else{
              _this.scriptOpts=[];
            }
        },
        perftaskReachBottom:function(){
            console.log("到达底部了");
            let _this = this;
            return new Promise(resolve => {
                setTimeout(()=>{
                    this.$http.defaults.withCredentials = false;
                    this.$http.post("/myapi/perftask/list",{
                        header:{},
                        data:{
                            pageno:_this.pNo+1,
                        },
                    }).then(function(response){
                        console.log("触底响应",response.headers.pageno);
                        console.log(response);
                        _this.perftaskList = response.data.resultList.map(item=>{
                            return {
                                value:item.id,
                                label:item.perftask_name,
                            }
                        });
                        console.log(_this.perftaskList);
                        _this.perftaskOpts = _this.perftaskOpts.concat(_this.perftaskList);
                        console.log(_this.perftaskOpts);
                        if(_this.pNo < response.headers.totalpage){
                            _this.pNo++;
                        }else{
                            console.log("没有更多了")
                        }
                    })
                },200)
            })
        },
        /**=========================================执行模态框事件==================================== */
        /**确认事件 */
        exeOk:function(){
            
            if(this.eveValidate.exeType == '00'){
                console.log(new Date());
            }else{
                console.log(this.eveValidate.exeDateTime);
            }
            this.showExeModal = false;
        },
        /**取消事件 */
        exeCancel:function(){
            this.showExeModal = false;
        },





        /**================================设置模态框事件================================ */
        setOk:function(name){
            this.$refs[name].validate((valid) => {
                let _this = this;
                if (valid) {
                    this.$http.defaults.withCredentials = false;
                    this.$http.post("/myapi/senario/settings",{
                        header:{},
                        data:{
                            senario_id:_this.setValidate.senario_id,
                            senario_name:_this.setValidate.senario_name,
                            senario_desc: _this.setValidate.senario_desc,
                            max_conusrs_perpm:_this.setValidate.max_conusrs_perpm,
                            per_duration:_this.setValidate.per_duration,
                            base_pacing:_this.setValidate.base_pacing,
                            per_threads:_this.setValidate.per_threads,
                            duration:_this.setValidate.duration,
                            scene:_this.threadList,
                        },
                    }).then(function(response){
                        _this.$Message.success('提交成功!');
                        _this.showSetModal = false;
                        console.log('response',);
                        console.log(_this.threadList);
                    })
                    
                } else {
                    this.$Message.error('表单验证失败!');
                }
                console.log(_this);                 //方法接口写好时再清空之前输入的
                console.log(_this.setValidate);
                 //this.$refs[name].resetFields();
            });
        },
        setCancel:function(){
            this.showSetModal = false;
        },
        isChecked:function(){
            var checkedNum = 0,unCheckedNum = 0;
            this.threadList.map(item=>{
                if(item.enable == true){
                    checkedNum ++;
                }else{
                    unCheckedNum ++;
                }
            })
            this.setValidate.thread_groups_num = checkedNum;
            console.log(checkedNum);
            console.log(unCheckedNum);
            console.log(this.threadList);
        },
        /**=============================监控配置事件=============================== */
        /**取消事件 */
        moniterCancel:function(){
            this.showWathcModal = false;
            console.log('监控取消事件');
        },
        /**确认事件 */
        moniterOk:function(){
            console.log('监控确认事件');
        },
        /**查询条件清除 */
        moniterReset:function(name){
            this.$refs[name].resetFields();
        },
        /**列表查询 */
        moniterCase:function(){
            
        },
        /**保存并修改事件 */
        moniterSave:function(){
            if(this.moniterSelectedData.length > 0){

            }else{
                this.$Message.error("请选择要删除的数据");
            }
        },
        /**选中的数据 */
        moniterSelectionChanged:function(data){
            this.moniterSelectedData = data;
            console.log("选中的数据",this.moniterSelectedData);
        },

        handleEdit:function(row) {
            this.$set(row, '$isEdit', true)
        },
        handleSave:function(row) {
            this.$set(row, '$isEdit', false)

        },
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
    .btn_selected, .header .h_menu .h_menu_btn_all .h_menu_btn:hover {
        color: #01babc;
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
        width:90%;
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
    .actionBtn{
        width: 16%;
    }
    // .caseBoxRow{
    //     padding-bottom:10px;
    // }
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


    /*是否显示更多箭头样式*/
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
    .arrUp{
        transform: rotate(-180deg);
        transform-origin: center center;
    }
    .arrDown{
        transform: rotate(0deg);
        transform-origin: center center;
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
</style>
