export default {
    data () {
        return {
            formValidate: {
                id:'',//主键
                projectId:'',//项目选择
                mockName: '',//挡板名称
                mockType: '',//挡板类型
                configType:'',//配置方式
                interfaceId:'',//接口标识
                messageConfiguration:'',//报文配置
                effectNnv:'',//生效环境
                publishAddress:'',//发布地址,自己生成
                details:[//挡板控制存储详细信息
                    {   
                        id:'1',//主键
                        projectId:'',//项目编号
                        messageType:'',//报文类型
                        requestMsgFeature: '',//请求报文特征
                        responseMsg: ''//响应报文
                    }
                ]
            },
            header:{  //请求报文header部分 
              txCode: 'addMock',//
              projectId: '1001',//项目Id
              projectName:'ares',//项目名
              userId:'admin',//用户Id
              reqTime: '', //请求时间
              sysTraceId: '', //交易流水号
            },
            ruleValidate: {
                mockName: [
                    { required: true, message: 'The BaffleName cannot be empty', trigger: 'blur' }
                ],
                projectId: [
                    { required: true, message: 'protocol cannot be empty', trigger: 'change' }
                ],
                mockType: [
                    { required: true, message: 'Please select the BaffleType', trigger: 'change' }
                ]
    
            },
            projectId:'',
            temp_effectNnv:[],
            isnew : this.$route.query.isnew,
            mockid : ''
        }
    },
    created() {
        if(this.isnew==1){  //编辑操作
            this.mockid = this.$route.query.mockid;
            this.getMockinfor();
        }
        this.getSysTraceId();
    },
    methods: {
        handleSubmit (mockType) {
            this.$refs[mockType].validate(async (valid) => {
                if (valid) {
                    this.$http.defaults.withCredentials = false;
                    // this.formValidate.effectNnv = this.temp_effectNnv.join(',');
                    this.formValidate.effectNnv = this.effectNnvString;
                    console.log({header:this.header,data:this.formValidate})
                    const { data: res } = await this.$http.post('mockHandler', {
                      header:this.header,data:this.formValidate});
                    console.log(res)
                    // // 跳转到商品列表页
                    this.$Message.success(res.respDesc);
                    // this.$router.push('/InterfaceCase')
                } else {
                    this.$Message.error('Fail!');
                }
            })
        },
        backMockCollocation () {//返回挡板控制页
            this.$router.push('/baffleConfiguration')
        },
        addMock(){//添加挡板
            let id = (this.formValidate.details.length + 1).toString();
            this.formValidate.details.push({
                id:id,
                projectId:'',//项目编号
                messageType:'',//报文类型
                requestMsgFeature: '',//请求报文特征
                responseMsg: ''//响应报文
            })
        },
        removeMock(index){
            if (this.formValidate.details.length !== 1) {
                this.formValidate.details.splice(index, 1)
              } else {
                this.$Message.error('操作失误，动作至少保留一个!');
              } 
        },
        getReqTime() { //获取请求时间
            //yyyymmddhhmmssSSS
            const dt = new Date()
            const y = dt.getFullYear()
            const m = (dt.getMonth() + 1 + '').padStart(2, '0')
            const d = (dt.getDate() + '').padStart(2, '0')
      
            const hh = (dt.getHours() + '').padStart(2, '0')
            const mm = (dt.getMinutes() + '').padStart(2, '0')
            const ss = (dt.getSeconds() + '').padStart(2, '0')
            const SSS = (dt.getMilliseconds() + '').padStart(3, '0')
            this.header.reqTime = y + m + d + hh + mm + ss + SSS
            //  alert(`${y}-${m}-${d} ${hh}:${mm}:${ss} ${SSS}`)
            //  alert(this.reqTime)
            
          },
        getSysTraceId() { //获取交易流水号
            this.getReqTime();
            var randomNum = '';
            for (var i = 0; i < 5; i++) {
              randomNum += Math.floor(10 * Math.random());
            }
            // alert(randomNum)
            this.header.sysTraceId = this.header.reqTime + randomNum
            //  console.log(this.header)
          },
          getMockinfor(){
            let _this = this;
            this.header.txCode = 'queryMock';
            this.$http.defaults.withCredentials = false;
            this.$http.post('mockHandler',{header:this.header,data:{id:this.mockid}}).then(function(res){
                let resdata = res.data.data;
                _this.formValidate.mockType = resdata.mockType;
                _this.formValidate.mockName = resdata.mockName;
                _this.formValidate.interfaceId = resdata.interfaceId;
                _this.formValidate.configType = resdata.configType;
            });
          }
    },
    computed:{
        effectNnvString(){
            return this.temp_effectNnv.join(',');
        }
    }
}
