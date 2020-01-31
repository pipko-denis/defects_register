<template>
  <div v-if="this.$store.getters.getIsAuth"> 
    <h1>Список протоколов</h1>  
    <v-toolbar flat color="white">      
      <v-text-field v-model="search" append-icon="search" label="Поиск" single-line hide-details></v-text-field>    
      <v-spacer></v-spacer>



      
      
      <v-dialog v-model="dialog" fullscreen hide-overlay transition>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2 hidden-sm-and-down mr-1" v-on="on" ><v-icon>add</v-icon>Создать протокол</v-btn>          
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
            <v-btn flat @click="exportProtocolPdf" ><v-icon dark>ptint</v-icon>Печать</v-btn>
            <v-btn flat @click="save" v-if="(($store.getters.getUserId === this.editedItem.create_user)) || ((this.editedItem)&&(!this.editedItem.id))">Сохранить</v-btn>
          </v-toolbar-items>         
        </v-toolbar> 

            <v-layout wrap>
              <v-flex xs12 >
                <v-expansion-panel  class="pa-1">

                      <v-layout wrap class="pb-3">
                        <v-flex xs1 sm1       class="pr-1 pl-1"><v-text-field v-model="editedItem.id" :readonly="true" label="ID"></v-text-field></v-flex>  
                        <v-flex xs11 sm7      class="pr-1 pl-1">
                          <v-select  clearable v-model="editedItem.place_id"  :items="places" item-text="name" item-value="id" label="Место проведения"></v-select>
                        </v-flex>
                        
                        <v-flex xs12 sm4      class="pr-1 pl-1">
                          <v-dialog ref="dialogRegTime" v-model="modal3" :return-value.sync="editedItem.pass_reg_time" persistent lazy full-width min-width="250px" max-width="290px">
                              <template v-slot:activator="{ on }">
                                  <v-text-field v-model="computedPassRegTime"  label="Время прохождения через изм.участок" prepend-icon="access_time" clearable readonly v-on="on"></v-text-field>
                              </template>
                              <v-time-picker v-if="modal3" v-model="editedItem.pass_reg_time" full-width format="24hr" use-seconds >
                                  <v-spacer></v-spacer>                                    
                                  <v-btn color="primary" @click="$refs.dialogRegTime.save(editedItem.pass_reg_time)">Применить</v-btn>
                                  <v-btn  @click="modal3 = false">Отмена</v-btn>
                              </v-time-picker>
                          </v-dialog>                      
                        </v-flex>
                        
                        <v-flex xs12 sm4 md4 class="pr-1 pl-1">                          
                          <v-dialog ref="dialogDate" v-model="modal0" :return-value.sync="editedItem.prot_dat" persistent lazy full-width width="250px">
                              <template v-slot:activator="{ on }">
                                  <v-text-field v-model="computedDtExec" label=" Дата проведения осмотра" prepend-icon="event" clearable readonly v-on="on"></v-text-field>
                              </template>
                              <v-date-picker v-if="modal0" no-title v-model="editedItem.prot_dat" full-width>
                                  <v-spacer></v-spacer>                                    
                                  <v-btn color="primary" @click="$refs.dialogDate.save(editedItem.prot_dat)">Применить</v-btn>
                                  <v-btn  @click="modal0 = false">Закрыть</v-btn>
                              </v-date-picker>
                          </v-dialog>
                          </v-flex>

                        <v-flex xs12 sm4 md4 class="pr-1 pl-1">
                                <v-dialog ref="dialogFrom" v-model="modal1" :return-value.sync="editedItem.prot_time_from" persistent lazy full-width width="250px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="computedTimeBeg"  label=" c " prepend-icon="access_time" clearable readonly v-on="on"></v-text-field>
                                    </template>
                                    <v-time-picker v-if="modal1" v-model="editedItem.prot_time_from"  full-width format="24hr" >
                                        <v-spacer></v-spacer>                                    
                                        <v-btn color="primary" @click="$refs.dialogFrom.save(editedItem.prot_time_from)">Применить</v-btn>
                                        <v-btn  @click="modal1 = false">Отмена</v-btn>
                                    </v-time-picker>
                                </v-dialog>
                          </v-flex>

                        <v-flex xs12 sm4 md4 class="pr-1 pl-1">                                
                          <v-dialog ref="dialogTo" v-model="modal2" :return-value.sync="editedItem.prot_time_to" persistent lazy full-width min-width="250px" max-width="290px">
                              <template v-slot:activator="{ on }">
                                  <v-text-field v-model="computedTimeEnd"  label=" по " prepend-icon="access_time" clearable readonly v-on="on"></v-text-field>
                              </template>
                              <v-time-picker v-if="modal2" v-model="editedItem.prot_time_to" full-width format="24hr" >
                                  <v-spacer></v-spacer>                                    
                                  <v-btn color="primary" @click="$refs.dialogTo.save(editedItem.prot_time_to)">Применить</v-btn>
                                  <v-btn  @click="modal2 = false">Отмена</v-btn>
                              </v-time-picker>
                          </v-dialog>
                        </v-flex>
                        
                        <v-flex xs12 sm6     class="pr-1 pl-1"><v-text-field v-model="editedItem.inspector_first" label="ФИО и должность осматривающего"></v-text-field></v-flex>
                        <v-flex xs12 sm6     class="pr-1 pl-1"><v-text-field v-model="editedItem.inspector_second" label="ФИО и должность осматривающего"></v-text-field></v-flex>                
                      </v-layout> 

                  <v-expansion-panel-content ripple>                        
                      <v-divider class="mx-0 primary" horizontal></v-divider>
                      <template v-slot:header ><div class="headline"> Информация о составе</div></template>
                      <v-layout wrap>
                        <v-flex xs12 sm6 class="pl-1">
                          <v-layout wrap>
                            <v-flex xs11>
                              <v-select @change="getCarsForTrain"  clearable v-model="editedItem.train_id"  :items="trains" item-text="train_number" item-value="id" label="Номер состава"></v-select>
                            </v-flex>                
                            <v-flex xs1>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn fab small dark color="secondary" class="mb-2" @click="setAddTrainDialog" v-on="on"><v-icon>add</v-icon></v-btn>   
                                </template>
                                <span>Создать состав</span>
                              </v-tooltip> 
                            </v-flex>                          
                          </v-layout> 
                        </v-flex>

    <v-flex xs12 sm6 class="pl-1">

      <v-dialog ref="dialogTo" v-model="addCarDialog" persistent max-width="500px">

        <v-card>           
         <v-card-title class="primary white--text" >            
           <span class="headline">Создание вагона</span>
        </v-card-title>
        <v-divider class="mx-0 primary" horizontal></v-divider> 
        <v-card-text>
            <v-container grid-list-md>
                <v-layout wrap>
                <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedCarItem.car_reg_number" label="Рег.№ вагона"></v-text-field>
                </v-flex>                
                <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedCarItem.ord_num" type="number" label="Пор. номер"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedCarItem.car_year" type="number" label="Год выпуска"></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-select v-model="editedCarItem.car_type" clearable :items="lstCarTypes" item-text="name" item-value="id" label="Тип вагона:"></v-select>
                </v-flex>              
                </v-layout>
            </v-container>
        </v-card-text>
          <v-divider class="mx-0 primary" horizontal></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="primary white--text" @click="saveCar()">Создать</v-btn>
            <v-btn   @click="addCarDialog=false">Отмена</v-btn>            
          </v-card-actions>
        </v-card>
      </v-dialog>

                          <v-layout wrap>
                            <v-flex xs11>
                              <v-select  clearable v-model="editedItem.car_id" no-data-text="Список вагонов пуст"  :items="cars" item-text="car_reg_number" item-value="id" label="Вагон"></v-select> 
                            </v-flex>

                            <v-flex xs1 ms1>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn fab small dark color="secondary" class="mb-2" @click="setAddCarDialog" v-on="on"><v-icon>add</v-icon></v-btn>   
                                </template>
                                <span>Создать вагон</span>
                              </v-tooltip> 
                            </v-flex>         
                          </v-layout> 
                        </v-flex>                        
                                                                 
                        <v-flex xs12 sm6     class="pr-1 pl-1">
                          <v-select  clearable v-model="editedItem.car_condit"  :items="conditions" item-text="name" item-value="id" label="Состояние"></v-select>
                        </v-flex>
                        <v-flex xs12 sm6     class="pr-1 pl-1">
                          <v-select  clearable v-model="editedItem.car_loading"  :items="loadings" item-text="name" item-value="id" label="Загрузка"></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 md4 class="pr-1 pl-1"><v-text-field v-model="editedItem.axis_num" type="number" label="№ оси в составе"></v-text-field></v-flex>
                        <v-flex xs12 sm6 md4 class="pr-1 pl-1">
                          <v-select  clearable v-model="editedItem.side"  :items="sides" item-text="name" item-value="id" label="Сторона"></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 md4 class="pr-1 pl-1"><v-text-field v-model="editedItem.diam" type="number" label="Диаметр поверхности катания, см"></v-text-field></v-flex>
                        <v-flex xs12         class="pr-1 pl-1"><v-textarea v-model="editedItem.wheel_condit" label="Общее состояние колеса и поверхности катания"></v-textarea></v-flex>

