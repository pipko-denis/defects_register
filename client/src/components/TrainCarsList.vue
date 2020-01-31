<template>
  <v-card>    
    <div class="headline">Список вагонов</div>
    <v-toolbar flat color="white">      
      <v-text-field v-model="search" append-icon="search" label="Поиск" single-line hide-details></v-text-field>    
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-btn fab small color="secondary" @click="getCarsList(pTrainId)" v-on="on"><v-icon>refresh</v-icon></v-btn> 
        </template>
        <span>Перезагрузить список вагонов состава</span>
      </v-tooltip> 

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn fab small dark color="secondary" class="mb-2" @click="setAddDialog" v-on="on"><v-icon>add</v-icon></v-btn>   <!--:disabled="!getProcessing && !getIsTrainSelected"-->
        </template>
        <span>Добавить вагон к составу</span>
      </v-tooltip> 

      <v-dialog v-model="dialog" persistent max-width="500px">        
                 
        <v-card>           
         <v-card-title class="primary white--text" >            
           <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-divider class="mx-0 primary" horizontal></v-divider> 
        <v-card-text>
            <v-container grid-list-md>
                <v-layout wrap>
                <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.car_reg_number" label="Рег.№ вагона"></v-text-field>
                </v-flex>                
                <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.ord_num" type="number" label="Пор. номер"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.car_year" type="number" label="Год выпуска"></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-select v-model="editedItem.car_type" clearable :items="lstCarTypes" item-text="name" item-value="id" label="Тип вагона:"></v-select>
                </v-flex>
<!--                
                <v-flex xs12 sm6>
                  <v-select v-model="editedItem.condit" clearable :items="lstCarCondit" item-text="name" item-value="id"  label="Состояние:"></v-select>
                </v-flex>
                <v-flex xs12 sm6>
                    <v-select v-model="editedItem.loading" clearable :items="lstCarLoad" item-text="name" item-value="id" return object label="Загрузка:"></v-select>                                     
                </v-flex>
-->                
                </v-layout>
            </v-container>
        </v-card-text>
          <v-divider class="mx-0 primary" horizontal></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="primary white--text" @click="save">Сохранить</v-btn>
            <v-btn   @click="close">Отмена</v-btn>            
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-data-table :headers="headers" :items="trainCars" :search="search" class="elevation-1" rows-per-page-text="Строк на странице"
        no-data-text="Ничего не найдено" no-results-text="Данные отсутствуют">
      <template v-slot:items="props">
        <td>{{ props.item.car_reg_number }}</td>
        <td class="justify-center layout px-0">
          <v-icon small :disabled="getProcessing" class="mr-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon small :disabled="getProcessing" @click="deleteItem(props.item)">delete</v-icon>
        </td>
        <td class="text-xs-left">{{ getCarTypeById(props.item.car_type) }}</td>
        <td class="text-xs-left">{{ props.item.ord_num }}</td>
        <td class="text-xs-left">{{ props.item.car_year }}</td>
        <!--<td class="text-xs-left">{{ getCarConditingById(props.item.condit) }}</td>
        <td class="text-xs-left">{{ getCarLoadingById(props.item.loading) }}</td>-->
      </template>    
    </v-data-table>
  </v-card>
</template>


<script>

