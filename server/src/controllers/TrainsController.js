const trains = require('../models/trains')

module.exports = {
    getTrains (req,res)  {          

        try{
            if ((!req)||(!req.body)||(!req.body.userid)){
                res.send({ message: {text:`Ошибка авторизации пользователя!`,code: 102}, data:[]})
                return
            }                
            //console.info('controller', decoded)
            trains.getTrains(req.body.userid)
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

    delTrain(req,res){
        try{

            if (!req.body){
                res.send({message: {text:`Переданы пустые данные для удаления состава!`,code: 103}, data:0})
                return
            }
            if (!req.body.userid){
                res.send({ message: {text:`Ошибка авторизации пользователя!`,code: 102}, data:0})
                return
            }

            console.info(`trying to delete train with:`,req.body)     

            trains.delTrain(req.body.userid,req.body.id)
            .then(resolve => {                    
                res.send(resolve)
            })
            .catch(reject => {                 
                res.send(reject)
            })
       }catch (err){
           res.send({message:{code: 101, text: 'Ошибка удаления состава'}, data: 0})
       }        
    },

    addTrain (req,res)  {          
               
        try{

            if (!req.body){
                res.send({message: {text:`Переданы пустые данные для добавления состава!`,code: 103}, data:0})
                return
            }
            if (!req.body.userid){
                res.send({ message: {text:`Ошибка авторизации пользователя!`,code: 102}, data:0})
                return
            }

            console.log(new Date().toLocaleString(),`trying to add train with userid: ${req.body.userid}`)     

            trains.addTrain(req.body.userid,req.body)
            .then(resolve => {                    
                res.send(resolve)
            })
            .catch(reject => {                    
                res.send(reject)
            })
       }catch (err){
           res.send({message:{code: 101, text: 'Ошибка сохрания состава'}, data: 0})
       }    
    }

}
