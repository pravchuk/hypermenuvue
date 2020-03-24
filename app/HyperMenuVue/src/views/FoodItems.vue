<template>
  <div :class="{'food-items':true,'food-cart-added':Object.keys(foodOrdered).length>0}">
    <div class="back-button" v-if="selectedOnly" @click="toggleSelected">< Back</div>
    <h1>{{ restaurantObj.Name }}</h1>
    <b-list-group
      v-for="(categoryObj,categoryId) in restaurantObj.Categories"
      :key="categoryId">
      {{ !selectedOnly ? restaurantObj.Categories[categoryId].category : ''}}
      <b-list-group-item 
        v-for="foodId in categoryObj.ids"
        v-if="(selectedOnly && foodOrdered[foodId] && foodOrdered[foodId].quantity > 0) || !selectedOnly"
        :key="foodId"
        class="d-flex align-items-center"
        :class="{'food-item-img': restaurantObj.Food[foodId].img}">
          <img :ref="'food-image-'+foodId" :src="(restaurantObj.Food[foodId].imgUrl ? restaurantObj.Food[foodId].imgUrl :'/static/hypermenu-no-image.jpg')" class="food-image" v-if="restaurantObj.Food[foodId].img" @load="loadRealImage('food-image-'+foodId, restaurantObj.Food[foodId].img)" />
          <div class="food-name">{{restaurantObj.Food[foodId].Name}}</div>
          <div class="selecting-tools">
            <b-badge variant="primary" pill>{{foodOrdered != null && foodOrdered[foodId] != null ? foodOrdered[foodId].quantity : 0}}</b-badge>
            <b-button pill variant="danger" @click="removeItemFromCart(foodId)">-</b-button>
            <b-button pill variant="success" @click="addItemToCart(foodId)">+</b-button>
          </div>
      </b-list-group-item>
    </b-list-group>
    <button v-if="selectedOnly" class="order-now" @click="orderNow"> Order Now </button>
    <span @click="toggleSelected"><FoodCart></FoodCart></span>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import FoodCart from '@/components/FoodCart';
import router from '@/router';
import { getFoodImage } from '@/api/restaurantApis'

export default {
  data () {
    return {
      selectedOnly: false
    }
  },
  components:{
    FoodCart
  },
  created () {
    this.getRestaurantData(this.$route.params.tableId);
  },
  methods: {
    ...mapActions('orderstore',[
      'addItemToCart',
      'sendOrder',
      'removeItemFromCart'
    ]),
    ...mapActions('restaurantstore',[
      'getRestaurantData'
    ]),
    toggleSelected: function(){
      this.selectedOnly = !this.selectedOnly;
    },
    orderNow(){
      this.sendOrder({
        'PhoneNo': '9738368399',
        'PreTaxAmt': this.totalPrice,
        'Order': this.foodOrdered
      });
    },
    loadRealImage(htmlRef, imageRef){
      let self = this;
      getFoodImage(imageRef).then(url =>{
        debugger
        self.$refs[htmlRef].src = url;
      });
    }
  },
  computed: {
    ...mapState('restaurantstore',['restaurantObj']),
    ...mapGetters(['foodOrdered', 'totalPrice'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.food-items.food-cart-added{
  margin-bottom: 25px;
}
.back-button{
  float:left;
  padding-left: 20px;
  padding-top: 20px;
}
.order-now{
  margin: 20px;
  color: #fff;
  background: green;
}
.food-image{
  width: 90px;
  border-radius: 5px;
}
.selecting-tools{
  position: absolute;
  right: 5px;
  bottom: 5px;
}
.food-item-img{
  padding: 0px;
}
.food-item{
  height:80px;
}
.food-name{
  padding-left: 5px;
  height: 60px;
}
</style>
