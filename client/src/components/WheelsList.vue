<template>
  <div>
    <v-toolbar flat color="white">      
      <v-text-field v-model="search" append-icon="search" label="Поиск" single-line hide-details></v-text-field>    
      <v-spacer></v-spacer>
      
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-btn fab small color="secondary" @click="loadDefectsFromSrvByTrain" v-on="on"><v-icon>refresh</v-icon></v-btn> 
        </template>
        <span>Перезагрузить список данных по осмотру колёс</span>
      </v-tooltip> 

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn fab small dark color="secondary" :disabled="getProcessing" class="mb-2" @click="setAddDialog" v-on="on"><v-icon>add</v-icon></v-btn>   <!--:disabled="!getProcessing && !getIsTrainSelected"-->
        </template>
        <span>Добавить данные по осмотру колеса</span>
      </v-tooltip>       

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-show="false" fab small color="secondary" dark class="mb-2" v-on="on"><v-icon>donut_large</v-icon></v-btn>  
        </template>
        <span>Внести данные по осмотру колеса</span>
      </v-tooltip>   
    </v-toolbar>

    <v-data-table :headers="headers" :items="getWheelsForSelectedTrain" :search="search" class="elevation-1" rows-per-page-text="Строк на странице"
        no-data-text="Ничего не найдено" no-results-text="Данные отсутствуют">
      <template v-slot:items="props">
        <td>{{ getCarNoById(props.item.car_reg_number) }}</td>
        <td class="justify-center layout px-0">
          <v-icon small :disabled="getProcessing" class="mr-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon small :disabled="getProcessing" @click="deleteItem(props.item)">delete</v-icon>
        </td>
        <td class="text-xs-left">{{ props.item.axis_num }}</td>
        <td class="text-xs-left">{{ getWheelSideById(props.item.side) }}</td>
        <td class="text-xs-left">{{ props.item.diam }}</td>
        <td class="text-xs-left">{{ props.item.def_cnt }}</td>  
        <td class="text-xs-left">{{ props.item.pic_cnt }}</td>
        <td class="text-xs-left">{{ props.item.wheel_condit }}</td>
      </template>    
    </v-data-table>

    <wheel-details></wheel-details>

  </div>
</template>


<script>

