import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' 
import colors from 'vuetify/es5/util/colors'
import _ from 'lodash'
//import UUID from 'vue-uuid';

Vue.use(Vuetify,
    {
      theme: {
        primary: colors.red.darken2, // #E53935
        secondary: '#FF9335',//'#FF6201',//colors.red.lighten4, // #FFCDD2
        accent: '#757575' // #3F51B5
      }
    }
  )


Vue.config.productionTip = false

//Vue.use(app_props)

var vm = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

//vm.$mount


