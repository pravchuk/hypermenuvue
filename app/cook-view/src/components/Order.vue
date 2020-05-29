<template>
    <div class="order" @click="openOrderActions = !openOrderActions">
        <span class="order-id">#{{order.id}}</span>
        <span class="table">Table : {{order.table}}</span>
        <ul class="items">
            <li :key="item.name" v-for="item in order.items">{{item.name}} <span v-if="item.quantity">( {{item.quantity}}x )</span> <span v-if="item.specialInstruction">( {{item.specialInstruction}} )</span></li>
        </ul>
        <span class="num-items">{{numberOfItems}} items</span>
        <div class="orderActions">
            <button class="b-order">Order</button>
            <button class="b-reject">Reject</button>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Order',
    props:{
        order: Object
    },
    computed: {
        numberOfItems: function(){
            let count = 0;
            for(let item of this.order  .items){
                if(item.quantity){
                    count += item.quantity;
                }else{
                    count++;
                }
            }
            return count;
        }
    }
}
</script>

<style lang="scss" scoped>

@import 'src/assets/css/buttons.scss';

.order{
    padding: 20px;
    margin: 20px;
    background: rgb(255, 156, 156);
}
.order-id{
    position:absolute;
    right: 50px;
}
.num-items{
    font-style: italic;
}
</style>