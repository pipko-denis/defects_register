<template>
<v-layout wrap>
<!---->

    <v-toolbar flat color="white">      
      <v-text-field v-model="search" append-icon="search" label="Поиск" single-line hide-details></v-text-field>    
      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn fab small dark color="secondary" class="mb-2" @click="setAddDialog" v-on="on"><v-icon>add</v-icon></v-btn>   <!--:disabled="!getProcessing && !getIsTrainSelected"-->
        </template>
        <span>Добавить дефект</span>
      </v-tooltip> 

      <v-dialog v-model="dialog">        
                 
        <v-card>           
         <v-card-title class="primary white--text" >            
           <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-divider class="mx-0 primary" horizontal></v-divider> 
        <v-card-text>
            <v-container grid-list-md>
                <v-layout wrap>
                    <v-flex xs12 sm4 md3>
                        <v-text-field v-model="editedItem.ord_num" type="number" label="Пор. номер"></v-text-field>
                    </v-flex>            
                    <v-flex xs12 sm8 md9 >
                        <v-select v-model="editedItem.dpk_type" clearable :items="lstDpkType" item-text="name" item-value="id" label="Вид ДПК:"></v-select>
                    </v-flex>                    
                    <v-flex xs12 md4>
                        <v-text-field v-model="editedItem.def_lngth" type="number" label="Длинна, мм"></v-text-field>
                    </v-flex>
                    <v-flex xs12 md4>
                        <v-text-field v-model="editedItem.def_width" type="number" label="Ширина, мм"></v-text-field>
                    </v-flex>
                    <v-flex xs12 md4>
                        <v-text-field v-model="editedItem.def_depth" type="number" label="Глубина, мм"></v-text-field>
                    </v-flex>
                    <v-flex xs12 md8>
                        <v-select v-model="editedItem.dpk_categ" clearable :items="lstDpkCateg" item-text="name" item-value="id" return object label="Категория ДПК:"></v-select>                                     
                    </v-flex>
                    <v-flex xs12 md4>
                        <v-text-field v-model="editedItem.dpk_posit" type="number" label="Полож. дефекта на пов.катания, см"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-textarea v-model="editedItem.notes" label="Примечания"></v-textarea>
                    </v-flex>
                    <v-flex xs12 md3>
                        <!--<v-text-field v-model="editedItem.pic_cnt" type="number" label="pic_cnt"></v-text-field>-->
                        <v-btn class="primary white--text" @click="onPickFiles">Прикрепить фотографии</v-btn>
                        <input id="inputImg" type="file" ref="filesInput" style="display: none" accept="image/*" multiple @change="onFilesPicked">
                    </v-flex>
                    <v-flex xs12>
                        <v-card>
                            <v-container grid-list-sm fluid>
                                <v-layout row wrap>
                                    <v-flex v-for="(img,i) in images" :key="i" xs4 sm3 md2 d-flex>                                    
                                        <v-card flat tile class="d-flex" aspect-ratio="1">
                                            <img :src="img.imageUrl" height="150px" width="150px">
                                            <v-btn outline small absolute bottom right fab color="primary" class="mb-4" @click.prevent="removePic(img)"><v-icon>delete</v-icon></v-btn>
                                        </v-card>
                                    </v-flex>                                     
                                </v-layout> 
                            </v-container>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-text>
          <v-divider class="mx-0 primary" horizontal></v-divider> 
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="primary white--text" :disabled="defectNotValid" @click="save">Сохранить</v-btn>
            <v-btn   @click="close">Отмена</v-btn>            
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-show="false" fab small color="secondary" dark class="mb-2" v-on="on"><v-icon>donut_large</v-icon></v-btn>  
        </template>
        <span>Внести данные по осмотру колеса</span>
      </v-tooltip>   
    </v-toolbar>

