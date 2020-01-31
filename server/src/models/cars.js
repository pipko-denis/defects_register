const pool = require('./pool')

module.exports.addCar =  function(userid,car)  {

    return new Promise (function(resolve,reject) {    
          
        console.info('addCar begin', car)
        
        pool.dbPool.query({
            sql: ' CALL sp_cars_ins ( ?, ?, ?, ?,  @_id, @_message , @_msgCode, @_id); select @_id as id, @_message as message, @_msgCode as msgCode, @_id as id_car ; '
            ,values: [                 
                ,car.car_reg_number
                ,car.car_type
                ,car.car_year
                ,userid]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),'ERROR addCar',error);  
                    reject({ message: {text:`Ошибка добавления вагона! `,code: 2},data:{id:0,carid:0}})
                }else{
                    let msg = ``
                    let code = 0
                    let id = 0
                    try {
                        id = results[1][0].id
                        carid = results[1][0].id_car
                        msg = results[1][0].message
                        code = results[1][0].msgCode
                    } catch (err) {
                        code = 3
                        msg = "Не удалось получить параметры добавленного состава! Ошибка работы с БД."
                        console.log(new Date().toLocaleString(),'ERROR addCar results',err);  
                    }
                    console.log(new Date().toLocaleString(),'id=',id,';car=',carid);
                    resolve({message: {text:msg, code: code}, data: {id:id, carid: carid}})              

                }

          });
          
    });
}

module.exports.editCar =  function(userid,car)  {

    return new Promise (function(resolve,reject) {    
          
        console.info('tag', car)
        
        pool.dbPool.query({
            sql: ' CALL sp_cars_upd ( ?, ?, ?, ?, ?, @_message , @_msgCode); select @_message as message, @_msgCode as msgCode; '
            ,values: [  car.id, car.car_reg_number, car.car_type, car.car_year, userid ]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка обновления информации по вагону состава! `,code: 3},data:0})
                }else{
                    let msg = ``
                    let code = 0
                    try {
                        msg = results[1][0].message
                        code = results[1][0].msgCode
                    } catch (error) {
                        code = 20
                        msg = "Не удалось получить результат обновления инфмаорции по вагону состава! Ошибка работы с БД."
                        console.info('ERROR sp_cars_upd', err)
                    }

                    resolve({message: {text:msg, code: code}, data: 0})              

                }

          });
          
    });
}


module.exports.addTrainCar =  function(userid,carData)  {

    return new Promise (function(resolve,reject) {    
          
        console.info('addCar', carData)
        
        pool.dbPool.query({
            sql: ' CALL sp_cars_train_ins ( ?, ?, ?, ?, ?, ?, @_id, @_message , @_msgCode, @_id_car); select @_id as id, @_message as message, @_msgCode as msgCode, @_id_car as id_car ; '
            ,values: [
                 userid
                ,carData.car_reg_number
                ,carData.car_type
                ,carData.car_year
                ,carData.train_id
                ,carData.ord_num]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error) 
                    reject({ message: {text:`Ошибка добавления вагона! `,code: 3},data:{id:0,carid:0}})
                }else{
                    let msg = ``
                    let code = 0
                    let id = 0
                    let carid = 0
                    try {
                        console.log(new Date().toLocaleString(),'results',results)
                        id = results[1][0].id
                        msg = results[1][0].message
                        code = results[1][0].msgCode
                        carid = results[1][0].id_car
                    } catch (err) {
                        code = 20
                        msg = "Не удалось получить параметры добавленного состава! Ошибка работы с БД."
                        console.log(new Date().toLocaleString(),err)
                    }
                    console.log(new Date().toLocaleString(),id,carid)
                    resolve({message: {text:msg, code: code}, data: {id: id, carid: carid}})              

                }

          });
          
    });
}

module.exports.editTrainCar =  function(userid,car)  {

    return new Promise (function(resolve,reject) {    
          
        console.info('editTrainCar car=', car)
        
        pool.dbPool.query({
            sql: ' CALL sp_cars_train_upd ( ?, ?, ?, ?, ?, ?, ?,  @_message , @_msgCode); select @_message as message, @_msgCode as msgCode; '
            ,values: [  car.id, car.train_car_id , userid, car.car_reg_number, car.car_type, car.car_year , car.ord_num ]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка обновления информации по вагону состава! `,code: 3},data:0})
                }else{
                    let msg = ``
                    let code = 0
                    try {
                        msg = results[1][0].message
                        code = results[1][0].msgCode
                        console.info('editTrainCar succsess msg', msg)
                    } catch (error) {
                        code = 20
                        msg = "Не удалось получить результат обновления инфмаорции по вагону состава! Ошибка работы с БД."
                        console.info('ERROR editTrainCar', err)
                    }

                    resolve({message: {text:msg, code: code}, data: 0})              

                }

          });
          
    });
}

module.exports.removeCarFromTrain =  function(userid,id)  {

    return new Promise (function(resolve,reject) {    
          
        console.info('tag', id)
        
        pool.dbPool.query({
            sql: ' CALL sp_train_cars_del ( ? , ?, @_message , @_msgCode); select @_message as message, @_msgCode as msgCode; '
            ,values: [
                 userid
                ,id]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка удаления вагона из состава! `,code: 3},data:0})
                }else{
                    let msg = ``
                    let code = 0
                    try {
                        msg = results[1][0].message
                        code = results[1][0].msgCode
                    } catch (error) {
                        code = 20
                        msg = "Не удалось получить результат удаления вагона из состава! Ошибка работы с БД."
                        console.info('removeCarFromTrain', err)
                    }

                    resolve({message: {text:msg, code: code}, data: 0})              

                }

          });
          
    });
}

module.exports.getCarsByTraindId =  function(userid,trainId)  {

    return new Promise (function(resolve,reject) {    
            
        pool.dbPool.query({
            sql: ' CALL sp_cars_get_by_train_id ( ? , ? , @message , @msgCode); select @message as message, @msgCode as msgCode; '
            ,values: [userid,trainId]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка получения списка вагонов из базы данных! `,code: 3},data:[]})
                }else{
                    let msg = ""
                    let code = 0 
                    try {
                        console.info(results[2][0] )
                        msg = results[2][0].message
                        code = results[2][0].msgCode
                    } catch (error) {
                        code = 201
                        msg = "Не удалось получить OUT параметры! Ошибка работы с БД."
                        console.info('getCarsByTraindId', err)
                    }
                    //console.info('results___________',results)//[2][0].message)
                    resolve({message:{text: msg, code: code}, data: results[0]})                    
                }

            });
                //},1000) //settimeout
});
    
}


module.exports.getCars =  function(userid,trainId)  {

    return new Promise (function(resolve,reject) {    
            
        pool.dbPool.query({
            sql: ' CALL sp_cars_get_by_train_id ( ? , ? , @message , @msgCode); select @message as message, @msgCode as msgCode; '
            ,values: [trainId,userid]}
            , function (error, results, fields) {
                if (error) {
                    console.log(new Date().toLocaleString(),error);  
                    reject({ message: {text:`Ошибка получения списка вагонов из базы данных! `,code: 3},data:[]})
                }else{
                    let msg = ""
                    let code = 0 
                    try {
                        msg = results[2][0].message
                        code = results[2][0].msgCode
                    } catch (error) {
                        code = 201
                        msg = "Не удалось получить OUT параметры! Ошибка работы с БД."
                        console.info('getCars', err)
                    }
                    //console.info('results___________',results)//[2][0].message)
                    resolve({message:{text: msg, code: code}, data: results[0]})                    
                }

            });
                //},1000) //settimeout
});
    
}