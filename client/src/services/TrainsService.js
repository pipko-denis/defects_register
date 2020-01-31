import Api from '@/services/Api'

export default {
    getTrains (credentials,options){
        return Api().post('trains'
        ,credentials,options)
    },

    saveTrain (credentials){
        return Api().post('trains/save'
        ,credentials)
    },

    delTrain (credentials){
        return Api().post('trains/del'
        ,credentials)
    },

}

