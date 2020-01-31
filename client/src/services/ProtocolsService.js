import Api from '@/services/Api'


export default {   

    saveProtocol (credentials){
        return Api().post('protocols/save'
        ,credentials)
    },

    getProtocolsByDt (credentials){
        return Api().post('/protocols/bydt'
        ,credentials)
    },

    deleteProtocol (credentials){
        return Api().post('/protocols/delete'
        ,credentials)
    },

    copyProtocol(credentials){
        return Api().post('/protocols/copy'
        ,credentials)
    },
    

}