import CarsService from '@/services/CarsService'

  export default {

    components:{
      CarsService,
    },

    props: {
      pTrainId:{
          type: Number,
          required: true
      },
    },  
    data: () => ({
      search: '',  
      dialog: false,
      headers: [
        { text: 'Рег.№ вагона', align: 'left',sortable: true,value: 'car_reg_number', sortable: true },
        { text: '', value: '', sortable: false },
        { text: 'Тип вагона', align: 'left', value: 'car_type', sortable: true },
        { text: 'Пор. номер', align: 'left', value: 'ord_num', sortable: true },
        { text: 'Год выпуска', align: 'left', value: 'car_year', sortable: true },
        //{ text: 'Состояние', align: 'left', value: 'condit', sortable: true },
        //{ text: 'Загрузка', align: 'left', value: 'loading', sortable: true },        
      ],      
      
      editedIndex: -1,
      editedItem: {id: null,car_reg_number: null,car_type: 0,ord_num: 0,car_year: 0},
      defaultItem: {id: null,car_reg_number: null,car_type: 0,ord_num: 0,car_year: 0},
      carsList: [],
      lstCarsRemoveFromSrv: [],
    }),

    computed: {

      lstCarTypes(){
        return this.$store.getters.getListCarTypes
      },

      formTitle () {
        return this.editedIndex === -1 ? 'Добавление вагона' : 'Редактирование вагона'
      },
      isEditDialod () {
        return this.editedIndex === -1 ? false : true
      },
      
      getProcessing(){   
        return this.$store.getters.getProcessing
      },

      trainCars(){          
        this.$emit("changedLstCars",this.carsList)
        return this.carsList
      },  

    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      pTrainId(val){
        console.info('watch pTrainId', val)
        this.getCarsList(val)
        this.lstCarsRemoveFromSrv = [] 
        this.$emit("changedLstDelCars",this.lstCarsRemoveFromSrv)
      }
    },


    methods: {
/*
        changedLstDelCars(event){
            this.train_number = event
            this.$emit("changedLstCars",this.carsList)
        },

        changedLstDelCars(event){
            this.train_number = event
            this.$emit("changedLstDelCars",this.lstCarsRemoveFromSrv)
        },
*/
        getCarsList(trainId){
          this.carsList = []
          this.$store.commit('SET_PROCESSING',true)  
          this.$store.commit('SET_ERROR_CLEAN')  
          try{                      
            CarsService.getCarsByTrain({trainId: trainId})
              .then(result => {           
                  if (result.data.message.code != 0) {
                    this.$store.commit('SET_PROCESSING',false)
                    this.$store.commit('SET_ERROR',result.data.message)              
                  }else{                    
                    this.$store.commit('SET_PROCESSING',false)
                    this.$store.commit('SET_MESSAGE',result.data.message)
                    this.carsList = result.data.data                    
                  }
                }
              )
              .catch(err => {                     
                  this.$store.commit('SET_PROCESSING',false)     
                  this.$store.commit('SET_ERROR',err)    
                  console.info('CarsList3', err)                     
                }
    
              )
          }catch(err){
            this.$store.commit('SET_PROCESSING',false)
            console.info('CarsList4', err)            
          }        
      },      


      setAddDialog(){
        if (this.pTrainId) {
          this.editedItem = Object.assign({},this.defaultItem)
          this.dialog = true
        }else {
          this.dialog = false
          alert('Необходимо выбрать состав') 
        }
      },
/*
      createCarForTrain(car){
        if (! this.$store.getters.getProtocolSelectedTrainId){
          console.info('method createCarForTrain', 'getProtocolSelectedTrainId is null')
        } else{
          car.train_id = this.pTrainId
          //this.$store.dispatch('CREATE_CAR_FOR_TRAIN',car) 
          console.info('createCarForTrain', this.pTrainId) 
          this.$store.commit('ADD_CAR_TO_LIST',car)  
        }
      },
*/
      removeCarFromTrain(item){
        if ((item)&&(item.train_car_id)){ 
          this.lstCarsRemoveFromSrv.push(item) 
          this.$emit("changedLstDelCars",this.lstCarsRemoveFromSrv)
        }
        const index = this.carsList.indexOf(item)
        this.carsList.splice(index, 1)
      },

      editTrainCar(item){
        if ((item)&&(item.id)){
          console.info('editTrainCar',item) 
        }else{
          console.info('method editTrainCar', 'id is null')          
        }
      },

      getCarLoadingById(id){
        let elem = _.find(this.lstCarLoad,{id:id})
        if (elem) return elem.name 
        else return null
      },
      getCarTypeById(id){        
        let elem = _.find(this.lstCarTypes,{id:id})
        if (elem) return elem.name 
        else return null
      },
      getCarConditingById(id){
        let elem = _.find(this.lstCarCondit,{id:id})
        if (elem) return elem.name 
        else return null
      },

      editItem (item) {        
        if (this.pTrainId){
          this.editedIndex = this.trainCars.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialog = true        
        }else{
          this.dialog = false
          alert('Необходимо выбрать состав')          
        }
        
      },

      deleteItem (item) {        
        if (confirm('Вы уверены что хотите удалить вагон '+item.car_reg_number+' из списка?')){
          this.removeCarFromTrain(item)
        }         
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        /*
        if ((!this.editedItem)||(!this.editedItem.car_reg_number)){
          alert('Для сохранения вагона необходимо указать его регистрационный номер!')          
          return
        }
        */ 

        if (this.editedIndex > -1) {
          //this.editItem(this.editedItem)
          Object.assign(this.trainCars[this.editedIndex], this.editedItem)
        } else {
          this.trainCars.push(this.editedItem)
          //this.createCarForTrain(this.editedItem)
        }

        this.close()
      },


    }
  }



</script>

<style scoped>

</style>


