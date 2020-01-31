import CarsService from '@/services/CarsService'

export default {
    state: {
        carsList: [],
    },

    getters: {
      getCarsForProtocolSelectedTrain: (state) => state.carsList,
    },

    mutations: {

      SET_INFO(state,payload){
        console.info('SET_INFO',payload)
      },


      SET_CARS_LIST (state,payload){
          state.carsList = payload
      },
      ADD_CAR_TO_LIST (state,payload){
        state.carsList.push(payload)
      },
      REMOVE_CAR_FROM_LIST(state,payload){
        //state.carsList.push(payload)
        const index = state.carsList.indexOf(payload)
        state.carsList.splice(index, 1)        
      },
      UPDATE_CAR_IN_LIST (state,payload){
        if (payload) {
         //if (this.$store.getters.getProtocolSelectedTrainId === payload.train_Id) {
            const elem = _.find(state.carsList,{id:payload.id})
            if (elem){
              Object.assign(elem, payload)
            }else{
              this.dispatch('GET_CARS_FROM_SRV_BY_TRAIN',{trainid: payload.train_id}) 
            }
         // }
        }
      },


    },  

    actions: {
        GET_CARS_FROM_SRV_BY_TRAIN({commit},payload){    
          commit('SET_CARS_LIST',[])                 
          commit('SET_PROCESSING',true)  
          commit('SET_ERROR_CLEAN')  
          try{                      
            CarsService.getCarsByTrain({trainId: payload.trainid})
              .then(result => {           
                  if (result.data.message.code != 0) {
                    commit('SET_PROCESSING',false)
                    commit('SET_ERROR',result.data.message)               
                  }else{                    
                    commit('SET_PROCESSING',false)
                    commit('SET_CARS_LIST',result.data.data)
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

        CREATE_CAR_FOR_TRAIN({commit},payload){                    
          commit('SET_PROCESSING',true)  
          commit('SET_ERROR_CLEAN')  
          try{                      
            CarsService.addTrainCar(payload)
              .then(result => {           
                  if (result.data.message.code != 0) {
                    commit('SET_PROCESSING',false)
                    commit('SET_ERROR',result.data.message)
                  }else{                    
                    commit('SET_PROCESSING',false)
                    payload.id = result.data.data.id
                    commit('SET_MESSAGE',result.data.message)
                    commit('ADD_CAR_TO_LIST',payload)
                    
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

        EDIT_TRAIN_CAR({commit},payload){                    
          commit('SET_PROCESSING',true)  
          commit('SET_ERROR_CLEAN')  
          try{                      
            CarsService.editTrainCar(payload)
              .then(result => {           
                  if (result.data.message.code != 0) {
                    commit('SET_PROCESSING',false)
                    commit('SET_ERROR',result.data.message)
                  }else{                    
                    commit('SET_PROCESSING',false)
                    commit('SET_MESSAGE',result.data.message)
                    commit('UPDATE_CAR_IN_LIST',payload)                    
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

        REMOVE_CAR_FROM_TRAIN({commit},payload){

          commit('SET_PROCESSING',true)  
          commit('SET_ERROR_CLEAN')  
          try{                      
            CarsService.removeCarFromTrain({id:payload.id})
              .then(result => {           
                  if (result.data.message.code != 0) {
                    commit('SET_PROCESSING',false)
                    commit('SET_ERROR',result.data.message)
                  }else{                    
                    commit('SET_PROCESSING',false)
                    commit('REMOVE_CAR_FROM_LIST',payload.id)
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
        }


    },

}    