<!--НАЧАЛО Отображение основных снимков протокола -->
<!--
                    <v-flex xs12>
                      <v-layout wrap>
                          <v-flex xs3><v-text-field v-model="editedIndex.imageTrain"  label="Фотография вагона"></v-text-field></v-flex>
                          <v-flex xs1><v-btn class="primary white--text" fab small @click="onTrainFilePick"><v-icon>image</v-icon></v-btn></v-flex>
                          <input id="imgTrain" type="file" ref="fileTrain" accept="image/*" style="display: none" single  @change="onFileTrainPicked">
                          
                          <v-flex xs3><v-text-field v-model="editedIndex.imageTrain"  label="Фотография колёсной пары"></v-text-field></v-flex>
                          <v-flex xs1><v-btn class="primary white--text" fab small @click="onTrainFilePick"><v-icon>image</v-icon></v-btn></v-flex>
                          <input id="imgTrain" type="file" ref="fileTrain" accept="image/*" style="display: none" single  @change="onFileTrainPicked">

                          <v-flex xs3><v-text-field v-model="editedIndex.imageTrain"  label="Фотография маркировки"></v-text-field></v-flex>
                          <v-flex xs1><v-btn class="primary white--text" fab small @click="onTrainFilePick"><v-icon>image</v-icon></v-btn></v-flex>
                          <input id="imgTrain" type="file" ref="fileTrain" accept="image/*" style="display: none" single  @change="onFileTrainPicked">

                          <v-flex xs5><v-text-field v-model="editedIndex.imageTrain"  label="Фотография общего вида с дефектами"></v-text-field></v-flex>
                          <v-flex xs1><v-btn class="primary white--text" fab small @click="onTrainFilePick"><v-icon>image</v-icon></v-btn></v-flex>
                          <input id="imgTrain" type="file" ref="fileTrain" accept="image/*" style="display: none" single  @change="onFileTrainPicked">

                          <v-flex xs5><v-text-field v-model="editedIndex.imageTrain"  label="Фотография натурного листа"></v-text-field></v-flex>
                          <v-flex xs1><v-btn class="primary white--text" fab small @click="onTrainFilePick"><v-icon>image</v-icon></v-btn></v-flex>
                          <input id="imgTrain" type="file" ref="fileTrain" accept="image/*" style="display: none" single  @change="onFileTrainPicked">
                      </v-layout> 
                    </v-flex>
