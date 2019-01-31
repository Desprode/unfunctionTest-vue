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
                })
            },
            /**下载*/
            downloadCase:function(){
                let _this = this;
                var executor_id = this.$route.query.setValidates[0].executor_id;
                //this.$http.defaults.withCredentials = false;
                this.$http.post('/myapi/testresult/download',{
                    data:{
                        executor_id:executor_id,
                    }
                }).then(function(response){
                    //console.log("script编辑接口response.data",response.data);
                    //_this.tableData =  response.data.resultList.file_path;
                    console.log("111222",response.data);
                    var blob = new Blob([response.data]);
                    if (window.navigator.msSaveOrOpenBlob) {
                        // 兼容IE10
                        navigator.msSaveBlob(blob,'report.xlsx')
                    } else {
                        let url = window.URL.createObjectURL(blob);
                        let link = document.createElement('a');
                        link.style.display = 'none';
                        link.href = url;
                        link.setAttribute('download','report.xlsx');
                        document.body.appendChild(link);
                        link.click();
                    }
                })
                
            }
    }
    }
</script>