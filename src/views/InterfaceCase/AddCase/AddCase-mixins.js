export default {
  data() {
    return {
      formValidate: {
        id:'',//id为空，表示第一次提交，id不为空,表示不是第一次提交
        projectId:'',//项目编号
        interfaceId: "", //接口编号
        version: "", //版本
        // createTime:'',//创建时间，没用到
        // createUser:'',//创建人，没用到
        protocolConfig: { //协议配置
          protocolType: '', //协议类型，如http
          configItem: { //配置项
            method: '', //方法 ，post
            address: '' //地址，localhost
          }
        },
        interfaceDesc: "", //测试描述
        requestMsg: { //报文类型/请求报文
          type: '', //对应 ‘from/json/xml’
          messageBody: '' //"原始xml|原始json|表单转json"
        },
        preProcess: [ //前置动作
          {
            order: '1',
            processType: '',
            configItem: {

            }
          }
        ],
        postProcess: [ //后置动作
                 {
            order: '1',
            processType: '',
            configItem: {

            }
          }
        ],
        checkPoints: '', //临时定义为String类型，不然报错
        // check_points:[//检查点
        //   {}
        // ],
        ciFlag: false, //持续集成
        effectNnv:''//生效环境
      },
      ruleValidate: {
        interfaceId: [{
          required: true,
          message: "The ID/name cannot be empty",
          trigger: "blur"
        }]
      },
      header:  //请求报文header部分
        {
          txCode: 'addCase',//
          projectId: '1001',//项目Id
          projectName:'ares',//项目名
          userId:'admin',//用户Id
          reqTime: '', //请求时间
          sysTraceId: '', //交易流水号
          // operateCode:'1'
        }
      ,
      tableNum: [ //基本信息中的表格控制数据
        {
          id: 1,
          key: '',
          value: '',
          desc: ''
        }
      ],
      isTrue:true,
      select1:'',
      props:["id"]
    }
  },
  created() {
    this.getSysTraceId();
    // console.log(this.$route.query);
    if(Object.keys(this.$route.query).length == 0){
      this.getGlobalCongig();
    }else{
      this.getInterFaseData();
    }
  },
  methods: {
    async getInterFaseData(){//修改功能的数据获取
       this.$http.defaults.withCredentials = false;
       let {data:res} = await this.$http.post('caseHandler', {
                header: {
                    txCode:'queryCase',
                    sysTransId:'20181010153628000165432',
                    projectId:'1001',
                    projectName:'res',
                    reqTime:'201810101536280001',
                    userId:'admin',
                },
                data: {
                    id: this.$route.query.id
                }
        })
      if(res.respCode == 200){
        res.data.protocolConfig = JSON.parse(res.data.protocolConfig);
        res.data.requestMsg = JSON.parse(res.data.requestMsg);
        res.data.postProcess = JSON.parse(res.data.postProcess);
        res.data.preProcess = JSON.parse(res.data.preProcess);
        if(res.data.requestMsg.type == 'form'){
          this.tableNum = JSON.parse(res.data.requestMsg.messageBody);
        }
        for(var key in res.data){
          this.formValidate[key] = res.data[key]
        }
      }
  },
    
    getGlobalCongig(){//获取全局配置数据
      this.formValidate.projectId = this.$store.state.newPro;//选择项目
      this.formValidate.protocolConfig.protocolType = this.$store.state.newProtocol;//http
      this.formValidate.protocolConfig.configItem.method = this.$store.state.newWay;//get/post
      this.formValidate.checkPoints = this.$store.state.checkPointConfig;//检查点
    },
    //保存表单调用的方法
    handleSubmit(interfaceId) {
      this.$refs[interfaceId].validate(async (valid) => {
        if (valid) {
          console.log({header:this.header,data:this.formValidate})
          if(this.formValidate.requestMsg.type == 'form'){
            this.formValidate.requestMsg.messageBody = JSON.stringify(this.tableNum);
          }
          this.$http.defaults.withCredentials = false;
          const { data: res } = await this.$http.post('caseHandler', {
            header:this.header,data:this.formValidate});
            console.log(res)
            if (res.respCode !== "200") return this.$Message.error(res.respDesc)
            
            if(this.formValidate.id == ''){
              this.formValidate.id = res.id;
            }
          // 跳转到商品列表页
          this.$Message.success(res.respDesc);
          // this.$router.push('/InterfaceCase')
        } else {
          // this.changeJson();
          this.$Message.error('基本信息中的接口Id没有填写，so Fail!');
        }
      })
    },
    //添加前置动作
    addPreInput() {
      let id = (this.formValidate.preProcess.length + 1).toString();
      let name = '';
      let configItem = {};
      this.formValidate.preProcess.push({
        order: id,
        processType: name,
        configItem: configItem
      })
    },
    //添加后置动作
    addPostInput() {
      let id = (this.formValidate.postProcess.length + 1).toString();
      let name = '';
      let configItem = {};
      this.formValidate.postProcess.push({
        order: id,
        processType: name,
        configItem: configItem
      })
    },
    //删除前置动作
    removePre(index) {
      if (this.formValidate.preProcess.length !== 1) {
        this.formValidate.preProcess.splice(index, 1)
      } else {
        this.$Message.error('操作失误，动作至少保留一个!');
      }
    },
    //删除后置动作
    removePost(index) {
      if (this.formValidate.postProcess.length !== 1) {
        this.formValidate.postProcess.splice(index, 1)
      } else {
        this.$Message.error('操作失误，动作至少保留一个!');
      }
    },
    //删除基本信息里form选项的key/value项
    removeTable(index) {
      if (this.tableNum.length !== 1) {
        this.tableNum.splice(index, 1)
      } else {
        this.$Message.error('操作失误，至少保留一个!');
      }
    },
    //添加基本信息里form选项的key/value项
    addTable() {
      let id = this.tableNum.length + 1;
      let key = '';
      let value = '';
      let desc = '';
      this.tableNum.push({
        id: id,
        key: key,
        value: value,
        desc: desc
      })
    },
    insertItem(index){
      if(this.tableNum.length == (index+1)){
        let id = this.tableNum.length + 1;
        let key = '';
        let value = '';
        let desc = '';
        this.tableNum.push({
          id: id,
          key: key,
          value: value,
          desc: desc
        })
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
      //  console.log(this.sysTraceId)
    },
    changeExecute(i, event) {
      this.formValidate.preProcess[i].configItem = {}
      if (event.value == 'CASE') {
        this.formValidate.preProcess[i].configItem.caseID = ''
      }
      if (event.value == 'SHELL') {
        this.formValidate.preProcess[i].configItem.script = ''
      }
      if (event.value == 'SQL') {
        this.formValidate.preProcess[i].configItem.DB = ''
        // this.formValidate.pre_process[i].configItem.SQL = []
      }

      // console.log(this.formValidate.preProcess[i].configItem)
    },
    execution(){
      this.isTrue = false;
    },
    changeJson(){//将tableNum转化为json类型
      let table =  JSON.stringify(this.tableNum)
      console.log(table);
    }

   
  }


};