-->                    
<!--КОНЕЦ Отображение основных снимков протокола -->

                      </v-layout>    
                  </v-expansion-panel-content>               
                  
                  <v-expansion-panel-content ripple>                        
                      <v-divider class="mx-0 primary" horizontal></v-divider>
                      <template v-slot:header ><div class="headline"> Список дефектов</div></template>
                      <v-layout wrap>
                        <defects-list :pInitDefects=listDefects :pInitRemDefects=listRemDefects></defects-list>                          
                      </v-layout>    
                  </v-expansion-panel-content>               
                  <v-expansion-panel-content ripple v-if="this.editedItem.id">                        
                      <v-divider class="mx-0 primary" horizontal></v-divider>                      
                      <template v-slot:header ><div class="headline"> Фотографии дефектов</div></template>
                      <v-layout wrap>
                        <v-carousel :cycle=false>
                          <v-carousel-item v-for="(item,i) in editedItemimages" :key="i" :src="apiUrl+item.path">
                            <div style="z-index:1;position:absolute;background: rgba(239, 108, 0, .6);width:100%;">
                              <ul class="white--text" style="list-style: none;">
                                <li><b>Порядковый номер дефекта:</b> {{item.ord_num}}. <b>Размер:</b> {{item.def_size}} мм</li>
                                <li><b>Вид ДПК:</b> {{getElemNameInListById(lstDpkType,item.dpk_type)}}. <b>Категория ДПК:</b> {{getElemNameInListById(lstDpkCateg,item.dpk_categ)}}.</li>
                                <li>Изображение: <a :href="apiUrl+item.path" target="blank" class="white--text"><b>{{item.file_name}}</b></a></li>                             
                              </ul>  
                              <v-btn outline small absolute bottom right fab color="white" class="mb-4"  @click.prevent="removePic(item)" v-if="(($store.getters.getUserId === editedItem.create_user))"><v-icon>delete</v-icon></v-btn>
                            </div>
                          </v-carousel-item>
                        </v-carousel>                                                
                      </v-layout>    
                  </v-expansion-panel-content>               
                </v-expansion-panel>                

              </v-flex>
            </v-layout>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-data-table :headers="headers" :items="protocols" :search="search" :hide-actions="true" rows-per-page-text="Строк на странице" 
        no-data-text="Данные отсутствуют" no-results-text="Ничего не найдено" class="elevation-1">
      <template v-slot:items="props">
        <td class="text-xs-left">{{ "0000"+props.item.id}}</td>
        <td class="text-xs-left">{{ formatDate(props.item.prot_dat)}}</td>
        <td class="justify-center layout px-0">
          <v-icon small :disabled="getProcessing" class="mr-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon class="mr-2" v-if="($store.getters.getUserId === props.item.create_user)" small :disabled="getProcessing" @click="copyItem(props.item)">file_copy</v-icon>
          <v-icon class="mr-2" v-if="($store.getters.getUserId === props.item.create_user)" small :disabled="getProcessing" @click="deleteItem(props.item)">delete</v-icon>          
        </td>
        <td class="text-xs-left">{{ 'с '+(props.item.prot_time_from || '--')+' по '+(props.item.prot_time_to || '--') }}</td>
        <td class="text-xs-left">{{ getPlaceById(props.item.place_id) }}</td>        
        <td>{{ props.item.train_number }}</td>
        <td>{{ props.item.car_reg_number }}</td>
        <td class="text-xs-left">{{ getCarTypeById(props.item.car_type) }}</td>
        <td class="text-xs-left">{{ props.item.car_year }}</td>
        <td class="text-xs-left">{{ getCarConditById(props.item.car_condit) }}</td>
        <td class="text-xs-left">{{ getCarLoadById(props.item.car_loading) }}</td>
        <td class="text-xs-left">{{ props.item.axis_num }}</td>
        <td class="text-xs-left">{{ getWheelSideById(props.item.side) }}</td>
        <td class="text-xs-left">{{ props.item.diam }}</td>
        <td class="text-xs-left">{{ (props.item.def_cnt || '0')+'/'+(props.item.pic_cnt || '0') }}</td>  
        <td class="text-xs-left">{{ props.item.inspector_first }}</td>
        <td class="text-xs-left">{{ props.item.inspector_second }}</td>
        <td class="text-xs-left"></td>
      </template>    
      <template v-slot:no-data>
        <v-btn color="primary" @click="getProtocolsFormSrv">Перезагрузить список</v-btn>
      </template>
    </v-data-table>
  </div>
