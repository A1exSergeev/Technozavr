import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import {API_BASE_URL} from '@/config';


Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		cartProducts: [],

		userAccessKey: null,

		cartProductsData: [],

		cartLoading: null,
		cartLoadingFailed: false,
		
		orderInfo: null,
		deliveryPrice: 0
	},
	
	mutations: {
		updateOrderInfo(state, orderInfo) {
			state.orderInfo = orderInfo;
		},
		resetCart(state) {
			state.cartProducts = [],
			state.cartProductsData = []
		}, 
		updateCartProductAmount(state, {productId, amount}) {
			const item = state.cartProducts.find(item => item.productId === productId);

			if (item) {
				item.amount = amount;
			}
		},
		deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter(
        item => item.productId !== productId
      );
    },
		updateUserAccessKey(state, accessKey) {
			state.userAccessKey = accessKey;
		},
		updateCartProductsData(state, items) {
			state.cartProductsData = items;
		},
		syncCartProducts(state) {
			state.cartProducts = state.cartProductsData.map(item => {
				return {
					productId: item.id,
					amount: item.quantity
				}
			})
		},
		cartLoading(state, value) {
			return state.cartLoading = value;
		},
		cartLoadingFailed(state) {
      return state.cartLoadingFailed;
    },
		updateDeliveryPrice(state, price) {
			state.deliveryPrice = price;
		}
	},	
	getters: {
		cartDetailProducts(state) {
      return state.cartProducts.map(item => {
        const product = state.cartProductsData.find(p => p.id === item.productId);
        return {
          ...item,
          product: {
            ...product,
            image: product.productOffer.product.preview.file.url
          }
        };
      });
    },
		cartTotalPrice(state, getters) {
			return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
		},
		cartProductsQuantity(state, getters) {
			return getters.cartDetailProducts.length;
		},
		productsOrder(state) {
			return state.orderInfo
		},
		getDeliveryPrice(state) {
			return state.deliveryPrice;
		},
		totalPriceInfo(state) {
			if (state.orderInfo) {
				return state.orderInfo.basket.items.reduce(
					(acc, item) => item.price * item.quantity + acc,
					0
				);
			}
		},
		productsQuantityInfo(state) {
			if (state.orderInfo) {
				return state.orderInfo.basket.items.length;
			}
		}
	},

	actions: {
		loadOrderInfo(context, orderId) {
			return axios
			.get(API_BASE_URL + '/api/orders/' + orderId, {
				params: {
					userAccessKey: context.state.userAccessKey
				}
			})
			.then(response => {
				context.commit('updateOrderInfo', response.data)
			})
		},
		loadCart(context) {
			context.state.cartLoading = true;
      context.state.cartLoadingFailed = false;
			return (new Promise(resolve => setTimeout(resolve, 500)))
				.then(() => {
				return axios
					.get(API_BASE_URL + '/api/baskets', {
						params: {
							userAccessKey: context.state.userAccessKey
						}
					})
						.then(response => {
							if (!context.state.userAccessKey) {
								localStorage.setItem('userAccessKey', response.data.user.accessKey);
								context.commit('updateUserAccessKey', response.data.user.accessKey);
							}
							context.commit('updateCartProductsData', response.data.items);
							context.commit('syncCartProducts');
						})
						.catch(() => {
							context.state.cartLoadingFailed = true;
						})
						.then(() => {
							context.state.cartLoading = false;
						});
					})
		},
		addProductToCart(context, {productId, colorId, amount}) {
			return (new Promise(resolve => setTimeout(resolve, 500)))
				.then(() => {
					return axios
						.post(API_BASE_URL + '/api/baskets/products', {
							productOfferId: productId,
            colorId: colorId,
            quantity: amount
						}, {
							params: {
								userAccessKey: context.state.userAccessKey
							}
						})
						.then(response => {
							context.commit('updateCartProductsData', response.data.items);
							context.commit('syncCartProducts');
						})
				})
		},
		updateCartProductAmount(context, { productId, amount }) {
      context.commit("updateCartProductAmount", { productId, amount });

      if (amount < 1) {
        return;
      }

      return axios
        .put(
          API_BASE_URL + "/api/baskets/products",
          {
            basketItemId: productId,
            quantity: amount
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey
            }
          }
        )
        .then(response => {
          context.commit("updateCartProductsData", response.data.items);
        })
        .catch(() => {
          context.commit("syncCartProducts");
        });
    },
		deleteProductFromCart(context, productId) {
      context.commit("deleteCartProduct", productId);

      return axios
        .delete(API_BASE_URL + "/api/baskets/products", {
          data: {
            basketItemId: productId
          },
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        .then(response => {
          context.commit("deleteCartProduct", response.data.items);
        })
        .catch(() => {
          context.commit("syncCartProducts");
        });
    },
	}
});
