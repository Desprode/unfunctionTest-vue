<template>
	<div class="pageContent">
        <Card>
            <div class="caseBox">
                <h3 class="Title">
                    <span>用户插件列表</span>
                </h3>
                <div class="tableBox">
                    <div class="tableBtnBox">
                        <Button type="primary" @click="addScript" >上传插件</Button>
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
            <Modal v-model="showDialog" width="800">
                <p slot="header" style="text-align:center" >
                    <Icon type="ios-information-circle"></Icon>
                    <span>上传</span>
                </p>
                <div style="text-align:center">
                    <i-form ref="addValidate" :model="addValidate" :rules="ruleValidate" :label-width="100" label-position="left">
                        <Row>
                            <i-col span="20">
                                <Form-item label="上传文件：" prop="script_filename">
                                    <i-input  v-model="addValidate.script_filename" placeholder="请选择上传文件(.jar格式)"></i-input>
                                </Form-item>                                
                            </i-col>        
                            <i-col span=4 >
                                <Upload ref="upload"
                                        name="file"
                                        action="/myapi/scripts/upload" 
                                        :before-upload="handleUpload" 
                                        :format="['jar']" 
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
                    <Button color="#1c2438" @click="submitScript('addValidate')">确认</Button>
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
            srchCmploading: false,
            showDialog:false,
            cmpOpts: [],
            list: [], 
            taskStatusList: this.$Global.taskStatusList,
            id:'',
            plugin_name:'',
            plugin_size:'',
            uploader:'',
            upload_time:'',
            script_filename:'',

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
                                                this.handleDownload(item.executor_id);
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

            /* add by xin */
            /**===================================模态框表单验证数据 =========================*/
            Deletips:false, 
            formValidate: {

            },
            addValidate: {
                script_filename: ''
                },
            ruleValidate: {
                script_filename: [
                { required: true, message: '此项为必填项', trigger: 'blur' }
            ]
            },
        }
    },
    created(){
        this.listCase();
    },
    methods: {
        handleFormatError:function(file){
            this.$Message.error(file.name + '文件格式不正确,请上传jar格式的文件!');
        },
        handleUpload:function(file){
            var reg=new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]","i");
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
                console.log(this.filesize)
                console.log(this.script_filename)
                console.log(this.script_filepath)
                console.log(this.script_id)
            }
        },

        /**加载表格中的数据 */
        listCase: function() {
            let _this = this;
            this.$http.defaults.withCredentials = false;
            this.$http.post('/myapi/userPluginMgr/list', {
                data: {
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
        /**添加新数据弹出模态框 */
        addScript:function(){
            this.showDialog = true;
            console.log("显示模态框");
        },
        /***==========模态框弹出时确定事件: 验证表单提交 ===================*/
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
                            if("ok" == response.data.result){
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
        /**模态框弹出取消事件 */
        cancel () {
            this.$Message.info('点击了取消');
            this.showDialog = false;
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