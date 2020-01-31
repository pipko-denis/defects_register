<template>
<v-container grid-list-md >
        <v-layout row wrap>
            <v-flex xs12 >
                    <v-container row>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-select  clearable :value="pSelectedPlace" @input="changedSelectedPlace" :items="plases" item-text="place_name" item-value="id" label="Место проведения:"></v-select>
                            </v-flex>
                        </v-layout>    
                        <v-layout row wrap>

                            <v-flex xs12 sm4>
                                 <v-dialog ref="dialogDate" v-model="modal0" :return-value.sync="dtExec" persistent lazy full-width width="250px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="computedDtExec" label=" Дата проведения " prepend-icon="event" clearable readonly v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-if="modal0" no-title v-model="dtExec" full-width>
                                        <v-spacer></v-spacer>                                    
                                        <v-btn color="primary" @click="$refs.dialogDate.save(dtExec)">Применить</v-btn>
                                        <v-btn  @click="modal0 = false">Закрыть</v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-flex>

                            <v-flex xs12 sm4>
                                 <v-dialog ref="dialogFrom" v-model="modal1" :return-value.sync="timeBeg" persistent lazy full-width width="250px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="computedTimeBeg"  label=" c " prepend-icon="access_time" clearable readonly v-on="on"></v-text-field>
                                    </template>
                                    <v-time-picker v-if="modal1" v-model="timeBeg"  full-width format="24hr" >
                                        <v-spacer></v-spacer>                                    
                                        <v-btn color="primary" @click="$refs.dialogFrom.save(timeBeg)">Применить</v-btn>
                                        <v-btn  @click="modal1 = false">Отмена</v-btn>
                                    </v-time-picker>
                                </v-dialog>
                            </v-flex>

                            <v-flex xs12 sm4>
                                <v-dialog ref="dialogTo" v-model="modal2" :return-value.sync="timeEnd" persistent lazy full-width min-width="250px" max-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="computedTimeEnd"  label=" по " prepend-icon="access_time" clearable readonly v-on="on"></v-text-field>
                                    </template>
                                    <v-time-picker v-if="modal2" v-model="timeEnd" full-width format="24hr" >
                                        <v-spacer></v-spacer>                                    
                                        <v-btn color="primary" @click="$refs.dialogTo.save(timeEnd)">Применить</v-btn>
                                        <v-btn  @click="modal2 = false">Отмена</v-btn>
                                    </v-time-picker>
                                </v-dialog>
                            </v-flex>
                            
                        </v-layout>    

                        <v-layout row wrap>
                            <v-flex  xs12>
                                <v-text-field :value="pExecuterOne" @input="changedExecuterOne" clearable label="ФИО и должность проводившего осмотр:" required></v-text-field>                                
                            </v-flex>                            
<!--
                            <v-flex  xs1>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn fab small color="secondary" v-on="on" @click="setUserNameFromStore">
                                            <v-icon>done_outline</v-icon>
                                        </v-btn>
                                    </template>
                                <span>Указать свои данные</span>
                                </v-tooltip>
                            </v-flex>
-->
                            <v-flex  xs12 >
                                <v-text-field :value="pExecuterTwo" @input="changedExecuterTwo" clearable label="ФИО и должность проводившего осмотр:" required></v-text-field>
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
            pSelectedPlace:{
                type: Number,
                default: function(){ return "default pSelectedPlace"}
            },
            pExecuterOne:{
                type: String,
                default: function(){ return this.$store.getters.getUserName +', '+ this.$store.getters.getPosition}
            },
            pExecuterTwo:{
                type: String,
                default: function(){ return null}
            },
            pDtExec:{
                type: String,
                default: function(){ return null}
            },
            pTimeBeg:{
                type: String,
                default: function(){ return null}
            },
            pTimeEnd:{
                type: String,
                default: function(){ return null}
            },
        },

        data: ()  => ({
            plases:[
                {id:1, place_name:"Место 1"},
                {id:2, place_name:"Место 2"},
            ],
            selectedPlace: null,
            executerOne: null,
            executerTwo: null,
            dtExec: null,//new Date().toISOString().substr(0, 10),
            timeBeg:null,
            timeEnd:null,
            
            modal0: false,
            modal1: false,
            modal2: false,            
        }),



        computed: {
            computedTimeBeg: {
                get: function(){                    
                    this.$emit("changedTimeBeg",this.timeBeg)
                    if (this.timeBeg)
                    return this.timeBeg
                    else return null
                },
                set: function(newValue){
                    this.timeBeg = newValue
                }
            },
            computedTimeEnd: {
                get: function(){                    
                    this.$emit("changedTimeEnd",this.timeEnd)
                    if (this.timeEnd)
                    return this.timeEnd
                    else return null
                },
                set: function(newValue){
                    this.timeEnd = newValue
                }
            },
            computedDtExec: {
                get: function(){                    
                    this.$emit("changedDtExec",this.dtExec)
                    if (this.dtExec)
                    return this.formatDate(this.dtExec)
                    else return null
                },
                set: function(newValue){
                    this.dtExec = newValue
                }
            },

            
        },        
        

        methods: {
            changedSelectedPlace(event){
                this.selectedPlace = event
                this.$emit("changedSelectedPlace",this.selectedPlace)
            },
            changedExecuterOne(event){
                this.executerOne = event
                this.$emit("changedExecuterOne",this.executerOne)
            },
            changedExecuterTwo(event){
                this.executerTwo = event
                this.$emit("changedExecuterTwo",this.executerTwo)
            },

            setUserNameFromStore(){
                this.executerOne = this.$store.getters.getUserName +', '+ this.$store.getters.getPosition
                //this.pExecuterOne = this.executerOne
                this.changedExecuterOne(this.$store.getters.getUserName +', '+ this.$store.getters.getPosition)                
                console.info('setUserNameFromStore',this.pExecuterOne)
            }, 

            formatDate (date) {
                if (!date) return null

                const [year, month, day] = date.split('-')
                return `${day}.${month}.${year}`
            },

            parseDate (date) {
                if (!date) return null

                const [month, day, year] = date.split('.')
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            }
        },

       
    }
</script>

<style scoped>

</style>