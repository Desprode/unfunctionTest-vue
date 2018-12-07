<template>
	<div class="pageContent">
        <Card>
            <div class="caseBox">
                <h3 class="Title">
                    <span>用户插件列表</span>
                </h3>
                <div class="tableBox">
                    <div class="tableBtnBox">
                        <Button type="primary" @click="addCase" >上传插件</Button>
                        <Button @click="deleteCase" type="error">删除</Button>
                    </div>
                    <Table border  ref="selection" :columns="columns" :data="tableData" class="myTable"></Table>
                    <div class="pageBox" v-if="tableData.length">
                        <Page :total="parseInt(totalCount)" show-elevator show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
                        <p>总共{{totalPage}}页</p>
                    </div>
                </div>
            </div>


            <!-- /* add by xin */ -->
            <!--===================================新建任务时弹出的对话框===============-->
            <Modal v-model="Deletips" width="800" @on-ok="handleSubmit(addValidate)" @on-cancel="cancel()">
                <p slot="header" style="text-align:center" >
                    <Icon type="ios-information-circle"></Icon>
                    <span>上传</span>
                </p>
                <div style="text-align:center">
                    <i-form ref="addValidate" :model="addValidate" :rules="ruleValidate" :label-width="100" label-position="left">
                        <Row>
                            <i-col span="20">
                                <Form-item label="上传文件：" prop="plugin_name">
                                    <i-input  v-model="addValidate.plugin_name" placeholder="请选择上传文件(.jar格式)"></i-input>
                                </Form-item>                                
                            </i-col>        
                            <i-col span=4 >
                                <Upload action="/myapi/upload" 
                                        :before-upload="handleUpload" 
                                        :format="['jar']" 
                                        :on-format-error="handleFormatError"
                                        v-model="addValidate.plugin_name">
                                    <Button icon="ios-cloud-upload-outline">上传文件</Button>
                                </Upload>
                            </i-col>                  
                        </Row>
                    </i-form>
                </div>
                <div slot="footer">
                    <Button color="#1c2438" @click="handleSubmit('addValidate')">确认</Button>
                    <Button type="primary" @click="cancel()">取消</Button>
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
            isShowMoreShow:false,
            srchCmploading: false,
            cmpOpts: [],
            list: [], 
            taskStatusList: this.$Global.taskStatusList,
            id:'',
            plugin_name:'',
            plugin_size:'',
            uploader:'',
            upload_time:'',

            columns: [
            	{
                    type: 'selection',
                    width: 50,
                    align: 'center'
                },
                {
                    title: 'id',
                    key: 'id',
                    width: 60,
                },
                {
                    title: '插件名称',
                    key: 'plugin_name',
                    width: 220,
                    tooltip: true, 
                },
                {
                    title: '文件大小',
                    width: 220,
                    key: 'plugin_size'
                },
                {
                    title: '上传用户',
                    key: 'uploader',
                    width: 100,
                },
                {
                    title: '上传时间',
                    key: 'upload_time',
                    width: 110,
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
                                                this.detailCase(item.executor_id);
                                            }
                                        }
                                    }, '下载')
                        ])
                                            
                    }
                }
            ],
            tableData: [],
            totalcount:0,                         //共多少条数据
            pageno:1,                            //当前页
            pagesize:10,                           //每页显示多少条数据
            selectedData:[],

            /* add by xin */
            /**===================================模态框表单验证数据 =========================*/
            Deletips:false, 
            formValidate: {

            },
            addValidate: {
                plugin_name: ''
                },
            ruleValidate: {
                plugin_name: [
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
            this.$Message.error(file.name + '文件格式不正确,请上传jar格式的文件!');

        },
        handleUpload:function(file){
            var reg=new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]","i");
            var fname = file.name.substr(0,file.name.indexOf('.'))
            if(reg.test(fname)==true){
                this.$Message.error(file.name+"包含特殊字符,请检查后在上传!"); 
                return false;
            }
        },
        show:function(ev){
            alert(ev.keyCode)
        },
        srchComponent:function(query){
            this.cmpOpts = [];
            if(query !== ''){
                this.srchCmploading = true;
                setTimeout(()=>{
                    this.srchCmploading = false;
                    let _this = this;
                    this.$http.defaults.withCredentials = false;
                    this.$http.post('/myapi/userPluginMgr/list',{
                        headers:{},
                        data:{
                            name:query,
                            endTime:''
                        },
                    }).then(function(response){
                        //console.log('下拉框请求的响应',response);
                        _this.list = response.data.resultList;
                        _this.cmpOpts = _this.list.map(item =>{
                            return {
                                value:item.id,
                                label :item.name
                            }
                        });
                        //console.log('赋值给预选项',_this.cmpOpts);
                    })
                },200)
            }else{
                this.cmpOpts = [];
            }
        },

        /*删除按钮功能*/
        deleteCase: function() {
            let selectedData=this.selectedData;      //选中要删除的数据
            let resArr = [];                         
            let deleteId = [];                       //选中数据的id
            if(selectedData.length>0){               //如果有选中的数据
                for(let i in selectedData){         //进行遍历
                    deleteId.push(selectedData[i].id);  //将选中的而数据的id放入要删除的集合中
                
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
        /**加载表格中的数据 */
        listCase: function() {
            let _this = this;
            console.log('表单数据:', _this.id,_this.plugin_name,_this.plugin_size,_this.uploader,_this.upload_time);
            this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/userPluginMgr/list', {
                data: {
                    id: _this.id,
                    plugin_name: _this.plugin_name,
                    plugin_size: _this.plugin_size,
                    uploader: _this.uploader,
                    upload_time: _this.upload_time,
                    pageno:this.pageno,                             //当前页码
                    pagesize:this.pagesize                           //当前页面大小
                    
                }
            }).then(function (response) {
                console.log("列表请求回来的分页数据",response.headers);
                console.log("请求回来的模糊查询数据",response.data);
                _this.totalcount = response.headers.totalcount               //将总的数据条数赋值后渲染
                _this.tableData = response.data.resultList;
            })
        },
        /**分页查询功能----切换每页大小 */
        pageSizeChange:function(pagesize){
            //console.log("页码大小切换",pagesize);
            this.pagesize = pagesize;                     //改变当前页大小后
            this.listCase();                                 //重新请求数据
        },
        /**分页查询功能----切换当前页 */
        pageChange:function(pageno){
            //console.log("页码切换",pageno);
            this.pageno = pageno; 
            this.listCase();
        },
        findCase: function(id) {
            let _this = this
            //console.log('findCase')
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
                //console.log('response')
                //console.log(response.data.data)
            })
        },
        
        setCiFlag: function() {
            let _this = this
            let ids = []
            this.selectedData.forEach(e => {
                ids.push(e.id)
            });
            //console.log('setCiFlag')
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
            //console.log(data)
        },
        /**添加新数据弹出模态框 */
        addCase:function(){
            this.Deletips = true;
            console.log("显示模态框");
        },
        /***==========模态框弹出时确定事件: 验证表单提交 ===================*/
        handleSubmit (name) {
            //console.log(this.addValidate);
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('提交成功!');
                     this.Deletips = false;
                     //this.$refs.addValidate.$el.input.value = ''
                   //console.log("确认按钮之后", this.$refs.addValidate.$el)
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