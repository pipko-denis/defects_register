const user = require('../models/user')

//let res = jwtSignUser({name: "Denis",message: "ok", code: 0})
//console.log(new Date().toLocaleString(),res)


module.exports = {

   
    
    checkToken(req,res,next)  {          
    
        let decoded = user.checkToken(req.headers.authorization)
    
        try{
            if ((!decoded)||(!decoded.id)){
                res.send({ message:{text: `Ошибка авторизации пользователя!`,code: 102}, data:[]})
                return
            }             
            req.body.userid = decoded.id   
            //console.info('checkToken',req.body)
        }catch (err){
            console.info('AuthController checkToken',err)
            res.send({message:{code: 101, text: 'Ошибка получения данных'}, data: []})
        }    

        next();
    },



    signin (req,res)  {    
          
        try{
            if (req.body.login !== undefined){ 
                console.log(new Date().toLocaleString(),`trying to sign in with login: ${req.body.login}`)// pass:${req.body.pass}`)
                user.signin(req.body.login,req.body.pass)
                .then(resolve => { 
                    res.send(resolve)
                })
                .catch(reject => {                    
                    console.log(new Date().toLocaleString(),reject)
                    res.send(reject)
                })
            }else{
                res.send({ message: `Ошибка авторизации пользователя ${req.body.login}!`,code: 101})
            }
        }catch (err){
            res.send({code: 102, message: 'Server error'})
        }    
    }

}