<template>
	<div class="pageContent">
        <Card>
            <div class="caseBox">
                <h3 class="Title">
                    <span>场景管理</span>
                </h3>
            <!--==================================form 表单============================================-->
                <Form ref="formValidate" :model="formValidate" class="formValidate" :label-width="80" v-show="isbouterAlive">
                    <div class="rowbox">
                        <Row class="caseBoxRow">
                            <Col span="8">
                                <FormItem label="场景类型:" prop="senario_type">
                                    <Select v-model="formValidate.senario_type" clearable @keyup.enter.native= listCase()>
                                        <Option  value="01">单交易基准</Option>
                                        <Option  value="02">单交易负载</Option>
                                        <Option  value="03">混合场景</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="场景名称:" prop="senario_name">
                                    <Input v-model="formValidate.senario_name" placeholder="输入场景名称" @keyup.enter.native= listCase()></Input>
                                </FormItem>
                            </Col>
                            
                            <Col span="8">
                                <Button @click="listCase" type="primary" icon="ios-search" class="actionBtn">查询</Button>
                                <Button @click='searchReset("formValidate")' class="actionBtn">重置</Button>
                            </Col>
                        </Row>
                        <Row class="caseBoxRow" v-show="isShowMore">
                            <Col span="8">
                                <FormItem label="创建人:" prop="senario_creator">
                                <!--输入查询==》支持远程搜索-->
                                <!-- <Input v-model="formValidate.senario_creator" placeholder="输入场景创建人" @keyup.enter.native= listCase()></Input> -->
                                <Select v-model="formValidate.senario_creator" placeholder="输入场景创建人" clearable filterable remote :remote-method="senarioCreatorRemote" :loading="perftaskNameLoading" @on-open-change="senario_creator" @keyup.enter.native= listCase()>
                                        <Option v-for="(opts,index) in searchCreatorOpts"  :value="opts.id" :key="index">{{opts.member_name}}({{opts.username}})</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="关联任务:" prop="perf_task">
                                    <Select v-model="formValidate.perf_task" placeholder="至少输入一个字段查询" clearable filterable remote :remote-method="perftaskNameRemote" :loading="perftaskNameLoading" @keyup.enter.native= listCase()>
                                        <Option v-for="(opts,index) in searchOpts"  :value="opts.perfTaskID" :key="index">{{opts.perfTaskName}}</Option>
                                    </Select>
                                    <!-- <Input v-model="perftask_name" placeholder="输入关联任务"></Input> -->
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="关联脚本:" prop="script">
                                    <Select v-model="formValidate.script" placeholder="至少输入一个字段查询" clearable filterable remote :remote-method="perfScriptRemote" :loading="perftaskNameLoading" @keyup.enter.native= listCase()>
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
                    <Button @click="deleteCase" type="error" class="actionBtn">删除</Button>
                </div>
                <div class="tableBox">
                    <Table border :loading="isLoadingList" ref="selection" :columns="columns" :data="tableData" class="myTable"  @on-select="onSelect" @on-select-cancel="onSelectCancel" show-header></Table>
                    <div class="pageBox" v-if="tableData.length">
                        <Page :total="parseInt(totalCount)" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
                        <p>总共{{totalPage}}页</p>
                    </div>
                </div>
            </div>

        <!--============================================删除任务模态框==================================-->
            <Modal v-model="delSenarioModal" width="800" :closable="false" :mask-closable="false">
                <p slot="header" style="color:#f60" >
                    <span>请确认是否删除以下任务</span>
                </p>
                <!--<Form ref="delPTaskValidate" :model="delPTaskValidate" :label-width="120">-->
                    <Row v-for="(Item,index) in deleteDataList" :key="index">
                        <Col span="3" class="delShowTitle"><Icon type="ios-close" /></Col>
                        <Col span="2" class="delShowTitle">id: </Col>
                        <Col span="1">{{Item.senario_id}}</Col>
                        <Col span="3" class="delShowTitle">任务名称: </Col>
                        <Col span="13">{{Item.senario_name}}</Col>
                        <Col span="2"></Col>
                    </Row>
                <!--</Form>-->
                <div slot="footer">
                    <Button color="#1c2438" @click="delMonitorCancel">取消</Button>
                    <Button type="primary" @click="delMonitorOk">确认</Button>
                </div>
            </Modal>
            <!--=========================未删除成功模态框======================================-->
             <Modal v-model="noDeleteModal" width="800" :closable="false" :mask-closable="false">
                <p slot="header" style="text-align:center" >
                    <span>以下任务在进行中，未删除成功</span>
                </p>
                    <Row v-for="(Item,index) in notDeleteList" :key="index">
                        <Col span="3" class="delShowTitle"><Icon type="ios-close" /></Col>
                        <Col span="2" class="delShowTitle">id: </Col>
                        <Col span="1">{{Item.id}}</Col>
                        <Col span="3" class="delShowTitle">任务名称: </Col>
                        <Col span="13">{{Item.senario_name}}</Col>
                        <Col span="2"></Col>
                    </Row>
            </Modal>
        <!--========================================创建场景模态框：=================================-->
            <Modal v-model="showAddModal" width="800" :closable="false" :mask-closable="false">
                <p slot="header" style="color:#f60" >
                    <span>新增</span>
                </p>
                <div style="text-align:center">
                <Form ref="addValidate" :model="addValidate" :rules="ruleValidate" :label-width="80">
                    <FormItem label="场景类型:" prop="senario_type">
                    <Select v-model="addValidate.senario_type" placeholder="请选择场景类型" clearable @keyup.enter.native= "handleSubmit('addValidate')">
                            <Option value="01">单交易基准</Option>
                            <Option value="02">单交易负载</Option>
                            <Option value="03">混合场景</Option>                      
                        </Select>
                    </FormItem>
                    <FormItem label="场景名称:" prop="senario_name">                      
                    <Input v-model="addValidate.senario_name" placeholder="请输入场景名称" @keyup.enter.native= "handleSubmit('addValidate')"></Input>
                    </FormItem>
                    <FormItem label="场景描述:" prop="fie">
                        <Input placeholder="请填写场景描述"  v-model="addValidate.fie" type="textarea" name="senario_desc" :autosize='true' id="field_senario_desc" @keyup.enter.native= "handleSubmit('addValidate')"></Input>
                    </FormItem>
                    <FormItem label="关联任务:" prop="ref_task_name">
                        <Select v-model="addValidate.ref_task_name" placeholder="至少输入一个字段查询" clearable filterable remote :remote-method="perftaskRemote" :loading="perftaskLoading" @on-change="perftaskOptChange" :label-in-value="true" @on-clear="perftaskClear" @on-open-change="perftask" @keyup.enter.native= "handleSubmit('addValidate')">
                            <!-- <Scroll :on-reach-bottom="perftaskReachBottom"> -->
                                <Option v-for="(opts,index) in perftaskOpts" :value="opts.value" :key="index">{{opts.label}}</Option>    
                            <!-- </Scroll>                 -->
                        </Select>
                    </FormItem>
                    <FormItem label="关联脚本:" prop="ref_script_name">
                        <Select v-model="addValidate.ref_script_name" placeholder="请选择脚本" clearable :disabled="isDisabled" filterable remote :remote-method="refscriptRemote" :loading="perftaskLoading" @on-open-change="script" @keyup.enter.native= "handleSubmit('addValidate')">
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
            <Modal v-model="showExeModal" width="800" :closable="false" :mask-closable="false">
                <p slot="header" style="color:#f60" >
                    <span>执行时间设置</span>
                </p>
                <Form ref="eveValidate" :model="eveValidate" :rules="eveRuleValidate" :label-width="100" label-position="left">
                    <FormItem label="执行类型" prop="exeType">
                        <RadioGroup v-model="eveValidate.exeType" vertical >
                            <Radio label="1" checked>立即执行</Radio>
                            <Radio label="2">定时执行</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="预设启动时间" v-show="eveValidate.exeType=='2'?true:false">
                        <DatePicker type="datetime" placeholder="选择日期" v-model="eveValidate.exeDateTime"></DatePicker>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button color="#1c2438" @click="exeCancel()">取消</Button>
                    <Button type="primary" @click="exeOk()">确认</Button>
                </div>
            </Modal>

        <!--======================================场景设置模态框======================================-->
            <Modal v-model="showSetModal" width="800" :closable="false" :mask-closable="false">
                <p slot="header" style="color:#f60" >
                    <span>编辑场景</span>
                </p>
                <Form ref="setValidate" :model="setValidate" :rules="setRuleValidate" :label-width="120">
                    <h2>基本属性</h2>
                    <FormItem label="场景名称 ：" prop="senario_name">                      
                    <Input v-model="setValidate.senario_name"></Input>
                    </FormItem>
                    <FormItem label="场景描述 ：" prop="senario_desc">
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
                        <Col span="12"  v-if="showSetType =='02'?true:false">
                            <FormItem label="每个线程组并发数 ：" prop="per_threads" :label-width="140">
                                <Input v-model="setValidate.per_threads" :number="true"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12"  v-if="showSetType !='03'?true:false">
                            <FormItem label="每个线程组运行时长 ：" prop="per_duration" :label-width="150">
                                <Input v-model="setValidate.per_duration" :number="true"></Input>
                            </FormItem>
                        </Col>
                        <Col span="10" offset="1" v-if="showSetType =='01'?true:false">
                            <FormItem label="间隔(毫秒) ：" prop="base_pacing">
                                <Input v-model="setValidate.base_pacing" :number="true"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row v-if="showSetType !='03'?true:false">
                        <Col span="10" offset="2">
                            <span>线程组个数 ： </span>
                            <span>{{setValidate.thread_groups_num}}</span>
                        </Col>
                        <Col span="9" offset="3">
                            <span>运行时长 ：</span>
                            <span>{{totalTime}}</span>
                        </Col>
                    </Row>
                    <h2>线程组配置</h2>
                    <br>
                    <Row v-for="(threadItem,index) in threadList" :key="index">
                        <Col span="20"  v-if="showSetType !='03'?true:false">
                            <FormItem :label-width="10" prop="thread_name">
                                <Checkbox v-model="threadItem.enable" @on-change="isChecked(index)">{{threadItem.thread_name}}</Checkbox>  
                            </FormItem>
                        </Col>
                        <Col span="8"  v-if="showSetType=='03'?true:false">
                            <FormItem :label-width="10" prop="thread_name">
                                <Checkbox v-model="threadItem.enable" @on-change="isChecked(index)">{{threadItem.thread_name}}</Checkbox>  
                            </FormItem>
                        </Col>
                        <Col span="8" v-if="showSetType=='03'?true:false">
                            <FormItem label="组件并发数 ：" prop="thread_num">
                                <Input v-model="threadItem.thread_num"></Input>
                            </FormItem>
                        </Col>
                        <Col span="8" v-if="showSetType=='03'?true:false">
                            <FormItem label="间隔（毫秒）：">
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
            <Modal v-model="showMoniterModal" width="830" :closable="false" :mask-closable="false">
                <p slot="header" style="color:#f60" >
                    <span>监控配置</span>
                </p>
                <Form ref="moniterValidate" :model="moniterValidate" :label-width="80" >
                    <Row class="caseBoxRow">
                        <Col span="9">
                            <FormItem label="IP" prop="ip">
                                <Input v-model="moniterValidate.ip" @keyup.enter.native = moniterCase() clearable @on-blur="onBlurMonitorSearch">
                                </Input>
                            </FormItem>
                        </Col>
                        <Col span="10">
                            <FormItem label="系统名称" prop="sComponent">
                                <Select clearable v-model="moniterValidate.sComponent" placeholder="请选择系统" clearable filterable remote :remote-method="scomponentRemote" :loading="scomponentLoading" @on-open-change="openMonitorChange" @keyup.enter.native = moniterCase()  @on-clear="clearMonitorSearch">
                                <Option v-for="(opts,index) in scomponentOpts" :value="opts.label" :key="index">{{opts.label}}</Option>          
                        </Select>
                            </FormItem>
                        </Col>
                        <Col span="5">
                            <Button @click="moniterCase" type="primary" icon="ios-search">查询</Button>
                            <Button @click="moniterReset('moniterValidate')">重置</Button>
                        </Col>
                    </Row>
                    <Row v-show="isShowMoniterMore">
                        <Col span="10">
                            <FormItem label="环境类型:" prop="inviro_type">
                                <Select v-model="moniterValidate.inviro_type" placeholder="---请选择---" clearable @keyup.enter.native = moniterCase()  @on-clear="clearMonitorSearch">
                                    <Option value="组件组装非功能(CPT)_南湖">组件组装非功能(CPT)_南湖</Option>
                                    <Option value="组件组装非功能(CPT)_洋桥">组件组装非功能(CPT)_洋桥</Option>
                                    <Option value="应用组装非功能(PT1+PT2)_南湖">应用组装非功能(PT1+PT2)_南湖</Option> 
                                    <Option value="应用组装非功能(PT1+PT2)_洋桥">应用组装非功能(PT1+PT2)_洋桥</Option>        
                                    <Option value="南湖搬迁专项区_洋桥">南湖搬迁专项区_洋桥</Option>               
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div class="formValidateMoreBtnBox" :class="isShowMoniterMore ?'arrUp':'arrDown'" @click="isShowMoniterMore = !isShowMoniterMore">
                        <Icon type="chevron-down" color="#fff" ></Icon>
                        <Icon type="chevron-down" color="#fff" ></Icon>
                    </div>
                <!--添加区域-->
                <Form ref="monitorAddValidate" :model="monitorAddValidate" :rules="monitorAddRules" :label-width="100" class="tableBox" v-show="monitorAddShow">
                    <Row>
                        <Col span="11">
                            <FormItem label="系统名称" prop="subSysName">
                                <Select  v-model="monitorAddValidate.subSysName" clearable placeholder="请选择物理子系统" clearable filterable remote :remote-method="scomponentAddRemote" :loading="scomponentAddLoading" @on-open-change="openMonitorAddChange"  @keyup.enter.native = 'monitorAddSave("monitorAddValidate")'>
                                    <Option v-for="(opts,index) in scomponentAddOpts" :value="opts.label" :key="index">{{opts.label}}</Option>          
                                </Select>
                                <!-- <Input v-model="monitorAddValidate.subSysName" clearable></Input> -->
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="环境类型" prop="subAreaName">
                                <Select v-model="monitorAddValidate.subAreaName" placeholder="---请选择---" clearable  @keyup.enter.native = 'monitorAddSave("monitorAddValidate")'>
                                    <Option value="组件组装非功能(CPT)_南湖">组件组装非功能(CPT)_南湖</Option>
                                    <Option value="组件组装非功能(CPT)_洋桥">组件组装非功能(CPT)_洋桥</Option>
                                    <Option value="应用组装非功能(PT1+PT2)_南湖">应用组装非功能(PT1+PT2)_南湖</Option> 
                                    <Option value="应用组装非功能(PT1+PT2)_洋桥">应用组装非功能(PT1+PT2)_洋桥</Option>        
                                    <Option value="南湖搬迁专项区_洋桥">南湖搬迁专项区_洋桥</Option>               
                                </Select>
                            </FormItem>
                        </Col>
                        
                    </Row>
                    <Row class="caseBoxRow">
                        <Col span="11">
                            <FormItem label="操作系统类型" prop="osVersion">
                                <Select v-model="monitorAddValidate.osVersion" placeholder="---请选择---" clearable @keyup.enter.native = 'monitorAddSave("monitorAddValidate")'>
                                    <Option value="hp">hp</Option>
                                    <Option value="linux">linux</Option>
                                    <Option value="aix">aix</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="部署单元" prop="funDesc" >
                                <Input v-model="monitorAddValidate.funDesc" placeholder="请输入内容" @keyup.enter.native = 'monitorAddSave("monitorAddValidate")'></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row class="caseBoxRow">
                        <Col span="11">
                            <FormItem label="ip地址" prop="prodIp" >
                                <Input v-model="monitorAddValidate.prodIp" placeholder="请输入内容" @keyup.enter.native = 'monitorAddSave("monitorAddValidate")'></Input>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="用户名" prop="userName" >
                                <Input v-model="monitorAddValidate.userName" placeholder="请输入内容" @keyup.enter.native = 'monitorAddSave("monitorAddValidate")'></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row class="caseBoxRow">
                        <Col span="11">
                            <FormItem label="密码" prop="password" >
                                <Input v-model="monitorAddValidate.password" placeholder="请输入内容" @keyup.enter.native = 'monitorAddSave("monitorAddValidate")'></Input>
                            </FormItem>
                        </Col>
                        <Col span="8" offset="3">
                            <Button type="success" @click='monitorAddSave("monitorAddValidate")'>保存</Button>
                            <Button type="warning" @click='monitorDissmissAdd'>取消添加 </Button>
                            <Button @click='monitorAddReset("monitorAddValidate")'>重置</Button>
                        </Col>
                    </Row>
                </Form>
                <div align="left">
                    <Button @click="moniterSave" type="primary">保存并修改</Button>
                    <Button @click="moniterAdd" type="success">新增</Button>
                </div>
                <div class="tableBox" v-if="showSearchTable">
                    <Table border :loading="isLoading"  ref="selectionMonitor" :columns="moniterColumns" :data="moniterTableData" class="myTable"  @on-select="moniterOnSelection" @on-select-cancel="onMonitorSelectCancel" @on-select-all="moniterOnSelectionAll" @on-select-all-cancel="onMonitorSelectCancelAll"></Table>
                        <div class="pageBox" v-if="moniterTableData != undefined">
                            <Page :total="parseInt(moniterTotalCount)" show-elevator show-total show-sizer @on-change="moniterPageChange" @on-page-size-change="moniterPageSizeChange"></Page>
                            <p>总共{{moniterTotalPage}}页</p>
                        </div>
                </div>
                <div class="tableBox" v-else>
                    <Table border  ref="selectionMonitor" :columns="moniterColumns" :data="moniterTableData" class="myTable"  @on-select="moniterOnSelection" @on-select-cancel="onMonitorSelectCancel" @on-select-all="moniterOnSelectionAll" @on-select-all-cancel="onMonitorSelectCancelAll"></Table>
                        <div class="pageBox" v-if="moniterTableData != undefined">
                            <Page :total="parseInt(moniterTotalCount)" show-elevator show-total show-sizer @on-change="moniterPageChange" @on-page-size-change="moniterPageSizeChange"></Page>
                            <p>总共{{moniterTotalPage}}页</p>
                        </div>
                </div>
                <div slot="footer">
                    <Button color="#1c2438" @click="moniterCancel">取消</Button>
                    <Button type="primary" @click="moniterOk('setValidate')">确认</Button>
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
            isLoadingList:true,
            isLoading:true,
            timer:null,
            isbouterAlive: true,
            formValidate:{
                senario_name:'',                                      //场景名称             
                senario_type:'',                                      //场景类型
                senario_creator:'',                                  //创建人
                perf_task:'',                                    //关联任务
                script:'',                                      //脚本名称
            },
            perftaskNameLoading:false,
            isShowMore:false,                                   //是否显示更多查询条件
            searchCreatorOpts:[],
            searchOpts:[],
            searchList:[],
            /**============删除模态框数据========= */
            delSenarioModal:false,
            deleteDataList:[],
            noDeleted:[],
            noDeleteModal:false,
            notDeleteList:[],
            /**============新增模态框数据=========== */
            showAddModal:false,                  //新建窗口
            perftaskOpts:[],                     //关联任务下拉选项
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
                    align: 'center',
                },
                {
                    title: 'ID',
                    key: 'senario_id',
                    width: 60,
                },
                {
                    title: '关联任务',
                    key: 'perftask_name',
                    //ellipsis: true, 
                    align:'center',
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
                                    title: params.row.perftask_name
                                }
                            }, params.row.perftask_name)
                        ]);
                    }
                },
                {
                    title: '场景名称',
                    key: 'senario_name',
                    //ellipsis: true, 
                    align:'center',
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
                                    title: params.row.senario_name
                                }
                            }, params.row.senario_name)
                        ]);
                    }
                },
                {
                    title: '关联脚本',
                    key: 'script_name',
                    align: 'center',
                    ellipsis: true, 
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
                    title: '场景类型',
                    key: 'senario_type',
                    align: 'center',
                    render:(h,params) =>{
                        let _this = this;
                        //console.log("场景类型",h,params);
                        return h('span',_this.$Global.senarioType[params.row.senario_type])
                    },
                },
                {
                    title: '持续时长(分钟)',
                    key: 'duration',
                    align: 'center',
                    width: 70,
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
                    align: 'center',
                    width: 70,
                },
                {
                    title: '更新时间',
                    key: 'update_time',
                    align: 'center',
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
                                    title: params.row.update_time
                                }
                            }, params.row.update_time)
                        ]);
                    }
                },
                {
                    title:'操作',
                    key:'operAtion',
                    width:200,
                    align: 'center',
                    render: (h, item) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    size: 'small',
                                    type:'success',
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        let _this = this;
                                        _this.id = item.row.senario_id;
                                        _this.showExeType =  item.row.senario_type;
                                        //this.$http.defaults.withCredentials = false;
                                        this.$http.post('/myapi/senario/execStatus',{
                                            header:{},
                                            data:{
                                                senario_id:_this.id
                                            }
                                        }).then(function(response){
                                            console.log(response.data.resultMap.isRun);
                                            if(response.data.resultMap.isRun){
                                                _this.$Message.error("该任务正在进行，无法重复执行");
                                            }else{
                                                _this.showExeModal = true;
                                            }
                                        })
                                    }
                                }
                            },'执行'),
                            h('Button', {
                                props: {
                                    size: 'small',
                                    type:'info',
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
                                        //this.$http.defaults.withCredentials = false;
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
                            },'设置'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.showMoniterModal = true;
                                        this.id = item.row.senario_id;
                                        this.monitor_senario_id = item.row.senario_id;
                                        this.showSetType =  item.row.senario_type;
                                        this.moniterListCase();
                                        this.moniterSelectedData = [];
                                    }
                                }
                            },'监控配置'),
                            
                        ])

                    }
                }
            ],
            checkedId:[],
            tableData: [],
            tableDAtaTatol:0,
            tableDAtaPageLine:3,
            selectedData:[],                    //选中的项的数组
            deleteId:[],                       //选中删除数据的id
            totalCount:0,                         //共多少条数据
            pageNo:1,                            //当前页
            pageSize:10,                           //每页显示多少条数据
            totalPage:0,                           //共多少页
            /**====================执行模态框数据=================== */
            showExeModal:false,                  //执行窗口
            showExeType:'',
            eveValidate: {        
                exeType:'1',                             //执行类型
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
            showMoniterModal:false,
            isShowMoniterMore:false,
            scomponentLoading:false,
            showSearchTable:true,
            scomponentOpts:[],
            id:'',   
            monitor_senario_id:'', 
            monitorList:[], 
            monitorListPage:[],                                
            moniterPageNo:1,
            moniterPageSize:10,
            moniterTotalCount:0,                         //共多少条数据
            moniterTotalPage:0,                           //共多少页
            editCount:0,                                   //当前处于编辑状态的数据有几条
            monitorAddShow:false,
            scomponentAddLoading:false,
            scomponentAddOpts:[],
            subSysName_old:'',
            subSysName_new:'',
            monitorAddValidate: {
                subSysName:'',                     //物理子系统
                subAreaName:'',                   //环境类型
                funDesc:'',                        //部署单元
                prodIp:'',                        //ip地址
                osVersion:'',                     //操作系统类型
                userName:'',                     //用户名
                password:'',                      //密码
            },
            monitorAddRules:{
                subAreaName:[
                    {required:true,message:'必输项',trigger:'change'}
                ],
                subSysName:[
                    {required:true,message:'必输项',trigger:'change'}
                ],
                funDesc:[
                    {required:true,message:'必输项',trigger:'blur'}
                ],
                prodIp:[
                    {required:true,message:'必输项',trigger:'blur'}
                ],
                osVersion:[
                    {required:true,message:'必输项',trigger:'blur'}
                ],
                userName:[
                    {required:true,message:'必输项',trigger:'blur'}
                ],
                password:[
                    {required:true,message:'必输项',trigger:'blur'}
                ],
            },
            moniterTableData:[],
            moniterSelectedData:[],
            moniterValidate:{
                inviro_type:'',
                sComponent:'',
                ip:'',
            },
            moniterColumns:[
                {
                    type: 'selection',
                    width: 40,
                    align: 'center'
                },
                {
                    title: '#',
                    key: 'id',
                    width: 70,
                },
                {
                    title: '环境类型',
                    key: 'subAreaName',
                    ellipsis: true, 
                    width:180,
                },
                {
                    title: '物理子系统',
                    key: 'subSysName',
                    width:140,
                    ellipsis: true, 
                },
                {
                    title: '部署单元',
                    key: 'funDesc',
                    width:170,
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
                                    value: params.row.funDesc,
                                    autofocus: true
                                },
                                on: {
                                    input: function (event) {
                                        params.row.funDesc = event.target.value
                                    }
                                }
                            });
                        }else{
                            return h('div',params.row.funDesc)
                        }
                        
                    }
                },
                {
                    title: 'IP',
                    key: 'prodIp',
                    width:130,
                    align: 'center',
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
                                          this.handleSave(params.row);
                                          this.editCount --;
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
                                            this.handleEdit(params.row);
                                            this.editCount ++;
                                        }
                                    }
                                },'编辑'),
                            
                            ])
                        }
                                            
                    }
                }
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
            _this.isLoadingList = true;
            console.log("键盘按下")
            // console.log( "表单数据",_this.senario_type,_this.senario_name,_this.senario_creator,_this.is_deleted,_this.perftask_name,_this.script_name);
            //this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/senario/list', {
                data: {
                    senario_type: _this.formValidate.senario_type, 
                    senario_name:_this.formValidate.senario_name,
                    senario_creator:_this.formValidate.senario_creator,
                    perf_task:_this.formValidate.perf_task,
                    script:_this.formValidate.script,
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
                _this.selectedData.map(item=>{
                    _this.checkedId.push(item.senario_id);
                });
                for(var i=0;i<_this.tableData.length;i++){
                    if(_this.checkedId.includes(_this.tableData[i].senario_id)){
                        _this.tableData[i]['_checked'] = true;
                    }
                }
                _this.timer = setTimeout(() => {
                    _this.isLoadingList = false;
                }, 1000);
                console.log("搜索提示选项",_this.searchOpts)
            })
        },
        searchReset:function(name){
            this.$refs[name].resetFields();
        },
        /**切换页码 */
        pageChange:function(pageNo){
            let _this = this;
            _this.pageNo = pageNo;
            _this.listCase();
            console.log(_this.tableData);
        },
        /**切换页面大小 */
        pageSizeChange:function(pageSize){
            console.log(pageSize);
            this.pageSize = pageSize;
            this.listCase();
        },
        /**下拉选自动查询 */
        senario_creator:function(){
            let _this = this;
            this.$http.post('/myapi/user/search',{
                header:{},
                data:{
                    member_name:''
                }
            }).then(function(response){
                _this.searchCreatorOpts = response.data.resultList.map(item=>{
                    return {
                        id:item.id,
                        username:item.username,
                        member_name:item.member_name,
                    }
                })
            })
        },
        /**创建人远程查询 */
        senarioCreatorRemote:function(query){
            let _this = this;
            this.$http.post('/myapi/user/search',{
                header:{},
                data:{
                    member_name:query
                }
            }).then(function(response){
                console.log("远程查询创建人",response);
                _this.searchCreatorOpts = response.data.resultList.map(item=>{
                    return {
                        id:item.id,
                        username:item.username,
                        member_name:item.member_name,
                    }
                })
            })
        },
        /**关联任务远程查询 */
        perftaskNameRemote:function(query){
            let _this = this;   
            //this.$http.defaults.withCredentials = false;
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
        /*关联脚本远程查询* */
        perfScriptRemote:function(query){
            let _this = this;  
            //this.$http.defaults.withCredentials = false;
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
            this.deleteDataList = this.selectedData;      //选中要删除的数据
            let deleteId = [];                       //选中数据的id
            if (this.selectedData.length > 0) {               //如果有选中的数据
                this.delSenarioModal = true;
                for (let i in this.deleteDataList) {         //进行遍历
                    deleteId.push(this.selectedData[i].senario_id);  //将选中的而数据的id放入要删除的集合中
                    //this.deleteData(deleteId);            //调用删除数据的方法，将tableData中的数据删除
                }
                this.deleteId = deleteId;
                console.log("删除多条的id",deleteId);
            } else {
                this.$Message.error("请选择要删除的数据")
            }
        }, 
        /**确认删除 */
        delMonitorOk:function(){
            console.log(this.deleteId);
            let _this = this;
            //this.$http.defaults.withCredentials = false;
            this.$http.post("/myapi/senario/del",{
                header:{},
                data:{
                    ids:_this.deleteId,
                }
            }).then(function(response){
                console.log(response.data.resultMap.noDeleted);
                _this.tableData.forEach((item,index) => {
                    if(_this.deleteId.includes(item.senario_id)){
                        _this.tableData.splice(index, 1);        //即删除该数据上
                    }
                });
                _this.delSenarioModal = false;
                _this.selectedData = [];
                if(response.data.resultMap.noDeleted != 0){
                    _this.notDeleteList = response.data.resultMap.noDeleted;
                    _this.noDeleteModal = true;
                    _this.listCase();
                }else{
                     _this.noDeleteModal = false;
                    _this.$Message.info('删除成功');
                    _this.listCase()
                }
            });
        },
        /**取消删除 */
        delMonitorCancel:function(){
            this.delSenarioModal = false;
        }, 
        //deleteData:function(deleArr) {                //调用方法将原有数据中对应的id删除
            // console.log("删除多台哦数据内容",deleArr)
            // let _this = this;
            // let tableData = _this.tableData;          //原有的数据
            // tableData.forEach((item, index) => {      //对原有的数据进行遍历
            //     if (deleArr.includes(item.senario_id)) {       //当原有的数据与要删除的数据中有相同的数据时，
            //         _this.$Modal.confirm({
            //             title:'确认',
            //             content: '是否删除该数据',
            //             onOk: () => {
            //                 //this.$http.defaults.withCredentials = false;
            //                 this.$http.post("/myapi/senario/del",{
            //                     header:{},
            //                     data:{
            //                         ids:deleArr,
            //                     }
            //                 }).then(function(response){
            //                     tableData.splice(index, 1);        //即删除该数据上
            //                     _this.$Message.info('删除成功');
            //                     _this.listCase();
            //                     console.log(response);
            //                 })
            //             },
            //             onCancel: () => {
            //                 _this.$Message.info('删除失败');
            //             }
            //         }); 
                   
            //     }
            // });
        //,
            /**选中的数据发生改变 */
        onSelect: function(row,selection) {
            this.selectedData.push(selection);
            // for(var i=0;i<this.tableData.length;i++){
            //     if(this.tableData[i].senario_id == selection.senario_id){
            //         this.tableData[i]['_checked'] = true;
            //         console.log(this.tableData[i]);
            //     }
            // }
            console.log("选中要删除的数据",this.selectedData)
            //console.log(data)
        },
        onSelectCancel:function(row,selection){
            let _this = this;
            for(var i=0;i<_this.selectedData.length;i++){
                if(_this.selectedData[i].senario_id == selection.senario_id){
                    _this.selectedData.splice(i,1);
                }
            }
            // _this.selectedData.forEach((item,index) => {
            //     if(_this.selectedData.includes(item)){
            //         _this.selectedData.splice(index, 1);        //即删除该数据上
            //     }
            // });
            console.log("取消选中要删除的数据",_this.selectedData)
        },
       
        /**添加新数据弹出模态框 */
        addCase:function(){
            this.showAddModal = true;
            //this.perftask();
            //console.log("显示模态框");
        },
        /***================================新增模态框事件===========================================*/
        handleSubmit:function (name) {
            let  _this = this;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    console.log("开始添加");
                    //this.$http.defaults.withCredentials = false;
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
                        _this.listCase();
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
            //this.$http.defaults.withCredentials = false;
            this.$http.post("/myapi/perftask/list",{
                data:{
                    perftask_name:'',    //第一次请求时关联任务为空
                }
            }).then(function(response){
                // console.log("任务管理请求回的数据",response.data.resultList);
                // console.log("传到后台的任务管理数据",_this.addValidate.ref_task_name);
                _this.perftaskOpts = response.data.resultList.map(item=>{
                    return {
                        value:item.id,
                        label:item.perftask_name,
                    }
                })
            })
        },
        /**远程加载关联任务方法 */
        perftaskRemote:function(query){
            console.log("输入的参数",query);
            let _this = this;
            //this.$http.defaults.withCredentials = false;
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
                console.log("_this.perftaskOpts",_this.perftaskOpts);
            })
        },
        
        /**关联任务选中项改变时根据id加载對應关联脚本 */
        perftaskOptChange:function(){
            let _this = this;
            _this.id = _this.addValidate.ref_task_name;
            //this.$http.defaults.withCredentials = false;
            this.$http.post("/myapi/perftask/taskRelatedScript",{
                data:{
                    id:_this.id
                }
            }).then(function(response){
                console.log("关联脚本返回数据",response.data.resultList,response.data.resultList.length)
                if(response.data.resultList.length == 0 || response.data.resultList.length == undefined){
                    _this.addValidate.ref_script_name = '';
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
        script:function(openstatus){
            let _this = this;
            _this.id = _this.addValidate.ref_task_name;
            //this.$http.defaults.withCredentials = false;
            if(openstatus){
                console.log(openstatus);
                this.$http.post("/myapi/perftask/taskRelatedScript",{
                    data:{
                        id:_this.id
                    }
                }).then(function(response){
                    console.log("关联脚本返回数据",response.data.resultList,response.data.resultList.length)
                    // if(response.data.resultList.length == 0 || response.data.resultList.length == undefined){
                    //     _this.addValidate.ref_script_name = '';
                    //     console.log("没有关联脚本数据");
                    //     _this.isDisabled = true;
                    // }else{
                    //     _this.isDisabled = false;
                    //     _this.scriptOpts = response.data.resultList.map(item=>{
                    //         return {
                    //             value:item.id,
                    //             label:item.script_name,
                    //         }
                    //     })
                    // }
                    _this.scriptOpts = response.data.resultList.map(item=>{
                        return {
                            value:item.id,
                            label:item.script_name,
                        }
                    })
                })
            }
        },
        perftaskClear:function(){
            console.log("关联任务中的内容被清空了");
            this.addValidate.ref_script_name = '';
            this.isDisabled = true;
        },
        /**远程加载关联脚本数据 */
        refscriptRemote:function(query){
            console.log("输入的脚本参数",query);
            this.perftaskLoading = true;
            setTimeout(() => {
                this.perftaskLoading = false;
                let _this = this;
                //this.$http.defaults.withCredentials = false;
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
        },
        // perftaskReachBottom:function(){
        //     console.log("到达底部了");
        //     let _this = this;
        //     return new Promise(resolve => {
        //         setTimeout(()=>{
        //             //this.$http.defaults.withCredentials = false;
        //             this.$http.post("/myapi/perftask/list",{
        //                 header:{},
        //                 data:{
        //                     pageno:_this.pNo+1,
        //                 },
        //             }).then(function(response){
        //                 console.log("触底响应",response.headers.pageno);
        //                 console.log(response);
        //                 _this.perftaskOpts = response.data.resultList.map(item=>{
        //                     return {
        //                         value:item.id,
        //                         label:item.perftask_name,
        //                     }
        //                 });
        //                 _this.perftaskOpts = _this.perftaskOpts.concat(_this.perftaskOpts);
        //                 console.log(_this.perftaskOpts);
        //                 if(_this.pNo < response.headers.totalpage){
        //                     _this.pNo++;
        //                 }else{
        //                     console.log("没有更多了")
        //                 }
        //             })
        //         },200)
        //     })
        // },
        /**=========================================执行模态框事件==================================== */
        
        /**确认事件 */
        exeOk:function(){
            let _this = this;
            if(this.eveValidate.exeType == '1'){
                console.log(new Date());
                //this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/senario/exec', {
                    header:{},
                    data:{
                        senario_id:_this.id,
                        exe_type:_this.eveValidate.exeType,
                    }
                }).then(function(response){
                    console.log("立即执行");
                    console.log(response);
                    _this.showExeModal = false;
                    _this.eveValidate.exeType='1';
                    _this.$router.push({path:'/monitoring',query:{executor_id:response.data.resultMap.executor_id,senario_name:response.data.resultMap.senario_name,
                    senario_id:response.data.resultMap.senario_id,
                    senario_type:_this.showExeType,
                    }});
                })
            }else{
                console.log(this.eveValidate.exeDateTime);
                //this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/senario/exec', {
                    header:{},
                    data:{
                        senario_id:_this.id,
                        preset_exe_time:_this.eveValidate.exeDateTime,
                        exe_type:_this.eveValidate.exeType,
                    }
                }).then(function(response){
                    console.log("定时执行");
                    console.log(response.data.resultMap);
                    _this.showExeModal = false;
                    _this.eveValidate.exeType='0';
                    _this.$router.push({path:'/monitoring',query:{executor_id:response.data.resultMap.exec_id,senario_name:response.data.resultMap.senario_name,
                    senario_id:response.data.resultMap.senario_id,
                    senario_type:_this.showExeType,
                    }});
                })
            }
        },
        /**取消事件 */
        exeCancel:function(){
            this.showExeModal = false;
            this.eveValidate.exeType='1';
        },
        /**================================设置模态框事件================================ */
        setOk:function(name){
            this.$refs[name].validate((valid) => {
                let _this = this;
                if (valid) {
                    //this.$http.defaults.withCredentials = false;
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
                        _this.listCase();
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
        moniterListCase:function(){
            let _this = this;
            _this.isLoading = true;
            //this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/monitorSetting/list',{
                header:{},
                data:{
                    id:_this.id,
                    pageNo:_this.moniterPageNo,
                    pageSize:_this.moniterPageSize,
                    pageChecked:_this.monitorListPage,
                }
            }).then(function(response){
                console.log(response.data.resultList);
                _this.moniterTableData = response.data.resultList;
                _this.moniterTotalCount = response.headers.totalcount;
                _this.moniterTotalPage = response.headers.totalpage;
                if(response.data.resultList != undefined && response.data.resultList != [] ){
                    _this.subSysName_old = response.data.resultList[0].subSysName;
                }
                _this.showSearchTable = true;
                _this.timer = setTimeout(() => {
                    _this.isLoading = false;
                }, 1000);
                console.log(response);
                console.log(_this.moniterTableData);

            })
        },
        /**取消事件 */
        moniterCancel:function(){
            this.showMoniterModal = false;
            this.showSearchTable = true;
            this.editCount = 0;
            this.monitorAddShow = false;
            this.moniterPageNo = 1;
            console.log('监控取消事件');
            this.monitorListPage = [];    //清空翻页保存的数据
            this.subSysName_old = '';
            clearInterval(this.timer)
        },
        /**确认事件 */
        moniterOk:function(){
            console.log('监控确认事件');
            if(this.editCount != 0 ){
                this.$Message.error("您有数据未保存，请查看");
            }else{
                this.showMoniterModal = false;
                this.monitorAddShow = false;
                this.showSearchTable = true;
                this.moniterPageNo = 1;
                this.monitorListPage = [];
                this.subSysName_old = '';
                clearInterval(this.timer);
            }
            console.log(this.editCount);
        },
        /**查询条件清除 */
        moniterReset:function(name){
            this.$refs[name].resetFields();
        },
        /**系统名称下拉选自动加载 */
        openMonitorChange:function(openStatus){
            console.log(openStatus);
            let _this =this;
            if(openStatus){
                //this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/component/search',{
                    header:{},
                    data:{
                        name:'',
                    }
                }).then(function(response){
                    console.log(response);
                    _this.scomponentOpts = response.data.resultList.map(item=>{
                        return {label:item.name}
                    })
                })
            }
        },
        /**模糊查询物理子系统 */        
        scomponentRemote:function(query){
            this.scomponentLoading = true;
            setTimeout(() => {
                let _this = this;
                _this.scomponentLoading = false;
                //this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/component/search',{
                    header:{},
                    data:{
                        name:query,
                    }
                }).then(function(response){
                    console.log(response);
                    _this.scomponentOpts = response.data.resultList.map(item=>{
                        return {label:item.name}
                    })
                })
            }, 200);
        },
        /**列表查询 */
        moniterCase:function(){
            let _this = this;
            console.log('系统名称',_this.moniterValidate.sComponent,'ip',_this.moniterValidate.ip);
            if(_this.showSearchTable){
                this.moniterPageNo = 1;
            }
            // for(var i=0;i<_this.moniterTableData.length;i++){
            //     if(_this.moniterTableData[i]._checked == true){
            //         _this.moniterSelectedData.push(_this.moniterTableData[i]);
            //     }
            // }
            // if(_this.moniterSelectedData.length > 0){
            //     _this.monitorListPage = _this.moniterSelectedData.map(item=>{
            //         return item.id;
            //     })
            //     console.log("翻页数据",_this.monitorListPage);
            // }
            if((_this.moniterValidate.sComponent == ''|| _this.moniterValidate.sComponent == undefined) && (_this.moniterValidate.ip == '' || _this.moniterValidate.ip == undefined) ){
                _this.$Message.error('至少输入系统名称或ip中的一个条件进行查询');
            }else{
                _this.isLoading = true;
                //this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/monitorSetting/search',{
                    header:{},
                    data:{
                        id:_this.monitor_senario_id,
                        subAreaName:_this.moniterValidate.inviro_type,
                        subSysName:_this.moniterValidate.sComponent,
                        prodIp:_this.moniterValidate.ip,
                        pageNo:_this.moniterPageNo,
                        pageSize:_this.moniterPageSize,
                        pageChecked:_this.monitorListPage,
                    }
                }).then(function(response){
                    console.log(response);
                     _this.timer = setInterval(() => {
                        _this.isLoading = false;
                    }, 2000);
                    console.log(_this.moniterValidate.sComponent);
                    _this.showSearchTable = false;
                    _this.moniterTableData = response.data.resultList;
                    _this.moniterTotalCount = response.headers.totalcount;
                    _this.moniterTotalPage = response.headers.totalpage;
                    if(response.data.resultList != undefined || response.data.resultList != [] ){
                        _this.subSysName_new = response.data.resultList[0].subSysName;
                    }
                    //_this.moniterReset();
                })
            }
        },
        onBlurMonitorSearch:function(){
            if((this.moniterValidate.ip == '' || this.moniterValidate.ip == undefined) && (this.moniterValidate.sComponent == '' || this.moniterValidate.sComponent == undefined) && (this.moniterValidate.inviro_type == '' || this.moniterValidate.inviro_type == undefined)){
                this.moniterListCase();
            }else{
                console.log("未清空");
            }
        },
        clearMonitorSearch:function(){
            console.log(this.moniterValidate.ip);
            console.log(this.moniterValidate.sComponent);
            console.log(this.moniterValidate.inviro_type);
            this.moniterValidate.sComponent = '';
            if((this.moniterValidate.ip == '' || this.moniterValidate.ip == undefined) && (this.moniterValidate.sComponent == '' || this.moniterValidate.sComponent == undefined) && (this.moniterValidate.inviro_type == '' || this.moniterValidate.inviro_type == undefined)){
                this.moniterListCase();
            }else{
                console.log("未清空");
            }
        },
         /**切换页码 */
        moniterPageChange:function(moniterPageNo){
            console.log(moniterPageNo);
            let _this = this;
            _this.isLoading = true;
            _this.moniterPageNo = moniterPageNo;
            console.log("_this.moniterTableData",_this.moniterTableData);
            for(var i=0;i<_this.moniterTableData.length;i++){
                if(_this.moniterTableData[i]._checked == true){
                    _this.moniterSelectedData.push(_this.moniterTableData[i]);
                }
                console.log("_this.moniterSelectedData",_this.moniterSelectedData);
            }
            if(_this.moniterSelectedData.length > 0){
                _this.monitorListPage = _this.moniterSelectedData.map(item=>{
                    return item.id;
                })
                
            }
            _this.monitorListPage = [...new Set(_this.monitorListPage)];
            console.log("翻页数据",_this.monitorListPage);
            if(_this.showSearchTable){
                console.log("原始表格");
                _this.moniterListCase();
            }else{
                console.log("搜索后表格",_this.moniterTableData);
                _this.moniterCase();
            }; 
        },
        /**切换页面大小 */
        moniterPageSizeChange:function(pageSize){
            console.log(pageSize);
            let _this = this;
            _this.moniterPageSize = pageSize;
            if(_this.showSearchTable){
                _this.moniterListCase();
            }else{
                _this.moniterCase();
            }; 
        },
        /**保存并修改事件 */
        moniterSave:function(){
            let _this = this;
            //本身数据表格
                 console.log("搜索后表格");
                console.log('旧的系统名称',_this.subSysName_old,'新的系统名称',_this.subSysName_new);
            if(_this.showSearchTable){
                if(_this.moniterSelectedData.length > 0){
                for(var i=0;i<_this.moniterTableData.length;i++){
                    if(_this.moniterTableData[i]._checked == true){
                        _this.moniterSelectedData.push(_this.moniterTableData[i]);
                    }
                };
                _this.monitorList = _this.moniterSelectedData.map(item=>{
                    return item.servPartId;
                });
                _this.monitorList = [...new Set(_this.monitorList)];
                console.log("_this.monitorList",_this.monitorList);
                this.$http.post("/myapi/monitorSetting/addMachine",{
                    header:{},
                    data:{
                        monitorList:_this.monitorList,
                        senarioid:_this.monitor_senario_id,
                    },
                }).then(function(response){
                    _this.moniterListCase();
                });
                }else{
                    _this.$Message.error("至少选择一条数据");
                }
            }else{
                for(var i=0;i<_this.moniterTableData.length;i++){
                    if(_this.moniterTableData[i]._checked == true){
                        _this.moniterSelectedData.push(_this.moniterTableData[i]);
                    };
                }
                if(_this.moniterSelectedData.length > 0){
                    if(_this.subSysName_old !== _this.subSysName_new && _this.subSysName_old !== ''){
                        console.log("不相同");
                        _this.$Modal.confirm({
                            title:'确认',
                            content: '系统名称将发生改变',
                            onOk: () => {
                                console.log("不相同确认");
                                _this.monitorList = _this.moniterSelectedData.map(item=>{
                                    return item.servPartId;
                                })
                                _this.monitorList = [...new Set(_this.monitorList)];
                                console.log("_this.monitorList",_this.monitorList);
                                //this.$http.defaults.withCredentials = false;
                                this.$http.post("/myapi/monitorSetting/addMachine",{
                                    header:{},
                                    data:{
                                        monitorList:_this.monitorList,
                                        senarioid:_this.monitor_senario_id,
                                    },
                                }).then(function(response){
                                    _this.moniterListCase();
                                });
                            },
                            onCancel: () => {
                                console.log("不相同取消");
                                _this.$Message.info('修改失败，系统未发生改变');
                            }
                        }); 
                    }else{
                        console.log("相同");
                        _this.monitorList = _this.moniterSelectedData.map(item=>{
                            return item.servPartId;
                        })
                        _this.monitorList = [...new Set(_this.monitorList)];
                        console.log("_this.monitorList",_this.monitorList);
                        //this.$http.defaults.withCredentials = false;
                        this.$http.post("/myapi/monitorSetting/addMachine",{
                            header:{},
                            data:{
                                monitorList:_this.monitorList,
                                senarioid:_this.monitor_senario_id,
                            },
                        }).then(function(response){
                            _this.moniterListCase();
                        });
                    }
                }else{
                    _this.$Message.error("至少选择一条数据");
                }
            }
        }, 
        /**自定义监控添加 */
        moniterAdd:function(){
            this.monitorAddShow = true;
            //let addList = {senarioid:'4',subAreaName:'4', subSysName:'4',funDesc:'4',prodIp:'4' };
             //this.moniterTableData.push(this.addList)
            //console.log(this.moniterTableData);
        },
        /**远程加载物理子系统 */
        scomponentAddRemote:function(query){
            this.scomponentAddLoading = true;
            setTimeout(() => {
                let _this = this;
                _this.scomponentAddLoading = false;
                //this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/component/search',{
                    header:{},
                    data:{
                        name:query,
                    }
                }).then(function(response){
                    console.log(response);
                    _this.scomponentAddOpts = response.data.resultList.map(item=>{
                        return {label:item.name}
                    })
                })
            }, 200);
        },
        /**下拉框下拉加载 */

        openMonitorAddChange:function(openStatus){
            let _this =this;
            if(openStatus){
                //this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/component/search',{
                    header:{},
                    data:{
                        name:'',
                    }
                }).then(function(response){
                    console.log(response);
                    _this.scomponentAddOpts = response.data.resultList.map(item=>{
                        return {label:item.name}
                    })
                    console.log(_this.scomponentAddOpts);
                })
            }
        },
        /**保存自定义添加的接口 */
        monitorAddSave:function(name){
            this.$refs[name].validate((valid) => {
                if(valid){
                    let _this = this;
                    //this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/monitorSetting/addMachineMonitor',{
                        header:{},
                        data:{
                            subSysName:_this.monitorAddValidate.subSysName,                     //物理子系统
                            subAreaName:_this.monitorAddValidate.subAreaName,                   //环境类型
                            funDesc:_this.monitorAddValidate.funDesc,                        //部署单元
                            prodIp:_this.monitorAddValidate.prodIp,                        //ip地址
                            osVersion:_this.monitorAddValidate.osVersion,                     //操作系统类型
                            userName:_this.monitorAddValidate.userName,                     //用户名
                            password:_this.monitorAddValidate.password,                      //密码
                        }
                    }).then(function(response){
                        console.log("添加成功");     
                        _this.monitorAddShow = false;
                        _this.moniterListCase();
                        _this.$refs[name].resetFields();
                    })
                }else{
                    _this.$Message.info("提交失败")
                }
            });
        },
        /**取消添加 */
        monitorDissmissAdd:function(){
            //this.monitorAddReset();
            this.monitorAddShow = false;
        },
        /**添加重置 */
        monitorAddReset:function(name){
            this.$refs[name].resetFields();
        },
        /**选中的数据 */
        moniterOnSelection:function(row,selection){
            for(var i=0;i<this.moniterTableData.length;i++){
                if(this.moniterTableData[i].servPartId == selection.servPartId){
                    this.moniterTableData[i]._checked = true;
                }
            }
            console.log("选中的数据",this.moniterTableData);
        },
        onMonitorSelectCancel:function(row,selection){
            let _this = this;
            for(var i=0;i<_this.moniterTableData.length;i++){
                if(_this.moniterTableData[i].servPartId == selection.servPartId){
                    _this.moniterTableData[i]._checked = false;
                }
                    _this.monitorListPage.splice(i,1);
            }
            //console.log("选中的数据",this.moniterTableData);
        },
        /**全选 */
        moniterOnSelectionAll:function(){
            for(var i=0;i<this.moniterTableData.length;i++){
                this.moniterTableData[i]._checked = true;
            }
        },
        onMonitorSelectCancelAll:function(){
            for(var i=0;i<this.moniterTableData.length;i++){
                this.moniterTableData[i]._checked = false;
            }
        },
        // onMonitorSelectCancel:function(row,selection){
        //     let _this = this;
        //     for(var i=0;i<_this.moniterSelectedData.length;i++){
        //         if(_this.moniterSelectedData[i].servPartId == selection.servPartId){
        //             _this.moniterSelectedData.splice(i,1);
        //         }
        //     }
        // },
        /**数据编辑 */
        handleEdit:function(row) {
            this.$set(row, '$isEdit', true);
            console.log(row);
        },
        /**数据保存 */
        handleSave:function(row) {
            this.$set(row, '$isEdit', false)
            console.log(row);
            let _this = this;
            //this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/monitorSetting/machineMonitorUpdate',{
                header:{},
                data:{
                    id:row.id,
                    funDesc:row.funDesc,
                }
            }).then(function(response){
                _this.$Message.info("修改成功")
            })

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
    .delShowTitle {
        // padding-left: 40px;
        padding-right: 15px;
        padding-bottom: 15px;
        text-align: right;
        font-size: 12px;
        font-weight: bold;
    }
   
</style>
