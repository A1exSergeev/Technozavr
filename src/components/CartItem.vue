<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="item.product.image" width="120" height="120" srcset="img/phone-square-3@2x.jpg 2x" :alt="item.product.title">
    </div>
    <h3 class="product__title">
      {{ item.product.productOffer.title }}
    </h3>
    <div class="product__info" style="{display:inline-flex}">
      <p class="product__info--prop">
        {{ item.product.productOffer.product.mainProp.title }}: &nbsp;
        <span style="display:inline-block" class="colors__value color" :style="{ 'background-color': getColorsCode(item.product.productOffer.propValues[0].value) }" v-if="item.product.productOffer.product.mainProp.id == 7"></span>
        &nbsp;{{ item.product.productOffer.propValues[0].value }}
      </p>
      <p class="product__info--prop" v-if="item.product.productOffer.product.mainProp.id != 7">
        Цвет: &nbsp;
        <span class="colors__value color" :style="`background: ${item.product.color.color.code}`"></span>
        &nbsp; {{ item.product.color.color.title }}
      </p>
      
    </div>
    <span class="product__code"> Артикул: {{ item.product.productOffer.id }} </span>

    <div class="product__counter form__counter">
      <button style="cursor: pointer;" type="button" aria-label="Убрать один товар" @click.prevent="decrementAmount">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input type="text" v-model.number="amount" name="count">

      <button style="cursor: pointer;" type="button" aria-label="Добавить один товар" @click.prevent="incrementAmount">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{ item.amount * item.product.price | numberFormat }} ₽
    </b>

    <button style="cursor: pointer;" class="product__del button-del" type="button" aria-label="Удалить товар из корзины" @click.prevent="deleteProduct">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
  import numberFormat from '@/helpers/numberFormat';
  import { mapActions } from 'vuex';
  import getColorsCode from '@/helpers/getColorsCode';

  export default {
    filters: {numberFormat},
    props: ['item'],
    computed: {
      amount: {
        get() {
          return this.item.amount
        },
        set(value) {
          this.$store.dispatch('updateCartProductAmount', {
            productId: this.item.productId, 
            amount: value
          })
        }
      }
    },
    methods: {
      ...mapActions(['deleteProductFromCart']),
      getColorsCode,
      deleteProduct() {
        this.deleteProductFromCart(this.item.productId)
      },
      incrementAmount() {
        this.$store.commit("updateCartProductAmount", {
          productId: this.item.productId,
          amount: ++this.amount
        });
      },
      decrementAmount() {
        if (this.amount > 1) {
          this.$store.commit("updateCartProductAmount", {
            productId: this.item.productId,
            amount: --this.amount
          });
        }
      }
    } 
  }
</script>

<style>
  .color {
    margin-top: -3px;
  }
</style>
