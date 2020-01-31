import DefectsService from '@/services/DefectsService'
import ImageService from '@/services/ImageService'

export default {
    state: {

    },

    mutations: {
/*
        SAVE_DEFECT(state,payload){
            console.info('SAVE_DEFECT', payload)
            
            if (! state.editedWheel) { state.editedWheel = {id: null, ord_num: null,dpk_type: null,def_size: null,dpk_categ: null,dpk_posit: null, pic_cnt: null,notes: null, defects: []}}

            if (! state.editedWheel.defects) { state.defects = []}

            if (payload) {              
                if (payload.editedIndex > -1) {
                  Object.assign(state.editedWheel.defects[payload.editedIndex], payload.editedItem)
                }else{
                  state.editedWheel.defects.push(payload.editedItem)
                }
            }             
        },
       
        
        REMOVE_DEF(state,payload){
            const elem = _.find(state.editedWheel.defects,{id: payload.id})
            if (elem) {
                const index = state.editedWheel.defects.indexOf(elem)
                state.editedWheel.defects.splice(index,1)
            }else{
                console.info('REMOVE_DEF','Не найден удаляемое колесо')
            }
        },
*/         
    },    


    actions: {

    SAVE_DEFECT_IMAGE({commit},payload){
      commit('SET_PROCESSING',true)  
      commit('SET_ERROR_CLEAN')
      try{
        if (! payload.file) return console.log('image is empty')
        const formData = new FormData()
        formData.append('defectImage',payload.file)
        formData.append('defectid',payload.id)          
        ImageService.saveImage(formData)
        .then(result => {
          if (result.data.message.code != 0) {
            commit('SET_PROCESSING',false)
            commit('SET_ERROR',result.data.message) 
          }else{                    
            commit('SET_PROCESSING',false)
            commit('SET_MESSAGE',result.data.message)
          }
        }).catch(err => {                     
            commit('SET_ERROR',err)            
        })
      }catch(err){
        commit('SET_ERROR',err) 
      }finally{
        commit('SET_PROCESSING',false)
      }

    },


      SAVE_DEFECT({commit},payload){          
        //console.info('SAVE_DEFECT payload', payload)        
        commit('SET_PROCESSING',true)  
        commit('SET_ERROR_CLEAN')            
        try{         
          let defect = Object.assign({},payload,{images: undefined})    
          console.info('SAVE_DEFECT defect', defect)         
          DefectsService.saveDefect(defect)
            .then(result => {           
                if (result.data.message.code != 0) {
                  commit('SET_PROCESSING',false)
                  commit('SET_ERROR',result.data.message) 
                }else{                    
                  commit('SET_PROCESSING',false)
                  if (result.data.data) {
                    //console.info('SAVE_DEFECT result', result.data)
                    payload.id = result.data.data
                    //console.info('SAVE_DEFECT message', result.data.message)
                    commit('SET_MESSAGE',result.data.message)

                    if (payload.images) {
                      payload.images.forEach(image => {
                        this.dispatch('SAVE_DEFECT_IMAGE',{id:result.data.data,file: image.file})  
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
        }catch(err){
          commit('SET_PROCESSING',false)
          console.info('SAVE DEFECT ERROR', err)
        }
        

      },

        SAVE_WHEEL_DEFECTS({commit},payload){

        },
        SAVE_DEFECTS_PICURES({commit},payload){

        },

        DEL_DEFECT({commit},payload){
            commit('SET_PROCESSING',true)  
            commit('SET_ERROR_CLEAN')  
            
            try{                      
               
              DefectsService.deleteDefect({id:payload.id})
                .then(result => {           
                    if (result.data.message.code != 0) {
                      commit('SET_PROCESSING',false)
                      commit('SET_ERROR',result.data.message)
                    }else{                    
                      commit('SET_PROCESSING',false)
                      commit('SET_MESSAGE',result.data.message)
                    }
                  }
                )
                .catch(err => {                     
                    commit('SET_PROCESSING',false)     
                    commit('SET_ERROR',err)            
                  }
      
                )

            }catch(err){
              console.info('REMOVE_DEF', err)  
              commit('SET_PROCESSING',false)
            }finally{
                commit('SET_PROCESSING',false)
            }
            
        },
    },
    
    getters: {
        getShowWheelDialog: (state) => state.showWheelDialog,
        getProtocolWheels: (state) => state.protocolWheels,
        //getDefectPics: (state) => state.defectPics,  
        getEditedWheel: (state) => state.editedWheel,  
        getEditedWheelIndex: (state) => state.editedWheelIndex,    
    },

    
}