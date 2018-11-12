<template>
	<div class="pageContent">
        <div class="caseBox">
            <h3 class="Title">
                <span>接口测试案例列表</span>
            </h3>
           
            <Form ref="formValidate" class="formValidate" :label-width="80">
                    <div class="rowbox">
                            <Row class="caseBoxRow">
                                <Col span="12">
                                    <FormItem label="接口ID/名称">
                                        <Input v-model="interfaceId" placeholder="输入接口ID/名称"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="迭代版本">
                                        <Input v-model="version" placeholder="输入版本号"></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row class="caseBoxRow">
                                <Col span="12">
                                    <FormItem label="起始时间">
                                        <DatePicker v-model="startTime" placement="bottom-start" type="date" format="yyyy-MM-dd"  placeholder="选择起始时间"></DatePicker>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="截止时间">
                                        <DatePicker v-model="endTime" placement="bottom-start" type="date" format="yyyy-MM-dd"  placeholder="选择截至时间"></DatePicker>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row class="caseBoxRow">
                                <Col span="12">
                                    <FormItem label="创建人">
                                        <Input v-model="createUser" placeholder="输入创建人"></Input>
                                    </FormItem>
                                </Col>
                            </Row>   
                </div>           
                <div>
                    <Button @click="addCase" type="default" class="actionBtn">新增</Button>
                    <Button @click="deleteCase" type="default" class="actionBtn">删除</Button>
                    <Button @click="listCase" type="primary" icon="ios-search" class="actionBtn">查询</Button>
                    <Button @click="setCiFlag" type="default" class="actionBtn">加入持续集成</Button>
                </div>
            </Form>
            <div class="tableBox">
                <Table border  ref="selection" :columns="columns" :data="tableData" class="myTable" @on-row-dblclick="onRowDblClick" @on-selection-change="onSelectionChanged"></Table>
                <div class="pageBox" v-if="tableData.length">
                    <Page :total="tableDAtaTatol/tableDAtaPageLine > 1 ? (tableDAtaTatol%tableDAtaPageLine ? parseInt(tableDAtaTatol/tableDAtaPageLine)+1 : tableDAtaTatol/tableDAtaPageLine)*10 : 1" show-elevator></Page>
                    <p>总共{{tableDAtaTatol}}条记录</p>
                </div>
            </div>
        </div>
    </div>


        <!-- <AddItemPop :isShow="isShowAddPop" :isAdd="isAdd" :addLoading="true" @popClose="popCloseFn"  @tableDataAdd="tableDataAddFn" :tabDataRow="tableDataRow" /> -->

</template>
<script>
export default {
	name: 'TestCase',
    data () {
        return {
            interfaceId:'',
            version:'',
            startTime:'',
            endTime:'',
            createUser:'',
            columns: [
            	{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '接口ID/名称',
                    key: 'interfaceId',
                    width: 85,
                    align: 'center',
                },
                {
                    title: '描述',
                    key: 'interfaceDesc'
                },
                {
                    title: '是否加入持续集成',
                    key: 'ciFlag'
                },
                {
                    title: '迭代版本',
                    key: 'version'
                },
                {
                    title: '创建人',
                    key: 'createUser'
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    width: 100,
                    align: 'center',
                }
            ],
            tableData: [],
            tableDAtaTatol:0,
            tableDAtaPageLine:3,
            selectedData:[],
        }
    },
    created(){
        this.listCase();
    },
    methods: {
        deleteCase: function() {
            let _this = this
            let ids = []
            this.selectedData.forEach(el => {
                ids.push(el.id)
            });
            console.log('deleteCase')
            this.$http.defaults.withCredentials = false;
            this.$http.post('caseHandler', {
                header: {
                    txCode:'deleteCase',
                    sysTransId:'20181010153628000165432',
                    projectId:'1001',
                    projectName:'res',
                    reqTime:'153628001',
                    userId:'admin',
                },
                data: {
                    ids: ids
                }
            }).then(function (response) {
                for (var i = ids.length - 1, j = _this.tableData.length - 1; i >= 0 && j >= 0; j--) {
                    if (ids[i] === _this.tableData[j].id) {
                        _this.tableData.splice(j, 1);
                        i--;
                    }
                }
            })
        },

        listCase: function() {
            let _this = this
            console.log('listCase')
            this.$http.defaults.withCredentials = false;
            this.$http.post('caseHandler', {
                header: {
                    txCode:'listCase',
                    sysTransId:'20181010153628000165432',
                    projectId:'1001',
                    projectName:'res',
                    reqTime:'153628001',
                    userId:'admin',
                },
                data: {
                    interfaceId: this.interfaceId,
                    version: this.version,
                    startTime: '',
                    endTime: '',
                    createUser: this.createUser
                }
            }).then(function (response) {
                console.log('response')
                _this.tableData = response.data.data.cases
            })
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

        onSelectionChanged: function(data) {
            this.selectedData = data;
            console.log(data)
        },

        onRowDblClick: function(row) {
            this.$router.push({path:'/addCase',query:{id:row.id}});
        },

        addCase: function() {
            this.$router.push('addCase')
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
</style>
