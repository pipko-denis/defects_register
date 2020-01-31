<template>
<div v-if="this.$store.getters.getIsAuth"> 
    <h1>Журнал работы системы</h1>  
    <v-toolbar flat color="white">      
      <v-text-field v-model="search" append-icon="search" label="Поиск" clearable ></v-text-field>   
      <v-spacer></v-spacer> 
      <v-select  v-model="showErrors"  :items="msgTypesList" item-text="text" item-value="id" label="Вид сообщений"></v-select>
    </v-toolbar>
    
    <v-data-table :headers="headers" :items="(showErrors === 2) ? getLog : getErrors" :search="search"  rows-per-page-text="Строк на странице" 
        no-data-text="Данные отсутствуют" no-results-text="Ничего не найдено" :rows-per-page-items="rowsPerPageItems">
      <template v-slot:items="props">
        <td>{{ props.item.dt }}</td>
        <td>{{ props.item.payload.code }}</td>        
        <td>{{ props.item.payload.text }}</td>        
      </template>
    </v-data-table>
  </div>
</template>

<script>

export default {

    data: () => ({
      search: null,
      rowsPerPageItems: [25,50,{"text":"Все","value":-1}],
      headers: [
        {text: 'Дата',align: 'left',sortable: true, value: 'dt'},
        { text: 'Код', align: 'left',value: 'payload.code' },
        { text: 'Текст сообщения', align: 'left',value: 'payload.text' },
      ],
      msgTypesList: [{id:1, text:"Ошибки"},{id:2, text:"Сообщения"}],
      showErrors: 1,
    }),

    methods:{
      formatDate (date) {
        if (!date) return null        
        return date
          //const [year, month, day] = date.split('-')
          //return `${day}.${month}.${year}`
      }, 
    },
/*
    mounted() {
        let dt = new Date()
        console.info('mounted', dt)
        console.info('mounted', dt.toString())
        console.info('mounted', dt.toLocaleString())

    },
*/
    computed:{
        getLog(){
            return this.$store.getters.getMessList
        },
        getErrors(){
            return this.$store.getters.getErrorList
        },
    }
    }
</script>

<style scoped>

</style>