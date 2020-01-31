<template>
    <div>
        <v-navigation-drawer absolute temporary v-model="drawer" class="hidden-md-and-up">
            <v-list>
                <v-list-tile v-for="(item,i) in menuItems" flat :key="`navmenuitem${i}`" :to="item.route">
                    <v-list-tile-action>
                        <v-icon left v-html="item.icon"></v-icon>
                    </v-list-tile-action>                       
                        <v-list-tile-title v-text="item.title"></v-list-tile-title>                     
                </v-list-tile>
            </v-list>            
        </v-navigation-drawer>
        <v-toolbar dark class="primary pb-0" >
            <v-toolbar-side-icon @click.stop="drawer = !drawer" class="hidden-md-and-up"></v-toolbar-side-icon>
            <router-link to="/" tag="span" style="cursor:pointer">
                <v-toolbar-title v-text="'СЦУ колёсных осмотров '" class="hidden-lg-and-up"></v-toolbar-title>
                <v-toolbar-title v-text="'Система централизованного учёта колёсных осмотров  '" class="hidden-md-and-down"></v-toolbar-title>
            </router-link>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn v-for="(item,i) in menuItems" flat :key="`toolbarmenuitem${i}`" :to="item.route" >
                    <v-icon left v-html="item.icon"></v-icon>
                    {{item.title}}
                </v-btn>
            </v-toolbar-items> 
        </v-toolbar>     
        <v-progress-linear v-if="processing" xs12  v-slot:progress color="blue" height="4" class="mt-0"  indeterminate></v-progress-linear>      
    </div>
</template>

<script>
    export default {
        name: 'app-header',
        data() {
            return {
                drawer: false
            }
        },
        created(){
            console.info('AppHeader', 'store init')
            this.$store.commit('STORE_INIT')  
        },
        computed: {
            processing: function() {             
                return this.$store.getters.getProcessing
            },
            isUserAuth: function(){
                return this.$store.getters.getIsAuth
            },
            btnTest: function(){return{
                        title:'Test',
                        route:'/Trains',
                        icon: 'train',
                        needAuth: true,
                    }},
            menuItems: function(){
                if (this.isUserAuth){                    
                    return [                    
                        {
                            title:'Составы',
                            route:'/trains',
                            icon: 'train',
                            needAuth: true,
                        },
                        {
                            title:'Протоколы',
                            route:'/protocols',
                            icon: 'description',
                            needAuth: true,
                        },
                        {
                            title:'Отчёты',
                            route:'/reports',
                            icon: 'save_alt',
                            needAuth: true,
                        },        
                        {
                            title:'Журнал',
                            route:'/logpage',
                            icon: 'history',
                            needAuth: true,
                        },                                   
                        {
                            title:'Выйти',
                            route:'/logout',
                            icon: 'power_settings_new',
                            needAuth: true,
                        },

                    ]
                }else{
                    return [
                        {
                            title:'Войти',
                            route:'/signin',
                            icon: 'exit_to_app',
                            needAuth: false,
                        },  
                    ]
                }
            },
        }
        
    }
</script>

<style scoped>

</style>