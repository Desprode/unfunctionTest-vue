<template>
  <div id="standard">
    <h3 class="Title">
        <span>标准依据</span>
    </h3>
    <div :style="{'text-align': 'right'}"><Button  type="primary" @click="submitConfig()">提交</Button></div>
    <!-- <div>
        <Row>
            <Col span="4">
                <span class="baffle_label">名称</span>
            </Col>
            <Col span="8">
                <Input placeholder="Enter 名称" v-model="basisName" clearable/>
            </Col>
            <Col span="4">
                <span class="baffle_label">别名</span>
            </Col>
            <Col span="8">
                <Input placeholder="Enter 别名" v-model="basisAlias" clearable />
            </Col>
        </Row>
    </div> -->
    <div class="basis">
      <div class="tool">
      <i-table border  @on-row-click="addDb" ref="dbSelection" :row-class-name="rowClassName" :columns="dbColumns" :data="dbData"></i-table><br/>
      </div>
      <div class="tool">
      <i-table border @on-row-click="addAp" ref="apSelection" :row-class-name="rowClassName" :columns="apColumns" :data="apData"></i-table><br/>
      </div>
      <div class="tool">
      <i-table border @on-row-click="addKmc" ref="kmcSelection" :row-class-name="rowClassName" :columns="kmcColumns" :data="kmcData"></i-table><br/>
      </div>
    </div><br/><br/>
  </div>
