import TrainsService from '@/services/TrainsService'

export default {
    state: {
        trainsList: [],        
    },
    mutations: {
        SET_TRAINS_LIST (state,payload){
            state.trainsList = payload
        },
        ADD_UPD_TRAIN (state,payload){
          let elem = _.find(state.trainsList,{id: payload.id})    
          //console.info('ADD_UPD_TRAIN ELEM',elem)      
          if (elem) {
            let ind = state.trainsList.indexOf(elem)
            //console.info('ADD_UPD_TRAIN IND',ind)      
            Object.assign(state.trainsList[ind], payload)
          }else{
            state.trainsList.push(payload)
          }          
          state.trainsList.sort((a,b) => (a.train_number > b.train_number) ? 1 : ((b.train_number > a.train_number) ? -1 : 0));
      },
      DEL_TRAIN (state,payload){
        let ind = state.trainsList.indexOf(payload)    
        //console.info('DEL_TRAIN ELEM',ind)      
        if (ind) {                  
          //console.info('DEL_TRAIN IND',ind)      
          state.trainsList.splice(ind, 1)
        }          
    },
    },
    getters: {
        getTrains: (state) => state.trainsList,
    },

    actions: {
        GET_TRAINS_FROM_SRV({commit},payload){          
          commit('SET_PROCESSING',true)  
          commit('SET_ERROR_CLEAN')  

          try{                      
            TrainsService.getTrains(null)
              .then(result => {           
                  if (result.data.message.code != 0) {
                    commit('SET_PROCESSING',false)
                    commit('SET_ERROR',result.data.message)
                    commit('SET_TRAINS_LIST',[])                 
                  }else{                    
                    commit('SET_PROCESSING',false)
                    commit('SET_TRAINS_LIST',result.data.data)
                    commit('SET_MESSAGE',result.data.message)
                  }
                }
              )
              .catch(err => {                     
                  commit('SET_PROCESSING',false)     
                  commit('SET_TRAINS_LIST',[]) 
                  commit('SET_ERROR',err)            
                }
    
              )
          }catch{
            commit('SET_PROCESSING',false)
          }

        },

        DEL_TRAIN({commit},payload){
          commit('SET_PROCESSING',true)  
          commit('SET_ERROR_CLEAN')            
          try{                  
            //console.info('action DEL_TRAIN payload',payload)    
            TrainsService.delTrain({id:payload.id})
              .then(result => {      
                  //console.info('DEL_TRAIN result', result)     
                  if (result.data.message.code != 0) {
                    commit('SET_PROCESSING',false)
                    commit('SET_ERROR',result.data.message) 
                  }else{                    
                    commit('SET_PROCESSING',false)
                    //console.info('DEL_TRAIN', result.data.message)
                    commit('DEL_TRAIN',payload)
                    commit('SET_MESSAGE',result.data.message)
                  }
                }
              )
              .catch(err => {                     
                  commit('SET_PROCESSING',false)     
                  commit('SET_ERROR',err)            
                }
    
              )
          }catch{
            commit('SET_PROCESSING',false)
          }          
        },

        SAVE_TRAIN({commit},payload){          
          //console.info('payload before save', payload)        
          commit('SET_PROCESSING',true)  
          commit('SET_ERROR_CLEAN')            
          try{                      
            TrainsService.saveTrain(payload.train)
              .then(result => {           
                  if (result.data.message.code != 0) {
                    commit('SET_PROCESSING',false)
                    commit('SET_ERROR',result.data.message) 
                  }else{                    
                    commit('SET_PROCESSING',false)
                    //console.info('SAVE_TRAIN', result.data.data)
                    if (result.data.data) {
                      payload.train.id = result.data.data
                      commit('ADD_UPD_TRAIN',payload.train)
                      commit('SET_MESSAGE',result.data.message)
                      if (payload.cars){
                        payload.cars.forEach(car => {                          
                          car.train_id = payload.train.id
                          if (car.id) {
                            this.dispatch('EDIT_TRAIN_CAR',car)
                          }else{
                            this.dispatch('CREATE_CAR_FOR_TRAIN',car)     
                          }                                               
                        });
                      }

                      if (payload.rCars){
                        payload.rCars.forEach(car => {                          
                          car.train_id = payload.train.id
                          if (car.train_car_id) {
                            this.dispatch('REMOVE_CAR_FROM_TRAIN',{id: car.train_car_id})  
                          }                                               
                        });
                      }
                      
                    }

                  }
                }
              )
              .catch(err => {                     
                  commit('SET_PROCESSING',false)     
                  commit('SET_ERROR',err)            
                }
    
              )
          }catch{
            commit('SET_PROCESSING',false)
          }
          

        }        
    }
}