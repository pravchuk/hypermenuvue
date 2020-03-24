import Vue from 'vue'
import Vuex from 'vuex'
import restaurantstore from './modules/restaurantstore'
import orderstore from './modules/orderstore'
import getters from './getters'
import firebase from 'firebase'

firebase.initializeApp({
  projectId: 'hypermenu-web',
  databaseURL: 'https://hypermenu-web.firebaseio.com',
  storageBucket: 'hypermenu-web.appspot.com'
})

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    restaurantstore,
    orderstore
  },
  getters
})

export default store
