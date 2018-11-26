<template>
    <div>
        <div align="left" >
            <font size="5" color="#01babc">实时监控</font>
        </div></br>
    <Tabs type="card"  >
        <!---------------------分割线-------------------------->
        <Tab-pane label="压力机日志">
            <Table :columns="columns1" :data="data1"></Table>
        </Tab-pane>
        <!---------------------分割线-------------------------->
        <Tab-pane label="平台日志">
            <Table :columns="columns1" :data="data1"></Table>
        </Tab-pane>
        <!---------------------分割线-------------------------->
        <Tab-pane label="执行结果">
            <Table :columns="columns1" :data="data1"></Table>
        </Tab-pane>
    </Tabs>
    </div>  
</template>
<script>
</script>
