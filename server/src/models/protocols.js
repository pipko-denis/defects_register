

const pool = require('./pool')

module.exports.getProtocolsByDt =  function(userid,dtFrom,dtTo)  {

    return new Promise (function(resolve,reject) {    
            
        pool.dbPool.query({
            sql: ' CALL sp_protocols_get_bydt ( ?, ?, ?, @message, @msgCode); select @message as message, @msgCode as msgCode; '
            ,values: [ userid, dtFrom, dtTo]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка получения списка протоколов из базы данных! `,code: 3},data:[]})
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

module.exports.deleteProtocol =  function(userid,id)  {

    return new Promise (function(resolve,reject) {    
            
        pool.dbPool.query({
            sql: ' CALL sp_protocols_delete ( ?, ?, @message, @msgCode); select @message as message, @msgCode as msgCode; '
            ,values: [ userid, id]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка удаления протокола из базы данных! `,code: 3},data:[]})
                }else{
                    let msg = ""
                    let code = 0 
                    console.info('RESULTS', results[1][0].message,results[1][0].msgCode)
                    try {
                        msg = results[1][0].message
                        code = results[1][0].msgCode
                    } catch (error) {
                        code = 201
                        msg = "Не удалось получить OUT параметры! Ошибка работы с БД."
                    }
                    //console.info('results___________',results)//[2][0].message)
                    resolve({message:{text: msg, code: code}, data: null})                    
                }

            });
                //},1000) //settimeout
});
    
}


module.exports.copyProtocol =  function(userid,payload)  {

    return new Promise (function(resolve,reject) {    
          
        console.info('copyProtocol protocol for id', payload)
        
        pool.dbPool.query({
            sql: ' CALL sp_protocols_copy ( ?, ?, @_id , @_message , @_msgCode); select @_id as id,@_message as message, @_msgCode as msgCode ; '
            ,values: [ userid , payload]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка копирования протокола! `,code: 3},data:0})
                }else{
                    let msg = ``
                    let code = 0
                    let id = 0
                    console.info('copyProtocol RESULTS', results[1][0])
                    try {
                        id = results[1][0].id
                        msg = results[1][0].message
                        code = results[1][0].msgCode
                    } catch (error) {
                        console.log(new Date().toLocaleString(),'model copyProtocol',error)
                        code = 201
                        msg = "Не удалось получить параметры протокола полученного в результате копирвания! Ошибка работы с БД."
                    }

                    if (id === 0 ){
                        //console.info('results___________',results)//[2][0].message)
                        resolve({message: {text:`Не удалось создать копию протокола!`, code: 200}, data: 0})                        
                    }else{
                        resolve({message: {text:msg, code: code}, data: id})              
                    }

                }

          });
          
    });
}

module.exports.saveProtocol =  function(userid,payload)  {

    return new Promise (function(resolve,reject) {    
          
        let  protocol = payload

        console.info('addProtocol protocol', payload.protocol)
        
        pool.dbPool.query({
            sql: ' CALL sp_protocols_ins ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @_id , @_message , @_msgCode); select @_id as id,@_message as message, @_msgCode as msgCode ; '
            ,values: [                
                userid
                ,protocol.id
                ,protocol.place_id
                ,protocol.prot_dat
                ,protocol.prot_time_from
                ,protocol.prot_time_to
                ,protocol.inspector_first
                ,protocol.inspector_second
                ,protocol.train_id                
                ,protocol.pass_reg_dt
                ,protocol.pass_reg_time
                ,protocol.car_id
                ,protocol.car_condit
                ,protocol.car_loading
                ,protocol.axis_num
                ,protocol.side
                ,protocol.diam
                ,protocol.wheel_condit
                ,protocol.def_cnt
                ,protocol.pic_cnt
                ]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка добавления протокола! `,code: 3},data:0})
                }else{
                    let msg = ``
                    let code = 0
                    let id = 0
                    console.info('addProtocol RESULTS', results[1][0])
                    try {
                        id = results[1][0].id
                        protocol.id = id
                        msg = results[1][0].message
                        code = results[1][0].msgCode
                    } catch (error) {
                        console.log(new Date().toLocaleString(),'model addProtocol',error)
                        code = 201
                        msg = "Не удалось получить параметры добавленного протокола! Ошибка работы с БД."
                    }

                    if (id === 0 ){
                        //console.info('results___________',results)//[2][0].message)
                        resolve({message: {text:`Не удалось добавить протокол!`, code: 200}, data: 0})                        
                    }else{
                        resolve({message: {text:msg, code: code}, data: id})              
                    }

                }

          });
          
    });
}

