import Vue from 'vue';
import axios from 'axios';
// axios.defaults.baseURL = 'http://128.192.206.53:8000';
import iView from 'iview';
Vue.use(iView);

const state = {  
    bafflelistdata : [      //挡板具体数据  
        {
            mockName : '服务没成功',
            projectId : 'addStar444',
            lasteditor : '张三',
            lasttime : '2018-9-1',
            effectNnv : '开发环境',
            publishAddress : 'http://128.192.31.1/22141/devenv/addStar444',
            posturl : [
                {
                    postenviron : '开发环境',
                    testurl : 'http://128.192.31.1/22141/devenv/addStar444'
                },
                {
                    postenviron : '测试环境',
                    testurl : 'http://128.192.31.1/22141/devenv/addStar444'
                }
            ]
            
        }
    ],
}

//getter 抛出去的数据
const getters = {
    //挡板列表信息
    bafflelistdata:state => state.bafflelistdata,
 }

const mutations = {
    addlist (state,bafflelist){ //挡板列表赋值
        for(let i in bafflelist.data.mocks){
            let item = bafflelist.data.mocks[i];
            let posturl = [];
            if(item.effectEnv.includes('|')){
                item.effectEnv = item.effectEnv.split('|');
                item.publishAddress = item.publishAddress.split('|');
                for(let j in item.effectEnv){
                    posturl.push({
                        postenviron : item.effectEnv[j],
                        testurl : item.publishAddress[j]
                    })
                }
            }else{
                posturl.push({
                    postenviron : item.effectEnv,
                    testurl : item.publishAddress
                })
            } 
            item.posturl = posturl;
        }
        state.bafflelistdata = bafflelist.data.mocks;
    },
    deledata(state,delearr){ //删除数据
        
        state.bafflelistdata.forEach((item,index) => {
            if(delearr.includes(item.id)){
                state.bafflelistdata.splice(index,1)
            }
        });
    }
}

 const actions = {
     queryBafflelist({commit},params){  //查询挡板列表接口
         axios.defaults.withCredentials = false;
         axios.post('mockHandler',params).then(res=>{
             commit('addlist',res.data)
         });
    },
    deleBaffledata({commit},params){   //删除挡板数据
        axios.defaults.withCredentials = false;
        axios.post('mockHandler',params).then(res=>{
             commit('deledata',params.data.ids);
         });
    }
 }

 export default {
    state,
    getters,
    actions,
    mutations
  };