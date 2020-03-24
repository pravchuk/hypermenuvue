 import {getRestaurantObj, getRestaurantFromTable} from '@/api/restaurantApis'


// initial state
const state = {
  restaurantObj: {}
}

// actions
const actions = {
  getRestaurantData ({commit}, tableId) {
    getRestaurantFromTable(tableId, tableObj => {
      getRestaurantObj(tableObj.restaurantId, restaurantObj => {
        commit('SET_RESTAURANT_OBJ', restaurantObj);
      })
    });
  }
}

// mutations
const mutations = {
  SET_RESTAURANT_OBJ (state, restaurantObj){
    state.restaurantObj = restaurantObj;
  },
  // SET_PRODUCTS (state, products) {
  //   state.all = products
  // },
  // DECREMENT_INVENTORY (state, { id }) {
  //   const product = state.all.find(product => product.id === id)
  //   product.inventory--
  // }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}

