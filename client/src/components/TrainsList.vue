<template>
  <div v-if="this.$store.getters.getIsAuth"> 
    <h1>Список составов</h1>  

    <v-toolbar flat color="white">      
      <v-text-field v-model="search" append-icon="search" label="Поиск" clearable single-line hide-details></v-text-field>   
      <v-spacer></v-spacer> 


      <v-dialog v-model="dialog" fullscreen hide-overlay transition>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2 hidden-sm-and-down mr-1" v-on="on" ><v-icon>add</v-icon>Создать состав</v-btn>
          <v-btn color="primary" dark class="mb-2 hidden-md-and-up mr-1" v-on="on" ><v-icon>add</v-icon></v-btn>
        </template>
        <v-card>

        <v-toolbar dark color="primary">
          <v-btn icon dark @click="close">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat @click="save">Сохранить</v-btn>
          </v-toolbar-items>
        </v-toolbar> 

          <v-card-text>

              <v-layout wrap>
                <v-flex xs1 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.id" label="ID"></v-text-field>
                </v-flex>  
                <v-flex xs11 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.train_number" label="Номер состава"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.cnt_car_total" label="Всего ПЕ"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.cnt_car_loco" label="из них локо"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.cnt_car" label="из них вагонов"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.cnt_axis_total" label="Всего осей"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.cnt_axis_loco" label="из них осей локо"></v-text-field>
                </v-flex>          
                <v-flex xs12 sm6 md4 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.cnt_axis_car" label="из них осей вагонов"></v-text-field>
                </v-flex>
              </v-layout>
               
            <train-cars-list :pTrainId="this.selectedTrainId" @changedLstCars="changedLstCars" @changedLstDelCars="changedLstDelCars"></train-cars-list>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-toolbar>
    
    <v-data-table :headers="headers" :items="trains" :search="search"  :hide-actions="true" rows-per-page-text="Строк на странице"
        no-data-text="Данные отсутствуют" no-results-text="Ничего не найдено">
      <template v-slot:items="props">
        <td>{{ props.item.train_number }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon small @click="deleteItem(props.item)">delete</v-icon>
        </td>
        <td class="text-xs-left">{{ props.item.cnt_car_total }}</td>        
        <td class="text-xs-center">{{ props.item.cnt_car_loco }}</td>
        <td class="text-xs-center">{{ props.item.cnt_car }}</td>
        <td class="text-xs-center">{{ props.item.cnt_axis_total }}</td>
        <td class="text-xs-center">{{ props.item.cnt_axis_loco }}</td>
        <td class="text-xs-center">{{ props.item.cnt_axis_car }}</td>
        
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getTrainsFormSrv">Перезагрузить список</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>

import TrainCarsList from './TrainCarsList'

export default {
    components: {
        TrainCarsList,
    },
    data: () => ({
      selectedTrainId: -1,
      dialog: false,
      search: null,
      rowsPerPageItems: [/*25,50,*/{"text":"Все","value":-1}],
      headers: [
        {text: 'Номер состава',align: 'left',sortable: true, value: 'train_number'},
        { text: '', align: 'left',value: '', sortable: false },
        { text: 'Всего вагонов', align: 'left',value: 'cnt_car_total' },
        { text: 'из них локо', align: 'left',value: 'cnt_car_loco' },
        { text: 'из них вагонов', align: 'left',value: 'cnt_car' },
        { text: 'Всего осей', align: 'left',value: 'cnt_axis_total' },
        { text: 'из них локо', align: 'left',value: 'cnt_axis_loco'},
        { text: 'из них вагонов', align: 'left',value: 'cnt_axis_car' },
      ],
      editedIndex: -1,
      editedItem: {
        id: null,  
        train_number: null,
        cnt_car_total: null,
        cnt_car_loco: null,
        cnt_car: null,
        cnt_axis_total: null,
        cnt_axis_loco: null,
        cnt_axis_car: null
      },
      defaultItem: {
        id: null,  
        train_number: null,
        cnt_car_total: null,
        cnt_car_loco: null,
        cnt_car: null,
        cnt_axis_total: null,
        cnt_axis_loco: null,
        cnt_axis_car: null
      },
      lstDelCars: [],
      lstCars: [],
    }),



    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Добавление состава' : 'Редактирование состава'
        },
        trains(){
            //console.info('trains', this.$store.getters.getTrains)
            return this.$store.getters.getTrains
        },
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    methods: {

      changedLstCars(event){
          this.lstCars = event
          //console.info('TrainsList changedLstCars',this.lstCars)
      },
      changedLstDelCars(event){
          this.lstDelCars = event
          console.info('TrainsList changedLstDelCars',this.lstDelCars)
      },

      getTrainsFormSrv(){
        this.$store.dispatch('GET_TRAINS_FROM_SRV')            
      },

      editItem (item) {
        this.editedIndex = this.trains.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.selectedTrainId = item.id        
        this.$store.dispatch('GET_CARS_FROM_SRV_BY_TRAIN',{trainid: item.id}) 
        console.info('editItem this.selectedTrainId=',this.selectedTrainId)        
        this.dialog = true
      },

      deleteItem (item) {
        //const index = this.trains.indexOf(item)
        //if confirm('Are you sure you want to delete this item?') && this.trains.splice(index, 1)
        if (confirm('Вы уверены что хотите удалить состав со всем списком вагонов?')){
            if (item.id){
                this.$store.dispatch('DEL_TRAIN',item)
            }else{
                this.$store.commit('DEL_TRAIN',item)
            }
        }
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
          this.selectedTrainId = -1
        }, 300)
      },

      save () {        
        let payload = {train: this.editedItem, cars: this.lstCars, rCars: this.lstDelCars}
        console.info('save train',payload)  
        this.$store.dispatch('SAVE_TRAIN',payload) 
        this.close()
      }
    },

    mounted() {
        this.getTrainsFormSrv()
    },

  }
   
</script>

<style scoped>

</style>