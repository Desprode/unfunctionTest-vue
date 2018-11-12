<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row>数据库信息</Row>
        <Row>
            <Col span="10"><span class="expand-key">名称 </span></Col>
            <Col span="10"><span class="expand-key">连接串 </span></Col>
        </Row>
    
        <Row v-for="(item,i) in row.evnInfo.db">
                <Col span="10">
                    <Select  placeholder="Enter DB" style="width: 360px">
                            <Option value="DB1">DB1</Option>
                            <Option value="DB2">DB2</Option>
                    </Select>
                    <!-- <Input  placeholder="Enter 名称" style="width: 360px" @on-focus="insertDb(row,i)" v-model="item.name"/> -->
                </Col>
                <Col span="12">
                    <Input  placeholder="Enter 连接串" style="width: 360px" @on-focus="insertDb(row,i)" v-model="item.url"/>
                </Col>
        </Row>
        
        <br/>
        <Row>AP信息</Row>
        <Row>
            <Col span="10"><span class="expand-key">名称 </span></Col>
            <Col span="10"><span class="expand-key">IP </span></Col>
        </Row>
        <Row v-for="(item,i) in row.evnInfo.ap">
            <Col span="10">
                <Select  placeholder="Enter AP" style="width: 360px">
                    <Option value="AP1">AP1</Option>
                    <Option value="AP2">AP2</Option>
                </Select>
                <!-- <Input  placeholder="Enter 名称" style="width: 360px" @on-focus="insertAp(row,i)" v-model="item.name"/> -->
            </Col>
            <Col span="10">
                <Input  placeholder="Enter IP" style="width: 360px" @on-focus="insertAp(row,i)" v-model="item.ip"/>
            </Col>
              
        </Row>
        <br/>
        <Row>加解密服务器</Row>
        <Row>
            <Col span="10"><span class="expand-key">KMC </span></Col>
            <Col span="10"><span class="expand-key">安全节点 </span></Col>
        </Row>
        <Row v-for="(item,i) in row.evnInfo.encryptServer">
            <Col span="10">
                <Select  placeholder="Enter KMC" style="width: 360px">
                    <Option value="KMC1">KMC1</Option>
                    <Option value="KMC2">KMC2</Option>
                </Select>
                <!-- <Input  placeholder="Enter KMC" style="width: 360px" @on-focus="insertKmc(row,i)" v-model="item.kmc"/> -->
            </Col>
            <Col span="10">
                <Input  placeholder="Enter 安全节点" style="width: 360px" @on-focus="insertKmc(row,i)" v-model="item.spot"/>
            </Col>
            
        </Row>
    </div>
</template>
<script>
    import store from '@/store/index';
    export default {
        props: {
            row: Object
        },
        methods: {
            insertDb(row,index){
                if(row.$isEdit==true){
                    let db = row.evnInfo.db
                    if(db.length==(index+1)){
                        var r = {name:'',url:''};
                        db.push(r);
                        console.log('db:'+db.length);
                        this.$store.commit('SET_EVN_UPDATE', true);
                        this.$store.commit('SET_EVN_ROW', row);  
                    }
                }   
            },
            insertAp(row,index){
                if(row.$isEdit==true){
                    let ap = row.evnInfo.ap
                    if(ap.length==(index+1)){
                        var r = {name:'',ip:''};
                        ap.push(r);
                        console.log('ap:'+ap.length);
                        this.$store.commit('SET_EVN_UPDATE', true);
                        this.$store.commit('SET_EVN_ROW', row);
                    }
                }
            },
            insertKmc(row,index){
                if(row.$isEdit==true){
                    let kmc = row.evnInfo.encryptServer
                    if(kmc.length==(index+1)){
                        var r = {kmc:'',spot:''};
                        kmc.push(r);
                        console.log('kmc:'+kmc.length);
                        this.$store.commit('SET_EVN_UPDATE', true);
                        this.$store.commit('SET_EVN_ROW', row);
                    }
                }
            }
        }
    };
</script>
<style>
.ivu-table-cell {
    padding-left: 0px;
    padding-right: 0px;
}
.ivu-col{
    margin-top:3px;
}
</style>