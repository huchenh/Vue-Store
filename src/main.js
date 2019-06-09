// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import infiniteScroll from 'vue-infinite-scroll'
import Vuex from 'vuex'
// var pageination = require('vue_pageination')
import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'
import './assets/css/iconfont.css'
import {
	currency
} from './utils/currency'
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false


// <pageination :total="50" :size="size" :page="10" :changge="pageFn" :isUrl="true"></pageination>
Vue.use(Vuex);
// Vue.use(pageination)
Vue.use(VueLazyLoad, {
	loading: '../static/loading-svg/loading-balls.svg',
	preLoad: 1.3
	// observer: true
})
Vue.filter('currency', currency)
Vue.use(infiniteScroll)

const store = new Vuex.Store({
	state: {
		nickName: '',
		isAdmin: 0,
		cartCount: 0
	},
	mutations: {
		updateUserInfo(state, nickName) {
			state.nickName = nickName
		},
		updateUserAdmin(state,isAdmin){
			state.isAdmin = isAdmin;
		},
		updateCartCount(state, cartCount) {
			state.cartCount += cartCount;
		},
		clearCartCount(state, cartCount) {
			state.cartCount = cartCount;
		},
		initCartCount(state, cartCount) {
			state.cartCount = cartCount
		}
	}
})


/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: {
		App
	},
	template: '<App/>'
})