</template>


<script>

import CarsService from '../services/CarsService'
import DefectsService from '../services/DefectsService'
import DefectsList from './WheelDefectsList'
import ImageService from '@/services/ImageService'
import config from '@/config'
import jsPDF from 'jspdf'
//:pInitDefectsList="[]"

  export default {

    components:{
      CarsService,
      DefectsList,
      ImageService,
    },

    data: () => ({
      search: '', 
      /*
      rowsPerPageItems: [25,50,{"text":"Все","value":-1}], :rows-per-page-items="rowsPerPageItems"*/
      dialog: false,
      addTrainDialog: false,
      addCarDialog: false,
      modal0: false,modal1: false,modal2: false, modal3: false,
      selectedProtocolId:-1,
      editedIndex: -1,
      editedItemimages:[],  
      
      editedCarItem:  {car_reg_number: null,car_type: 0,ord_num: 0,car_year: 0},
      defaultCarItem: {car_reg_number: null,car_type: 0,ord_num: 0,car_year: 0},
                      
      carsList:[],
      listDefects: [],
      listRemDefects: [],
      headers: [        
        { text: 'Номер протокола', align: 'left',value: 'prot_dat', sortable: true , width: "1%" },
        { text: 'Дата осмотра', align: 'left',value: 'prot_dat', sortable: true , width: "1%"},   
        { text: '', value: '', sortable: false },     
        { text: 'Время осмотра', align: 'left',value: 'prot_time_from', sortable: true , width: "1%"},
        { text: 'Место осмотра', align: 'left',value: 'props.item.place_id', sortable: true , width: "1%"},        
        { text: 'Номер состава', align: 'left',value: 'train_number', sortable: true , width: "1%"},
        { text: 'Рег.№ вагона', align: 'left',value: 'car_reg_number', sortable: true , width: "1%"},
        { text: 'Тип вагона', align: 'left', value: 'car_type', sortable: true , width: "1%"}, 
        { text: 'Год выпуска вагона', align: 'left', value: 'car_year', sortable: true , width: "1%"}, 
        { text: 'Состояние вагона', align: 'left', value: 'car_condit', sortable: true , width: "1%"},   
        { text: 'Загрузка вагона', align: 'left', value: 'car_loading', sortable: true , width: "1%"},
        { text: '№ оси', align: 'left', value: 'axis_num', sortable: true , width: "1%"},
        { text: 'Сторона', align: 'left', value: 'side', sortable: true , width: "1%"},
        { text: 'Диаметр пов.катания', align: 'left', value: 'diam', sortable: true , width: "1%"},
        { text: 'Кол.деф./фото', align: 'left', value: 'def_cnt', sortable: false , width: "1%"},
        { text: 'Исполнитель', align: 'left', value: 'inspector_first', sortable: false , width: "1%" },
        { text: 'Исполнитель', align: 'left', value: 'inspector_second', sortable: false , width: "1%" },
        { text: '', value: '', sortable: false }, 
      ],
      
      
      defaultItem: { id: null, place_id: null, prot_dat: null,prot_time_from: null,prot_time_to: null ,inspector_first: null, inspector_second: null ,train_id: null, train_number: null,pass_reg_dt: null
      , pass_reg_time: null, car_id: null, car_reg_number: null,car_condit: null, car_loading: null, axis_num: null,side: null, diam: null, wheel_condit: null, def_cnt: null,pic_cnt: null},
      editedItem:  { id: null, place_id: null, prot_dat: null,prot_time_from: null,prot_time_to: null ,inspector_first: null, inspector_second: null,train_id: null, train_number: null,pass_reg_dt: null
      , pass_reg_time: null, car_id: null, car_reg_number: null,car_condit: null, car_loading: null, axis_num: null,side: null, diam: null, wheel_condit: null, def_cnt: null,pic_cnt: null},
    }),

    computed: {  
      protocols(){
            //console.info('protocols', this.$store.getters.getProtocols)
            return this.$store.getters.getProtocols
      },
      lstCarTypes(){return this.$store.getters.getListCarTypes},      

      formTitle () {return this.editedIndex === -1 ? 'Добавление протокола' : 'Редактирование протокола'},  
      lstDpkType(){return this.$store.getters.getListDpkType},
      lstDpkCateg(){ return this.$store.getters.getListDpkCateg},
      places(){return this.$store.getters.getPlaces},
      trains(){return this.$store.getters.getTrains},
      conditions(){return this.$store.getters.getListCarCondit},
      loadings(){return this.$store.getters.getListCarLoad},
      sides(){return this.$store.getters.getListSides},
      cars(){return this.carsList},
      apiUrl(){return config.apiUrl},

      computedDtExec: {
          get: function(){                    
              if (this.editedItem.prot_dat)
              return this.formatDate(this.editedItem.prot_dat)
              else return null
          },
          set: function(newValue){
              this.editedItem.prot_dat = newValue
          }
      },
      computedTimeBeg: {
          get: function(){                    
              if (this.editedItem.prot_time_from)
              return this.editedItem.prot_time_from
              else return null
          },
          set: function(newValue){
              this.editedItem.prot_time_from = newValue
          }
      },
      computedPassRegTime: {
        get: function(){                    
              if (this.editedItem.pass_reg_time)
              return this.editedItem.pass_reg_time
              else return null
          },
          set: function(newValue){
              this.editedItem.pass_reg_time = newValue
          }
      },
      computedTimeEnd: {
          get: function(){                    
              if (this.editedItem.prot_time_to)
              return this.editedItem.prot_time_to
              else return null
          },
          set: function(newValue){
              this.editedItem.prot_time_to = newValue
          }
      },      

      getProcessing(){
        return this.$store.getters.getProcessing
      },

    },

    mounted(){     
      //console.info('ProtocolsList config', config.apiUrl) 
      this.getProtocolsFormSrv()  
      this.getTrainsFormSrv()  
    },


    watch: {
      editedItem (val) {
        //console.info('watch', this.editedIndex)        
        this.getCarsForTrain()
        this.getDefectsByProt()
        this.getImagesByProtocol()
        if (this.editedIndex === -1){
          val.inspector_first = this.getCurrentUser()
        }
      },
      dialog (val){
        if ((val)&&(this.editedIndex === -1)){
          this.editedItem.inspector_first = this.getCurrentUser()
        }
      }
    },    

    methods: { 

      exportProtocolPdf(){
        var doc = new jsPDF()
        
        doc.text('Hello world!', 10, 10)
        doc.save('a4.pdf')
      },

      onTrainFilePick(){
                this.$refs.fileTrain.click()
      },
      onFileTrainPicked(){
          if (!this.editedItem) return alert("Не удалось опредить протокол для прикрепления снимка")          

          let fl = event.target.files

          console.info('file', fl[0])
          let fileReader = new FileReader()
          fileReader.addEventListener('load',() => {   
            this.editedIndex.imageTrain = {imageUrl: fileReader.result,id: fl[0].name,file: fl[0]}
          })
          fileReader.readAsDataURL(fl[0])                    
      },

      removePic(item){
          if (confirm('Вы уверены что хотите удалить фотографию '+item.file_name+' дефекта с пор.номером '+item.ord_num+' ?')){
            //console.info('removePic item', item) 
            this.$store.commit('SET_PROCESSING',true)  
            this.$store.commit('SET_ERROR_CLEAN')            
            try{                      
                ImageService.deleteImage({id: item.id})
                .then(result => {           
                    console.info('removePic', result.data.message)
                    if (result.data.message.code != 0) {
                        this.$store.commit('SET_PROCESSING',false)
                        this.$store.commit('SET_ERROR',result.data.message) 
                    }else{                    
                        this.$store.commit('SET_PROCESSING',false)
                            this.$store.commit('SET_MESSAGE',result.data.message)                        

                            const index = this.editedItemimages.indexOf(item)
                            this.editedItemimages.splice(index, 1)  

                            alert(result.data.message.text)                            
                    }
                }
                )
                .catch(err => {                     
                    this.$store.commit('SET_PROCESSING',false)     
                    this.$store.commit('SET_ERROR',err)            
                }
    
                )
            }catch(err){
                this.$store.commit('SET_PROCESSING',false)
                this.$store.commit('SET_ERROR',err) 
            }
        } 
      },

      setAddTrainDialog(){
        this.addTrainDialog = true
      },

      setAddCarDialog(){
        this.addCarDialog = true
      },

      saveCar(){
        //alert('Сохранение вагона')
        /*
        if (!this.editedItem.train_Id){
          alert('Для сохранения вагона необходимо заполнить поле "Номер состава"!')          
          return
        }
        
        if ((!this.editedCarItem)||(!this.editedCarItem.car_reg_number)){
          alert('Для сохранения вагона необходимо указать его регистрационный номер!')          
          return
        } 
        */
        let tmpItem = Object.assign({},this.editedCarItem)
        tmpItem.train_id = this.editedItem.train_id

///new
          this.$store.commit('SET_PROCESSING',true)  
          this.$store.commit('SET_ERROR_CLEAN')  
          try{                      
            CarsService.addTrainCar(tmpItem)
              .then(result => {    
                  if (result.data.message.code != 0) {
                    this.$store.commit('SET_PROCESSING',false)
                    this.$store.commit('SET_ERROR',result.data.message)
                  }else{                                        
                    this.$store.commit('SET_PROCESSING',false)
                    tmpItem.train_car_id  = result.data.data.id
                    tmpItem.id = result.data.data.carid
                    this.$store.commit('SET_MESSAGE',result.data.message)                    
                    if ((this.editedItem)&&(this.editedItem.train_id == tmpItem.train_id)&&(this.carsList)){
                      this.carsList.push(tmpItem)
                    }
                    
                  }
                }
              )
              .catch(err => {                     
                  this.$store.commit('SET_PROCESSING',false)     
                  this.$store.commit('SET_ERROR',err)            
                }
    
              )
          }catch{
            this.$store.commit('SET_PROCESSING',false)
          }

//new end
        this.editedCarItem = Object.assign({},this.defaultCarItem)        
        this.addCarDialog = false
      },

      saveTrain(){
        alert('Сохранение состава')
        this.addTrainDialog = false
      },

      setCarId(){
        let elem = _.find(this.cars,{id: 9})
        console.info('founded elem',this.cars,this.editedItem.car_id,elem)
      },

      save () {        
        if ((this.listDefects)&&(this.listDefects.length)) {
          this.editedItem.def_cnt = this.listDefects.length
          let cntPic = this.editedItem.pic_cnt + this.editedItemimages.length
          //console.info('save protocol before editedItemimages.length=',this.editedItemimages.length)
          this.listDefects.forEach(element => {
            if ((element.images)&&(element.images.length)){
              cntPic+=element.images.length
            }
          }); 
          //console.info('save protocol after element.images.length=',cntPic) 
          this.editedItem.pic_cnt = cntPic
        }
        let payload = {protocol: this.editedItem,
                      defects: this.listDefects, rDefects: this.listRemDefects}
        console.info('save protocol ',payload)  
        //this.$store.dispatch('SAVE_TRAIN',payload)
        this.$store.dispatch('SAVE_PROTOCOL',payload)  
        this.close()
      },


      getCarsForTrain(){
          this.carsList = []
          if ((!this.editedItem)||(!this.editedItem.train_id)||(this.editedItem.train_id < 1)) return null
          this.$store.commit('SET_PROCESSING',true)  
          try{                      
            CarsService.getCarsByTrain({trainId: this.editedItem.train_id})
              .then(result => {           
                  if (result.data.message.code != 0) {
                    this.$store.commit('SET_PROCESSING',false)
                    this.$store.commit('SET_ERROR',result.data.message)            
                  }else{                    
                    this.$store.commit('SET_PROCESSING',false)
                    this.carsList = result.data.data
                    //console.info('this.carsList=',this.carsList)
                    //let elem = _.find(this.carsList,{id: this.editedItem.car_id})
                    //console.info('founded elem',elem,this.editedItem.car_id)
                    //this.selectedCarId = elem
                    this.$store.commit('SET_MESSAGE',result.data.message)    
                  }
                }
              )
              .catch(err => {                     
                  this.$store.commit('SET_PROCESSING',false)     
                  this.$store.commit('SET_ERROR',err)   
                }
    
              )
          }catch (err){
            this.$store.commit('SET_ERROR',err)           
            this.$store.commit('SET_PROCESSING',false)
          }

      },

      getDefectsByProt(){
          this.listDefects = []
          if ((!this.editedItem)||(!this.editedItem.id)||(this.editedItem.id < 1)) return null
          this.$store.commit('SET_PROCESSING',true)  
          try{                      
            DefectsService.getDefectsByProtocol({id: this.editedItem.id})
              .then(result => {           
                  if (result.data.message.code != 0) {
                    this.$store.commit('SET_PROCESSING',false)
                    this.$store.commit('SET_ERROR',result.data.message)            
                  }else{                    
                    this.$store.commit('SET_PROCESSING',false)
                    this.listDefects = result.data.data
                    this.$store.commit('SET_MESSAGE',result.data.message)    
                  }
                }
              )
              .catch(err => {                     
                  this.$store.commit('SET_PROCESSING',false)     
                  this.$store.commit('SET_ERROR',err)   
                }
    
              )
          }catch (err){
            this.$store.commit('SET_ERROR',err)           
            this.$store.commit('SET_PROCESSING',false)
          }

      },

      getImagesByProtocol(){
          this.editedItemimages = []
          if ((!this.editedItem)||(!this.editedItem.id)||(this.editedItem.id < 1)) return null 
          this.$store.commit('SET_PROCESSING',true)  
          try{                      
            ImageService.getImagesByProtocol({id: this.editedItem.id})
              .then(result => {           
                  if (result.data.message.code != 0) {
                    this.$store.commit('SET_PROCESSING',false)
                    this.$store.commit('SET_ERROR',result.data.message)            
                  }else{                    
                    this.$store.commit('SET_PROCESSING',false)
                    this.editedItemimages = result.data.data
                    this.$store.commit('SET_MESSAGE',result.data.message)    
                  }
                }
              )
              .catch(err => {                     
                  this.$store.commit('SET_PROCESSING',false)     
                  this.$store.commit('SET_ERROR',err)   
                }
    
              )
          }catch (err){
            this.$store.commit('SET_ERROR',err)           
            this.$store.commit('SET_PROCESSING',false)
          }

      },
        
      editItem (item) {
        this.editedIndex = this.protocols.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.selectedProtocolId = item.id   
        //this.selectedTrainId = item.train_id
        //this.$store.dispatch('GET_CARS_FROM_SRV_BY_TRAIN',{trainid: item.id}) 
        this.dialog = true
      },

      deleteItem (item) {        
        if (confirm('Вы уверены что хотите удалить данные по протоколу из списка?')){
          console.log('deleteItem',item)
          this.$store.dispatch('DELETE_PROTOCOL',item) 
        }
      },

      copyItem (item) {               
        if (confirm('Вы уверены что хотите создать копию выбранного протокола № 000'+item.id+' ?')){
          console.log('copyItem',item)
          this.$store.dispatch('COPY_PROTOCOL',item) 
        }        
      },

      getCurrentUser(){
        return this.$store.getters.getUserName + ', '+this.$store.getters.getPosition
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          /*
          let newItem = Object.assign({}, this.defaultItem)
          this.editedItem = Object.assign(newItem, {inspector_first: this.$store.getters.getUserName})
          this.editedItem = Object.assign({}, newItem) //this.defaultItem)
          */
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
          this.selectedTrainId = -1
          this.listDefects = [],
          this.listRemDefects = [],
          this.listDefectPics = [],
          this.listRemDefectPics = [],
          this.lstCars = []
        }, 300)
      },

      //ФОРМАТИРОВАНИЕ И Т.П.

      getProtocolsFormSrv(){
        this.$store.dispatch('GET_PROTOCOLS_FROM_SRV')            
      }, 
      getTrainsFormSrv(){
        this.$store.dispatch('GET_TRAINS_FROM_SRV')            
      },

      getElemNameInListById(list,id){
        let elem = _.find(list,{id:id})
        if (elem) return elem.name 
        else return null
      },

      getWheelSideById(id){
          let elem = _.find(this.$store.getters.getListSides,{id:id})
          if (elem) return elem.name 
          else return null
      },
      getCarConditById(id){
        let elem = _.find(this.$store.getters.getListCarCondit,{id:id})
        if (elem) return elem.name 
        else return null
      },
      getCarLoadById(id){
        let elem = _.find(this.$store.getters.getListCarLoad,{id:id})
        if (elem) return elem.name 
        else return null
      },
      getCarTypeById(id){
        let elem = _.find(this.$store.getters.getListCarTypes,{id:id})
        if (elem) return elem.name 
        else return null
      },     
      getPlaceById(id){        
        let elem = _.find(this.$store.getters.getPlaces,{id:id})
        //console.info('place_id', elem)
        if (elem) return elem.name 
        else return null
      },
      formatDate (date) {
          if (!date) return null
        
          const [year, month, day] = date.split('-')
          return `${day}.${month}.${year}`
      }, 


    }
  }


</script>

<style scoped>
  table.v-table tbody td:first-child, table.v-table tbody td:not(:first-child), table.v-table tbody th:first-child, table.v-table tbody th:not(:first-child), table.v-table thead td:first-child, table.v-table thead td:not(:first-child), table.v-table thead th:first-child, table.v-table thead th:not(:first-child) {
    padding: 0 10px
  }
</style>