<!---->
    <v-flex xs12>
        <v-data-table :headers="headers" :items="getWheelDefects" :search="search" class="elevation-1" rows-per-page-text="Строк на странице"
            no-data-text="Ничего не найдено" no-results-text="Данные отсутствуют">
        <template v-slot:items="props">
            <td>{{ props.item.ord_num }}</td>
            <td class="justify-center layout px-0">
            <v-icon small :disabled="getProcessing" class="mr-2" @click="editDefect(props.item)">edit</v-icon>
            <v-icon small :disabled="getProcessing" @click="deleteDefect(props.item)">delete</v-icon>
            </td>
            <td class="text-xs-left">{{ getElemNameInListById(lstDpkType,props.item.dpk_type) }}</td>
            <td class="text-xs-left">{{ props.item.def_lngth }}</td>
            <td class="text-xs-left">{{ props.item.def_width }}</td>
            <td class="text-xs-left">{{ props.item.def_depth }}</td>
            <td class="text-xs-left">{{ getElemNameInListById(lstDpkCateg,props.item.dpk_categ) }}</td> 
            <td class="text-xs-left">{{ props.item.dpk_posit }}</td>
            <td class="text-xs-left">{{ props.item.pic_cnt }}</td>            
        </template>    
        </v-data-table>
    </v-flex>
</v-layout>


</template>

