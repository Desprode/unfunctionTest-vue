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
                                    <Option v-for="(option, index) in cmpOpts" :value="option.com_name" :key="index">{{option.com_name}}</Option>
                                </Select>
                            </Col>
                            <Col span="2" class="searchLable">任务名称</Col>
                            <Col span="5">
                                <Input clearable v-model="sTaskName" placeholder="输入任务名称"></Input>
                            </Col>
                            <Col span="2" class="searchLable">任务状态</Col>
                            <Col span="5">
                                <Select clearable v-model="sTaskStatus" style="">
                                    <Option v-for="item in taskStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="3">
                                <Button @click="listPTask"  type="primary" icon="ios-search">搜索</Button>
                            </Col>
                        </Row>
                        <Row :gutter="16" v-if="isShowMoreShow">
                            <Col span="2" class="searchLable">任务开始日期</Col>
                            <Col span="9">
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询起始日期" v-model="startDate_s"></DatePicker>
                                </Col>
                                <Col span="1" class="lineBtwTimes">-</Col>
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询截止日期" v-model="startDate_f"></DatePicker>
                                </Col>
                                <Col span="1"></Col>
                            </Col>
                            <Col span="2" class="searchLable">任务结束日期</Col>
                            <Col span="9">
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询起始日期" v-model="endDate_s"></DatePicker>
                                </Col>
                                <Col span="1" class="lineBtwTimes">-</Col>
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询截止日期" v-model="endDate_f"></DatePicker>
                                </Col>
                                <Col span="1"></Col>
                            </Col>
                            <Col span="2"></Col>
                        </Row>
                        <Row :gutter="16" v-if="isShowMoreShow">
                            <Col span="2" class="searchLable">任务来源</Col>
                            <Col span="3">
                                <Select clearable v-model="sTaskSource" style="">
                                    <Option v-for="item in taskSourceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="2" class="searchLable">投产日期</Col>
                            <Col span="9">
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询起始日期" v-model="onlineDate_s"></DatePicker>
                                </Col>
                                <Col span="1" class="lineBtwTimes">-</Col>
                                <Col span="11">
                                    <DatePicker type="date" placeholder="选择查询截止日期" v-model="onlineDate_f"></DatePicker>
                                </Col>
                                <Col span="1"></Col>
                            </Col>
                            <Col span="8"></Col>
                        </Row>   
                    </div>
                    <div class="formValidateMoreBtnBox" :class="isShowMoreShow ?'arrUp':'arrDown'" @click="isShowMoreShow = !isShowMoreShow">
                        <Icon type="chevron-down" color="#fff" ></Icon>
                        <Icon type="chevron-down" color="#fff" ></Icon>
                    </div>
                </Form>
                
                <div class="tableBox">
                    <div class="tableBtnBox">
                        <Button type="success" @click="addPTask" >新建任务</Button>
                        <Button type="primary" @click="demandMetrics">测试需求</Button>
                        <!-- <Button type="warning" @click="listPTask">测试指标</Button> -->
                        <Button @click="delPTask" type="error">删除</Button>
                    </div>
                    <!-- @on-row-dblclick="onRowDblClick" -->
                    <Table border  ref="selection" :columns="columns" :data="tableData" class="myTable" @on-selection-change="onSelectionChanged"></Table>
                    <div class="pageBox" v-if="tableData.length">
                        <Page :total="parseInt(totalcount)" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
                        <!-- <p>总共{{totalcount}}条记录</p> -->
                    </div>
                </div>
            </div>


            <!--=================================== 新建任务的对话框 ===================================-->
            <Modal v-model="addPTaskModal" width="800">
                <p slot="header" style="text-align:center" >
                    <Icon type="ios-information-circle-outline"></Icon>
                    <span>添加任务</span>
                </p>
                <div style="text-align:center">
                    <Form ref="addValidate" :model="addValidate" :rules="addRuleValidate" :label-width="100" label-position="right">
                        <Form-item label="物理子系统" prop="component_name">
                            <i-select v-model="addValidate.component_name" 
                                placeholder="输入物理子系统中文名称或英文简称" 
                                clearable 
                                filterable 
                                remote 
                                :remote-method="srchComponent" 
                                :loading="srchCmploading" 
                                :transfer=false
                                >
                                <i-option v-for="(option, index) in cmpOpts" :value="option.com_name" :key="index" @click.native="getMoreCmpParams(option)">{{option.com_name}}</i-option>
                            </i-select>
                        </Form-item>
                        <Form-item label="任务名称" prop="task_name">
                            <i-input v-model="addValidate.task_name"></i-input>
                        </Form-item>
                        <Row>
                            <i-col span="8">
                                <Form-item label="任务开始日期" prop="perftask_begin_date">
                                    <Date-picker type="date" placeholder="选择日期" v-model="addValidate.perftask_begin_date" format="yyyy-MM-dd"></Date-picker>
                                </Form-item>
                            </i-col>
                            
                            <i-col span="8">
                                <Form-item label="任务结束日期" prop="perftask_end_date">
                                    <Date-picker type="date" placeholder="选择日期" v-model="addValidate.perftask_end_date" format="yyyy-MM-dd"></Date-picker>
                                </Form-item>
                            </i-col>

                            <i-col span="8">
                                <Form-item label="投产日期" prop="online_date">
                                    <Date-picker type="date" placeholder="选择日期" v-model="addValidate.online_date" format="yyyy-MM-dd"></Date-picker>
                                </Form-item>
                            </i-col>
                        </Row>
                    </Form>
                </div>
                <div slot="footer">
                    <Button color="#1c2438" @click="cancel()">取消</Button>
                    <Button type="primary" @click="handleSubmit('addValidate')">确认</Button>
                </div>
            </Modal>


            <!--=================================== 任务编辑的对话框 ===================================-->
            <Modal v-model="editPTaskModal" width="800">
                <p slot="header" style="text-align:center" >
                    <span>任务编辑</span>
                </p>
                <Form ref="editPTaskValidate" :model="editPTaskValidate" :rules="editPTaskRuleVldt" :label-width="120">
                    <FormItem label="物理子系统:" prop="component_name">
                        <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{editPTaskValidate.component_name}}</div>
                    </FormItem>
                    <FormItem label="任务名称:" prop="perftask_name">
                        <Input  v-model="editPTaskValidate.perftask_name"></Input>
                    </FormItem>
                    <Row>
                        <Col span="8">
                            <FormItem label="任务开始日期：" prop="perftask_begin_date">
                                <Date-picker type="date" placeholder="选择日期" v-model="editPTaskValidate.perftask_begin_date" format="yyyy-MM-dd"></Date-picker>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="任务结束日期：" prop="perftask_end_date">
                                <Date-picker type="date" placeholder="选择日期" v-model="editPTaskValidate.perftask_end_date" format="yyyy-MM-dd"></Date-picker>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="投产日期" prop="online_date">
                                <Date-picker type="date" placeholder="选择日期" v-model="editPTaskValidate.online_date" format="yyyy-MM-dd"></Date-picker>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem label="任务状态：" prop="perftask_status">
                                <Select clearable v-model="editPTaskValidate.perftask_status">
                                    <Option v-for="item in taskStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div slot="footer">
                    <Button color="#1c2438" @click="editCancel()">取消</Button>
                    <Button type="primary" @click="handleEditPTaskSubmit('editPTaskValidate')">确认</Button>
                </div>
            </Modal>
            

            <!--=================================== 删除任务的对话框 ===================================-->
            <Modal v-model="delPTaskModal" width="800">
                <p slot="header" style="text-align:center" >
                    <span>请确认是否删除以下任务</span>
                </p>
                <Form ref="delPTaskValidate" :model="delPTaskValidate" :label-width="120">
                    <!-- <ul type="circle"> -->
                    <Row v-for="(pTaskItem,index) in delPTaskValidate.delPTaskList" :key="index">
                        <!-- <li> -->
                        <Col span="3" class="delShowTitle"><Icon type="ios-close" /></Col>
                        <Col span="2" class="delShowTitle">id: </Col>
                        <Col span="1">{{pTaskItem.id}}</Col>
                        <Col span="3" class="delShowTitle">任务名称: </Col>
                        <Col span="13">{{pTaskItem.perftask_name}}</Col>
                        <Col span="2"></Col>
                        <!-- <Divider></Divider> -->
                        <!-- </li> -->
                    </Row>
                    <!-- </ul> -->
                </Form>
                <div slot="footer">
                    <Button color="#1c2438" @click="delCancel()">取消</Button>
                    <Button type="primary" @click="handleDelPTaskSubmit('delPTaskValidate')">确认</Button>
                </div>
            </Modal>


            <!--=================================== 测试需求的对话框 ===================================-->
            <Modal v-model="demandMetricsModal" width="800" :closable="false">
                <p slot="header" style="text-align:center" >
                    <span>测试需求</span>
                </p>
                <div class="tableBox">
                    <div class="tableBtnBox">
                        <Button type="success" @click="addDemand" >新增需求</Button>
                    </div>
                    <Table border  :columns="metricsCols" :data="metricsTableData" class="myTable"></Table>
                    <div class="pageBox" v-if="metricsTableData.length">
                        <Page :total="parseInt(metricsTcount)" :current.sync="metricsPageno" show-elevator show-total show-sizer @on-change="metricsPageChange" @on-page-size-change="metricsPageSizeChange"></Page>
                    </div>
                </div>
                <div slot="footer">
                    <Button color="#1c2438" @click="closeDemandWin()">关闭</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>

