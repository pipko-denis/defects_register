import Api from '@/services/Api'

export default {

    getCarsByTrain (credentials){
        return Api().post('cars/bytrain'
        ,credentials)
    },

    addTrainCar (credentials){
        return Api().post('cars/addTrainCar'
        ,credentials)
    },

    removeCarFromTrain (credentials){
        return Api().post('cars/removefromtrain'
        ,credentials)
    },

    editTrainCar (credentials){
        return Api().post('cars/editTrainCar'
        ,credentials)
    },

}