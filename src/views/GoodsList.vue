<template>
	<div>
		<nav-header></nav-header>	
		<nav-bread>
			<span>Goods</span>
		</nav-bread>
		<div class="accessory-result-page accessory-page">
		  <div class="container">
		    <div class="filter-nav">
		      <span class="sortby">Sort by:</span>
		      <a href="javascript:void(0)" class="default cur">Default</a>
		      <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short" :class="{'sort-up':!sortFlag}"><use xlink:href="#icon-arrow-short"></use></svg></a>
		      <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
		    </div>
		    <div class="accessory-result">
		      <!-- filter -->
		      <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
		        <dl class="filter-price">
		          <dt>Price:</dt>
		          <dd><a href="javascript:void(0)" @click="priceChecked='all'" :class="{'cur':priceChecked=='all'}">All</a></dd>
		          <dd v-for="(price,i) in priceFilter" :key="i">
		            <a href="javascript:void(0)" @click="setPriceFilter(i)" :class="{'cur':priceChecked==i}">{{price.startPrcie}} - {{price.endPrice}}</a>
		          </dd>
		        </dl>
		      </div>

		      <!-- search result accessories list -->
		      <div class="accessory-list-wrap">
		        <div class="accessory-list col-4">
		          <ul>
		            <li v-for="(item,index) in goodsList" :key="index">
		              <div class="pic" >
										<!-- 新版vue-lazyload 要在图片加上 :key=‘图片路径’ 图片才会随着数据改变 -->
		                <a href="javascrtipt:;"><img :key="'/static/'+item.product_image" v-lazy="'/static/'+item.product_image" alt="">{{ item.product_image }}</a>
		                
		              </div>
		              <div class="main">
		                <div class="name">{{item.product_name}}</div>
		                <div class="price">{{item.sale_price | currency('$')}}</div>
		                <div class="btn-area">
		                  <a href="javascript:;" class="btn btn--m" @click="addCart(item.product_id)">加入购物车</a>
		                </div>
		              </div>
		            </li>
		          </ul>
		          <div v-infinite-scroll="loadMore" v-show="loadPic"  class="load-more" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
					<img src="static/loading-svg/loading-spinning-bubbles.svg">
				  </div>
		        </div>
		      </div>
		    </div>
		  </div>
		</div>
		<div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
		<Modal v-bind:mdShow="mdShow" v-on:close="closeModal" v-show="mdShow==true">
			<p slot="message">
				请先登录，否则无法加入到购物车！
			</p>
			<div slot="btnGroup">
				<a href="javascript:;" class="btn btn--m" @click = "mdShow = false">关闭</a>
			</div>
		</Modal>
		<Modal v-bind:mdShow="mdShowCart" v-on:close="closeModal" v-show="mdShowCart">
			<p slot="message">
				
				<svg class="icon-status-ok">
		              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status"></use>
		        </svg>
				<span>加入购物车成功</span>
			</p>
			<div slot="btnGroup">
				<a href="javascript:;" class="btn btn--m" @click = "mdShowCart = false">继续购物</a>
				<router-link href="javascript:;" class="btn btn--m" to="/cart">查看购物车</router-link>
			</div>
		</Modal>
		<nav-footer></nav-footer>
	</div>
</template>

<script>
  	import NavHeader from './../components/NavHeader'
  	import NavFooter from './../components/NavFooter'
  	import NavBread from './../components/NavBread'
  	import Modal from './../components/Modal'
 	import axios from 'axios'	
	export default {
		data(){
			return{
				goodsList:[],
				priceFilter:[
					{
						startPrcie:'0.00',
						endPrice:'500.00'
					},
					{
						startPrcie:'500.00',
						endPrice:'1000.00'
					},
					{
						startPrcie:'1000.00',
						endPrice:'5000.00'
					}
				],
				priceChecked:'all',
				filterBy:false,
				overLayFlag:false,
				sortFlag:true,
				page:1,
				pageSize:8,
				busy:true,
				loadPic:true,
				mdShow:false,
				mdShowCart:false
			}
		},
		components:{
			NavHeader,
			NavBread,
			NavFooter,
			Modal
		},
		mounted(){
			this.getGoodsList()
		},
		methods:{
			addCart(productId){
				axios.post('/goods/addCart',{productId:productId}).then((res)=>{
					res = res.data;
					if(res.status=='0'){
						this.mdShowCart = true;
						this.$store.commit('updateCartCount',1)
					}else{
						this.mdShow =  true;
					}
				})
			},
			getGoodsList(flag){
				var param ={
					page:this.page,
					pageSize:this.pageSize,
					sort:this.sortFlag ? 1 : -1,
					priceLevel:this.priceChecked
				}
				axios.get('./goods/list',{params:param}).then((result)=>{
					if(result.data.status =='0'){
						if(flag){
							this.goodsList =this.goodsList.concat(result.data.result.list);
							console.log(result.data.result.count);
							if(result.data.result.count < this.pageSize){
								this.busy = true;
								this.loadPic = false;
							}else{
								this.busy = false;
								this.loadPic = true;
							}

						}else{
							this.goodsList = result.data.result.list;
							this.busy = false;
							this.loadPic = true;
						}
					}else{
						this.goodsList = [];
					}
					
				})
			},
			sortGoods(){
				this.sortFlag = !this.sortFlag;
				this.page = 1;
				this.getGoodsList()
			},
			loadMore(){
				this.busy = true;
				setTimeout(()=>{
					this.page++;
					this.getGoodsList(true)	
				},500)
			},
			showFilterPop(){
				this.filterBy=true;
				this.overLayFlag=true;
			},
			setPriceFilter(i){
				this.priceChecked=i;
				this.page=1;
				this.closePop();
				this.getGoodsList();
			},
			closePop(){
				this.filterBy=false;
				this.overLayFlag=false;	
			},
			closeModal(){
				this.mdShow = false;
				this.mdShowCart = false;
			}
		}
	}
</script>
<style>
	.list-wrap ul::after{
		content: "";
		display: table;
		height: 0;
		clear: both;
	}
	.load-more{
		height: 100px;
		line-height: 100px;
		text-align: center;
		font-size: 20px;
	}
	.icon-arrow-short{
		background: url('../../static/jiantou.jpg') center center;
		background-size: 100% 100%; 
		transition: all .3s ease-out;
	}
	.sort-up{
		transform:rotate(-180deg);
		transition: all .3s ease-out;
	}
	.btn:hover{
		background-color: #ffe5e6;
		transition: all .3s ease-out;
	}
</style>