<template>
    <div>
        <div align="left" >
            <font size="5" color="#01babc">执行结果详细信息</font>
        </div></br>
    <Tabs type="card"  >
        <Tab-pane label="测试报告">
            <iframe>{{html}}</iframe>
        </Tab-pane>
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
            <Form-item label="执行结果是否通过：" >
                <Row>
                    <i-col span="3">
                        <i-select>
                                <i-option value="1">是</i-option>
                                <i-option value="0">否</i-option>
                        </i-select>
                    </i-col>
                </Row>
            </Form-item>
            <Form-item label="测试结论分析描述：" >
                <Row>
                    <i-col span="13">
                         <i-input :value.sync="formItem.textarea" type="textarea" :autosize="{minRows: 3,maxRows: 7}" placeholder="请输入..."></i-input>
                    </i-col>
                </Row>
            </Form-item>
            <Form-item align="center">
                <i-button type="error" style="margin-left: 8px">取消</i-button>
                <i-button type="primary">保存</i-button>
                <i-button type="primary">提交缺陷</i-button>
            </Form-item>
        </Tab-pane>
    </Tabs>
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
                columns1: [
                    {
                        title: '序号',
                        key: 'name'
                    },
                    {
                        title: '机器名',
                        key: 'age'
                    },
                    {
                        title: 'ip',
                        key: 'address'
                    },
                    {
                        title: 'CPU%',
                        key: 'address'
                    },
                    {
                        title: 'MEM%',
                        key: 'address'
                    },
                    {
                        title: 'IObusy%',
                        key: 'address'
                    },
                    {
                        title: '失败数',
                        key: 'address'
                    },
                    {
                        title: 'jmeter日志',
                        key: 'address'
                    },
                    {
                        title: 'JTL日志',
                        key: 'address'
                    }
                ],
                data1: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ]
            }
        },
        created(){
        this.listCase();
        },
        
        methods:{
            //页面展示
            listCase: function() {
                console.log("111111111111111111111111111111");
                let _this = this;
                this.$http.defaults.withCredentials = false;
                this.$http.get('http://128.195.0.13:8000/testresult/getreport?fileurl=report/1542855394106/report.html', {
                    data: {
                        
                    }
                }).then(function (response) {
                    html=response.data.html;
                    console.log(response.data.html);
                    
                })  
            },
            
        }
    }

</script>
