const authController = require('./controllers/AuthController')
const trainsController = require('./controllers/TrainsController')
const carsController = require('./controllers/CarsController')
const imagesController = require('./controllers/ImagesController')
const protocolsController = require('./controllers/ProtocolsController')
const defectsController = require('./controllers/DefectsController')
const multer =  require('multer')


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'./defects_images/')
    },
    filename: function(req, file, cb){
        let filename = new Date().toISOString().substring(0,19).replace(/-|:|T/g,'_')+'_'+file.originalname
        //console.info('FILE', file)
        cb(null,filename)
    },
})

const fileFilter = (req, file,cb) => {
    if (file.mimetype.includes('image') ) {
        //console.info('includes image',file.mimetype+' '+typeof(file.mimetype) )
        cb(null,true)
    }else{
        //console.info('does not include image',file.mimetype+' '+typeof(file.mimetype))
        cb(null,false)    
    }
}


const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 10},
    fileFilter: fileFilter,
})

module.exports = (app) =>  {

    app.get('/status',(req,res) => {
        console.log(new Date().toLocaleString(),'get status')
        res.send({
                message: 'get status from node'
        }) 
    })
        
    app.post('/signin',authController.signin)

    app.post('/trains',authController.checkToken,trainsController.getTrains)

    app.post('/trains/save',authController.checkToken,trainsController.addTrain)
    
    app.post('/trains/del',authController.checkToken,trainsController.delTrain)

   
    app.post('/cars/bytrain',authController.checkToken,carsController.getCarsByTraindId)

    app.post('/cars',authController.checkToken,carsController.getCars)

    app.post('/cars/addCar',authController.checkToken,carsController.addCar)

    app.post('/cars/addTrainCar',authController.checkToken,carsController.addTrainCar)

    app.post('/cars/editCar',authController.checkToken,carsController.editCar)

    app.post('/cars/editTrainCar',authController.checkToken,carsController.editTrainCar)

    app.post('/cars/removefromtrain',authController.checkToken,carsController.removeCarFromTrain)


    app.post('/protocols/bydt',authController.checkToken,protocolsController.getProtocolsByDt)

    app.post('/protocols/save',authController.checkToken,protocolsController.saveProtocol)//,defectsController.saveDefects)

    app.post('/protocols/delete',authController.checkToken,protocolsController.deleteProtocol)

    app.post('/protocols/copy',authController.checkToken,protocolsController.copyProtocol)

    app.post('/defects/byprot',authController.checkToken,defectsController.getDefectsByProt)   
    
    app.post('/defects/save',authController.checkToken,defectsController.saveDefect)
      
    app.post('/defects/delete',authController.checkToken,defectsController.deleteDefect)

    app.post('/images/defects/add',authController.checkToken,upload.single('defectImage'),imagesController.uploadDefectImage)

    app.post('/images/protocol/get',authController.checkToken,imagesController.getImagesByProtocol)

    app.post('/images/get/last',authController.checkToken,imagesController.getLastImages)

    app.post('/images/delete',authController.checkToken,imagesController.deleteImage)



/*
    app.post('/cars/delete',carsController.deleteCar)
 */
}
