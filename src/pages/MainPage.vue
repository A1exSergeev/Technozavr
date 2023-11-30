<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info">
        {{ countProducts + ' ' + endingCountProducts(countProducts)}}
      </span>
    </div>

    <div class="content__catalog">
      <ProductFilter 
        :price-from.sync="filterPriceFrom" 
        :price-to.sync="filterPriceTo" 
        :category-id.sync="filterCategoryId" 
        :color-id.sync="filterColorId" 
        :prop-id.sync="filterPropId" 
        :prop-name.sync="filterPropName"
        />
      <section class="catalog">
        <div class="catalog__loader" v-if="productsLoading">
          <div class="loader">
            <div class="loader-description">Загрузка товаров</div>
            <img src="@/preloader/preloader.svg" alt="Preloader">
          </div>
        </div>

        <div class="catalog__error" v-if="productsLoadingFailed">
          <div class="catalog__error-description">Произошла ошибка при загрузке товаров !</div>
          <button class="catalog__error-btn" @click.prevent="loadProducts">Попробовать снова</button>
        </div>

        <ProductList :products="products"/>

        <BasePagination v-model="page" :count="countProducts" :per-page="productsPerPage"/>

      </section>

    </div> 
  </main>
</template>

<script>
  import ProductList from '@/components/ProductList.vue';
  import BasePagination from '@/components/BasePagination.vue';
  import ProductFilter from '@/components/ProductFilter.vue';
  import axios from 'axios';
  import {API_BASE_URL} from '@/config';
  import endingCountProducts from '@/helpers/endingCountProducts';

  export default {
    components: {ProductList, BasePagination, ProductFilter},
    data() {
			return {
        filterPriceFrom: null,
        filterPriceTo: null,
        filterCategoryId: 0,
        filterPropId: [],
        filterPropName: null,
        filterColorId: [],

				page: 1,
        productsPerPage: 12,
        productsData: null,
        productsLoading: false,
        productsLoadingFailed: false,
			}
    },
    computed: {
      products() {
        function filterColors(a, b) {
          let color = a.reduce((akk, item) => {
            akk.push(b.includes(item.color.id));
            return akk;
          }, []);
          return color.includes(true);
        }
        let data = this.productsData 
        ? this.productsData.items.map(product => {
          return {
            ...product,
            image: product.preview.file.url,
          }
        })
        : [];
        return this.filterColorId.length > 0
        ? data.filter(item => filterColors(item.colors, this.filterColorId))
        : data;
      },

			countProducts() {
        return this.productsData
        ? this.productsData.pagination.total
        : 0;
			},
      filterName() {
        return this.filterPropName
        ? `props[${this.filterPropName}]`
        : null;
			},
    },
    methods: {
      endingCountProducts,
      categoryPatcher() {
        if (this.$route.query.category) {
          this.filterCategoryId = Number(this.$route.query.category)
        }
      },
      loadProducts() {
        this.productsLoading = true;
        this.productsLoadingFailed = false;
        clearTimeout(this.loadProductsTimer);
        this.loadProductsTimer = setTimeout(() => {
          axios.get(API_BASE_URL + `/api/products`, {
          params: {
            page: this.page,
            limit: this.productsPerPage,
            categoryId: this.filterCategoryId,
            minPrice: this.filterPriceFrom,
            maxPrice: this.filterPriceTo,
            [this.filterName]: this.filterPropId
          }
        })
          .then(response => this.productsData = response.data)
          .catch(() => this.productsLoadingFailed = true)
          .then(() => this.productsLoading = false);
        }, 500);
      },
    },  
    watch: {
      page() {
        this.loadProducts();
      },
      filterPriceFrom() {
        this.loadProducts();
      },
      filterPriceTo() {
        this.loadProducts();
      },
      filterCategoryId() {
        this.loadProducts();
      },
      filterColorId() {
        this.loadProducts();
      },
      filterPropId() {
        this.loadProducts();
      },
    },
    created() {
      this.loadProducts();
      this.categoryPatcher();
    } 
  }
</script>

<style>
  .catalog {
    position: relative;
  }

  .catalog__loader {
    position: absolute; 
    width: 100%;
    height: 100%; 
    background: #ffffff; 
    z-index: 100;
  }

  .loader {
    display: flex; 
    flex-direction: column; 
    margin-left: 315px; 
    margin-top: 15%; 
    width: 240px;
  }

  .loader-description {
    margin-bottom: 15px; 
    font-family:'PressStart'; 
    font-size: 15px; 
    color: #222;
  }

  .catalog__error {
    display: flex; 
    flex-direction: column; 
    margin: auto auto;
  }

  .catalog__error-description {
    margin-bottom: 12px; 
    font-family:'PressStart'; 
    font-size: 15px; 
    color: #222;
  }

  .catalog__error-btn {
    display: inline-block;
    padding: 25px 15px;
    margin: 0 auto; 
    width: 240px; 
    background-color: #9eff00;
    border: 1px solid #9eff00;
    cursor: pointer; 
    font-family:'PressStart'; 
    font-size: 12px; 
    color: #222;
    transition: background-color .3s ease-in-out;
  }

  .catalog__error-btn:hover {
    background-color: transparent;
    
  }
</style>
