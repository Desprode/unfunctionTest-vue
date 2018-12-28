<template>
    <div>
        <div align="center" >
            <font size="5" color="#01babc">脚本详情</font>
        </div></br>
        
        <Form ref="setValidate" :model="setValidate" :label-width="80">
            <Row>
                <Col span="12">
                    <FormItem label="脚本ID:" item-width="40">                     
                        <!-- <div class="ivu-input-wrapper ivu-input-type editStaticDiv">{{setValidate.script_id}} </div> -->
                        <Input v-model="setValidate.script_id" readonly></Input>                           
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="脚本名称:" prop="script_name"> 
                            <!-- <i-input v-model="setValidate.script_name" aria-readonly="true"></i-input>   -->
                            <Input v-model="setValidate.script_name" readonly></Input>                   
                    </FormItem>
                </Col> 
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="脚本大小:" prop="filesize"> 
                            <Input v-model="setValidate.filesize" readonly></Input>                   
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="创建人:" prop="script_manager_id"> 
                            <Input v-model="setValidate.script_manager_id" readonly></Input>                   
                    </FormItem>
                </Col> 
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="创建时间:" prop="create_time"> 
                            <Input v-model="setValidate.create_time" readonly></Input>                        
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="更新时间:" prop="update_time">  
                            <Input v-model="setValidate.update_time" readonly></Input>                      
                    </FormItem>
                </Col> 
            </Row>
            <Row>
                <Col span="24">
                    <FormItem label="脚本说明:" prop="memo"> 
                            <Input v-model="setValidate.memo" readonly type="textarea" :autosize="{minRows:2,maxRows:3}"></Input>                      
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div align="center">
            <Button @click="back" type="primary">返回</Button>
        </div>
    </div>  
</template>
<script>
    export default {
        data () {
            return {
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
                }
            }
        },
        created(){
            this.loadScript();
        },
        methods:{
            //加载测试报告
            loadScript: function() {
                let _this = this;
                var script_id = this.$route.query.script_id;  
                this.$http.post('/myapi/scripts/view',{
                    data:{
                        id:script_id,
                    }
                }).then(function(response){
                    console.log("script编辑接口response.data",response.data);
                    _this.setValidate.script_name= response.data.resultList[0].script_name;
                    _this.setValidate.script_id= response.data.resultList[0].script_id;
                    _this.setValidate.app_name= response.data.resultList[0].app_name;
                    _this.setValidate.memo= response.data.resultList[0].memo;
                    _this.setValidate.create_time= response.data.resultList[0].created_time;
                    _this.setValidate.script_filename= response.data.resultList[0].script_filename;
                    _this.setValidate.update_time= response.data.resultList[0].modified_time;
                    _this.setValidate.filesize= response.data.resultList[0].script_filesize;
                    _this.setValidate.script_manager_id=response.data.resultList[0].script_manager_name;
                    // _this.setValidate.update_time= response.data.resultList[0].updated_time;
                    
                })
            },
            back(){
            if (window.history.length <= 1) {
                this.$router.push({path:'/'})
                return false
            } else {
                this.$router.go(-1)
            }
        }
    }
    }
</script>