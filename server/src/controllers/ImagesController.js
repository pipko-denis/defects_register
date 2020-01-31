const images = require('../models/images')
const user = require('../models/user')

module.exports = {

    deleteImage(req,res){           
        try{

            images.deleteImage(req.body.userid,req.body.id)
            .then(resolve => {   
                //res.sendFile()                 
                res.send(resolve)
            })
            .catch(reject => {                    
                res.send(reject)
            })
            
        }catch (err){
            console.info('deleteImage',err)
            res.send({message:{code: 101, text: 'Ошибка удаления изображения данных '}, data: []})
        }
        
    },


    uploadDefectImage(req,res){   
        
        let decoded = user.checkToken(req.headers.authorization)

        req.body.userid = decoded.id

        try{
            console.log(new Date().toLocaleString(),'uploadImages', req.body.userid)
            if ((!req)||(!req.body)||(!req.body.userid)){
                res.send({ message: {text:`Ошибка авторизации пользователя!`,code: 102}, data:[]})
                return
            }  

            if (!req.body.defectid){
                res.send({ message: {text:`Не указан номер дефекта!`,code: 102}, data:[]})  
                return              
            }

            if (!req.file.path){
                res.send({ message: {text:`Не Удалось сохранить файл ( долежн передаваться image-файл и рамер не должен превышать 10 МБ) !`,code: 102}, data:[]})  
                return              
            }
            
            images.saveDefectImage(req.body.userid,req.body.defectid,req.file)
            .then(resolve => {                   
                res.send(resolve)
            })
            .catch(reject => {                    
                res.send(reject)
            })
            
        }catch (err){
            console.info('uploadImages',err)
            res.send({message:{code: 101, text: 'Ошибка сохранения данных'}, data: []})
        }    
        
    },


    getLastImages(req,res){
        try{

            images.getLastImages(req.body.userid)
            .then(resolve => {   
                //res.sendFile()                 
                res.send(resolve)
            })
            .catch(reject => {                    
                res.send(reject)
            })
            
        }catch (err){
            console.info('getImagesByProtocol',err)
            res.send({message:{code: 101, text: 'Ошибка получения данных '}, data: []})
        }
    },

    getImagesByProtocol(req,res){        
        
        try{
            if (!req.body.id){
                res.send({ message: {text:`Не указан номер протокола!`,code: 102}, data:[]})  
                return              
            }

            images.getImagesByProtocol(req.body.userid,req.body.id)
            .then(resolve => {   
                //res.sendFile()                 
                res.send(resolve)
            })
            .catch(reject => {                    
                res.send(reject)
            })
            
        }catch (err){
            console.info('getImagesByProtocol',err)
            res.send({message:{code: 101, text: 'Ошибка получения данных '}, data: []})
        }    
        
    }


}