const pool = require('./pool')
const config = require('../config/config')
const jwt = require('jsonwebtoken')

function jwtSignUser(user){
    const ONE_WEEK = 3600 * 24 * 7
    console.log(new Date().toLocaleString(),'create token user=', user)
    return jwt.sign(user,config.auth.jwtSecret,{expiresIn: ONE_WEEK})
}


module.exports.checkToken = function (token){
    try{
            //console.info('INCOMING TOKEN',token)
            let decoded = jwt.verify(token,config.auth.jwtSecret)
            //console.log(new Date().toLocaleString(),'user checkToken user id', decoded.id)
            return decoded            
        }catch(err){
            console.log(new Date().toLocaleString(),'users checkToken',err.name)
            console.log(new Date().toLocaleString(),'users checkToken',err.message)                        
            return err
        }
}


module.exports.signin =  function(username,password)  {
    console.log(new Date().toLocaleString(),`username: ${username}, password: ${password}`)
    return new Promise (function(resolve,reject) {
    
        if ((username == undefined)||(username == null)||(username == "")){
            reject({ message: {text: `Ошибка авторизации пользователя!`,code: 5},data:null})
            return
        }

        if ((password == undefined)||(password == null)||(password == "")){
            reject({ message: {text: `Ошибка получения пароля ${username}`,code: 4},data:null})
            return
        }
    
        pool.dbPool.query({
            sql: 'SELECT id,access_token,COALESCE(full_name,last_name,userName) as username,password_hash,position,usr_grp  FROM t_users WHERE username = ? limit 1'
            ,values: [username]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text: `Ошибка получения пользователя с id= ${username}: ${error}`,code: 3},data:null})
                }else{
                    if (results.length == 0){
                        reject({message: {text: `Пользователь с логином "${username}" не найден`,code: 2}, data:null})
                    }else{            
                        //console.log(new Date().toLocaleString(),results)
                        if (password != results[0].password_hash) {
                            //console.log(new Date().toLocaleString(),`received password= ${password} and dbPassword ${results.password_hash}`)
                            reject({message: {text:`Указан не верный пароль для пользователя с логином "${username}"`,code: 1},data:null})
                        }else{
                            let user = {username:results[0].username, id: results[0].id, position: results[0].position,user_group: results[0].usr_grp}
                            let token = jwtSignUser(user)
                            console.info('user', user)
                            resolve({message: {text:`Данные по пользователю с логином "${username}" получены.`,code: 0},data: {user:user,token: token}})
                        }    
                    }
                }

          });
    });
}


/*
module.exports.getUserById =  function(id)  {
    console.log(new Date().toLocaleString(),'userid:', id)
    return new Promise (function(resolve,reject) {
    
        if ((id == undefined)||(id == null)){
            reject({ message: `Ошибка получения пользователя с id= ${id}`,code: 3,username: null})
        }
    
        pool.dbPool.query('SELECT userName FROM public.t_users WHERE id = $1', [id])
        .then(res => {
            if (res.rowCount == 0){
                resolve({message: `Пользователь с id= ${id} не найден`,code: 1,username: null})
            }else{            
                resolve({message: `Пользователь с id= ${id}  найден, имя "${res.rows[0].username}"`,code: 0,username: res.rows[0].username})
            }
        })
        .catch(e => setImmediate(() => { 
            console.log(new Date().toLocaleString(),e);  
            reject({ message: `Ошибка получения пользователя с id= ${id}: ${e}`,code: 2,username: null})
        }))
    });
}
*/
