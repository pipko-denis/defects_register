import { stat } from "fs";

export default {
    state: {
        messageList: [],
        errorList: [],
        processing: false,
        error: null,
        message:null,
        lstCarCondit: [{id: 1,name:'хорошее'},{id: 2,name:'среднее'},{id: 3,name:'плохое'}],
        lstCarLoad: [{id: 1,name:'полная'},{id: 2,name:'средняя'},{id: 3,name:'порожний'}],
        //lstCarTypes: [{id: 1,name:'цистерна'},{id: 2,name:'рефрижератор'},{id: 3,name:'вагон-сетка'},{id: 4,name:'крытый грузовой'},{id: 5,name:'платформа'},{id: 6,name:'фитинговая платформа'},{id: 7,name:'хопер'}],
        lstCarTypes: [],
        lstDpkType: [{id: 1,name:'ползун'},{id: 2,name:'выщербина'},{id: 3,name:'кольцевая выработка'},{id: 4,name:'другое(заполнить примечания)'},],
        lstDpkCateg: [{id: 1,name:'выбрак'},{id: 2,name:'невыбрак'},],
        lstSides: [{id: 1,name:'левая'},{id: 2,name:'правая'}],
        lstPlases:[],
        //[{id:1, name:"Пермь"},{id:2, name:"ЭК ВНИИЖТ"},{id:3, name:"Мга"},{id:4, name:"Агрыз"},{id:5, name:"Белогорск"},{id:6, name:"Лянгасово"},{id:7, name:"Ястребино"},{id:8, name:"Решеты"},{id:9, name:"Хрустальная"},{id:10, name:"Крымская"},{id:11, name:"Улан-Уде"},]  
    },
    mutations: {
        SET_PROCESSING(state,payload){
            state.processing = payload
        },
        SET_ERROR(state,payload){
            state.error = payload
            let lngth = state.errorList.unshift({dt: new Date().toLocaleString(),isError:true, payload})
            if ( lngth > 100 ) {
                state.errorList = state.errorList.splice(0,100)
            }
            //if (payload) console.info('error message',payload)
            setTimeout(() => {
                state.error = null     
            }, 3000);
        },
        SET_MESSAGE(state,payload){
            state.message = payload
            let lngth = state.messageList.unshift({dt: new Date().toLocaleString(),isError:false, payload})
            if ( lngth > 50 ) {
                state.messageList = state.messageList.splice(0,50)
            }

            setTimeout(() => {
                state.message = null          
            }, 3000);
        },
        SET_ERROR_CLEAN(state){
            //console.info('SET_ERROR_CLEAN')
            state.error = null
        },
        STORE_INIT(state){            
            state.lstPlases = [{id:1, name:"Пермь"},{id:2, name:"ЭК ВНИИЖТ"},{id:3, name:"Мга"},{id:4, name:"Агрыз"},{id:5, name:"Белогорск"},{id:6, name:"Лянгасово"},{id:7, name:"Ястребино"},{id:8, name:"Решеты"},{id:9, name:"Хрустальная"},{id:10, name:"Крымская"},{id:11, name:"Улан-Уде"}, {id:12, name:"Чурилово"} ]
            state.lstCarTypes = [{id: 1,name:'цистерна'},{id: 2,name:'рефрижератор'},{id: 3,name:'полувагон'},{id: 4,name:'крытый'},{id: 5,name:'платформа'},{id: 6,name:'транспортер'},{id: 7,name:'хоппер'},{id: 8,name:'думпкар'}]
        }
    },

    getters: {
        getProcessing: (state) => state.processing,
        getError: (state) => {if (state.error){return state.error.text}else{return ''}},
        getMessage: (state) => {if (state.message){return state.message.text}else{return ''}},        
        getListCarCondit: (state) => state.lstCarCondit,
        getListCarLoad: (state) => state.lstCarLoad,
        getListCarTypes: (state) => state.lstCarTypes,
        getListDpkType: (state) => state.lstDpkType,
        getListDpkCateg: (state) => state.lstDpkCateg,
        getListSides: (state) => state.lstSides,
        getPlaces: (state) => state.lstPlases,
        getMessList: (state) => state.messageList,
        getErrorList: (state) => state.errorList,
    }
}