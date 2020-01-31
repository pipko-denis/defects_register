const pool = require('./pool')

module.exports.getTrains =  function(userid)  {

    return new Promise (function(resolve,reject) {    
            
        pool.dbPool.query({
            sql: ' CALL sp_trains_get ( ? , @message , @msgCode); select @message as message, @msgCode as msgCode; '
            ,values: [userid]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка получения списка составов из базы данных! `,code: 3},data:[]})
                }else{
                    let msg = ""
                    let code = 0 
                    try {
                        msg = results[2][0].message
                        code = results[2][0].msgCode
                    } catch (error) {
                        code = 201
                        msg = "Не удалось получить OUT параметры! Ошибка работы с БД."
                    }
                    //console.info('results___________',results)//[2][0].message)
                    resolve({message:{text: msg, code: code}, data: results[0]})                    
                }

            });
                //},1000) //settimeout
});
    
}



module.exports.delTrain =  function(userid,trin_id)  {

    return new Promise (function(resolve,reject) {    
          
        console.info('addTrain', trin_id)
        
        pool.dbPool.query({
            sql: ' CALL sp_trains_del ( ?, ?, @_msgCode, @_message); select @_msgCode as msgCode, @_message as message  ; '
            ,values: [userid, trin_id]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка удаления состава! `,code: 3},data:0})
                }else{
                    let msg = ``
                    let code = 0
                    let id = 0
                    console.info('RESULTS', results[1][0])
                    try {
                        msg = results[1][0].message
                        code = results[1][0].msgCode
                    } catch (error) {
                        code = 2
                        msg = "Не удалось получить параметры добавленного состава! Ошибка работы с БД."
                    }
                    resolve({message: {text:msg, code: code}, data: null})
                }

          });
          
    });
}

module.exports.addTrain =  function(userid,trainData)  {

    return new Promise (function(resolve,reject) {    
          
        console.info('Adding or updating train', trainData)
        
        pool.dbPool.query({
            sql: ' CALL sp_trains_ins ( ?, ?, ?, ?, ?, ?, ?, ?, ?, @_id, @_msgCode, @_message); select @_id as id, @_msgCode as msgCode, @_message as message  ; '
            ,values: [
                userid
                ,trainData.id
                ,trainData.train_number
                ,trainData.cnt_car_total
                ,trainData.cnt_car_loco
                ,trainData.cnt_car
                ,trainData.cnt_axis_total
                ,trainData.cnt_axis_loco
                ,trainData.cnt_axis_car]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка добавления состава! `,code: 3},data:0})
                }else{
                    let msg = `Состав ${trainData.train_number} создан!`
                    let code = 0
                    let id = 0
                    console.info('RESULTS', results[1][0])
                    try {
                        id = results[1][0].id
                        msg = results[1][0].message
                        code = results[1][0].msgCode
                    } catch (error) {
                        code = 2
                        msg = "Не удалось получить параметры добавленного состава! Ошибка работы с БД."
                    }
                    resolve({message: {text:msg, code: code}, data: id})
                    /*
                    if (id === 0 ){
                        //console.info('results___________',results)//[2][0].message)
                        resolve({message: {text:`Состав №${trainData.train_number} уже присутствует в базе данных`, code: 1}, data: id})                        
                    }else{
                        resolve({message: {text:msg, code: code}, data: id})              
                    }
                    */

                }

          });
          
    });
}

