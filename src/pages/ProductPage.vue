<template>
  <main class="content container" v-if="productLoading">
    <div class="container__loader">
      <div class="loader">
        <div class="loader-description">Загрузка товара</div>
        <img src="@/preloader/preloader.svg" alt="Preloader">
      </div>
    </div>
  </main>

  <main class="content container" v-else-if="!productData">
    <div style="margin: 30%; width: 850px; font-family:'PressStart'; font-size: 20px; color: #222;">Не удалось загрузить товар :(</div>
  </main>

  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            {{ category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper" >
          <img width="570" height="570" :src="product.image" :alt="product.title">
        </div>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="addToCart">
            <b class="item__price">
              {{ product.price | numberFormat }} ₽
            </b>

            <fieldset class="form__block"  v-if="product.mainProp.id != 7">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors">
                <li class="colors__item" v-for="item in product.colors" :key="item.id">
                  <label class="colors__label">
                    <input class="colors__radio sr-only" type="radio" name="color-item" :value="item.color.id" v-model="colorId">
                    <span class="colors__value" :style="`background: ${item.color.code}`"></span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <fieldset class="form__block">
              <legend class="form__legend">{{ product.mainProp.title }}:</legend>
              <MainProp
                :products="product.offers"
                :price-update.sync="product.price"
                :current-prop.sync="productId"
                :current-prop-id.sync="product.mainProp.id"
              />
            </fieldset>

            <div class="item__row">
              <div class="form__counter">
                <button type="button" aria-label="Убрать один товар" @click.prevent="reduceProduct">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" v-model.number="productAmount">

                <button type="button" aria-label="Добавить один товар" @click.prevent="addProduct">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <button v-if="!productAdded" class="button button--primery" type="submit" :disabled="productAddSending">
                {{ cartStatus }}
              </button>

              <router-link :to="{name: 'cart'}">
                <button class="button button--primery button--to-cart btn-to-cart" v-if="productAdded">
                  <p style="margin-top: 0px; margin-bottom: 6px">В корзине</p>
                  <p style="margin: 0px; font-size: 10px;">Перейти</p>
                </button>
              </router-link>
            </div>

          </form>
        </div>
      </div>

      <div class="item__desc">
        <BaseTabs>
          <BaseTab label="Описание" :selected="true">
            <div v-if="product.content">{{ product.content }}</div>
            <div class="item__content" v-else>
              <p>
                Навигация GPS, ГЛОНАСС, BEIDOU Galileo и QZSS<br>
                Синхронизация со смартфоном<br>
                Связь по Bluetooth Smart, ANT+ и Wi-Fi<br>
                Поддержка сторонних приложений<br>
              </p>
            </div>
          </BaseTab>
          <BaseTab label="Характеристики">
            <div v-for="specification in product.specifications" :key="specification.id">
              <h3>{{ specification.title }}</h3>
              <p>{{ specification.value }}</p>
            </div>
          </BaseTab>
          <BaseTab label="Гарантия">
            <p>
              Любой возврат должен быть осуществлен в течение Возвраты в магазине БЕСПЛАТНО.<br />
              Вы можете вернуть товары в любой магазин. Магазин должен быть расположен в стране, в
              которой Вы осуществили покупку. БЕСПЛАТНЫЙ возврат в Пункт выдачи заказов.<br />
              Для того чтобы вернуть товар в одном из наших Пунктов выдачи заказов, позвоните по
              телефону 8 800 600 90 09<br />
            </p>
          </BaseTab>
          <BaseTab label="Оплата и доставка">
            <p>
              1.Курьерская доставка по Москве и Московской области – 1200 ₽<br />
              2.Самовывоз из магазина. Список и адреса магазинов Вы можете посмотреть здесь<br />
            </p>
          </BaseTab>
        </BaseTabs>
      </div>
    </section>
  </main>
</template>

<script>
  import gotoPage from '@/helpers/gotoPage';
  import numberFormat from '@/helpers/numberFormat';
  import axios from 'axios';
  import getColorCode from '@/helpers/getColorsCode';
  import {API_BASE_URL} from '@/config';
  import { mapActions } from 'vuex';
  import MainProp from '@/components/MainProp.vue';
  import BaseTabs from '@/components/BaseTabs.vue';
  import BaseTab from '@/components/BaseTab.vue';

  export default {
    data() {
      return {
        productAmount: 1,
        productData: null,

        productLoading: false,
        productLoadingFailed: true,

        productAdded: false,
        productAddSending: false,

        colorId: null,
        productId: null,
      };
    },
    components: {
      MainProp, BaseTab, BaseTabs
    },
    filters: {
      numberFormat
    },
    computed: {
      product() {
        return this.productData
          ? { ...this.productData, image: this.productData.preview.file.url }
          : {};
      },
      category() {
        return this.productData.category;
      },
      cartStatus() {
        let status = 'В корзину';
        if (this.productAddSending) {
          status = 'Добавляем...';
        }
        return status
      }
    },
    methods: {
      ...mapActions(['addProductToCart']),
      gotoPage,
      getColorCode,
      addToCart() {
        if (this.productAmount >= 1) {
          this.productAdded = false;
          this.productAddSending = true;

          this.addProductToCart({
              productId: this.productId, 
              colorId: this.colorId, 
              amount: this.productAmount})
            .then(() => {
              this.productAdded = true;
              this.productAddSending = false;
            });
        } else {
          alert('Введите корректное количество товаров')
        }
      },
      addProduct() {
        this.productAmount++;
        this.productAdded = false;
      },
      reduceProduct() {
        if (this.productAmount > 1) {
          this.productAmount--;
          this.productAdded = false;
        }
      },
      loadProduct() {
        this.productLoading = true;
        this.productLoadingFailed = false;

        clearTimeout(this.loadProductsTimer);
        this.loadProductsTimer = setTimeout(() => {
          axios.get(API_BASE_URL + '/api/products/' + this.$route.params.id)
          .then(response => this.productData = response.data)
          .then(() => {
            this.colorId = this.product.colors[0].color.id;
            this.productId = this.product.offers[0].id;
          })
          .catch(() => this.productLoadingFailed = true)
          .then(() => this.productLoading = false);
        }, 500);
      }
    },
    watch: {
      '$route.params.id': {
        handler() {
          this.loadProduct();
        },
        immediate: true
      }
    }
  }
</script>

<style>
  .form__counter button {
    cursor: pointer;
  }

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

  .btn-to-cart {
    padding: 15px 15px;
    margin-bottom: 15px;
    width: 224px;
    height: 70px;
  }

  .pics__wrapper img {
    max-height: 570px;
  }
</style>

