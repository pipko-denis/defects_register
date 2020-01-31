
const defects = require('../models/defects')

module.exports = {

    
    deleteDefect(req,res)  {                         
        //console.info('deleteDefect body',req.body)
       
        try{

            if (!req.body.id){
                res.send({ message: {text: `Не указан идентификатор дефекта!`,code: 104}, data:0})
                return
            }     

            if (!req.body.userid){
                res.send({ message: {text: `Ошибка авторизации пользователя!`,code: 102}, data:0})
                return
            }       

            console.log(new Date().toLocaleString(),`trying to delete defect with userid: ${req.body.userid}`)     

            defects.deleteDefect(req.body.userid,req.body.id)
            .then(resolve => {                    
               res.send(resolve)
            })
            .catch(reject => {                    
                res.send(reject)
            }) 
                     
       }catch (err){
           console.log(new Date().toLocaleString(),'addProtocol', err)
           res.send({message:{code: 101, text: 'Ошибка сохрания дефекта'}, data: 0})
       } 
         

    }, 
    saveDefect(req,res)  {                         
        //console.info('saveWheelsDefects body',req.body)
       
        try{

            if (!req.body){
                res.send({ message: {text: `Дефект пуст!`,code: 104}, data:0})
                return
            }     

            if (!req.body.protocol_id){
                res.send({message: {text: `Не передан идентификатор протокола для добавления дефектов!`,code: 103}, data:0})
                return
            }
            if (!req.body.userid){
                res.send({ message: {text: `Ошибка авторизации пользователя!`,code: 102}, data:0})
                return
            }       

            console.log(new Date().toLocaleString(),`trying to save defect with userid: ${req.body.userid}`)     

            defects.saveDefect(req.body.userid,req.body)
            .then(resolve => {                    
               res.send(resolve)
            })
            .catch(reject => {                    
                res.send(reject)
            }) 
                     
       }catch (err){
           console.log(new Date().toLocaleString(),'addProtocol', err)
           res.send({message:{code: 101, text: 'Ошибка сохрания дефекта'}, data: 0})
       } 
         

    },    


    getDefectsByProt (req,res)  {          

        try{
            if ((!req)||(!req.body)||(!req.body.userid)){
                res.send({ message: {text:`Ошибка авторизации пользователя!`,code: 102}, data:[]})
                return
            }                
            //console.info('controller', decoded)
            defects.getDefectsByProt(req.body.userid,req.body.id)
            .then(resolve => {                    
                res.send(resolve)
            })
            .catch(reject => {                    
                res.send(reject)
            })
        }catch (err){
            console.log(new Date().toLocaleString(),'getDefectsByProt', err)
            res.send({message:{code: 101, text: 'Ошибка получения данных'}, data: []})
        }    
    },

/*
    saveDefects(req,res)  {                         
        console.info('saveWheelsDefects body',req.body)
        console.log(new Date().toLocaleString(),'defects:',res.locals.saveProtocolMessage,'protocolid',res.locals.protocolid);
        let message = ((res.locals.saveProtocolMessage)&&(res.locals.saveProtocolMessage.message)) ? res.locals.saveProtocolMessage.message.text : ''
        //res.send({message: {text: message + `Данные получены контроллером сервера!`,code: 0}, data:req.body})
       
        try{

            if (!res.locals.protocolid){
                res.send({message: {text:message + `Не передан идентификатор протокола для добавления дефектов!`,code: 103}, data:0})
                return
            }
            if (!req.body.userid){
                res.send({ message: {text:message + `Ошибка авторизации пользователя!`,code: 102}, data:0})
                return
            }
            if (!req.body.defects){
                res.send({ message: {text:message + `Список дефетов пуст!`,code: 0}, data:0})
                return
            }            

            console.log(new Date().toLocaleString(),`trying to save defect with userid: ${req.body.userid}`)     

            defMessages = ''
            let inc = 0
            req.body.defects.forEach(defect => {
                defects.saveDefect(req.body.userid,{protocolid:res.locals.protocolid, defect:defect})
                .then(resolve => {                    
                   // res.send(resolve)
                   //defMessages += resolve.message
                   inc++
                   console.info('resolve', inc)
                })
                .catch(reject => {                    
                   // res.send(reject)
                   message += reject.code+' '+reject.message+'.'
                })  
                
            });
            message += 'Успешно сохранено '+inc+' дефектов.' 
            console.info('SAVING DEFECTS MESSAGE', message)

            res.send({message: {text:message,code: 0}, data:res.locals.protocolid})
                     
       }catch (err){
           console.log(new Date().toLocaleString(),'addProtocol', err)
           res.send({message:{code: 101, text: 'Ошибка сохрания состава'}, data: 0})
       } 
         

    },
*/


}
