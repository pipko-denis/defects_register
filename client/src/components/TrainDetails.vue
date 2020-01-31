<template>     
    <v-container grid-list-md >
        <v-layout row wrap>
            <v-flex xs12 >
                    <v-container row>
                        <v-layout row wrap>
                            <v-flex xs11>
                                <v-combobox v-model="selectedTrain" clearable :items="trains" item-text="train_number" return object label="Номер состава:"></v-combobox>
                            </v-flex>
                            <v-flex xs1>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn fab small color="secondary" :disabled="!validToAdd" v-on="on" @click="createTrain" @change="infoChange"><v-icon>add</v-icon></v-btn>
                                    </template>
                                    <span>Создать новый состав</span>
                                </v-tooltip>                                      
                            </v-flex>

                        </v-layout>    
                        <v-layout row wrap>
                            <v-flex xs12 sm4>
                                <v-text-field :value="computedCntCarTotal" @input="changedCntCarTotal" type="number" label="Всего ПЕ:"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm4>
                                <v-text-field :value="computedCntCarLoco" @input="changedCntCarLoco" type="Number" label="из них локо:" required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm4>
                                <v-text-field :value="computedCntCar" @input="changedCntCar" type="Number" label="вагоны:" required></v-text-field>
                            </v-flex>
                        </v-layout>    

                        <v-layout row wrap>
                            <v-flex  xs12 sm4>
                                <v-text-field :value="computedCntAxisTotal" @input="changedCntAxisTotal" type="Number" label="Всего осей:"></v-text-field>
                            </v-flex>
                            <v-flex  xs12 sm4>
                                <v-text-field :value="computedCntAxisLoco" @input="changedCntAxisLoco" type="Number" label="из них осей локо:" required></v-text-field>
                            </v-flex>
                            <v-flex  xs12 sm4>    
                                <v-text-field :value="computedCntAxisCar" @input="changedCntAxisCar" type="Number" label="из них осей вагонв:" required></v-text-field>                
                            </v-flex>  
                        </v-layout>
                    </v-container>                    
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {

        props: {
            prop_train_number:{
                type: Object,
                default: function(){ return null}
            },
            prop_cnt_car_total:{
                type: Number,
                default: function(){ return null}
            },
            prop_cnt_car_loco:{
                type: Number,
                default: function(){ return null}
            },
            prop_cnt_car:{
                type: Number,
                default: function(){ return null}
            },
            prop_cnt_axis_total:{
                type: Number,
                default: function(){ return null}
            },
            prop_cnt_axis_loco:{
                type: Number,
                default: function(){ return null}
            },
            prop_cnt_axis_car:{
                type: Number,
                default: function(){ return null}
            },
        },

        data: () => ({
            train_number: null, 
            cnt_car_total: null,
            cnt_car_loco: null,
            cnt_car : null,
            cnt_axis_total: null,                
            cnt_axis_loco : null,
            cnt_axis_car: null,
            selectedTrain: null,
            cantAddThisTrain:true,
            validToAdd: false,
        }),

        methods: {

            changedCntTrainNumber(event){
                this.train_number = event
                this.$emit("changedCntTrainNumber",this.train_number)
            },
            changedCntCarTotal(event){                
                this.cnt_car_total = parseInt(event)
                this.$emit("changedCntCarTotal",this.cnt_car_total)
            },
            changedCntCarLoco(event){
                this.cnt_car_loco = parseInt(event)
                this.$emit("changedCntCarLoco",this.cnt_car_loco)
            },
            changedCntCar(event){
                this.cnt_car = parseInt(event)
                this.$emit("changedCntCar",this.cnt_car)
            },
            changedCntAxisTotal(event){
                this.cnt_axis_total = parseInt(event)
                this.$emit("changedCntAxisTotal",this.cnt_axis_total)
            },
            changedCntAxisLoco(event){
                this.cnt_axis_loco = parseInt(event)
                this.$emit("changedCntAxisLoco",this.cnt_axis_loco)
            },
            changedCntAxisCar(event){
                this.cnt_axis_car = parseInt(event)
                this.$emit("changedCntAxisCar",this.cnt_axis_car)
            },


            infoChange(){
                console.info("text")
            },

            createTrain(){

                let new_train = {
                    train_number: this.selectedTrain
                    //,uid: this.$uuid.v1()
                    ,cnt_car_total: this.cnt_car_total
                    ,cnt_car_loco: this.cnt_car_loco
                    ,cnt_car: this.cnt_car
                    ,cnt_axis_total: this.cnt_axis_total
                    ,cnt_axis_loco: this.cnt_axis_loco
                    ,cnt_axis_car: this.cnt_axis_car
                    }

                if (typeof(this.selectedTrain) == "string"){//(this.selectedTrain)&&(this.selectedTrain.train_number)){
                    this.$store.dispatch('SAVE_TRAIN',new_train)   
                    //console.info('CREATE_TRAIN', 'ACHTUNG')
                }else{
                    this.$store.commit('SET_ERROR',{text: 'Не заполнен параметр "Номер состава"!',code: -1})
                }
                
            },            

            fillInputsFromSelect(train){
                if ((train) && (train.id)) {
                    this.cantAddThisTrain = true
                    //console.info('commiting SET_SELECTED_TRAIN_ID', train.id)
                    this.$store.commit('SET_SELECTED_TRAIN_ID',train.id)   
                    this.$store.commit('CLEAR_PROTOCOL_WHEELS')                       
                    this.$store.dispatch('GET_CARS_FROM_SRV_BY_TRAIN',{trainid: train.id})//this.$store.getters.getProtocolSelectedTrainId})   
                    this.cnt_car_total = train.cnt_car_total
                    this.cnt_car_loco = train.cnt_car_loco
                    this.cnt_car = train.cnt_car
                    this.cnt_axis_total = train.cnt_axis_total
                    this.cnt_axis_loco = train.cnt_axis_loco
                    this.cnt_axis_car = train.cnt_axis_car
                }
                else {                    
                    if (train) { this.cantAddThisTrain = false}
                    else {this.cantAddThisTrain = true}
                    this.$store.commit('SET_SELECTED_TRAIN_ID',null) 
                    this.$store.commit('CLEAR_PROTOCOL_WHEELS') 
                    this.$store.commit('SET_CARS_LIST',[])  
                    //this.validTrain = true
                    this.cnt_car_total = null
                    this.cnt_car_loco = null
                    this.cnt_car = null
                    this.cnt_axis_total = null
                    this.cnt_axis_loco = null
                    this.cnt_axis_car = null                    
                }
            },
        },

        watch: {
            selectedTrain: function (val) { 
                this.fillInputsFromSelect(val)
                //Проверка валидности значения в поле "номер состава" для добавления в базу
                this.validToAdd = ((typeof(val) == "string")&&(val.length > 3)&&(!_.find(this.$store.getters.getTrains,{train_number:val})))
            },
        },

        beforeMount() {
            if (!this.$store.getters.getIsAuth) {
                this.$router.push("/")            
            }
            this.$store.commit('SET_SELECTED_TRAIN_ID',null)  
            this.selectedTrain = null
        },

        created(){
            //console.info('created', 'created')
            this.$store.dispatch('GET_TRAINS_FROM_SRV') 
        },
        

        computed:{       
            computedCntCarTotal: {
                get: function(){                    
                    this.$emit("changedCntCarTotal",this.cnt_car_total)
                    if (this.cnt_car_total) return this.cnt_car_total
                    else return null
                },
                set: function(newValue){
                    this.cnt_car_total = newValue
                }
            },
            computedCntCarLoco: {
                get: function(){                    
                    this.$emit("changedCntCarLoco",this.cnt_car_loco)
                    if (this.cnt_car_loco) return this.cnt_car_loco
                    else return null
                },
                set: function(newValue){
                    this.cnt_car_loco = newValue
                }
            },
            computedCntCar: {
                get: function(){                    
                    this.$emit("changedCntCar",this.cnt_car)
                    if (this.cnt_car) return this.cnt_car
                    else return null
                },
                set: function(newValue){
                    this.cnt_car = newValue
                }
            },
            computedCntAxisTotal: {
                get: function(){                    
                    this.$emit("changedCntAxisTotal",this.cnt_axis_total)
                    if (this.cnt_axis_total) return this.cnt_axis_total
                    else return null
                },
                set: function(newValue){
                    this.cnt_axis_total = newValue
                }
            },
            computedCntAxisLoco: {
                get: function(){                    
                    this.$emit("changedCntAxisLoco",this.cnt_axis_loco)
                    if (this.cnt_axis_loco) return this.cnt_axis_loco
                    else return null
                },
                set: function(newValue){
                    this.cnt_axis_loco = newValue
                }
            },
            computedCntAxisCar: {
                get: function(){                    
                    this.$emit("changedCntAxisCar",this.cnt_axis_car)
                    if (this.cnt_axis_car) return this.cnt_axis_car
                    else return null
                },
                set: function(newValue){
                    this.cnt_axis_car = newValue
                }
            },




            trains(){
               return this.$store.getters.getTrains
            },

            getProcessing(){
               return this.$store.getters.getProcessing
            },

            validTrain: function(){
                console.info(this.selectedTrain)
                let elem = _.find(this.$store.getters.getTrains,{train_number:this.selectedTrain})
                
                if (elem) return false
                else {
                    return true
                    console.info('elem',elem)
                }    
            },

            processing: function() {             
                return !this.$store.getters.getProcessing
            },            

        }
    }
</script>

<style scoped>

</style>