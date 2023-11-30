<template>
	<router-link class="header__cart" aria-label="Корзина с товарами" :to="{name: 'cart'}">
		<svg width="30" height="21" fill="currentColor">
			<use xlink:href="#icon-cart"></use>
		</svg>
		<span v-if="cartLoading" class="header__count count" aria-label="Количество товаров"><img src="@/preloader/preloaderCart.gif" alt=""></span>
		<span v-else class="header__count" aria-label="Количество товаров">{{ cartProductsQuantity }}</span>
	</router-link>  
</template>

<script>
	import { mapState } from 'vuex';
	export default {

		computed: {
			cartProductsQuantity() {
				return this.$store.state.cartProducts.length
			},
			...mapState({
        cartLoading: 'cartLoading'
      })
		},
  }
</script>

<style>
	.count {
		width: 13px;
	}

	.header__cart svg {
		transition: color .3s ease-in-out;
	}

	.header__cart:hover svg {
		color: #9eff00;
	}
</style>