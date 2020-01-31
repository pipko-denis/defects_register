const cars = require('../models/cars')
const user = require('../models/user')

module.exports = {
    getCars (req,res)  {          
        try{
            cars.getCars(req.body.userid)
            .then(resolve => {                    
                res.send(resolve)
            })
            .catch(reject => {                    
                res.send(reject)
            })
        }catch (err){
            res.send({message:{code: 101, text: 'Ошибка получения данных'}, data: []})
        }    
    },

    getCarsByTraindId (req,res)  {          

        if (!req.body.trainId){
            res.send({ message: {text:`Не передан номер состава!`,code: 103}, data:[]})
            return
        }
        try{            
            //console.info('controller', decoded)
            cars.getCarsByTraindId(req.body.userid,req.body.trainId)
            .then(resolve => {                    
                res.send(resolve)
            })
            .catch(reject => {                    
                res.send(reject)
            })
        }catch (err){
            res.send({message:{code: 101, text: 'Ошибка получения данных'}, data: []})
        }    
    },    

    addCar (req,res)  {          
        
        try{

            if (!req.body){
                res.send({message: {text:`Переданы пустые данные для добавления вагона!`,code: 103}, data:0})
                return
            }

            console.log(new Date().toLocaleString(),`trying to add car with userid: ${req.body.userid}`)     

            cars.addCar(req.body.userid,req.body)
            .then(resolve => {                    
                res.send(resolve)
            })
            .catch(reject => {                    
                res.send(reject)
            })
       }catch (err){
           res.send({message:{code: 101, text: 'Ошибка сохранения вагона'}, data: 0})
       }    
    },

    addTrainCar (req,res)  {          
        
        try{

            if (!req.body){
                res.send({message: {text:`Переданы пустые данные для добавления вагона!`,code: 103}, data:0})
                return
            }

            console.log(new Date().toLocaleString(),`trying to add car with userid: ${req.body.userid}`)     

            cars.addTrainCar(req.body.userid,req.body)
            .then(resolve => {                    
                res.send(resolve)
            })
            .catch(reject => {                    
                res.send(reject)
            })
       }catch (err){
           res.send({message:{code: 101, text: 'Ошибка сохранения вагона'}, data: 0})
       }    
    },



    editTrainCar (req,res)  {          
        
        try{

            if (!req.body){
                res.send({message: {text:`Переданы пустые данные для добавления вагона!`,code: 103}, data:0})
                return
            }

            console.log(new Date().toLocaleString(),`trying to edit car with userid: ${req.body.userid}`)     

            cars.editTrainCar(req.body.userid,req.body)
            .then(resolve => {                    
                res.send(resolve)
            })
            .catch(reject => {                    
                res.send(reject)
            })
       }catch (err){
           res.send({message:{code: 101, text: 'Ошибка сохранения вагона'}, data: 0})
       }    
    },

    editCar (req,res)  {          
        
        try{

            if (!req.body){
                res.send({message: {text:`Переданы пустые данные для добавления вагона!`,code: 103}, data:0})
                return
            }

            console.log(new Date().toLocaleString(),`trying to edit car with userid: ${req.body.userid}`)     

            cars.editCar(req.body.userid,req.body)
            .then(resolve => {                    
                res.send(resolve)
            })
            .catch(reject => {                    
                res.send(reject)
            })
       }catch (err){
           res.send({message:{code: 101, text: 'Ошибка сохранения вагона'}, data: 0})
       }    
    },    
    
    removeCarFromTrain (req,res)  {          
        
        try{
            console.info(req.body)
            if ((!req.body)||(!req.body.id)){
                res.send({message: {text:`Переданы пустые данные для удаления вагона!`,code: 103}, data:0})
                return
            }

            console.log(new Date().toLocaleString(),`trying to remove car with userid: ${req.body.userid}`)     

            cars.removeCarFromTrain(req.body.userid,req.body.id)
            .then(resolve => {                    
                res.send(resolve)
            })
            .catch(reject => {                    
                res.send(reject)
            })
       }catch (err){
           res.send({message:{code: 101, text: 'Ошибка удаления вагона!'}, data: 0})
           console.info('removeCarFromTrain',err)
       }    
    }

}
