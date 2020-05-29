<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <div class="top">
      HyperMenu
    </div>
    <div class="pagename">
      Orders
    </div>
    <div class="orders">
      <Order :key="order.id" :order="order" v-for="order in orders" />
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Order from './components/Order.vue'

export default {
  name: 'App',
  data: function(){
    return {
    orders:[
    {
      id: '123',
      table: '12',
      items: [
        {
          name: 'Gobi Manchuri'
        },
        {
          name: 'Jeera Rice',
          quantity: 2
        },
        {
          name: 'Chilly Chicken',
          specialInstruction: 'less spicy'
        }
      ]
    },
    {
      id: '124',
      table: '13',
      items: [
        {
          name: 'Gobi Manchuri'
        },
        {
          name: 'Jeera Rice',
          quantity: 2
        },
        {
          name: 'Chilly Chicken',
          specialInstruction: 'less spicy'
        }
      ]
    }
  ]
  }},
  components: {
    Order
    // HelloWorld
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
}
.top{
  text-align:center;
  background:coral;
  color: white;
}
.pagename{
  background: red;
  color: white;
}
.orders{
  margin-top: 20px;
}
</style>
