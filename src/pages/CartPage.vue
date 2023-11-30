<template>
<!DOCTYPE html>
  <main class="content container" v-if="cartLoading">
    <div class="container__loader">
      <div class="loader">
        <div class="loader-description">Загрузка корзины</div>
        <img src="@/preloader/preloader.svg" alt="Preloader">
      </div>
    </div>
  </main>


  <main class="content container" v-else-if="cartLoadingFailed">
    <div style="width: 100%; height: 100%; background: #ffffff; z-index: 100;">
      <div style="margin: 250px auto; width: 540px;">
        <div style="margin-bottom: 15px; font-family:'PressStart'; font-size: 15px; color: #222;">Не удалось загрузить корзину :(</div>
      </div>
    </div>
  </main>

  <main v-else class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html">
            Каталог
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        {{ productsQuantity }} товара
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem v-for="item in products" :key="item.productId" :item="item"/>
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span> {{ totalPrice | numerFormat }} ₽</span>
          </p>

          <router-link v-if="products.length" tag="button" :to="{name: 'order'}" class="cart__button button button--primery" type="submit">
            Оформить заказ
          </router-link>

        </div>
      </form>
    </section>
  </main>
</template>

<script>
  import numerFormat from '@/helpers/numberFormat';
  import { mapGetters, mapState } from 'vuex';
  import CartItem from '@/components/CartItem.vue';

  export default {
    filters: {numerFormat},
    components: {CartItem},
    computed: {
      ...mapGetters({
        products: 'cartDetailProducts', 
        totalPrice: 'cartTotalPrice', 
        productsQuantity: 'cartProductsQuantity'
      }),

      ...mapState({
        cartLoading: 'cartLoading',
        cartLoadingFailed: 'cartLoadingFailed'
      }),
    },
  }
</script>

<style>
  .container__loader {
    width: 100%; 
    height: 100%; 
    background: #ffffff; 
    z-index: 100;
  }

  .loader {
    display: flex; 
    flex-direction: column; 
    margin: 250px auto; 
    width: 240px;
  }

  .loader-description {
    margin-bottom: 15px; 
    font-family:'PressStart'; 
    font-size: 15px; 
    color: #222;
  }

  .product__info {
    flex-direction: column;
    align-items: flex-start;
  }

  .product__info--prop {
    display: flex;
    margin-top: 0;
  }
</style>
