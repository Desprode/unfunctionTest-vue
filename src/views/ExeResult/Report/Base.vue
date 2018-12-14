<template>
        <div class="pageContent">
          <div class="caseBox">
            <h1 id="title">###title###基准测试报告</h1>
            <Form ref="formValidate" class="formValidate">
                <div class="rowbox">
                    <Row :gutter="16" >
                        <Col span="2" id="senario_name">
                            <Col class="table-field-Col">场景名称:</Col>
                            <div class="table-field-div" id="sceneName">##sceneName##</div>
                        </Col>
                        <Col span="2" id="vu_num">
                            <Col class="table-field-Col">VU数:</Col>
                            <div class="table-field-div" id="vuNum">##VU数##</div>
                        </Col>
                    </Row>
                </div>
              <h3 class="Title">
                  <span>场景基本信息</span>
              </h3>
              <div class="rowbox">
                  <Row :gutter="16">
                      <Col span="2" class="table-field-Col">项目名称:</Col>
                      <Col span="5">
                        <div class="table-field-div" id="projectName">##projectName##</div>
                      </Col>
                      <Col span="2" class="table-field-Col">组件名称:</Col>
                      <Col span="5">
                        <div class="table-field-div" id="componentName">##componentName##</div>
                      </Col>
                      <Col span="2" class="table-field-Col">任务名称:</Col>
                      <Col span="5">
                        <div class="table-field-div" id="taskName">##taskName##</div>
                      </Col>
                  </Row>
                  <Row :gutter="16" >
                      <Col span="2" class="table-field-Col">开始时间:</Col>
                      <Col span="5">
                        <div class="table-field-div" id="startTime">##startTime##</div>
                      </Col>
                      <Col span="2" class="table-field-Col">结束时间:</Col>
                      <Col span="5">
                        <div class="table-field-div" id="endTime">##endTime##</div>
                      </Col>
                      <Col span="2" class="table-field-Col">运行时间:</Col>
                      <Col span="5">
                        <div class="table-field-div" id="interalMinutes">##interalMinutes##</div>
                      </Col>
                  </Row>
                  <Row :gutter="16" >
                      <Col span="2" class="table-field-Col">场景类型:</Col>
                      <Col span="5">
                        <div class="table-field-div">##混合场景##</div>
                      </Col>
                      <Col span="2" class="table-field-Col">执行人:</Col>
                      <Col span="5">
                        <div class="table-field-div" id="executorName">##executorName##</div>
                      </Col>
                      <Col span="2"></Col>
                  </Row>
              </div>
            </Form><br/>
            <Form ref="formValidate" class="formValidate">
              <h3 class="Title">
                <span>性能数据表</span>
              </h3>
              <div class="rowbox">
                <img id="jmeter_summary" src="###jmeter_summary###" />
              </div>
            </Form>
            <Form ref="formValidate" class="formValidate">
              <h3 class="Title">
                <span>性能趋势图</span>
              </h3>
              <div class="rowbox">
                <img id="jmeter_tps" src="###jmeter_tps###" />
                <img id="jmeter_avgrsp" src="###jmeter_avgrsp###" />
              </div>
            </Form>
            <Form ref="formValidate" class="formValidate"></Form>
              <h3 class="Title">
                  <span>失败事务分析</span>
              </h3>
              <div class="rowbox">
                  <Row :gutter="30" >
                      <Col class="table-field-Col" >事务名</Col>
                      <Col class="table-field-Col">数量</Col>
                      <Col class="table-field-Col">返回错误码</Col>
                      <Col class="table-field-Col">返回错误描述</Col>
                      <Col class="table-field-Col">jmeter报错信息</Col>
                  </Row>
              </div>
              <div>
                  ###errors###
              </div>
            </Form>
          </div>
        </div>
      </template>
      <script>
        export default {
            data () {
                return {
                    formItem: {
                        input: '',
                        select: '',
                        radio: 'male',
                        checkbox: [],
                        switch: true,
                        date: '',
                        time: '',
                        slider: [20, 50],
                        textarea: ''
                    }
                }
            }
        }
      </script>
      <style lang="less" scoped>
      .Title{
          text-align: left;
          font-weight: 400;
          font-size: 15px;
          position: relative;
          padding-left: 0;
          padding-bottom: 7px;
          border-bottom: 2px solid #01babc;
          margin-top:0px;
          margin-bottom: 20px;
      }
      .Title span{
          padding-right: 26px;
          padding-top: 8px;
          padding-bottom: 8px;
          background-color: #01babc; 
          border-radius: 0px 38px 38px 0px;
          color:#fff;
          padding-left: 26px;
      }
      .Title::before{
          content: '';
          position: absolute;
          left:12px;
          top:1px;
          width:4px;
          height: 60%;
          background-color: #fff;
          border-radius: 2px;
      }
      .pageContent{
          margin:-16px;
      }
      .rowbox{
          width:100%;
          margin: 0px auto;
      }
      .myTable {
          margin-bottom: 15px;
      }
      .caseInputBox{
          display: flex;
      }
      .serchBtnBox{
          position: relative;
      }
      
      .caseBoxRow{
          padding-bottom:10px;
      }
      .serchBtn{
          position: absolute;
          left:0;
          top:50%;
          transform: translate(50%, -65%);
      }
      .formValidate {
          margin:0 auto;
          width: 100%;
          margin-left: 0;
      
      }
      .caseBox{
       padding-top:10px;
      }
      .tableBox{
          padding-top: 20px;
      }
      .tableBtnBox{
          padding-top:0;
          padding-bottom:10px;
          text-align: left;
      }
      .pageBox {
          padding-bottom:20px;
          padding-top:20px;
          overflow: hidden;
      }
      .pageBox ul{
          float: right;
      }
      .pageBox p{
          float:left;
          line-height: 32px;
          font-size:12px;
      }
      
      .formValidateMoreBtnBox {
          text-align: center;
          height: 16px;
          background: #e9eaec;
          position: relative;
          width: 10%;
          margin: 0 auto;
          cursor: pointer;
          margin-top: 10px;
      }
      
      /* add by q */
      .arrUp{
          transform: rotate(-180deg);
          transform-origin: center center;
      }
      .arrDown{
          transform: rotate(0deg);
          transform-origin: center center;
      }
      
      .formValidateMoreBtnBox {
          text-align: center;
          height: 16px;
          background: #01babc;
          position: relative;
          width: 8%;
          margin: 0 auto;
          cursor: pointer;
          margin-top: 10px;
      }
      
      .formValidateMoreBtnBox .ivu-icon {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -30%);
          -ms-transform: translate(-50%, -30%);
          -webkit-transform: translate(-50%, -30%);
      }
      
      .formValidateMoreBtnBox .ivu-icon:first-of-type {
          transform: translate(-50%, -60%);
          -ms-transform: translate(-50%, -60%);
          -webkit-transform: translate(-50%, -60%);
      }
      
      .formValidateMoreBtnBox .ivu-icon:last-of-type {
          transform: translate(-50%, -20%);
          -ms-transform: translate(-50%, -20%);
          -webkit-transform: translate(-50%, -20%);
      }
      .table-field-Col {
          min-width: 120px;
          display: table-cell;
          text-align: right;
          margin-right: 20px;
          vertical-align: top;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 0;
          padding-right: 20px;
          padding-top: 5px;
      }
      .table-field-div {
          font-size: 13px;
          padding: 10px;
          padding-top: 8px;
          padding-right: 10px;
          padding-bottom: 14px;
          padding-left: 10px;
      }
      
      /* add by xin */
      /*三个操作按钮样式*/
      .btnOpera{
      margin-top: 30px;
      text-align: left;
      display: flex;
      }
      .btnOpera .btn_border{
              width: 50px;
          margin-right: 10px;
      }
      .editStaticDiv {
          font-size: 12px;
          padding-top: 6px;
      }
      </style>
      