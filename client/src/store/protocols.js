import ProtocolsService from '@/services/ProtocolsService'
//import DefectsService from '@/services/DefectsService'


export default {
    state: {
      protocolsList: []
      /*
        { id: 1, place_id: 1, prot_dat: '2019-03-01',prot_time_from: '10:05',prot_time_to:'16:43',inspector_first: 'Иванов', inspector_second: 'Петров'
        ,train_id: 1, train_number: '0001', pass_reg_dt: '2019-04-07', pass_reg_time: '11:05', car_id: 6, car_reg_number: '001-01'
        ,car_condit: 1 , car_loading: 1, car_type: 1, car_year: 2001
        ,axis_num: 1 ,side: 1, diam: 111, wheel_condit: 'текст 02', def_cnt: 1,pic_cnt: 1},
        { id: 2, place_id: 1, prot_dat: '2019-03-01',prot_time_from: '11:05',prot_time_to:'15:27',inspector_first: 'Иванов', inspector_second: 'Петров'
        ,train_id: 1, train_number: '0001', pass_reg_dt: '2019-04-01', pass_reg_time: '11:05', car_id: 9
        ,car_reg_number: '001-04',car_condit: 2 , car_loading: 2, car_type: 2, car_year: 2002
        ,axis_num: 2 ,side: 2, diam: 222, wheel_condit: 'текст 02', def_cnt: 2,pic_cnt: 2},
      ]
      */
    },
    mutations: {
      SET_SELECTED_TRAIN_ID (state,payload){
        state.train_id = payload
      },
      SET_PROTOCOLS_LIST (state,payload){
        state.protocolsList = payload
      },
      ADD_UPD_PROTOCOL (state,payload){
        //this.protocolsList.push()
        let protocol = payload.protocol
        let elem = _.find(state.protocolsList,{id: protocol.id})    
        console.info('ADD_UPD_PROTOCOL ELEM',elem)      
        if (elem) {
          let ind = state.protocolsList.indexOf(elem)
          console.info('ADD_UPD_PROTOCOL IND',ind)      
          Object.assign(state.protocolsList[ind], protocol)
        }else{
          state.protocolsList.push(protocol)
        }                
      },
      DELETE_PROTOCOL (state,payload){
        let ind = state.protocolsList.indexOf(payload)
        console.info('DELETE_PROTOCOL commit',payload)
        state.protocolsList.splice(ind,1)
      }
      
    },
    getters: {
        getProtocols: (state) => state.protocolsList,
    },

    actions: {

        GET_PROTOCOLS_FROM_SRV({commit},payload){          
          commit('SET_PROCESSING',true)  
          commit('SET_ERROR_CLEAN')  

          try{                      
            ProtocolsService.getProtocolsByDt(null)
              .then(result => {           
                  if (result.data.message.code != 0) {
                    commit('SET_PROCESSING',false)
                    commit('SET_ERROR',result.data.message)
                    commit('SET_PROTOCOLS_LIST',[])                 
                  }else{                    
                    commit('SET_PROCESSING',false)
                    commit('SET_PROTOCOLS_LIST',result.data.data)
                    commit('SET_MESSAGE',result.data.message)
                  }                  
                }
              )
              .catch(err => {                     
                  commit('SET_PROCESSING',false)     
                  commit('SET_PROTOCOLS_LIST',[]) 
                  commit('SET_ERROR',err)   
                  console.info('GET_PROTOCOLS_FROM_SRV ERR1', err)        
                }
    
              )
          }catch(err){
            commit('SET_PROCESSING',false)
            console.info('GET_PROTOCOLS_FROM_SRV ERR2', err)
          }

        },

      COPY_PROTOCOL({commit},payload){          
        console.info('payload COPY_PROTOCOL id=', payload.id)        
        commit('SET_PROCESSING',true)  
        commit('SET_ERROR_CLEAN')            
        try{                      
          ProtocolsService.copyProtocol({id: payload.id})
            .then(result => {           
                if (result.data.message.code != 0) {
                  commit('SET_PROCESSING',false)
                  commit('SET_ERROR',result.data.message) 
                }else{                    
                  commit('SET_PROCESSING',false)                  
                  commit('SET_MESSAGE',result.data.message)
                  console.info('commit COPY_PROTOCOL', result.message)
                  //let newProtocol = Object.assign({},{id: result.data.id, payload.})
                  //commit('COPY_PROTOCOL',payload)
                  this.dispatch('GET_PROTOCOLS_FROM_SRV',null) 
                }
                
              }
            )
            .catch(err => {                     
                commit('SET_PROCESSING',false)     
                commit('SET_ERROR',err)  
                console.info('save protocols err 1', err)          
              }
  
            )
        }catch(err){
          commit('SET_PROCESSING',false)
          console.info('save protocols err 2', err)
        }
        

      },  

      DELETE_PROTOCOL({commit},payload){          
        console.info('payload DELETE_PROTOCOL', payload)        
        commit('SET_PROCESSING',true)  
        commit('SET_ERROR_CLEAN')            
        try{                      
          ProtocolsService.deleteProtocol({id: payload.id})
            .then(result => {           
                if (result.data.message.code != 0) {
                  commit('SET_PROCESSING',false)
                  commit('SET_ERROR',result.data.message) 
                }else{                    
                  commit('SET_PROCESSING',false)                  
                  commit('SET_MESSAGE',result.data.message)
                  console.info('commit DELETE_PROTOCOL', result.message)
                  commit('DELETE_PROTOCOL',payload)
                }
                
              }
            )
            .catch(err => {                     
                commit('SET_PROCESSING',false)     
                commit('SET_ERROR',err)  
                console.info('save protocols err 1', err)          
              }
  
            )
        }catch(err){
          commit('SET_PROCESSING',false)
          console.info('save protocols err 2', err)
        }
        

      },

      SAVE_PROTOCOL({commit},payload){          
        console.info('payload SAVE_PROTOCOL', payload)        
        commit('SET_PROCESSING',true)  
        commit('SET_ERROR_CLEAN')            
        try{                      
          ProtocolsService.saveProtocol(payload.protocol)
            .then(result => {           
                if (result.data.message.code != 0) {
                  commit('SET_PROCESSING',false)
                  commit('SET_ERROR',result.data.message) 
                }else{                    
                  commit('SET_PROCESSING',false)
                  if (result.data.data) {
                    payload.protocol.id = result.data.data
                    commit('SET_MESSAGE',result.data.message)
                    //commit('ADD_UPD_PROTOCOL',payload)
                    this.dispatch('GET_PROTOCOLS_FROM_SRV',null)  

                    if (payload.defects){
                      payload.defects.forEach(defect => {                          
                        defect.protocol_id = payload.protocol.id
                        this.dispatch('SAVE_DEFECT',defect)                                                 
                      });
                    }

                    if (payload.rDefects){
                      payload.rDefects.forEach(defect => {
                        this.dispatch('DEL_DEFECT',{id: defect.id})                                                 
                      });
                    }

                  }

                }
              }
            )
            .catch(err => {                     
                commit('SET_PROCESSING',false)     
                commit('SET_ERROR',err)  
                console.info('save protocols err 1', err)          
              }
  
            )
        }catch(err){
          commit('SET_PROCESSING',false)
          console.info('save protocols err 2', err)
        }
        

      } 
    }
}