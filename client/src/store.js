import Vue from 'vue'
import Vuex from 'vuex'
import UserModule from './store/user'
import GeneralModule from './store/general'
import TrainsModule from './store/trains'
import CarsModule from './store/cars'
import DefectsModule from './store/defects'
import ProtocolsModule from './store/protocols'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: false,
  plugins: [createPersistedState()],
  modules: {
    UserModule,
    GeneralModule,
    TrainsModule,
    CarsModule,
    DefectsModule,
    ProtocolsModule,
  }
})