</template>
<script>
export default {
    name: 'standard',
    data() {
        
        return {
            basisAlias: '',
            basisName: '',
            projectName: '',
            projectId: '',
            dbColumns:[
                {
                    title: '数据库名称',
                    key: 'name',
                    align:'center',
                    render:(h,params) => {
                        if(params.row.$isEdit){
                            return h('input',{
                                style: {
                                    'text-align':'center',
                                    width: params.column._width+'px',
                                    height: '48px',
                                    border: '0px',
                                    outline:'none',
                                    cursor: 'pointer',
                                    'background-color':'#f8f8f9'
                                },
                                domProps: {
                                    value: params.row.name,
                                    autofocus: true
                                },
                                on: {
                                input: function (event) {
                                    params.row.name = event.target.value
                                }
                                }
                            });
                        }else{
                            return h('div',params.row.name)
                        }
                    }
                },
                {
                    title: '数据库别名',
                    key: 'alias',
                    align:'center',
                    render:(h,params) => {
                        if(params.row.$isEdit){
                            return h('input',{
                                style: {
                                    'text-align':'center',
                                    width: params.column._width+'px',
                                    height: '48px',
                                    border: '0px',
                                    outline:'none',
                                    cursor: 'pointer',
                                    'background-color':'#f8f8f9'
                                },
                                domProps: {
                                    value: params.row.alias,
                                    autofocus: true
                                },
                                on: {
                                input: function (event) {
                                    params.row.alias = event.target.value
                                }
                                }
                            });
                        }else{
                            return h('div',params.row.alias)
                        }
                    }
                },
                {
                    title: '归属项目',
                    key: 'projectName',
                    align:'center',
                    render:(h,params) => {
                        if(params.row.$isEdit){
                            return h('input',{
                                style: {
                                    'text-align':'center',
                                    width: params.column._width+'px',
                                    height: '48px',
                                    border: '0px',
                                    outline:'none',
                                    cursor: 'pointer',
                                    'background-color':'#f8f8f9'
                                },
                                domProps: {
                                    value: params.row.projectName,
                                    autofocus: true
                                },
                                on: {
                                input: function (event) {
                                    params.row.projectName = event.target.value
                                }
                                }
                            });
                        }else{
                            return h('div',params.row.projectName)
                        }
                    }
                },
                {
                    title: 'Action',
                    key: 'action',
                    align:'center',
                    render: (h, params) => {
                        return h('div', [
                                h('Button', {
                                                props: {
                                                    type: 'primary',
                                                    size: 'small'
                                                },
                                                style: {
                                                    marginRight: '5px'
                                                },
                                                on: {
                                                    click: () => {
                                                            if (params.row.$isEdit) {
                                                            this.handleSave(params.row)
                                                            } else {
                                                            this.handleEdit(params.row)
                                                            }
                                                    }
                                                }
                                            },params.row.$isEdit ? '保存' : '编辑'),
                                h('Button', {
                                                props: {
                                                    type: 'error',
                                                    size: 'small'
                                                },
                                                on: {
                                                    click: () => {
                                                        this.remove(params.index,'db')
                                                    }
                                                }
                                            }, '删除')
                        ])
                                
                    }
                }
            ],
            dbData:[
                {name:"db1sdfds",alias:"alias",projectName:'projectName',$isEdit: false},{name:"db1",alias:"alias",projectName:'projectName',$isEdit: false},{name:"db1",alias:"alias",projectName:'projectName',$isEdit: false},{name:"db1",alias:"alias",projectName:'projectName',$isEdit: false}
                ],
            apColumns:[
                {
                    title: 'AP名称',
                    key: 'name',
                    align:'center',
                    render:(h,params) => {
                        if(params.row.$isEdit){
                            return h('input',{
                                style: {
                                    'text-align':'center',
                                    width: params.column._width+'px',
                                    height: '48px',
                                    border: '0px',
                                    outline:'none',
                                    cursor: 'pointer',
                                    'background-color':'#f8f8f9'
                                },
                                domProps: {
                                    value: params.row.name,
                                    autofocus: true
                                },
                                on: {
                                input: function (event) {
                                    params.row.name = event.target.value
                                }
                                }
                            });
                        }else{
                            return h('div',params.row.name)
                        }
                    }
                    
                },
                {
                    title: 'AP别名',
                    key: 'alias',
                    align:'center',
                    render:(h,params) => {
                        if(params.row.$isEdit){
                            return h('input',{
                                style: {
                                    'text-align':'center',
                                    width: params.column._width+'px',
                                    height: '48px',
                                    border: '0px',
                                    outline:'none',
                                    cursor: 'pointer',
                                    'background-color':'#f8f8f9'
                                },
                                domProps: {
                                    value: params.row.alias,
                                    autofocus: true
                                },
                                on: {
                                input: function (event) {
                                    params.row.alias = event.target.value
                                }
                                }
                            });
                        }else{
                            return h('div',params.row.alias)
                        }
                    }
                },
                {
                    title: '归属项目',
                    key: 'alias',
                    align:'center',
                    render:(h,params) => {
                        if(params.row.$isEdit){
                            return h('input',{
                                style: {
                                    'text-align':'center',
                                    width: params.column._width+'px',
                                    height: '48px',
                                    border: '0px',
                                    outline:'none',
                                    cursor: 'pointer',
                                    'background-color':'#f8f8f9'
                                },
                                domProps: {
                                    value: params.row.projectName,
                                    autofocus: true
                                },
                                on: {
                                input: function (event) {
                                    params.row.projectName = event.target.value
                                }
                                }
                            });
                        }else{
                            return h('div',params.row.projectName)
                        }
                    }
                },
                {
                    title: 'Action',
                    key: 'action',
                    align:'center',
                    render: (h, params) => {
                            return h('div', [
                            h('Button', {
                                                props: {
                                                    type: 'primary',
                                                    size: 'small'
                                                },
                                                style: {
                                                    marginRight: '5px'
                                                },
                                                on: {
                                                    click: () => {
                                                            if (params.row.$isEdit) {
                                                            this.handleSave(params.row)
                                                            } else {
                                                            this.handleEdit(params.row)
                                                            }
                                                    }
                                                }
                            },params.row.$isEdit ? '保存' : '编辑'),
                                
                            h('Button', {
                                            props: {
                                                type: 'error',
                                                size: 'small'
                                            },
                                            on: {
                                                click: () => {
                                                    this.remove(params.index,'ap')
                                                }
                                            }
                                        }, '删除')
                            ])
                                                
                        }
                }
            ],
            apData:[
                {name:"ap1",alias:"alias",projectName:'projectName',$isEdit: false},{name:"ap1",alias:"alias",projectName:'projectName',$isEdit: false},{name:"ap1",alias:"alias",projectName:'projectName',$isEdit: false},{name:"ap1",alias:"alias",projectName:'projectName',$isEdit: false}
            ],
            kmcColumns:[
                {
                    title: '服务器名称',
                    key: 'name',
                    align:'center',
                    render:(h,params) => {
                        if(params.row.$isEdit){
                            return h('input',{
                                style: {
                                    'text-align':'center',
                                    width: params.column._width+'px',
                                    height: '48px',
                                    border: '0px',
                                    outline:'none',
                                    cursor: 'pointer',
                                    'background-color':'#f8f8f9'
                                },
                                domProps: {
                                    value: params.row.name,
                                    autofocus: true
                                },
                                on: {
                                input: function (event) {
                                    params.row.name = event.target.value
                                }
                                }
                            });
                        }else{
                            return h('div',params.row.name)
                        }
                    }
                },
                {
                    title: '服务器别名',
                    key: 'alias',
                    align:'center',
                    render:(h,params) => {
                        if(params.row.$isEdit){
                            return h('input',{
                                style: {
                                    'text-align':'center',
                                    width: params.column._width+'px',
                                    height: '48px',
                                    border: '0px',
                                    outline:'none',
                                    cursor: 'pointer',
                                    'background-color':'#f8f8f9'
                                },
                                domProps: {
                                    value: params.row.alias,
                                    autofocus: true
                                },
                                on: {
                                input: function (event) {
                                    params.row.alias = event.target.value
                                }
                                }
                            });
                        }else{
                            return h('div',params.row.alias)
                        }
                    }
                },
                {
                    title: '归属项目',
                    key: 'alias',
                    align:'center',
                    render:(h,params) => {
                        if(params.row.$isEdit){
                            return h('input',{
                                style: {
                                    'text-align':'center',
                                    width: params.column._width+'px',
                                    height: '48px',
                                    border: '0px',
                                    outline:'none',
                                    cursor: 'pointer',
                                    'background-color':'#f8f8f9'
                                },
                                domProps: {
                                    value: params.row.projectName,
                                    autofocus: true
                                },
                                on: {
                                input: function (event) {
                                    params.row.projectName = event.target.value
                                }
                                }
                            });
                        }else{
                            return h('div',params.row.projectName)
                        }
                    }
                },
                {
                    title: 'Action',
                    key: 'action',
                    align:'center',
                    render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                                props: {
                                                    type: 'primary',
                                                    size: 'small'
                                                },
                                                style: {
                                                    marginRight: '5px'
                                                },
                                                on: {
                                                    click: () => {
                                                            if (params.row.$isEdit) {
                                                            this.handleSave(params.row)
                                                            } else {
                                                            this.handleEdit(params.row)
                                                            }
                                                    }
                                                }
                                },params.row.$isEdit ? '保存' : '编辑'),
                                
                                h('Button', {
                                                props: {
                                                    type: 'error',
                                                    size: 'small'
                                                },
                                                on: {
                                                    click: () => {
                                                        this.remove(params.index,'kmc')
                                                    }
                                                }
                                }, '删除')
                            ])
                                                
                        }
                }
            ],
            kmcData:[
                {name:"kmc",alias:"alias",projectName:'projectName',$isEdit: false},{name:"kmc",alias:"alias",projectName:'projectName',$isEdit: false},{name:"kmc",alias:"alias",projectName:'projectName',$isEdit: false},{name:"kmc",alias:"alias",projectName:'projectName',$isEdit: false}
            ]
        }
    },
    methods:{
        handleEdit(row) {
            this.$set(row, '$isEdit', true)

        },
        handleSave(row) {
            this.$set(row, '$isEdit', false);
        },
        remove (index,name) {
            if(name=='db'){
                this.dbData.splice(index, 1);
            }else if(name=='ap'){
                this.apData.splice(index, 1);
            }else if(name=='kmc'){
                this.kmcData.splice(index, 1);
            }
            
        },
        async submitConfig(){
          const {data:res} = await this.$http.post('http://192.168.43.208:8000/basisHandler',{
                header:{sysTraceId:'s12345',projectId:'sat',projectName:'sat',reqTime:'20181029',userId:'admin',operateCode:'1'},
                data:{'config':JSON.stringify({db:this.dbData,ap:this.apData,kmc:this.kmcData})}
          })
        },
        addDb(data, index){
            if((index+1)==this.dbData.length){
                let add = {name:this.basisName,alias:this.basisAlias,projectName:'projectName'};
                this.dbData.push(add);
            }
            
        },
        addAp(data, index){
            if((index+1)==this.apData.length){
                let add = {name:this.basisName,alias:this.basisAlias,projectName:'projectName'};
                this.apData.push(add);
            }
            
        },
        addKmc(data, index){
            if((index+1)==this.kmcData.length){
                let add = {name:this.basisName,alias:this.basisAlias,projectName:'projectName'};
                this.kmcData.push(add);
            }
            
        },
        rowClassName (row, index) {
                if ((index%2) === 1) {
                    //return 'b-table-1-row';
                } else if ((index%2) === 0) {
                    //return 'b-table-0-row';
                }
                return '';
            }
    }
}
</script>
<style>
.b-table-1-row td{
        background-color: #2db7f5;
        color: #fff;
        height: 45px;
    }
.b-table-0-row td{
        background-color: #ff6600;
        color: #fff;
        height: 45px;
    }
.tool{
    width: 33.3%;
    float: left;
    text-align: left;
    padding-left: 0.1%;
    padding-bottom: 0px;
}
.Title{
    text-align: left;
    font-weight: 400;
    font-size: 14px;
    position: relative;
    padding-left: 0;
    padding-bottom: 5px;
    border-bottom: 2px solid #01babc;
    margin-top:6px;
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

.baffle_label{
    line-height: 32px;
    font-size: 14px
}

</style>
