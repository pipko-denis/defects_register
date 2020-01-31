//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
const mysql = require('mysql')
const config = require('../config/config')


var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

const pool = mysql.createPool({    
    user: config.db.user,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port,    
    database: config.db.database,
    multipleStatements: true,
})

/*
pool.query('SELECT access_token,COALESCE(last_name,userName) as username,password_hash  FROM t_users WHERE ( username = "PipkoDA" ) limit 1', function (error, results, fields) {
  if (error) throw error;
  if (results.length > 0) console.log(new Date().toLocaleString(),'received ' + results[0].username + ' user')
  else console.log(new Date().toLocaleString(),'results = undefined');

})

console.log(new Date().toLocaleString(),'creating query');
pool.query({sql: 'SELECT access_token,COALESCE(last_name,userName) as username,password_hash  FROM t_users WHERE ( username = ? ) limit 1'
  ,values: ['Pipko']
  , function (error, results, fields) {
      //if (error) throw error;
      console.log(new Date().toLocaleString(),'The solution is: ', results[0].username);//[0].access_token);
    }
});
*/
//pool.connect()

module.exports = {
    dbPool : pool,
}

/*
pool.query('SELECT * FROM public.yiiuser WHERE id = $1', [189], (err, res) => {
    if (err) {
      throw err
    }
  
    console.log(new Date().toLocaleString(),'user:', res.rows[0])
  })
*/