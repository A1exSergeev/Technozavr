<template>
	<li class="catalog__item">
		<router-link class="catalog__pic" :to="{ name: 'product', params: { id: product.id } }">
			<img class="catalog__pic-img" :src="product.image" :alt="product.title">
		</router-link>

		<h3 class="catalog__title">
			<router-link :to="{ name: 'product', params: { id: product.id } }">
				{{ product.title }}
			</router-link>
		</h3>

		<span class="catalog__price">
			{{ currentPrice | numberFormat }} ₽
		</span>
		
		<ul class="colors colors--black" v-if="product.mainProp.id != 7">
			<li class="colors__item" v-for="(item, index) in product.colors" :key="item.color.id">
				<label class="colors__label">
					<input class="colors__radio sr-only" type="radio" :name="item.id" v-model="pickedColor" :value="index">
					<span class="colors__value" :style="`background: ${item.color.code}`"></span>
				</label>
			</li>
		</ul>

		<MainProp
      :products="product.offers"
      :price-update.sync="currentPrice"
      :current-prop="product.id"
      :current-prop-id="product.mainProp.id"
    />
	</li>

</template>

<script>
	import gotoPage from '@/helpers/gotoPage';
	import numberFormat from '@/helpers/numberFormat';
	import MainProp from './MainProp.vue';

	export default {
    data() {
			return {
				currentPrice: null,
				pickedColor: 0
			};
    },
    filters: {
			numberFormat
    },
		props: ['product'],
		components: { MainProp },
    methods: {
      gotoPage
    },
    created() {
      this.currentPrice = this.product.offers[0].price;
    },
	}
</script>
