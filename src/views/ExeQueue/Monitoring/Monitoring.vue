<template>
    <div>
        <div align="left" >
            <font size="5" color="#01babc">实时监控</font>
        </div></br>
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
</template>
<script>
</script>
