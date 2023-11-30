<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'main'}" class="breadcrumbs__link">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'cart'}" class="breadcrumbs__link">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'order'}" class="breadcrumbs__link">
            Оформление заказа
          </router-link>
        </li>
      </ul>

      <h1 v-if="orderInfo" class="content__title">
        Заказ оформлен <span>№ {{ orderInfo.id }}</span>
      </h1>
    </div>

    <section class="cart" v-if="orderInfo">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа. 
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span v-if="orderInfo" class="dictionary__value">
                {{ orderInfo.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span v-if="orderInfo" class="dictionary__value">
                {{ orderInfo.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span v-if="orderInfo" class="dictionary__value">
                {{ orderInfo.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span v-if="orderInfo" class="dictionary__value">
                {{ orderInfo.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{ orderInfo.paymentType }}
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="item in cardOrderInfo" :key="item.id">
              <h3>{{ item.title }}</h3>
              <b>{{ (item.quantity * item.price) | numberFormat}} ₽</b>
              <span>Артикул: {{ item.id }}</span>
            </li>
          </ul>
          
          <div class="cart__total">
            <p>Доставка: <b>{{ deliveryPrice | numberFormat}} ₽</b></p>
            <p>Итого: 
              <b>{{ productsQuantityInfo }}</b> {{ endingCountProducts(productsQuantityInfo) }} на сумму 
              <b>{{ totalPriceInfo + deliveryPrice | numberFormat}} ₽</b>
            </p>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
  import numberFormat from '@/helpers/numberFormat';
  import { mapGetters } from 'vuex';
  import endingCountProducts from '@/helpers/endingCountProducts';

  export default {
    data() {
      return{};
    },
    filters: {numberFormat},
    computed: {
      ...mapGetters({
        orderInfo: 'productsOrder',
        totalPriceInfo: 'totalPriceInfo',
        productsQuantityInfo: 'productsQuantityInfo',
        deliveryPrice: 'getDeliveryPrice'
      }),
      cardOrderInfo() {
        return this.orderInfo.basket.items.map(item => ({
          title: item.productOffer.title,
          price: item.productOffer.price,
          id: item.productOffer.id,
          quantity: item.quantity
        }));
      }
    },
    methods: {
      endingCountProducts
    },
    created() {
      if (this.$store.state.orderInfo && this.$store.state.orderInfo.id === this.$route.params.id) {
        return;
      }
      this.$store.dispatch('loadOrderInfo', this.$route.params.id)
    }
  }
</script>