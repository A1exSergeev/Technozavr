<template>
  <li class="cart__order">
    <h3>{{ item.product.productOffer.title }}</h3>
    <b>{{ item.amount * item.product.price | numberFormat }} ₽</b>
    <span>Артикул: {{ item.product.productOffer.id }}</span>
  </li>
</template>

<script>
  import numberFormat from '@/helpers/numberFormat';

  export default {
    props: ['item'],
    filters: {numberFormat},
  }
</script>


