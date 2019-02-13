<template>
    <div>
        <div align="left" >
            <font size="5" color="#01babc">报告详细信息</font>
        </div></br>
        <div align="left">
            <Button @click="downloadCase()" type="primary">下载报告</Button>
        </div>
        <!-- 页面渲染   -->
        <div v-html='content'>{{content}}</div>
    </div>  
</template>
<script>
    export default {
        data () {
            return {
                formItem: {
                    html:'',
                    input: '',
                    select: '',
                    radio: 'male',
                    checkbox: [],
                    switch: true,
                    date: '',
                    time: '',
                    slider: [20, 50],
                    textarea: ''
                },
                /** ============================执行结果============================ */
                showSetType:'',
                content:'',
            }
        },
        created(){
            this.listCase();
        },
        methods:{
            //加载测试报告
            listCase: function() {
                let _this = this;
                var perftask_id = this.$route.query.perftask_id; 
                console.log("perftask_id",perftask_id); 
                this.$http.post('/myapi/testresult/getMergeReport', {
                    data: {
                        perftask_id:perftask_id
                    }
                }).then(function (response) {
                    _this.tableData =  response.data.resultList;
                    console.log("_this.tableData",_this.tableData);
                    _this.content   =  response.data.resultList[0].content;
                    _this.file_path   =  response.data.resultList[0].file_path;
                })
            },
            /**下载*/
            downloadCase:function(){
                let _this = this;
                console.log("file_path",_this.file_path);
                let a = document.createElement('a')
                a.href = _this.file_path;
                a.click();  
            }
    }
    }
</script>