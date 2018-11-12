<template>
    <div class="baffle_sublist">
        <Row v-for="(item,index) in row.posturl" :class="index==row.posturl.length-1?'divider_last':'divider'" :key="item.postenviron">
            <Col span="8" v-if="item.postenviron!=''">
                <span class="list_name">{{item.postenviron}}：</span>
            </Col>
            <Col span="16" v-if="item.testurl!=''">
                <span>{{ item.testurl }}</span> 
            </Col>
        </Row>
    </div>
</template>
<script>
export default {
    props : {
        row : Object
    }
}
</script>
<style scoped>
.list_name{
    display: inline-block;
    width: 100%;
    text-align: center
}
.baffle_sublist .divider{
    border-bottom: 1px solid #e8eaec;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    margin-bottom: 10px
}
.baffle_sublist .divider_last{
    border-bottom: 0;
    padding-left: 10px;
    padding-right: 10px;
}
</style>


