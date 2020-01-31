const pool = require('./pool')



module.exports.saveDefectImage =  function(userid,defectid,file)  {

    return new Promise (function(resolve,reject) {    
          
        console.info('SAVE DEFECT IMAGE', file.originalname)

        pool.dbPool.query({
            sql: ' CALL sp_defect_images_ins ( ?, ?, ?, ?, @_message , @_msgCode); select @_message as message, @_msgCode as msgCode; '
            ,values: [ userid,defectid,file.originalname,file.path ]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка сохранения файла ${file.originalname}! `,code: 23},data: file.path})
                }else{
                    let msg = ``
                    let code = 0
                    try {
                        msg = results[1][0].message
                        code = results[1][0].msgCode
                    } catch (error) {
                        code = 20
                        msg = `Не удалось получить результат добавления информации по фотографии дефекта ${file.originalname}! Ошибка работы с БД.`
                        console.info('saveDefectImage', err)
                    }

                    resolve({message: {text:msg, code: code}, data: file.path})              

                }

          });

          
    });
}


module.exports.deleteImage =  function(userid,id)  {

    return new Promise (function(resolve,reject) {    

        pool.dbPool.query({
            sql: ' CALL sp_defect_images_del ( ?, ?, @_msgCode, @_message ); select @_message as message, @_msgCode as msgCode; '
            ,values: [ userid, id ]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка удаления изображения! `,code: 21},data:[]})
                }else{
                    console.log(new Date().toLocaleString(),results);
                    let msg = ""
                    let code = 0
                    try {
                        msg = results[1][0].message
                        code = results[1][0].msgCode
                    } catch (error) {
                        code = 20
                        msg = "Не удалось получить OUT параметры для фотографий! Ошибка работы с БД."
                        console.info('ERROR getDefectImages', error)
                    }
                    resolve({message: {text:msg, code: code}, data: null})
                }

          });
          
          
    });
}


module.exports.getLastImages =  function(userid,id)  {

    return new Promise (function(resolve,reject) {    

        pool.dbPool.query({
            sql: ' CALL sp_defect_images_last ( ?, @_message , @_msgCode); select @_message as message, @_msgCode as msgCode; '
            ,values: [ userid ]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка получения фотографий! `,code: 21},data:[]})
                }else{
                    let msg = ""
                    let code = 0
                    try {
                        msg = results[2][0].message
                        code = results[2][0].msgCode
                    } catch (error) {
                        code = 20
                        msg = "Не удалось получить OUT параметры для фотографий! Ошибка работы с БД."
                        console.info('ERROR getDefectImages', error)
                    }
                    console.info('getDefectImages', results[0])
                    if (!results[0].length) {
                        resolve({message: {text:msg, code: code}, 
                                    data: [{path:"defects_images\\default_wheel.jpg",file_name:"Протоколы отсутствуют",ord_num: 0, dpk_type:0,def_size:0,dpk_categ:0,defect_id:0,id:0,prot_id:0}]
                                })              
                    }else{
                        resolve({message: {text:msg, code: code}, data: results[0]})
                    }

                }

          });
          
          
    });
}


module.exports.getImagesByProtocol =  function(userid,id)  {

    return new Promise (function(resolve,reject) {    

        pool.dbPool.query({
            sql: ' CALL sp_defect_images_get_by_protocol ( ?, ?, @_message , @_msgCode); select @_message as message, @_msgCode as msgCode; '
            ,values: [ id, userid ]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка получения фотографий протокола! `,code: 21},data:[]})
                }else{
                    let msg = ""
                    let code = 0
                    try {
                        msg = results[2][0].message
                        code = results[2][0].msgCode
                    } catch (error) {
                        code = 20
                        msg = "Не удалось получить OUT параметры для фотографий дефекта! Ошибка работы с БД."
                        console.info('getDefectImages', error)
                    }

                    resolve({message: {text:msg, code: code}, data: results[0]})              

                }

          });
          
          
    });
}