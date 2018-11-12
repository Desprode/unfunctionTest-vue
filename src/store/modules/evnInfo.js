const evnInfo = {
    state: 
    {
        evnList:
        [
            {
              name: '开发环境',
              explain: '开发阶段',
              evnInfo:{
                db:[
                  {name:'db1',url:'jdbc:log4jdbc:mysql://localhost:3306/ares?useUnicode=true&characterEncoding=utf8'}
                  // {name:'db2',url:'jdbc:log4jdbc:mysql://localhost:3306/ares?useUnicode=true&characterEncoding=utf8'}
                ],
                ap:[
                  {name:'ap1',ip:'192.168.0.101'}
                  // {name:'ap2',ip:'192.168.0.102'}
                ],
                encryptServer:[
                  {kmc:'s1',spot:'192.168.0.101'}
                  // {kmc:'s2',spot:'192.168.0.102'}
                ]
                
              },
              $isEdit: false
            },
            {
              name: '测试环境',
              explain: '测试过程',
              evnInfo:{
                db:[
                  {name:'db1',url:'jdbc:log4jdbc:mysql://localhost:3306/ares?useUnicode=true&characterEncoding=utf8'}
                ],
                ap:[
                  {name:'ap1',ip:'192.168.0.101'}
                ],
                encryptServer:[
                  {kmc:'s1',spot:'192.168.0.101'}
                ]
                
              },
              $isEdit: false
            }
        ],
        evnUpdate:true,
        evnRows:[]
    },
  
    mutations: {
      SET_EVN(state){
        console.log(3435667);
        let evn = {name:'环境名称',explain:'环境描述',evnInfo:{db:[{name:'',url:''}],ap:[{name:'',ip:''}],encryptServer:[{kmc:'',spot:''}]},$isEdit: false}
        console.log(evn);
        state.evnList.push(evn);
      },
      SET_EVN_DB: (state, row) => {
        console.log('DB_'+row.name);
        console.log(row);
        state.evnList.forEach((item, index) => {
            if(item.name==row.name){
                item.evnInfo.db=row.evnInfo.db;
            }
        })
        console.log(state.evnList);
      },
      SET_EVN_AP: (state, row) => {
        console.log('AP_'+row.name);
        console.log(row);
        state.evnList.forEach((item, index) => {
            if(item.name==row.name){
                item.evnInfo.ap=row.evnInfo.ap;
            }
        })
        console.log(state.evnList);
      },
      SET_EVN_KMC: (state, row) => {
        console.log('KMC_'+row.name);
        console.log(row);
        state.evnList.forEach((item, index) => {
            if(item.name==row.name){
                item.evnInfo.encryptServer=row.evnInfo.encryptServer;
            }
        })
        console.log(state.evnList);
      },
      SET_EVN_UPDATE:(state, flag) => {
        state.evnUpdate=flag
      },
      SET_EVN_ROW:(state, row) => {
        let update = false;
        state.evnRows.forEach((item, index) => {
          if(item.name==row.name){
            state.evnRows.splice(index, 1,row);
            update = true;
          }
        })
        if(!update)
          state.evnRows.push(row);
      },
      DELETE_EVN:(state, index) => {
        state.evnList.splice(index, 1);
      }
    },
  
    actions: {
      setEvnDb({ commit }, row){
        commit('SET_EVN_DB', row);
      },
      setEvnAp({ commit }, row){
        commit('SET_EVN_AP', row);
      },
      setEvnKmc({ commit }, row){
        commit('SET_EVN_KMC', row);
      }
    }
  };
  
  export default evnInfo;
  