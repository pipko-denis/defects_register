import Api from '@/services/Api'

export default {

    saveImage (credentials){
        return Api().post('/images/defects/add'
        ,credentials)
    },

    getImagesByProtocol (credentials){
        return Api().post('/images/protocol/get'
        ,credentials)
    },

    getLastImages (){
        return Api().post('/images/get/last')
    },
    
    deleteImage (credentials){
        return Api().post('/images/delete'
        ,credentials)
    },

}