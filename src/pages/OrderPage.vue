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
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        {{ productsQuantity + ' ' + endingCountProducts(productsQuantity)}}
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText v-model="formData.name" :error="formError.name" title="ФИО" placeholder="Введите ваше полное имя"/>
            <BaseFormText v-model="formData.address" :error="formError.address" title="Адрес доставки" placeholder="Введите ваш адрес"/>
            <BaseFormText v-model="formData.phone" :error="formError.phone" title="Телефон" placeholder="Введите ваш телефон" type="tel"/>
            <BaseFormText v-model="formData.email" :error="formError.email" title="Email" placeholder="Введи ваш Email" type="email"/>
            <BaseFormTextarea v-model="formData.comment" title="Комментарий к заказу" :error="formError.comment" placeholder="Ваши пожелания"/>
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="item in deliveriesData" :key="item.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" :value="item.id" v-model="formData.deliveryTypeId">
                  <span class="options__value">
                    {{ item.title }}
                    <b>{{ item.price == 0 ? "бесплатно" : item.price }}</b>
                    <span v-if="item.price > 0"> ₽</span>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="item in paymentsData" :key="item.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" :value="item.id" v-model="formData.paymentTypeId">
                  <span class="options__value">
                    {{ item.title }}
                  </span>
                </label>
              </li>
            </ul>
          </div>

          <div v-if="goToCheckout" style="position: absolute; top: 240px; width: 750px; height: 810px; background: #ffffff; opacity: 0.7">
            <div style="display: flex; flex-direction: column; margin: 250px auto; width: 240px;">
              <div style="align-self: center; margin-bottom: 15px; font-family:'PressStart'; font-size: 15px; color: #222;">Оформляем заказ</div>
              <img src="@/preloader/preloader.svg" alt="Preloader">
            </div>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <OrderItem v-for="item in products" :key="item.productId" :item="item"/>
          </ul>
          
          <div class="cart__total">
            <p>Доставка: 
              <b>{{ deliveryPrice | numberFormat }} ₽</b>
            </p>
            <p>Итого: 
              <b>{{ productsQuantity }}</b> {{ endingCountProducts(productsQuantity) }} на сумму 
              <b>{{ totalPrice + deliveryPrice | numberFormat}} ₽</b>
            </p>
          </div>

          <button class="cart__button button button--primery" type="submit" :disabled="goToCheckout">
            {{ orderStatus }}
          </button>
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
  import BaseFormText from '@/components/BaseFormText.vue';
  import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
  import axios from 'axios';
  import {API_BASE_URL} from '@/config';
  import { mapGetters, mapMutations} from 'vuex';
  import numberFormat from '@/helpers/numberFormat';
  import OrderItem from '@/components/OrderItem.vue';
  import endingCountProducts from '@/helpers/endingCountProducts';


  export default {
    data() {
      return {
        formData: {
          deliveryTypeId: null,
          paymentTypeId: null
        },
        formError: {},
        formErrorMessage: '',

        goToCheckout: false,

        deliveriesData: [],
        paymentsData: []
      }
    },
    filters: {numberFormat},
    computed: {
      ...mapGetters({
        products: 'cartDetailProducts', 
        totalPrice: 'cartTotalPrice', 
        productsQuantity: 'cartProductsQuantity'
      }),
      orderStatus() {
        let status = 'Оформить заказ';
        if (this.goToCheckout) {
          status = 'Оформляем...';
        }
        return status
      },
      deliveryPrice() {
        return this.formData.deliveryTypeId
          ? +this.deliveriesData.find(item => item.id === this.formData.deliveryTypeId).price
          : 0;
      }
    }, 
    components: {BaseFormText, BaseFormTextarea, OrderItem},
    methods: {
      ...mapMutations(['updateDeliveryPrice']),
      endingCountProducts,
      order() {
        this.formError = {};
        this.formErrorMessage = '';

        axios.post(API_BASE_URL + `/api/orders`, {
          ...this.formData
        }, {
          params: {
            userAccessKey: this.$store.state.userAccessKey
          }
        })
        .then(response => {
          this.goToCheckout = true;

          clearTimeout(this.loadOrder);
          this.loadOrder = setTimeout(() => {
            this.$store.commit('resetCart');
            this.$store.commit('updateOrderInfo', response.data);
            this.$router.push({name: 'orderInfo', params: {id: response.data.id}});
          }, 1000)  
        })
        .catch(error => {
          this.formError = error.response.data.error.request || {};
          this.formErrorMessage = error.response.data.error.message;
          this.goToCheckout = false;
        });
      },
      loadDeliveries() {
        axios
          .get(API_BASE_URL + '/api/deliveries')
          .then(response => (this.deliveriesData = response.data))
          .then(() => {
            this.formData.deliveryTypeId = this.deliveriesData[0].id;
          })
          .then(() => {
            this.loadPayments(this.formData.deliveryTypeId);
          });
      },
      loadPayments(value) {
        axios
          .get(API_BASE_URL + '/api/payments', {
            params: {
              deliveryTypeId: value
            }
          })
          .then(response => (this.paymentsData = response.data))
          .then(() => {
            this.formData.paymentTypeId = this.paymentsData[0].id;
          });
      }
    },
    created() {
      this.loadDeliveries();
    },
    watch: {
      'formData.deliveryTypeId': function(val, oldVal) {
        if (oldVal === null) {
          return;
        }
        axios
        .get(API_BASE_URL + '/api/payments', {
          params: {
            deliveryTypeId: this.formData.deliveryTypeId
          }
        })
        .then(response => {
          this.paymentsData = response.data;
        })
        .then(() => {
          this.formData.paymentTypeId = this.paymentsData[0].id;
        });
      },
      deliveryPrice() {
        this.$store.commit('updateDeliveryPrice', Number(this.deliveryPrice));
      }
    }
  }
</script>

