

const pool = require('./pool')


module.exports.deleteDefect =  function(userid,id)  {

    return new Promise (function(resolve,reject) {    
          
        console.info('tag', id)
        
        pool.dbPool.query({
            sql: ' CALL sp_prot_defects_del ( ? , ?, @_msgCode, @_message ); select @_message as message, @_msgCode as msgCode; '
            ,values: [
                 userid
                ,id]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка удаления дефекта! `,code: 3},data:0})
                }else{
                    let msg = ``
                    let code = 0
                    try {
                        msg = results[1][0].message
                        code = results[1][0].msgCode
                    } catch (error) {
                        code = 20
                        msg = "Не удалось получить результат удаления дефекта! Ошибка работы с БД."
                        console.info('deleteDefect', err)
                    }

                    resolve({message: {text:msg, code: code}, data: 0})              

                }

          });
          
    });
}

module.exports.getDefectsByProt =  function(userid,protocolid)  {

    return new Promise (function(resolve,reject) {    
            
        pool.dbPool.query({
            sql: ' CALL sp_prot_defects_get_by_prot ( ?, ?, @message, @msgCode); select @message as message, @msgCode as msgCode; '
            ,values: [ userid, protocolid]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка получения списка дефектов из базы данных! `,code: 3},data:[]})
                }else{
                    let msg = ""
                    let code = 0 
                    let id = 0
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

module.exports.saveDefect =  function(userid,payload)  {

    return new Promise (function(resolve,reject) {    
          
        console.info('saveDefect payload', payload)
        
        pool.dbPool.query({
            sql: ' CALL sp_prot_defects_ins ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @_message , @_msgCode, @_idout); select @_idout as id,@_message as message, @_msgCode as msgCode ; '
            ,values: [  
                payload.id              
                ,payload.protocol_id
                ,payload.ord_num
                ,payload.dpk_type
                ,payload.dpk_categ
                ,payload.dpk_posit
                ,payload.pic_cnt    
                ,payload.notes          
                ,userid  
                ,payload.def_lngth
                ,payload.def_width
                ,payload.def_depth
                ]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка добавления дефекта! `,code: 3},data:0})
                }else{
                    let msg = `Дефект создан!`
                    let code = 0
                    let id = 0
                    //console.info('saveDefect RESULTS', results)//[1][0])
                    try {
                        id = results[1][0].id
                        msg = results[1][0].message
                        code = results[1][0].msgCode
                    } catch (error) {
                        console.log(new Date().toLocaleString(),'model saveDefect',error)
                        code = 201
                        msg = "Не удалось получить параметры добавленного дефекта! Ошибка работы с БД."
                    }

                    if (code != 0){
                        resolve({message: {text: msg, code: code}, data: 0})    
                    }else if (id === 0 ){
                        //console.info('results___________',results)//[2][0].message)
                        resolve({message: {text:`Не удалось сохранить дефект!`, code: 200}, data: 0})    
                        console.log(new Date().toLocaleString(),'model saveDefect id === 0',results)                   
                    }else{
                        resolve({message: {text:msg, code: code}, data: id})              
                    }

                }

          });
          
    });
}

