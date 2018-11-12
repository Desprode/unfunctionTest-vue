<template>
  <div id="envir">
    <h3 class="Title"><span>环境管理</span></h3>
    <div class="envTable">
      <div id="tool">
      <Button  type="primary" @click="configEvn()">配置环境</Button>
      </div>
      <i-table border :columns="evnColumns" :data="evnInfo"></i-table><br/>
      
    </div><br/><br/>
  </div>
</template>

<script>
import expandRow from './Evn-expand.vue';
import store from '@/store/index';
export default {
  name: 'evn',
  'components': {expandRow},
  data() {
    return {
      evnColumns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
              return h(expandRow, {
                  props: {
                      row: params.row
                  }
              })
          }
        },
        {
          title: '环境名称',
          key: 'name',
          align:'center',
          height: '48px',
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
          title: '环境描述',
          key: 'explain',
          align:'center',
          height: '48px',
          render: (h, params) => {
            if (params.row.$isEdit) {
              return h('input', {
                style: {
                  'text-align':'center',
                  height: '48px',
                   width: params.column._width+'px',
                  border: '0px',
                  outline:'none',
                  cursor: 'pointer',
                  'background-color':'#f8f8f9'
                },
                domProps: {
                  value: params.row.explain
                },
                on: {
                  input: function (event) {
                    params.row.explain = event.target.value
                  }
                }
              });
            } else {

              return h('div', params.row.explain);
            }
          }
        },
        {
          title: '归属项目',
          key: 'explain',
          height: '48px',
          align:'center',
          render: (h, params) => {
            if (params.row.$isEdit) {
              return h('input', {
                style: {
                  'text-align':'center',
                  height: '48px',
                   width: params.column._width+'px',
                  border: '0px',
                  outline:'none',
                  cursor: 'pointer',
                  'background-color':'#f8f8f9'
                },
                domProps: {
                  value: params.row.explain
                },
                on: {
                  input: function (event) {
                    params.row.explain = event.target.value
                  }
                }
              });
            } else {

              return h('div', params.row.explain);
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
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
            ])
                                
          }
        }
        
      ],
      evnInfo:store.getters.evnList
      
    }
  },
  methods: {
    rowClassName (row, index) {
      return 'm-table-info-row';
    },
    configEvn(){
      this.$store.commit('SET_EVN');
    },
    handleEdit(row) {
      this.$set(row, '$isEdit', true)

    },
    async handleSave(row) {
       
      let rows = store.getters.evnRows;
      if(!(rows.length>0)){
        this.$set(row, '$isEdit', false);
        return;
      }
      console.log(rows);
      console.log(store.getters.evnUpdate);
      if(store.getters.evnUpdate==true){
        const {data:res} = await this.$http.post('http://192.168.43.208:8000/evnHandler',{
          header:{sysTraceId:'s12345',projectId:'sat',projectName:'sat',reqTime:'20181029',userId:'admin',operateCode:'1'},
          data:{'configInfo':JSON.stringify(rows)}
          });
        if(res.respCode ==200){

        }
        rows.forEach((item, index) => {
          this.$store.dispatch('setEvnDb', item);
          this.$store.dispatch('setEvnAp', item);
          this.$store.dispatch('setEvnKmc', item);
        });
      }
      this.$set(row, '$isEdit', false);
    },
    remove (index) {
      this.$store.commit('DELETE_EVN',index);
    }
  }
}
</script>
<style scoped>
..ivu-table .ivu-table-cell {
    padding-left: 10px;
    padding-right: 10px;
}
  #tool{
    /* background-color:#f8f8f9; */
    text-align: left;
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
</style>
