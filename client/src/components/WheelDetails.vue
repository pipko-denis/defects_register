<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="setDialogVis(false)">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat @click="saveDataAndCloseDialog">Сохранить</v-btn>
          </v-toolbar-items>
        </v-toolbar> 

            <v-card-text>
                <v-container fluid grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-select v-model="editedWheel.car_reg_number" clearable :items="getListCars" item-text="car_reg_number" item-value="id" label="Рег.№ вагона:"></v-select>
                        </v-flex>                
                        <v-flex xs12 sm4>
                            <v-text-field v-model="editedWheel.axis_num" type="number" label="№ оси в составе"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm4>
                            <v-select v-model="editedWheel.side" clearable :items="lstSides" item-text="name" item-value="id" label="Сторона:"></v-select>
                        </v-flex>
                        <v-flex xs12 sm4>
                            <v-text-field v-model="editedWheel.diam" type="number" label="Диаметр пов.катания"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-textarea v-model="editedWheel.wheel_condit" label="Общее состояние колеса"></v-textarea>
                        </v-flex>              
                    </v-layout>

                    <wheel-defects-list></wheel-defects-list>

                </v-container>
            </v-card-text>
       
      </v-card>
    </v-dialog>
</template>

<script>
  import WheelDefectsList from '../components/WheelDefectsList'

  export default {
    components: {
      WheelDefectsList
    },

    data () {
      return {
        lstSides: [{id: 1,name:'левая'},{id: 2,name:'правая'}],        
        
      }
    },

    created(){
        this.setDialogVis(false)
    },
    
    computed:{
        editedWheel(){return this.$store.getters.getEditedWheel},
        editedWheelIndex(){return this.$store.getters.getEditedWheelIndex},
        dialog(){return this.$store.getters.getShowWheelDialog},
        formTitle () {
          if ((this.editedWheel)&&(this.editedWheel.id)) {return  'Редактирование списка дефектов колеса'}
          else{return  'Добавление описания списка дефектов колеса'}        
        },
        getListCars(){return this.$store.getters.getCarsForProtocolSelectedTrain}

    },

    methods:{

        setDialogVis(val){
            this.$store.commit('SET_DEF_DIALOG_VIS',val) 
       },

        saveDataAndCloseDialog(){
          if (this.editedWheel) {
            if (!this.editedWheel.defects) {
              this.editedWheel.defects = []
              this.editedWheel.def_cnt = 0
            }else{
              console.info('saveDataAndCloseDialog', this.editedWheel.defects)
              if (typeof(this.editedWheel.defects) == "Array" ) {
                this.editedWheel.def_cnt = this.editedWheel.defects.length
                this.editedWheel.pic_cnt = 0 
               // this.editedWheel.pic_cnt = _.sumBy(this.editedWheel.defects,'pic_cnt')
              }else{
                 this.editedWheel.def_cnt = 0 
                 this.editedWheel.pic_cnt = 0
              }              
            }
            if (! this.editedWheel.uid) this.editedWheel.uid = this.$uuid.v1()
            let payload = {editedItem: this.editedWheel, editedIndex: this.editedWheelIndex}
            this.$store.commit('SAVE_WHEEL',payload)   
            this.$store.commit('SET_EDITED_WHEEL',{
                  editedWheel: {id: null,car_reg_number: null,axis_num: null,side: null,diam: null,def_cnt: 0,pic_cnt: 0,wheel_condit: null,defects:[]}
                  ,editedIndex: -1})      
            //this.$store.commit('SET_EDITED_WHEEL',{id: null, ord_num: null,dpk_type: null,def_size: null,dpk_categ: null,dpk_posit: null, pic_cnt: null,notes: null, defects: []}) 
            this.setDialogVis(false)          
          }
        },

      editWheel(item){        
        if ((item)&&(item.id)){
          //this.$store.dispatch('EDIT_TRAIN_CAR',item)         
          console.info('method editWheel', 'editing wheel')          
        }else{
          console.info('method editWheel', 'id is null')          
        }
        
      },

    }

  }
</script>