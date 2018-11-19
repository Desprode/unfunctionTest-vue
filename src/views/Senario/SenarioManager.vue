<template>
	<div class="pageContent">
        <div class="caseBox">
            <h3 class="Title">
                <span>场景管理</span>
            </h3>
           <!--==================================form 表单============================================-->
            <Form ref="formValidate" class="formValidate" :label-width="80" v-if="isbouterAlive">
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
                            <FormItem label="显示已删除:">
                                <Select v-model="is_deleted" clearable>
                                    <Option  value="false">否</Option>
                                    <Option  value="true">是</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="关联任务:">
                                <Input v-model="perftask_name" placeholder="输入关联任务"></Input>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="关联脚本:">
                                <Input v-model="script_name" placeholder="输入脚本名称"></Input>
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


        <!--========================================创建场景模态框===============================-->
        <Modal v-model="Deletips" width="1000">
            <p slot="header" style="color:#f60;text-align:center" >
                <Icon type="ios-information-circle"></Icon>
                <span>新增</span>
            </p>
            <div style="text-align:center">
            <i-form ref="addValidate" :model="addValidate" :rules="ruleValidate" :label-width="80">
                <Form-item label="场景类型:" prop="senario_type">
                   <i-select v-model="addValidate.senario_type" placeholder="请选择场景类型">
                            <i-option value="01">单交易基准</i-option>
                            <i-option value="02">单交易负载</i-option>
                            <i-option value="03">混合场景</i-option>                      
                    </i-select>
                </Form-item>
                <Form-item label="场景名称:" prop="senario_name">                      
                   <i-input v-model="addValidate.senario_name" placeholder="请输入场景名称"></i-input>
                </Form-item>
                    <div>
                        <Form-item label="场景描述:" prop="fie">
                        <textarea class="form-control"  placeholder="请填写场景描述"  v-model="addValidate.fie" data_type="text" id="field_senario_desc" name="senario_desc" rows="5" cols="125"></textarea>
                        </Form-item>
                    </div>
                <Form-item label="关联任务:" prop="ref_task_name">
                   <i-select v-model="addValidate.ref_task_name" placeholder="请选择任务">
                            <i-option value="1">关联1</i-option>
                            <i-option value="2">关联2</i-option>
                            <i-option value="3">关联3</i-option>                      
                    </i-select>
                </Form-item>
                <Form-item label="关联脚本:" prop="ref_script_name">
                   <i-select v-model="addValidate.ref_script_name" placeholder="请选择脚本">
                            <i-option value="1">脚本1</i-option>
                            <i-option value="2">脚本2</i-option>
                            <i-option value="3">脚本3</i-option>                      
                    </i-select>
                </Form-item>
            </i-form>
            </div>
            <div slot="footer">
                <Button color="#1c2438" @click="handleSubmit('addValidate')">确认</Button>
                <Button type="primary" @click="cancel()">取消</Button>
            </div>
        </Modal>
    </div>


        <!-- <AddItemPop :isShow="isShowAddPop" :isAdd="isAdd" :addLoading="true" @popClose="popCloseFn"  @tableDataAdd="tableDataAddFn" :tabDataRow="tableDataRow" /> -->

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
            is_deleted:'',                                       //是否删除
            perftask_name:'',                                    //关联任务
            script_name:'',                                      //脚本名称
            isShowMore:false,                                   //是否显示更多查询条件
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
                    { required: true, message: '请选择任务', trigger: 'change' }            
                ],
                ref_script_name: [                 
                    { required: true, message: '请选择脚本', trigger: 'change' }            
                ]         
            },
            
            columns: [
            	{
                    type: 'selection',
                    width: 40,
                    align: 'center'
                },
                {
                    title: 'ID',
                    key: 'id',
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
                    width:180,
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
                    width:90,
                    align: 'center',
                },
                {
                    title: '持续时长(分钟)',
                    key: 'duration',
                    width:120,
                    align: 'center',
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
                    width:145,
                    align: 'center',
                },
                {
                    title:'操作',
                    key:'operAtion',
                    width:160,
                    align: 'center',
                    render: (h, item) => {
                        return h('div', [
                            /*h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        if (params.row.$isEdit) {
                                            this.handleSave(params.row)
                                        } else {
                                            this.handleEdit(params.row)
                                        }
                                    }
                                }
                            }, params.row.$isEdit ? '保存' : '编辑'),*/
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.upadtezx(item.index)
                                    }
                                }
                            }, '执行'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.setCiFlag(item.index)
                                    }
                                }
                            }, '设置'),
                            h('Button', {
                                props: {
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
            Deletips:false,
        }
    },
    mounted:function () {
      },
    created(){
        this.listCase();
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
                    is_deleted:_this.is_deleted,
                    perftask_name:_this.perftask_name,
                    script_name:_this.script_name,
                    pageno:_this.pageNo,
                    pagesize:_this.pageSize,
                }
            }).then(function (response) {
                console.log(response);
                console.log('请求回来的表格数据: ', response.data);
                _this.tableData = response.data.resultList;
                _this.totalCount = response.headers.totalcount;
                _this.totalPage = response.headers.totalpage;
                console.log(response.headers.totalcount);
                console.log(_this.totalCount);  
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
        
        /**============================删除多条数据========================= */
        deleteCase: function () {
            //console.log("删除多条按钮");
            let selectedData = this.selectedData;      //选中要删除的数据
            let resArr = [];
            let deleteId = [];                       //选中数据的id
            if (selectedData.length > 0) {               //如果有选中的数据
                for (let i in selectedData) {         //进行遍历
                    deleteId.push(selectedData[i].id);  //将选中的而数据的id放入要删除的集合中
                    //console.log(selectedData[i].id);
                    //console.log(deleteId);
                    this.deleteData(deleteId);            //调用删除数据的方法，将tableData中的数据删除
                }
            } else {
                this.$Message.error("请选择要删除的数据")
            }
        }, 
        deleteData(deleArr) {                //调用方法将原有数据中对应的id删除
            let tableData = this.tableData;          //原有的数据
            tableData.forEach((item, index) => {      //对原有的数据进行遍历
                if (deleArr.includes(item.id)) {       //当原有的数据与要删除的数据中有相同的数据时，
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
            /**选中的数据发生改变 */
        onSelectionChanged: function(data) {
            this.selectedData = data;
            //console.log(data)
        },
        
        /**================================删除一条数据================================ */
        deleteDataCase:function (index){      
            //console.log("删除单条按钮");
            let tableData = this.tableData;
            console.log(tableData[index]);
            this.$Modal.confirm({
                title:'确认',
                content: `是否删除该数据`,
                onOk: () => {
                    tableData.splice(index, 1);
                    this.$Message.info('删除成功');
                },
                onCancel: () => {
                    this.$Message.info('删除失败');
                }
            });       
            
        },


        /**===================设置功能=========================== */
        setCiFlag: function() {
                       
        },

       
        /**添加新数据弹出模态框 */
        addCase:function(){
            this.Deletips = true;
            //console.log("显示模态框");
        },
        /***模态框弹出时确定事件: 验证表单提交 */
        handleSubmit:function (name) {
            console.log(this.addValidate.senario_type);
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('提交成功!');
                     this.Deletips = false;
                } else {
                    this.$Message.error('表单验证失败!');
                }
                console.log(this);                 //undefined  周一解决
                 //this.$refs[name].resetFields();
            });
            
        },
         /**模态框弹出取消事件 */
        cancel:function () {
             //this.$Message.info('点击了取消');
            this.Deletips = false;
        },
        /**修改新数据弹出模态框 */
        upadtezx:function(){
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
</style>