<script>
import global_ from 'header/global'
import cookie_ from 'header/cookie'
import axios from 'axios'

export default {
	name: 'TestCase',
    data () {
        return {
            /**==================== 搜索框数据 ====================*/
            isShowMoreShow:false,
            sComponent:'',          // 物理子系统
            srchCmploading: false,
            cmpOpts: [],
            list: [], 
            sTaskStatus:'',         // 任务状态
            taskStatusList: this.$Global.taskStatusList,
            taskSourceList: this.$Global.taskSourceList,
            sTaskName:'',           // 任务名称
            startDate_s:'',         // 任务开始日期
            startDate_f:'',
            endDate_s:'',           // 任务结束日期
            endDate_f:'',
            sTaskSource:'',         // 任务来源
            onlineDate_s:'',        // 投产日期
            onlineDate_f:'',  
            formSendCmpP: {         // 物理子系统选中项中传递的多个参数
                id: '', 
                cloud_id: '', 
                com_name: '', 
            }, 

            /**==================== 列表数据 ====================*/
            columns: [
            	{
                    type: 'selection',
                    width: 50,
                    align: 'center'
                },
                {
                    title: '任务id',
                    key: 'id',
                    width: 75,
                },
                {
                    title: '物理子系统',
                    key: 'component_name',
                    width: 210, 
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
                                    title: params.row.component_name
                                }
                            }, params.row.component_name)
                        ]);
                    }
                },
                {
                    title: '任务名称',
                    width: 210,
                    key: 'perftask_name', 
                    // ellipsis: true, 
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
                    title: '投产日期',
                    key: 'online_date',
                    width: 100,
                    render : (h, params)=>{
                        let _this = this;
                        return h('span', _this.$Global.formatDate(new Date(params.row.online_date), 'yyyy-MM-dd'));
                    }
                },
                {
                    title: '任务状态',
                    key: 'perftask_status',
                    width: 90,
                    render : (h, params)=>{
                        let _this = this
                        //console.log('params:', params);
                        return h('span', _this.$Global.taskStatusMap[params.row.perftask_status]);
                    }
                },
                {
                    title: '任务开始日期',
                    key: 'perftask_begin_date',
                    width: 110,
                    render : (h, params)=>{
                        let _this = this;
                        return h('span', _this.$Global.formatDate(new Date(params.row.perftask_begin_date), 'yyyy-MM-dd'));
                    }
                },
                {
                    title: '任务结束日期',
                    key: 'perftask_end_date',
                    width: 110,
                    render : (h, params)=>{
                        let _this = this;
                        return h('span', _this.$Global.formatDate(new Date(params.row.perftask_end_date), 'yyyy-MM-dd'));
                    }
                },
                {
                    title: '任务来源',
                    key: 'ptask_source',
                    width: 90,
                    render : (h, params)=>{
                        let _this = this
                        return h('span', _this.$Global.taskSourceMap[params.row.ptask_source]);
                    }
                },
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
                                    // type: 'text', 
                                    // icon: 'ios-create-outline', 
                                    // icon: 'ios-paper-outline', 
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.editPTaskModal = true;
                                        // console.log('params.row: ', params.row);
                                        this.editPTaskValidate.index = params.row._index;
                                        this.editPTaskValidate.id = params.row.id;
                                        this.editPTaskValidate.component_name = params.row.component_name;
                                        this.editPTaskValidate.perftask_name = params.row.perftask_name;
                                        this.editPTaskValidate.perftask_begin_date = params.row.perftask_begin_date;
                                        this.editPTaskValidate.perftask_end_date = params.row.perftask_end_date;
                                        this.editPTaskValidate.online_date = params.row.online_date;
                                        this.editPTaskValidate.perftask_status = params.row.perftask_status;
                                        this.editPTaskValidate.ptask_source = params.row.ptask_source;
                                            // if (params.row.$isEdit) {
                                            //     this.handleSave(params.row);
                                            // } else {
                                            //     this.handleEdit(params.row);
                                            // }
                                    }
                                }
                            }, '编辑'),        // params.row.$isEdit ? '保存' : '编辑'
                            h('Button', {
                                props: {
                                    type: 'default',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        //this.detailCase(params.row.id);
                                            console.log("第一个页面传递的ID",params.row.id);
                                             this.$router.push({
                                                path:'/merge',
                                                query:{id:params.row.id}
                                            })
                                    }
                                }
                            }, '聚合报告')
                        ])
                                            
                    }
                }
            ],
            tableData: [],
            totalcount:0,               // 共多少条数据
            pageno:1,                   // 当前页
            pagesize:10,                // 每页显示多少条数据
            selectedData:[],
            
            /**==================== 新建任务弹出框数据 ====================*/
            addPTaskModal:false, 
            addValidate: {
                component_name: '',         // 物理子系统
                task_name: '',              // 任务名称
                perftask_begin_date: '',    // 任务开始日期
                perftask_end_date: '',      // 任务结束日期
                online_date: '',            // 投产日期
            },
            addRuleValidate: {
                task_name: [
                    { required: true, message: '此项为必填项', trigger: 'blur' }
                ], 
                component_name: [
                    { required: true, message: '此项为必填项', trigger: 'change' }    // type: 'number', 
                ], 
                perftask_begin_date: [
                    { required: true, type: 'date', message: '此项为必填项', trigger: 'change' }
                ], 
                perftask_end_date: [
                    { required: true, type: 'date', message: '此项为必填项', trigger: 'change' }
                ], 
                online_date: [
                    { required: true, type: 'date', message: '此项为必填项', trigger: 'change' }
                ],
            },

            /**==================== 任务编辑弹出框数据 ====================*/
            editPTaskModal: false, 
            editPTaskValidate: {
                index: '',                  // 列表中的索引号
                id: '',                     // 任务编号
                component_name: '',         // 物理子系统
                perftask_name: '',          // 任务名称——可编辑
                perftask_begin_date: '',    // 任务开始日期——可编辑
                perftask_end_date: '',      // 任务结束日期——可编辑
                online_date: '',            // 投产日期——可编辑
                perftask_status: '',        // 任务状态——可编辑
                ptask_source: '',           // 任务来源
            },
            editPTaskRuleVldt: {
                task_name: [
                    { required: true, message: '此项为必填项', trigger: 'blur' }
                ], 
                perftask_begin_date: [
                    { required: true, type: 'date', message: '此项为必填项', trigger: 'change' }
                ], 
                perftask_end_date: [
                    { required: true, type: 'date', message: '此项为必填项', trigger: 'change' }
                ], 
                online_date: [
                    { required: true, type: 'date', message: '此项为必填项', trigger: 'change' }
                ],
                perftask_status: [
                    { required: true, message: '此项为必填项', trigger: 'change' }
                ],
            },

            /**==================== 删除任务弹出框数据 ====================*/
            delPTaskModal: false, 
            delPTaskValidate: {
                delPTaskList: [],                  // 待删除的任务列表
            },

            /**==================== 测试需求弹出框数据 ====================*/
            demandMetricsModal: false, 
            metricsCols: [
            	{
                    type: 'index2',
                    width: 60,
                    align: 'center', 
                    render: (h, params) => {
                        return h('span', params.index + (this.metricsPageno - 1) * this.metricsPagesize + 1);
                    }
                },
                {
                    title: '需求类型',
                    key: 'metrics_type',
                    width: 150,
                    render : (h, params)=>{
                        let _this = this;
                        // console.log("^^^ params.row.metrics_type: ", params.row.metrics_type);
                        let demandType = _this.$Global.demandTypeList;
                        // console.log("^^^ demandType: ", demandType);
                        if (params.row.is_add == true && params.row.$isEdit) {
                            return h('div', [
                                h("Select", {
                                    props:{
                                        value: '01'
                                    }, 
                                    on: {
                                        'on-change': (event) => {
                                            // console.log("^^^ event: ", event);
                                            params.row.metrics_type = event;
                                        }
                                    },
                                },
                                demandType.map(function(item) {
                                    // console.log("^^^ item: ", item);
                                    return [h(
                                        "Option", 
                                        {
                                            props: {
                                                value: item.value,
                                                key: item.value
                                            }
                                        },
                                        item.label
                                    )]
                                }))
                            ])
                        } else {
                            return h('span', _this.$Global.demandTypeMap[params.row.metrics_type]);
                        }
                    }
                },
                {
                    title: '需求描述',
                    key: 'metrics_desc',
                    width: 425,
                    render:(h,params) => {
                        if(params.row.$isEdit){
                            return h('input',{
                                style: {
                                    'text-align':'center',
                                    width: params.column._width+'px',
                                    height: '48px',
                                    border: '0',
                                    outline:'none',
                                    cursor: 'pointer',
                                    // 'background-color':'#f8f8f9'
                                },
                                domProps: {
                                    value: params.row.metrics_desc,
                                    autofocus: true
                                },
                                on: {
                                    input: function (event) {
                                        params.row.metrics_desc = event.target.value
                                    }
                                }
                            });
                        }else{
                            return h('div',params.row.metrics_desc)
                        }
                        
                    } 
                },
                {
                    title: '操作',
                    key: 'opration',
                    width:130,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    // type: 'primary',
                                    type: params.row.$isEdit ? 'success' : 'primary', 
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        if (params.row.$isEdit) {
                                            this.demandEditSave(params.row);
                                        } else {
                                            this.handleDemandEdit(params.row);
                                        }
                                    }
                                }
                            }, params.row.$isEdit ? '保存' : '编辑'),   // '保存'
                            h('Poptip', {
                                props: {
                                    confirm: true, 
                                    type: 'error', 
                                    size: 'small', 
                                    placement: 'left', 
                                    title: '您确认删除这条内容吗？'
                                }, 
                                on: {
                                    'on-ok': () => {
                                        let _this = this;

                                        this.$http.post('/myapi/metrics/del',{
                                            header:{},
                                            data:{
                                                id: params.row.id, 
                                            }
                                        }).then(function(response){
                                            if (response.data.result == "fail") {
                                                let errDesc = _this.handleErrCode(response);

                                                _this.$Message.error(errDesc);
                                            } else if (response.data.result == "ok") {
                                                _this.metricsTableData.splice(params.row._index, 1);
                                            }
                                        })
                                    }
                                }
                            }, [
                                h('Button', {
                                    props: {
                                        type: 'error', 
                                        size: 'small'
                                    }, 
                                    style: {
                                        marginRight: '5px'
                                    }, 
                                }, '删除')
                            ]), 
                            // h('Button', {
                            //     props: {
                            //         type: 'error',
                            //         size: 'small'
                            //     },
                            //     style: {
                            //         marginRight: '5px'
                            //     },
                            //     on: {
                            //         click: () => {
                            //             this.dmetricsDelModal = true;
                            //         }
                            //     }
                            // }, '删除'), 
                        ])
                    }
                }
            ], 
            metricsTableData: [], 
            metricsTcount: 0,                   // 共多少条数据
            metricsPageno:1,                    // 当前页
            metricsPagesize:10,                 // 每页显示多少条数据
            metricsTblDataCopy: [],             // 一份metricTable表格的副本，当编辑项被服务器拒绝的时候用来还原数据
            metricsEditingNo: 0,                // 记录当前处于新增或者编辑状态的测试需求个数，同时只允许1个
            dmetricsDelModal: false, 
        }
    },
    created(){
        /**判断目前cookie中是否有用户信息，
         * 如果没有获取到用户信息就用checkLogin到ITM中获取一下用户信息，存储到cookie中，
         * 供后端解析当前用户使用，header中也会调用这个函数来获取用户信息，之所以这里也再执行一次，
         * 是因为header和这里调用的listPTask是异步加载的，哪一个先加载完不一定，
         * 所以为了保证cookie中始终都有当前用户的信息，这里也做了一下用户信息获取和放cookie */
        let nickName = cookie_.getCookie('nickname');
        let userName = this.$Global.getCookie('username');

        // console.log("*** nickname: ", nickName);
        // console.log("*** username: ", userName);

        if (userName == '' || userName == null || userName == undefined) {
            //验证用户是否登陆，发送请求获取，有可能用户在其他页面做过登陆操作。
            axios.get(global_.login2_url + '/api/checkLogin', { params: {} }).then((parm) => {
                let parmdata = parm.data;
                // console.log(parmdata.nickname+"!!!!!!!!!");
                cookie_.setCookie('nickname', parmdata.nickname, 'd30');
                cookie_.setCookie('username', parmdata.username, 'd30');

                // console.log("after set --- nickname: ", cookie_.getCookie('nickname'));
                // console.log("after set --- username: ", cookie_.getCookie('username'));

                /**获取用户权限信息 */
                this.$http.post('/myapi/user/getUserPermissions', {
                    userId: parmdata.username,
                    // header: {},
                    // data: {
                    //     userId: parmdata.username, 
                    // }
                }).then(function (response) {
                    if (response.data.result == "fail") {
                        let errDesc = _this.handleErrCode(response);

                        _this.$Message.error(errDesc);
                    } else if (response.data.result == "ok") {
                        console.log("get user permissions: ", response);
                    }
                })

                /**获取任务列表 */
                this.listPTask();
            }).catch((error) => {})
        } else {
            /**获取用户权限信息 */
            this.$http.post('/myapi/user/getUserPermissions', {
                userId: userName,
                // header: {},
                // data: {
                //     userId: userName, 
                // }
            }).then(function (response) {
                if (response.data.result == "fail") {
                    let errDesc = _this.handleErrCode(response);

                    _this.$Message.error(errDesc);
                } else if (response.data.result == "ok") {
                    console.log("get user permissions: ", response);
                }
            })

            /**获取任务列表 */
            this.listPTask();
        }
    },
    methods: {
        show:function(ev){
            alert(ev.keyCode)
        },

        /**==================== 物理子系统检索 ====================*/
        srchComponent:function(query){
            // console.log("now in srchComponent, this is ", this);
            this.cmpOpts = [];
            if(query !== ''){
                this.srchCmploading = true;
                setTimeout(()=>{
                    this.srchCmploading = false;
                    let _this = this;
                    // this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/component/searchFromITM',{
                        headers:{},
                        data:{
                            kw: query,
                            page: 1, 
                            limit: 10, 
                        },
                    }).then(function(response){
                        if (response.data.result == "fail") {
                            let errDesc = _this.handleErrCode(response);

                            _this.$Message.error(errDesc);
                        } else if (response.data.result == "ok") {
                            //console.log('下拉框请求的响应',response);
                            if (response.data['resultList']) {
                                _this.list = response.data.resultList;
                                _this.cmpOpts = _this.list.map(item =>{
                                    return {
                                        id: item.id,
                                        cloud_id: item.cloud_id, 
                                        com_name: item.com_name
                                    }
                                });
                            } else {
                                _this.$Message.error("返回结果无resultList");
                            }
                        }
                    })
                    // 原物理子系统获取方式（调用鲁振兴查询本地component表），该交易目前仍存在，调用方式也为改变，只是任务管理不再调用，场景中的监控会调用
                    // this.$http.post('/myapi/component/search',{
                    //     headers:{},
                    //     data:{
                    //         name:query,
                    //         endDate:''
                    //     },
                    // }).then(function(response){
                    //     //console.log('下拉框请求的响应',response);
                    //     _this.list = response.data.resultList;
                    //     _this.cmpOpts = _this.list.map(item =>{
                    //         return {
                    //             value:item.id,
                    //             label :item.name
                    //         }
                    //     });
                    //     //console.log('赋值给预选项',_this.cmpOpts);
                    // })
                },200)
            }else{
                this.cmpOpts = [];
            }
        },
        getMoreCmpParams: function(obj) {
            this.formSendCmpP.id = obj.id;
            this.formSendCmpP.cloud_id = obj.cloud_id; 
            this.formSendCmpP.com_name = obj.com_name;
        }, 
        

        /**==================== 任务列表相关事件 ====================*/
        listPTask: function() {
            let _this = this;
            // console.log("任务来源:", _this.sTaskSource);
            // this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/perftask/list', {
                header: {},
                data: {
                    component_name: _this.sComponent,           // 物理子系统名称
                    perftask_name: _this.sTaskName,             // 任务名称
                    perftask_begin_date_s: _this.startDate_s,   // 任务开始日期
                    perftask_begin_date_f: _this.startDate_f,
                    perftask_end_date_s: _this.endDate_s,       // 任务结束日期
                    perftask_end_date_f: _this.endDate_f,
                    online_date_s: _this.onlineDate_s,
                    online_date_f: _this.onlineDate_f,
                    perftask_status: _this.sTaskStatus,         // 任务状态
                    ptask_source: _this.sTaskSource,            // 任务来源

                    pageno:this.pageno,                         // 当前页码
                    pagesize:this.pagesize                      // 每页展示条数
                    
                }
            }).then(function (response) {
                if (response.data.result == "fail") {
                    let errDesc = _this.handleErrCode(response);

                    _this.$Message.error(errDesc);
                } else if (response.data.result == "ok") {
                    // console.log("列表请求回来的分页数据",response.headers);
                    // console.log("请求回来的模糊查询数据",response.data);
                    let result = response.data.result;
                    // console.log("result: ", result);
                    _this.totalcount = response.headers.totalcount;               //将总的数据条数赋值后渲染
                    _this.tableData = response.data.resultList;
                    // console.log("*****************_this.tableData: ", _this.tableData);
                    // console.log("~~~~~~~~~~~~~~~~~~~columns: ", _this.columns);
                }
            })
        },
        /**分页查询功能----切换每页大小 */
        pageSizeChange:function(pagesize){
            //console.log("页码大小切换",pagesize);
            this.pagesize = pagesize;                     //改变当前页大小后
            this.listPTask();                                 //重新请求数据
        },
        /**分页查询功能----切换当前页 */
        pageChange:function(pageno){
            //console.log("页码切换",pageno);
            this.pageno = pageno; 
            this.listPTask();
        },

        onSelectionChanged: function(data) {
            this.selectedData = data;
            //console.log(data)
        },

        // onRowDblClick: function(row) {
        //     this.$router.push({path:'/addCase',query:{id:row.id}});
        // },
        
        // /**点击保存之后的事件 */
        // handleSave(row){
        //     //console.log("这是保存",row)
        // },
        // /**点击编辑之后的事件 */
        // handleEdit(row){
        //     //console.log("这是编辑",row)
        // },

        // /**删除一条数据 */
        // remove(index){
        //     this.tableData.splice(index,1);
        //     //console.log("这是删除一条数据",row);
        // },

        /**==================== 新建任务相关事件 ====================*/
        /**添加新数据弹出模态框 */
        addPTask:function(){
            this.addPTaskModal = true;
        },
        handleSubmit (name) {
            let _this = this;
            // console.log("**********************this: ", _this);
            
            this.$refs[name].validate((valid) => {
                if (valid) {
                    // this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/perftask/add', {
                        header: {},
                        data: {
                            component_name: _this.formSendCmpP.com_name,   // 物理子系统名称
                            ref_itm_id: _this.formSendCmpP.id,                  // ITM的物理子系统id
                            cloud_id: _this.formSendCmpP.cloud_id,              // ITM同步云的时候的id
                            task_name: _this.addValidate.task_name,             // 任务名称
                            perftask_begin_date: _this.addValidate.perftask_begin_date,   // 任务开始日期
                            perftask_end_date: _this.addValidate.perftask_end_date,    // 任务结束日期
                            online_date: _this.addValidate.online_date,
                            perftask_source: "2",
                        }
                    }).then(function (response) {
                        if (response.data.result == "fail") {
                            let errDesc = _this.handleErrCode(response);

                            _this.$Message.error(errDesc);
                            _this.addPTaskModal = false;
                        } else if (response.data.result == "ok") {
                            // console.log("**********************addValidate: ", _this.addValidate);
                            // _this.addValidate.component_name = _this.formSendCmpP.com_name;
                            _this.addValidate.perftask_name = _this.addValidate.task_name;
                            _this.addValidate.id = response.data.resultMap.id;
                            _this.addValidate.perftask_status = response.data.resultMap.perftask_status;
                            _this.addValidate.ptask_source = '2';
                            _this.$Message.success('提交成功!');
                            _this.addPTaskModal = false;
                            _this.tableData.push(_this.addValidate);
                            // console.log('tableData after: ', _this.tableData);
                        }
                    })
                } else {
                    _this.$Message.error('表单验证失败!');
                }
            });
        },     
        cancel () {
            this.$Message.info('点击了取消');
            this.addPTaskModal = false;
        },
       
        /**==================== 编辑任务相关事件 ====================*/
        handleEditPTaskSubmit (editPTaskData) {
            let _this = this;
            // console.log("**********************this: ", _this);
            // console.log("perftask_name: ", _this.editPTaskValidate.perftask_name);
            
            this.$refs[editPTaskData].validate((valid) => {
                if (valid) {
                    // this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/perftask/edit', {
                        header: {},
                        data: {
                            id: _this.editPTaskValidate.id, 
                            perftask_name: _this.editPTaskValidate.perftask_name,
                            perftask_begin_date: _this.editPTaskValidate.perftask_begin_date,
                            perftask_end_date: _this.editPTaskValidate.perftask_end_date,
                            online_date: _this.editPTaskValidate.online_date,
                            perftask_status: _this.editPTaskValidate.perftask_status, 
                        }
                    }).then(function (response) {
                        if (response.data.result == "fail") {
                            let errDesc = _this.handleErrCode(response);

                            _this.$Message.error(errDesc);
                            _this.editPTaskModal = false;
                        } else if (response.data.result == "ok") {
                            _this.$Message.success('提交成功!');
                            _this.editPTaskModal = false;
                            // console.log('tableData before: ', _this.tableData);
                            // console.log('index: ', _this.editPTaskValidate.index);
                            _this.$set(_this.tableData, _this.editPTaskValidate.index, _this.editPTaskValidate);
                            // console.log('tableData after: ', _this.tableData);
                        }
                    })
                } else {
                    _this.$Message.error('表单验证失败!');
                }
            });
        }, 
        editCancel () {
            this.$Message.info('点击了取消');
            this.editPTaskModal = false;
        }, 

        /**==================== 删除任务相关事件 ====================*/
        /*删除按钮功能*/
        delPTask: function() {
            let selectedData=this.selectedData;      //选中要删除的数据
            // console.log("selectedData", selectedData);

            if(selectedData.length>0){               //如果有选中的数据
                this.delPTaskModal = true;
                // console.log("***********");
                // console.log("before: ", this.delPTaskValidate);
                this.delPTaskValidate.delPTaskList = selectedData;
                // console.log("this.delPTaskValidate.delPTaskList: ", this.delPTaskValidate.delPTaskList);
            }else{
                    this.$Message.error("请选择要删除的数据")
            }
        }, 
        handleDelPTaskSubmit (delPTaskData) {
            let _this = this;
            let tableData = _this.tableData;
            let delList = _this.delPTaskValidate.delPTaskList;
            // console.log("== delList: ", delList);
            let delIds = [];

            for (let i in delList) {
                // console.log("~~ i: ", i);
                // console.log("^^ delitem id : ", delList[i].id);
                delIds.push(delList[i].id);  //将选中的而数据的id放入要删除的集合中
            }
            // console.log("** delIds: ", delIds);
            
            // this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/perftask/del', {
                header: {},
                data: {
                    ids: delIds
                }
            }).then(function (response) {
                if (response.data.result == "fail") {
                    let errDesc = _this.handleErrCode(response);

                    _this.$Message.error(errDesc);
                    _this.delPTaskModal = false;
                } else if (response.data.result == "ok") {
                    _this.$Message.success('删除成功!');
                    _this.delPTaskModal = false;
                    for (let i in delIds) {
                        // console.log("delIds[i]: ", delIds[i]);
                        for (let index in tableData) {
                            // console.log("tableData[index].id: ", tableData[index].id);
                            if (tableData[index].id == delIds[i]) {
                                // console.log("==now equal==");
                                tableData.splice(index, 1);        //删除表格中展示的数据
                                break;
                            }
                        }
                        // tableData.forEach((item,index) => {      //对原有的数据进行遍历
                        //     if(item.id == id){       //当原有的数据与要删除的数据中有相同的数据时，
                        //         // console.log("tableData index:", index);
                        //         tableData.splice(index, 1);        //删除表格中展示的数据
                        //     }
                        // });
                    }
                }
            })
        }, 
        delCancel () {
            this.$Message.info('点击了取消');
            this.delPTaskModal = false;
        },

        /**==================== 测试需求相关事件 ====================*/
        demandMetrics: function(){
            let selectedData=this.selectedData; 
            // console.log("---selectedData: ", selectedData);

            if (selectedData.length <= 0) {                 //如果没有选中的数据
                this.$Message.error("请选择一个任务查看测试需求")
            } else if (selectedData.length > 1) {           // 选中多条数据
                this.$Message.error("请选择一个任务查看测试需求")
            } else {
                let _this = this;
                _this.demandMetricsModal = true;
                // console.log("---selectedData[0].id: ", selectedData[0].id);

                // this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/metrics/list', {
                    header: {},
                    data: {
                        perftask_id: selectedData[0].id, 

                        pageno: _this.metricsPageno,                         // 当前页码
                        pagesize: _this.metricsPagesize,                     // 每页展示条数
                    }
                }).then(function (response) {
                    if (response.data.result == "fail") {
                        let errDesc = _this.handleErrCode(response);

                        _this.$Message.error(errDesc);
                        _this.metricsEditingNo = 0;
                    } else if (response.data.result == "ok") {
                        // console.log("response.data.resultList: ", response.data.resultList);
                        _this.metricsTableData = response.data.resultList;
                        _this.metricsTcount = response.headers.totalcount;
                        _this.metricsTblDataCopy = _this.metricsTableData;
                        _this.metricsEditingNo = 0;
                    }
                })
            }  
        }, 
        /**分页查询功能----切换每页大小 */
        metricsPageSizeChange: function(pagesize){
            //console.log("页码大小切换",pagesize);
            this.metricsPagesize = pagesize;                     //改变当前页大小后
            this.demandMetrics();                             //重新请求数据
        },
        /**分页查询功能----切换当前页 */
        metricsPageChange: function(pageno){
            //console.log("页码切换",pageno);
            this.metricsPageno = pageno; 
            this.demandMetrics();
        },
        addDemand: function () {
            if (this.metricsEditingNo != 0) {
                this.$Message.error("存在尚未保存的测试需求，请先保存后再新建需求！");
            } else {
                this.metricsEditingNo = this.metricsEditingNo + 1;
                let newDemandMtrc = {'metrics_type': '01', 'metrics_desc': '', 'is_add': true};
                // console.log("^^^ metricsTableData before push: ", this.metricsTableData);
                let mtrcTbDtLength = this.metricsTableData.push(newDemandMtrc);
                // console.log("^^^ metricsTableData after push: ", this.metricsTableData);
                // console.log("newDemandMtrc: ", newDemandMtrc);
                // console.log("mtrcTbDtLength: ", mtrcTbDtLength);
                // console.log("this.metricsTableData[mtrcTbDtLength-1]: ", this.metricsTableData[mtrcTbDtLength-1]);
                this.$set(this.metricsTableData[mtrcTbDtLength-1], '$isEdit', true);
                // this.addDmdItem = true;
            }
        },
        /**数据编辑 */
        handleDemandEdit: function(row) {
            if (this.metricsEditingNo != 0) {
                this.$Message.error("存在尚未保存的测试需求，请先保存后再编辑下一个需求！")
            } else {
                this.metricsEditingNo = this.metricsEditingNo + 1;
                // console.log("row: ", row);
                this.$set(row, '$isEdit', true);
                // console.log(row);
            }
        },
        /**数据保存 */
        demandEditSave: function(row) {
            if (row.metrics_desc == '') {
                this.$Message.error("需求描述不能为空");
            } else {
                this.$set(row, '$isEdit', false)
                // console.log('^^^ row:', row);

                let _this = this;

                if ( row['id'] ) {
                    console.log("^^^ row has id, it is an edit ^^^");

                    // this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/metrics/edit',{
                        header:{},
                        data:{
                            id: row.id, 
                            metrics_desc: row.metrics_desc,
                        }
                    }).then(function(response){
                        if (response.data.result == "fail") {
                            let errDesc = _this.handleErrCode(response);

                            _this.$Message.error(errDesc);
                            // console.log("^^^ metricsTblDataCopy: ", _this.metricsTblDataCopy);
                            _this.$set(row, 'metrics_desc', _this.metricsTblDataCopy[row._index].metrics_desc); // 临时性的
                            _this.metricsEditingNo = _this.metricsEditingNo - 1;
                        } else if (response.data.result == "ok") {
                            _this.$set(_this.metricsTableData, row._index, row);    // 真实的修改
                            _this.metricsEditingNo = _this.metricsEditingNo - 1;
                        }
                    })
                } else {
                    console.log("^^^ row has not id, it is an add ^^^");
                    // console.log("^^^ _this: ", _this);

                    // this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/metrics/add',{
                        header:{},
                        data:{
                            perftask_id: _this.selectedData[0].id, 
                            metrics_type: row.metrics_type,
                            metrics_desc: row.metrics_desc,
                        }
                    }).then(function(response){
                        if (response.data.result == "fail") {
                            let errDesc = _this.handleErrCode(response);

                            _this.$Message.error(errDesc);
                            _this.metricsTableData.splice(row._index, 1);
                            _this.metricsEditingNo = _this.metricsEditingNo - 1;
                        } else if (response.data.result == "ok") {
                            let newDemandMtrc = {
                                'id': response.data.resultMap.id, 
                                'metrics_type': row.metrics_type, 
                                'metrics_desc': row.metrics_desc, 
                                'is_add': false, 
                                '$isEdit': false
                            };
                            _this.$set(_this.metricsTableData, row._index, newDemandMtrc);
                            _this.metricsEditingNo = _this.metricsEditingNo - 1;
                            // console.log("^^^ _this.metricsTableData: ", _this.metricsTableData);
                        }
                    })
                }
            }
        },
        /**关闭测试需求窗口 */
        closeDemandWin (){
            this.metricsPagesize = 10;
            this.metricsPageno = 1;
            this.demandMetricsModal = false;
            // this.demandMetrics();
        }, 
        

        /**清除搜索条件 */
        handleReset (name) {
            //console.log(this.$refs)
            this.$refs[name].resetFields();
        }, 

        /**错误信息处理函数 */
        handleErrCode (resp) {
            let errDesc = "";
            if (resp.data.err_code != null) {
                errDesc = errDesc + "errCode: " + resp.data.err_code;
            } else {
                errDesc = "no errCode";
            }

            if (resp.data.err_desc != null) {
                errDesc = errDesc + " —— errDesc: " + resp.data.err_desc;
            } else {
                errDesc = errDesc + " —— no errDesc";
            }

            return errDesc;
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

.lineBtwTimes {
    text-align: center; 
    padding: 9px 0px
}

.editStaticDiv {
    font-size: 12px;
    padding-top: 6px;
}

.delStaticDiv {
    font-size: 12px;
    padding-top: 8px;
}

.delShowTitle {
    // padding-left: 40px;
    padding-right: 15px;
    padding-bottom: 15px;
    text-align: right;
    font-size: 12px;
    font-weight: bold;
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
