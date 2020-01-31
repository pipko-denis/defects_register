const protocols = require('../models/protocols')
//const defects = require('../models/defects')

module.exports = {
    getProtocolsByDt (req,res)  {
        try{
            if ((!req)||(!req.body)||(!req.body.userid)){
                res.send({ message: {text:`Ошибка авторизации пользователя!`,code: 102}, data:[]})
                return
            }                
            protocols.getProtocolsByDt(req.body.userid,req.body.dtfrom,req.body.dtto)
            .then(resolve => {                 
                res.send(resolve)
            })
            .catch(reject => {              
                res.send(reject)
            })
        }catch (err){
            console.log(new Date().toLocaleString(),'getProtocolsByDt', err)
            res.send({message:{code: 101, text: 'Ошибка получения данных по протоколам'}, data: []})
        }    
    },
    
    deleteProtocol (req,res)  {
        try{
            if ((!req)||(!req.body)||(!req.body.userid)){
                res.send({ message: {text:`Ошибка авторизации пользователя!`,code: 102}, data:[]})
                return
            }                
            protocols.deleteProtocol(req.body.userid,req.body.id)
            .then(resolve => {                 
                res.send(resolve)
            })
            .catch(reject => {              
                res.send(reject)
            })
        }catch (err){
            console.log(new Date().toLocaleString(),'deleteProtocol', err)
            res.send({message:{code: 101, text: 'Ошибка удаления протокола'}, data: []})
        }    
    },

    copyProtocol(req,res)  {
        try{
            if ((!req)||(!req.body)||(!req.body.userid)){
                res.send({ message: {text:`Ошибка авторизации пользователя!`,code: 102}, data:[]})
                return
            }                
            console.info('controller copy body.id=', req.body.id)
            protocols.copyProtocol(req.body.userid,req.body.id)
            .then(resolve => {                 
                res.send(resolve)
            })
            .catch(reject => {              
                res.send(reject)
            })
        }catch (err){
            console.log(new Date().toLocaleString(),'copyProtocol', err)
            res.send({message:{code: 101, text: 'Ошибка копирования протокола'}, data: []})
        }    
    },

    saveProtocol (req,res,next)  {                         
        let msgErr = "";
        try{

            if (!req.body){
                res.send({message: {text:`Переданы пустые данные для добавления протокола!`,code: 103}, data:0})
                return
            }
            if (!req.body.userid){
                res.send({ message: {text:`Ошибка авторизации пользователя!`,code: 102}, data:0})
                return
            }

            console.info(`trying to save protocol with userid: ${req.body.userid}`,req.body)  


            protocols.saveProtocol(req.body.userid,req.body)
            .then(resolve => {                         
                res.send(resolve)
/*
                if ((resolve)&&(resolve.message)){                    
                    if ((resolve.message.code === 0)&&(resolve.data)){      
                                                               
                        if ((req.body.defects)&&(req.body.defects.length > 0)){  
                            //console.info('ID FROM BODY',req.body.id)
                            //res.locals.saveProtocolMessage = resolve;
                            //res.locals.protocolid = resolve.data;                            
                           // next()
                           res.send(resolve)
                        }else{
                            resolve.message.text = resolve.message.text + " Данные по осмотру колёс не передавались."
                            res.send(resolve)
                        }                       

                    }else{
                        res.send(resolve)
                    }

                }else{
                    res.send({ message: {text:`Не удалось получить результаты добавления протокола! `,code: 104},data:0})
                }   
*/                             
            })
            .catch(reject => {                    
                res.send(reject)
            })
       }catch (err){
           console.log(new Date().toLocaleString(),'addProtocol', err)
           res.send({message:{code: 101, text: 'Ошибка сохрания протокола'}, data: 0})
       }    
    }

}


