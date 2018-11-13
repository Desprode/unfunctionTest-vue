<template>
    <div class="baffleConfiguration">
        <!-- 挡板信息输入区域 -->
        <Row>
            <Col span="3">
                <span class="baffle_label">挡板名称</span>
            </Col>
            <Col span="7">
                <Input placeholder="请输入挡板名称" v-model="bafflename" clearable />
            </Col>
            <Col span="3">
                <span class="baffle_label">接口ID</span>
            </Col>
            <Col span="7">
                <Input placeholder="请输入接口ID" v-model="baffleid" clearable />
            </Col>
            <Col span="4">
                <Button type="info" style="width: 80px" @click="queryBafflelist">查询</Button>
            </Col>
        </Row>

        <!-- 挡板相关操作区域 -->
        <div class="baffleOpera">
            <div class="btn_border">
                <Button type="success" style="width: 80px" @click="addMock">新增</Button>
            </div>
            <div class="btn_border">
                <Button type="error" style="width: 80px" @click="handleDelete">删除</Button>
            </div>
            <div class="btn_border">
                <Button type="warning" style="width: 80px" @click="handleEdit">编辑</Button>
            </div>
        </div>
        <!-- 查询结果table -->
        <Table :columns="bafflelist" :data="bafflelistdata" ref="selection" class="baffle_table" border highlight-row @on-select="handleRowChange" @on-select-cancel="handleRowChange" @on-select-all-cancel="handleRowChange" @on-select-all="handleRowChange" ></Table>
    </div>
</template>
<script>
import {mapGetters} from "vuex";
import expandRow from "./BaffleConfigureSublist";

  import store from '@/store/index.js';
export default {
    data(){
        return{
            bafflename : '', //挡板名称
            baffleid : '',  //挡板ID
            bafflelist : [     //挡板格式定义
                 {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                },
                {
                    title: '挡板名称',
                    key: 'mockName',
                    minWidth : 90,
                },
                {
                    title: '接口ID/名称',
                    key: 'projectId',
                    minWidth : 110
                },
                {
                    title : '最后修改人',
                    key: 'lasteditor',
                    minWidth : 110
                },
                {
                    title : '最后修改时间',
                    key: 'lasttime',
                    minWidth : 110
                },
                {
                    title : '发布地址信息',
                    key : 'urlinfor',
                    minWidth: 160,
                    align: 'center',
                    render : (h, params)=>{
                        return h(expandRow, {
                            props: {
                                row: params.row
                            }
                        })
                    }
                }
            ],
            selectedarr : [],   //选中的数据集合
            header: {
                txCode:'', //交易码
                sysTransId:'20181026153628000165432',   //交易流水号
                projectId:'1001',   //项目id
                projectName:'res',  //项目名称
                reqTime:'153628001',    //请求时间
                userId:'admin', //用户id
            },
        }
    },
    components : {
        expandRow
    },
    computed: {
        ...mapGetters(['bafflelistdata']), //这是数组['A’,’B’,...]
        queryParam(){
            return {
                projectId : '',
                mockName : this.bafflename,
                interfaceId : this.baffleid
            }
        }
    }, 
    mounted(){
        this.queryBafflelist();     //默认加载挡板列表
    },
    methods: {
        handleEdit(){   //编辑
            let selearr = this.selectedarr;
            if(selearr.length==0){
                this.$Message.error('请选择要编辑的数据');
            }else if(selearr.length>1){
                this.$Message.error('只能编辑一条数据，请重新选择');
            }else{
                let editid = this.selectedarr[0].id
                this.$router.push({path:'./addMock',query:{isnew:1,mockid:editid}});
            }
        },
	    addMock(){ //新增
            this.$router.push({path:'./addMock',query:{isnew:0}});
		},
        handleRowChange(selection){   //选中的集合
            this.selectedarr = selection;
        },
        handleDelete(){ //删除操作
            let delearr = this.selectedarr;
            let datalist = this.bafflelistdata;
            let resarr = [];
            let deleitemid = [];
            if(delearr.length>0){
                for (let i in delearr){
                    deleitemid.push(delearr[i].id);
                } 
                this.header.txCode = 'deleteMock';
                this.$store.dispatch('deleBaffledata',{header:this.header,data:{ids:deleitemid}})
            }else{
                this.$Message.error('请选择要删除的数据');
            }
            
        },
        queryBafflelist(){  //查询挡板列表
            this.header.txCode = 'listMock';
            this.$store.dispatch('queryBafflelist',{header:this.header,data:this.queryParam});
        },
        getReqTime() { //获取请求时间
            //yyyymmddhhmmssSSS
            const dt = new Date();
            const y = dt.getFullYear();
            const m = (dt.getMonth() + 1 + '').padStart(2, '0');
            const d = (dt.getDate() + '').padStart(2, '0');
      
            const hh = (dt.getHours() + '').padStart(2, '0');
            const mm = (dt.getMinutes() + '').padStart(2, '0');
            const ss = (dt.getSeconds() + '').padStart(2, '0');
            const SSS = (dt.getMilliseconds() + '').padStart(3, '0');
            this.header.reqTime = y + m + d + hh + mm + ss + SSS;
          },
        getSysTraceId() { //获取交易流水号
            this.getReqTime();
            var randomNum = '';
            for (var i = 0; i < 5; i++) {
              randomNum += Math.floor(10 * Math.random());
            }
            this.header.sysTraceId = this.header.reqTime + randomNum;
          }
    }
}
</script>
<style scoped>

.baffle_label{
    line-height: 32px;
    font-size: 14px
}
.baffleOpera{
    margin-top: 30px;
    text-align: left;
    display: flex;
}
.baffleOpera .btn_border{
    margin-right: 10px
}
.baffle_table{
    margin-top: 30px;
}

.baffle_table>>>.ivu-table-row td:nth-last-child(1) .ivu-table-cell{
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 10px;
    padding-top: 10px
}
</style>


