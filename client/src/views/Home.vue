<template>
  <v-container grid-list-md fluid>
    <v-layout wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <!--
          <v-carousel height="300px">
            <v-carousel-item v-for="(item,i) in images" :key="i" :src="apiUrl+item.path"></v-carousel-item>
          </v-carousel>
          -->
                        <v-carousel height="300px">
                          <v-carousel-item v-for="(item,i) in cardImages" :key="i" :src="apiUrl+item.path">
                            <div style="z-index:1;position:absolute;background: rgba(239, 108, 0, .8);width:100%;">
                              <ul class="white--text" style="list-style: none;">
                                <li v-if="item.id"><b>Протокол номер:</b> {{"0000"+item.prot_id}}. <b>Размер:</b> {{item.def_size}} мм</li>
                                <li><b>Вид ДПК:</b> {{getElemNameInListById(lstDpkType,item.dpk_type)}}. <b>Категория ДПК:</b> {{getElemNameInListById(lstDpkCateg,item.dpk_categ)}}.</li>
                                <li><b v-if="item.id">Снимок: </b><a v-if="item.id" :href="apiUrl+item.path" target="blank" class="white--text"><b>{{item.file_name}}</b></a><b v-if="! item.id">{{item.file_name}}</b></li>
                              </ul>  
                            </div>
                          </v-carousel-item>
                        </v-carousel> 

          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Протоколы осмотра колёс</h3>
              <!--<div> Протоколы осмотра колёс содержат информацию о дате и месте осмотра,а так же о составе, оси осматриваемого вагона и состоянии колеса. </div>-->
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn v-if="false" flat color="orange">Создать</v-btn>
            <v-btn flat color="orange" @click="goToPage('/protocols',false)">Просмотреть список</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-img src="./img/train_card_logo.jpg" aspect-ratio="2.75"></v-img>

          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Железнодорожные составы</h3>
              <!--<div> Список составов используется для формирования протоколов. </div>-->
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn v-if="false" flat color="orange">Создать состав</v-btn>
            <v-btn flat color="orange" @click="goToPage('/trains',false)">Просмотреть список</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
  import config from '@/config'
  import ImageService from '@/services/ImageService'

  export default {
    mounted() {
      if (!this.$store.getters.getIsAuth) {
          this.$router.push("/signin")            
      }else{
        this.getLastImages()
      }
    },
    data: () => ({
        cardImages:[{path:"defects_images/default_wheel.jpg",file_name:"Протоколы отсутствуют",ord_num: 0, dpk_type:0,def_size:0,dpk_categ:0,defect_id:0,id:0,prot_id:0}]
    }),

    computed:{
      apiUrl(){ 
        //console.info('API',config.apiUrl)
        return config.apiUrl
      },
      lstDpkType(){return this.$store.getters.getListDpkType},
      lstDpkCateg(){ return this.$store.getters.getListDpkCateg},
    },

    methods: {

      getElemNameInListById(list,id){
        let elem = _.find(list,{id:id})
        if (elem) return elem.name 
        else return null
      },

      getLastImages(){
          //console.info('getImages start')   
          this.cardImages = [{path:"defects_images/default_wheel.jpg",file_name:"Протоколы отсутствуют",ord_num: 0, dpk_type:0,def_size:0,dpk_categ:0,defect_id:0,id:0,prot_id:0}]
          this.$store.commit('SET_PROCESSING',true)  
          //this.$store.commit('SET_ERROR_CLEAN')  
          try{                      
            ImageService.getLastImages()
              .then(result => {           
                  if (result.data.message.code != 0) {
                    //console.info('result.data=',result.data.message)
                    this.$store.commit('SET_PROCESSING',false)
                    this.$store.commit('SET_ERROR',result.data.message)          
                  }else{                    
                    console.info('result.data=',result.data) 
                    this.$store.commit('SET_PROCESSING',false)
                    this.cardImages = result.data.data                     
                    this.$store.commit('SET_MESSAGE',result.data.message)    
                  }
                }
              )
              .catch(err => {                     
                  this.$store.commit('SET_PROCESSING',false)     
                  this.$store.commit('SET_ERROR',err)  
                  //console.info('getImages err1',err)   
                }
    
              )
          }catch (err){
            this.$store.commit('SET_ERROR',err)           
            this.$store.commit('SET_PROCESSING',false)
            //console.info('getImages err2',err)   
          }

      },

      goToTrains(){
        this.goToPage("/trains",false)    
        //console.info("goToTrains")    
      },

      goToPage(path,dialog){
          this.$router.push(path)            
          //console.info("goToPage",path)
      }
    }

  }
</script>

<style scoped>

</style>