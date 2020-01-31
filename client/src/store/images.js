import ImageService from '@/services/ImageService'

export default {
    state: {

    },

    mutations: {
    },    


    actions: {
        SAVE_IMAGE({commit},payload){   
            commit('SET_PROCESSING',true)  
            commit('SET_ERROR_CLEAN')            
            try{                      
                ImageService.saveImage(payload)
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
        }    
    }
}