import WheelDetails from '../components/WheelDetails'

  export default {
    
    components:{
        WheelDetails,
    },

    data: () => ({
      search: '',  
      headers: [
        { text: 'Рег.№ вагона', align: 'left',value: 'car_reg_number', sortable: true },
        { text: '', value: '', sortable: false },
        { text: '№ оси', align: 'left', value: 'axis_num', sortable: true },
        { text: 'Сторона', align: 'left', value: 'side', sortable: true },
        { text: 'Диаметр пов.катания', align: 'left', value: 'diam', sortable: true },
        { text: 'Кол.дефектов', align: 'left', value: 'def_cnt', sortable: true },
        { text: 'Кол.фото', align: 'left', value: 'pic_cnt', sortable: true },
        { text: 'Общее состояние колеса', align: 'left', value: 'wheel_condit', sortable: true },        
      ],
      
      lstSides: [{id: 1,name:'левая'},{id: 2,name:'правая'}],
      defaultItem: {id: null,car_reg_number: null,axis_num: null,side: null,diam: null,def_cnt: 0,pic_cnt: 0,wheel_condit: null,defects:[]},
   
    }),

    computed: {    
     
      getProcessing(){
        return this.$store.getters.getProcessing
      },

      getWheelsForSelectedTrain(){
        if (!this.$store.getters.getProtocolSelectedTrainId) return []
        else return this.$store.getters.getProtocolWheels
      },

      trainCars(){
        return this.$store.getters.getCarsForProtocolSelectedTrain
      },

      getIsTrainSelected(){
        if (this.$store.getters.getProtocolSelectedTrainId) return true
        else return false
        
      },   

      getListCars(){
          return this.$store.getters.getCarsForProtocolSelectedTrain
      }

    },

    mounted(){
        //this.$store.commit('SET_CARS_LIST',[]) 
    },

    methods: {

        setAddDialog(){
            if (this.$store.getters.getProtocolSelectedTrainId) {                              
                this.$store.commit('SET_EDITED_WHEEL',{
                  editedWheel: {id: null,car_reg_number: null,axis_num: null,side: null,diam: null,def_cnt: 0,pic_cnt: 0,wheel_condit: null,defects:[]}
                  ,editedIndex: -1})

                console.info('setAddDialog getEditedWheel',this.$store.getters.getEditedWheel)
                this.$store.commit('SET_DEF_DIALOG_VIS',true) 
            }else {
                this.$store.commit('SET_DEF_DIALOG_VIS',false)  
                alert('Необходимо выбрать состав') 
            }
        },

        loadDefectsFromSrvByTrain(){
            if(this.$store.getters.getProtocolSelectedTrainId){
                return this.$store.getters.getCarsForProtocolSelectedTrain
            }else{
                return []
            }
        //this.$store.dispatch('GET_CARS_FROM_SRV_BY_TRAIN',{trainid: this.$store.getters.getProtocolSelectedTrainId})  
        },


        getCarNoById(id){
            let elem = _.find(this.getListCars,{id:id})
            if (elem) return elem.car_reg_number 
            else return null
        },

        getWheelSideById(id){
            let elem = _.find(this.lstSides,{id:id})
            if (elem) return elem.name 
            else return null
        },

        editItem (item) {              
        if (this.$store.getters.getProtocolSelectedTrainId){
            let index = this.getWheelsForSelectedTrain.indexOf(item)
            //this.editedIndex = index
            //this.editedItem = Object.assign({}, item)
            //this.$store.commit('SET_EDITED_WHEEL',{editedWheel: Object.assign({}, item), editedIndex: index});
            this.$store.commit('SET_EDITED_WHEEL',{editedWheel: item, editedIndex: index});
            this.$store.commit('SET_DEF_DIALOG_VIS',true)  
        }else{
            this.$store.commit('SET_DEF_DIALOG_VIS',false) 
            alert('Необходимо выбрать состав')          
        }

        },

        deleteItem (item) {        
            if (confirm('Вы уверены что хотите удалить данные по колесу из списка?')){
                console.log('deleteItem',item)
                this.$store.commit('REMOVE_WHEEL',item) 
                //this.removeCarFromTrain(item)
                //&& this.trainCars.splice(index, 1)
            }         
        },



    }
  }

/*
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
*/
      /*
      async loadDefectsFromSrvByTrain(){
          await this.$store.dispatch('GET_CARS_FROM_SRV_BY_TRAIN',{train_id: this.$store.getters.getProtocolSelectedTrainId})   
          
          console.info('getProtocolSelectedTrainId',this.$store.getters.getProtocolSelectedTrainId)
        if (this.$store.getters.getProtocolSelectedTrainId){  
          try{            
            this.$store.commit('SET_PROCESSING',true)  
            this.$store.commit('SET_ERROR_CLEAN') 
            let result = await WheelService.getCarsByTrain({trainId: this.$store.getters.getProtocolSelectedTrainId})
            if ((result)&&(result.data)&&(result.data.data)&&(result.data.message)){
              console.info(result.data)
              if (result.data.message.code != 0){
                this.$store.commit('SET_ERROR',result.data.message.text)
                this.trainCars = result.data.data
              }else{
                this.trainCars = result.data.data
              }
            }else{
              this.$store.commit('SET_ERROR','')
              this.trainCars = []
            }
            
            
          }catch(err){            
            this.$store.commit('SET_ERROR',err)
            console.info('err',err)
          }finally{
            this.$store.commit('SET_PROCESSING',false) 
          }
        }else{
          this.$store.commit('SET_CARS_LIST',[])
        }
       
      },
 */


</script>

<style scoped>

</style>