<script>
    export default {

        props: {
            pInitDefects:{
                type: Array,
                //required:true,
                //default: function(){ return null}
            },
            pInitRemDefects:{
                type: Array,
                //required:true,
                //default: function(){ return null}
            },
        },

        data: function() {
            return {
                dialog: false,
                search: '', 
                headers: [
                        { text: 'Пор.№', align: 'left',sortable: true,value: 'ord_num', sortable: true },
                        { text: '', value: '', sortable: false },
                        { text: 'Вид ДПК', align: 'left', value: 'dpk_type', sortable: true },
                        { text: 'Длинна, мм', align: 'left', value: 'def_lngth', sortable: true },
                        { text: 'Ширина, мм', align: 'left', value: 'def_width', sortable: true },
                        { text: 'Глубина, мм', align: 'left', value: 'def_depth', sortable: true },
                        { text: 'Категория ДПК', align: 'left', value: 'dpk_categ', sortable: true },
                        { text: 'Полож. дефекта', align: 'left', value: 'dpk_posit', sortable: true, width: '10px' },
                        { text: 'Кол.фото', align: 'left', value: 'pic_cnt', sortable: true, width: '10px' },
                ],
                editedItem:  {id: null, ord_num: null,dpk_type: null,def_lngth: null, def_width: null, def_depth: null,dpk_categ: null,dpk_posit: null, pic_cnt: 0,notes: null, images: []},
                defaultItem: {id: null, ord_num: null,dpk_type: null,def_lngth: null, def_width: null, def_depth: null,dpk_categ: null,dpk_posit: null, pic_cnt: 0,notes: null, images: []},
                editedItemIndex: -1,  
                images: [],                              
            }
        },

        computed:{
                //editedWheel(){return this.$store.getters.getEditedWheel},
                //editedWheelIndex(){return this.$store.getters.getEditedWheelIndex},
                defectNotValid() {
                    return false
                    /*
                    console.info('defectNotValid', this.editedItem.def_depth,Number.isInteger(this.editedItem.def_depth))
                    return (this.editedItem)&&( 
                                                (
                                                    (!this.editedItem.def_depth) && (!Number.isInteger(this.editedItem.def_depth))
                                                )
                                               )
                    */
                },
                lstDpkType(){return this.$store.getters.getListDpkType},
                lstDpkCateg(){ return this.$store.getters.getListDpkCateg},
                getProcessing(){return this.$store.getters.getProcessing},
                formTitle () {return this.editedItemIndex === -1 ? 'Добавление дефекта' : 'Редактирование дефекта'},
                //isEditDialod () {return this.editedItemIndex === -1 ? false : true},  
                getWheelDefects(){ 
                    return this.pInitDefects
                   // if (this.$store.getters.getEditedWheel) return this.$store.getters.getEditedWheel.defects              
                   //else return []
                },
                /*
                images(){
                    console.info('images', this.editedItem)
                    if ((this.editedItem) && (this.editedItem.images)) return this.editedItem.images
                    else []
                }
                */
        },        

        methods:{
            showImageList(){
                console.info('showImageList', this.images)
            },
            removePic(img){
                let ind = this.images.indexOf(img)
                this.images.splice(ind,1)
                console.info('removePic', ind)
            },

            onPickFiles(){
                this.$refs.filesInput.click()
            },
 /* 
            onFilesPicked(){
                if (!this.editedItem) return alert("Не удалось опредить дефект для прикрепления фотографий")
                
                if (!this.editedItem.images) this.editedItem.images = []

                let fl = event.target.files

                for(let i=0;i<fl.length;i++){
                    let fileReader = new FileReader()
                    fileReader.addEventListener('load',() => {   
                        let elem = _.find(this.editedItem.images,{id: fl[i].name})                         
                        if (!elem) this.editedItem.images.push({imageUrl: fileReader.result,id: fl[i].name,file: fl[i]})                        
                    })
                    fileReader.readAsDataURL(fl[i])                    
                } 

            },
*/
            
            onFilesPicked(){
                if (!this.editedItem) return alert("Не удалось опредить дефект для прикрепления фотографий")
                
                if (!this.images) this.images = []

                let fl = event.target.files
                console.info('onFilesPicked', fl,this.images)
    
                for(let i=0;i<fl.length;i++){
                    //console.info('file', fl[i])
                    let fileReader = new FileReader()
                    fileReader.addEventListener('load',() => {   
                        let elem = _.find(this.images,{id: fl[i].name})                         
                        if (!elem) this.images.push({imageUrl: fileReader.result,id: fl[i].name,file: fl[i]})                        
                    })
                    fileReader.readAsDataURL(fl[i])                    
                }                                    
            },
            

            setAddDialog(){                
                this.editedItem = {id: null, ord_num: null,dpk_type: null,def_lngth: null, def_width: null, def_depth: null,dpk_categ: null,dpk_posit: null, pic_cnt: 0,notes: null, images: []}//Object.assign({},this.defaultItem)
                this.images = []
                document.getElementById("inputImg").value = ""
                this.dialog = true
                /*
                if (this.$store.getters.getProtocolSelectedTrainId) {
                    this.editedItem = {id: null, ord_num: null,dpk_type: null,def_size: null,dpk_categ: null,dpk_posit: null, pic_cnt: 0,notes: null, images: []}//Object.assign({},this.defaultItem)
                    this.dialog = true
                }else {
                this.close()
                alert('Необходимо выбрать состав') 
                }
                */
            },

            save () {
                if (this.editedItemIndex > -1) {
                    this.editedItem.images = this.images
                    this.editedItem.pic_cnt = this.editedItem.pic_cnt+this.images.length
                    console.info('assign',this.pInitDefects[this.editedItemIndex], this.editedItem) 
                    Object.assign(this.pInitDefects[this.editedItemIndex], this.editedItem)                    
                } else {
                    console.info('push',this.editedItemIndex, this.editedItem) 
                    this.editedItem.images = this.images
                    this.editedItem.pic_cnt = this.images.length 
                    this.pInitDefects.push(this.editedItem)                    
                }
                this.close()
                /*
                console.info('editedItem', this.editedItem)        
                if (this.editedItem) {
                    //if ((!this.editedItem.images)||(typeof(this.editedItem.images) != "Array")) { this.editedItem.images = []}
                    //this.editedItem.pic_cnt = this.editedItem.images.length
                    //this.$store.commit('SAVE_DEFECT',{editedItem: this.editedItem, editedIndex: this.editedItemIndex}) 
                    this.pInitDefects.push( Object.assign({}, this.editedItem))
                }
                this.close()
                */
            },

            editDefect (item) {        
                if (item){
                   //this.editedItemIndex = this.$store.getters.getEditedWheel.defects.indexOf(item)
                   this.editedItemIndex = this.pInitDefects.indexOf(item)
                   this.editedItem = Object.assign({}, item)
                   if ( (this.editedItem) && (this.editedItem.images)) this.images = this.editedItem.images
                   else this.images = []
                   this.dialog = true
                }else{
                    console.info('method editTrainCar', 'id is null')          
                }                      
            },

            deleteDefect (item) {        
                if (item) {
                    if (confirm('Вы уверены что хотите удалить дефект из списка?')){
                        let ind = this.pInitDefects.indexOf(item)
                        this.pInitDefects.splice(ind,1)
                        if (item.id){
                            this.pInitRemDefects.push(item)
                        }
                    }         
                }
            }, 

            getElemNameInListById(list,id){
                let elem = _.find(list,{id:id})
                if (elem) return elem.name 
                else return null
            },

            close () {
                //def_lngth def_width def_depth
                this.dialog = false
                document.getElementById("inputImg").value = ""
                setTimeout(() => {
                    this.editedItem = Object.assign({}, {id: null, ord_num: null,dpk_type: null,def_lngth: null, def_width: null, def_depth: null,dpk_categ: null,dpk_posit: null, pic_cnt: 0,notes: null, images: []})// this.defaultItem)
                    this.editedItemIndex = -1
                    this.images = []
                }, 300)
            },                

        },

    }
</script>

<style scoped>

</style>