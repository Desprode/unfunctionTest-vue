<template>
<div>
    <div align="left" >
            <font size="5" color="#01babc">实时监控</font>
    </div></br>
    <!--<div align="right" >右对齐，<div align="left" >左对齐-->
            <Button style="float:right" @click="deleteCase" type="error" class="actionBtn">停止</Button>
    <div align="left" >
        <font size="3" color="#01babc">场景名称:</font><Input v-model="senario_name" readonly="readonly" style="width:150px"></Input>
    </div>
    <div align="left" >
        <font size="3" color="#01babc">已运行时间:</font><Input v-model="senario_name" readonly="readonly" style="width:55px"></Input><!-- readonly="readonly"文本框内容不可选中-->
    </div>
    <div align="left">  
        <font size="3" color="#01babc">状态:</font>
        <Select v-model="senario_type" style="width:125px" disabled="disabled" clearable>  <!--disabled="disabled"下拉框内容不可选中-->
            <Option  value="10">预约等待</Option>
            <Option  value="01">测试准备中</Option>
            <Option  value="02">测试执行中</Option>
            <Option  value="03">测试取消</Option>
            <Option  value="00">测试结束</Option>
        </Select>
    </div>
    <div align="left">
        <font size="3" color="#01babc">详细描述:</font>
        <div class="test_box" contenteditable="true"   style="-webkit-user-select:text"><br /></div>
    </div>
    <div align="left">
        <Tabs type="card">
            <!---------------------分割线-------------------------->
            <Tab-pane label="jmeter信息">
                <Table :columns="columns1" :data="data1"></Table>
            </Tab-pane>
            <!---------------------分割线-------------------------->
            <Tab-pane label="服务器资源">
                <Table :columns="columns1" :data="data1"></Table>
            </Tab-pane>
            <!---------------------分割线-------------------------->
            <Tab-pane label="压力机资源">
                <Table :columns="columns1" :data="data1"></Table>
            </Tab-pane>
        </Tabs>
    </div>
</div> 
</template>
<script>
</script>
<style lang="less" scoped>
    .test_box {
        width: 300px;
        min-height: 50px;
        max-height: 50px;
    }
    .myTable {
    margin-bottom: 15px;
}
</style>
