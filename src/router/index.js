import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from './../views/GoodsList.vue'
import Cart from './../views/cart.vue'
import Address from './../views/address'
import OrderConfirm from './../views/orderConfirm.vue'
import OrderSuccess from './../views/orderSuccess.vue'
import adminIndex from './../views/admin/admin.vue'
import editGood from './../views/admin/edit.vue'
import addGood from './../views/admin/add.vue'


Vue.use(Router)

export default new Router({
	routes: [{
		path: '/',
		// name: 'HelloWorld',
		component: GoodsList
	}, {
		path: '/cart',
		component: Cart
	}, {
		path: '/address',
		component: Address
	}, {
		path: '/address',
		component: Address
	}, {
		path: '/orderConfirm',
		component: OrderConfirm
	}, {
		path: '/orderSuccess',
		component: OrderSuccess
	}, {
		path: '/admin',
		component: adminIndex
	}, {
		path: '/admin/edit/:goodId',
		name: 'editgoods',
		component: editGood
	}, {
		path: '/admin/add',
		component: addGood
	}]
})