<template>
    <div class="mini-cart" v-show="Object.keys(foodOrdered).length > 0">
        <div class="short-view">
            {{numberOfItems}} Item | ₹ {{totalPrice}}

        </div>
    </div>
</template>

<script>
    import { mapGetters, mapState, mapActions } from 'vuex';
    import router from '@/router';

    export default {
        name: 'FoodCart',
        date(){
            return {
                totalPrice: 0
            }
        },
        computed:{
            ...mapState('restaurantstore',['restaurantObj']),
            ...mapGetters(['foodOrdered']),
            numberOfItems: function(){
                var sum = 0;
                var price = 0
                for(var key in this.foodOrdered){
                    sum += this.foodOrdered[key].quantity;
                    price += (this.restaurantObj.Food[key].Price * this.foodOrdered[key].quantity);
                }
                this.setTotalPrice(price);
                this.totalPrice = price;
                return sum;
            }
        },
        methods:{
            ...mapActions('orderstore',['setTotalPrice']),
            openOrder(){
                router.push('Order');
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../styles/cart.scss';
</style>