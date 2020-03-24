import {sendOrder} from '@/api/restaurantApis'

// initial state
const state = {
    foodOrdered: {},
    totalPrice: 0
}

// actions
const actions = {
  getAllProducts ({ commit }) {
    restaurant.getProducts(products => {
      commit('SET_PRODUCTS', products)
    })
  },
  addItemToCart({commit}, foodId){
    commit('ADD_FOOD_ITEM_TO_CART',{'foodId':foodId});
  },
  sendOrder({commit}, order){
    sendOrder(order);
  },
  setTotalPrice({commit}, price){
    commit('SET_TOTAL_PRICE', price);
  },
  removeItemFromCart({commit}, foodId){
    commit('REMOVE_ITEM_FROM_CART', foodId);
  }
}

// mutations
const mutations = {
  ADD_FOOD_ITEM_TO_CART(state, {foodId}){
      if(state.foodOrdered[foodId]){
          state.foodOrdered = { ...state.foodOrdered , [foodId]: { quantity : state.foodOrdered[foodId].quantity+1 }}
      }else{
          state.foodOrdered = { ...state.foodOrdered , [foodId]: { quantity : 1 }}
      }
  },
  SET_TOTAL_PRICE(state, price){
    state.totalPrice = price;
  },
  REMOVE_ITEM_FROM_CART(state, foodId){
    if(state.foodOrdered[foodId])
      state.foodOrdered = { ...state.foodOrdered , [foodId]: { quantity : state.foodOrdered[foodId].quantity - 1 }}
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
