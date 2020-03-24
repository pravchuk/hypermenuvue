<template>
  <div :class="{'food-items':true,'food-cart-added':Object.keys(foodOrdered).length>0}">
    <h1>{{ msg }}</h1>
    <b-list-group
      v-for="(categoryObj,categoryId) in restaurantObj.Categories"
      :key="categoryId">
      {{restaurantObj.Categories[categoryId].category}}
      <b-list-group-item 
        v-for="foodId in categoryObj.ids"
        :key="foodId"
        @click="addItemToCart(foodId)"
        class="d-flex justify-content-between align-items-center">
          {{restaurantObj.Food[foodId].Name}}
          <b-badge variant="primary" pill>{{foodOrdered != null && foodOrdered[foodId] != null ? foodOrdered[foodId].quantity : 0}}</b-badge>
      </b-list-group-item>
      </b-list-group-item>
    </b-list-group>
    <span>Phone Number: {{restaurantObj.ContactNo}}</span>
    <button @click="dummy">{{dummyValue}} Default</button>
    <FoodCart></FoodCart>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import FoodCart from '@/components/FoodCart.vue'
import router from '@/router';

export default {
  data () {
    return {
      name: 'FoodOrder',
      msg: 'Food ordered',
      dummyValue: 0
    }
  },
  components:{
    FoodCart
  },
  created () {
    this.getRestaurantData();
  },
  methods: {
    ...mapActions('orderstore',[
      'addItemToCart'
    ]),
    ...mapActions('restaurantstore',[
      'getRestaurantData'
    ]),
    dummy: function(){
      this.dummyValue+=1;
    },
    openOrder: function(){
      router.push('Order');
    }
  },
  computed: {
    ...mapState('restaurantstore',['restaurantObj']),
    ...mapGetters(['foodOrdered'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.food-items.food-cart-added{
  margin-bottom: 25px;
}
</style>
