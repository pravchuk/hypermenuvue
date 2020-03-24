import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import FoodItems from '@/views/FoodItems'
import FoodOrder from '@/views/FoodOrder'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: FoodItems
    },
    {
      path: '/t/:tableId',
      name: 'Table', 
      component: FoodItems
    },
    {
      path: '/food',
      name: 'Food',
      component: FoodItems
    },
    {
      path: '/order',
      name: 'Order',
      component: FoodOrder
    }
  ]
})
