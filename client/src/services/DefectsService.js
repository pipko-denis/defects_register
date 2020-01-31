import Api from '@/services/Api'

export default {
    getDefectsByProtocol(credentials){
        return Api().post('defects/byprot'
        ,credentials)
    },

    saveDefect (credentials){
        return Api().post('defects/save'
        ,credentials)
    },

    deleteDefect (credentials){
        return Api().post('defects/delete'
        ,credentials)
    },

}