<template>
	<div>
		<nav-header></nav-header>
		<nav-bread>
			<span>edit goods</span>
		</nav-bread>
		<div class="container-fluid">
		    <div class="row">
		        <div class="col-sm-2">
				 	<a href="javascript:;" class="list-group-item active">商品管理</a>
		
					<router-link class="list-group-item" to="/admin">商品列表</router-link>
					<router-link class="list-group-item" to="/admin/add">增加商品</router-link>
				    
		        </div>
		        <div class="col-sm-10">
		            <ol class="breadcrumb">
		                <li class="active">商品管理
		                </li>
		                <li class="active">商品编辑
		                </li>
		            </ol>
		            
						 <div class="form-group">
						    <label for="name1" >商品名称</label>
						    <input type="hidden" name="id" />
						    <input type="text" v-model="productName" class="form-control" id="name1" name="name">
						  </div>
						  <div class="form-group">
						    <label for="age">商品价格</label>
						    <input type="text" v-model="price" class="form-control" name="age" id="age" >
						  </div>
						  <div class="form-group">
						    <label for="classname">商品编号</label>
						    <input type="text" v-model="id" class="form-control"    >
						  </div>
						  <!-- <div class="form-group">
						  	<div class="row">
						  							  <div class="col-xs-6 col-md-3">
						  							    <a href="#" class="thumbnail">
						  							      <img :src="/sattic/" alt="">
						  							    </a> 
						  							  </div>
						  							  <input type="file" >
						  							</div>
						    <label for="classname">图片</label>
						  </div> -->
						  <button class="btn btn-default" @click.stop="edit">Submit</button>
					
		        </div>
		    </div>
		</div>
		<Modal v-bind:mdShow="mdShow" v-on:close="closeModal" v-show="mdShow==true">
			<p slot="message">
				商品信息修改成功！！
			</p>
			<div slot="btnGroup">
				<a href="javascript:;" class="btn btn--m" @click = "mdShow = false">关闭</a>
			</div>
		</Modal>
		<nav-footer></nav-footer>
	</div>
</template>

<script>
	import NavHeader from './../../components/NavHeader'
  	import NavFooter from './../../components/NavFooter'
  	import NavBread from './../../components/NavBread'
  	import Modal from './../../components/Modal'
  	import axios from 'axios'
	export default {
		data(){
			return{
				productId:this.$route.params.goodId,
				product:'',
				id:'',
				price:'',
				productName:'',
				_id:'',
				mdShow:false
			}
		},
		mounted(){
			this.init()
		},
		methods:{
			closeModal(){
				this.mdShow=false
			},
			init(){
				axios.get('/admin/search',{params:{id:this.productId}}).then((response)=>{
					let res = response.data;
					if(res.status == '0'){
						this.product = res.result[0]
						this.productName = res.result[0].productName,
						this.price = res.result[0].salePrice;
						this.id = res.result[0].productId;
						this._id = res.result[0]['_id'];
					}else{
						alert(res.msg)
					}
				})
			},
			edit(){
				axios.post('/admin/edit',{id:this.id,price:this.price,name:this.productName,_id:this._id}).then((response)=>{
					let res = response.data;
					if(res.status == '0'){
						this.mdShow = true;
					}
				})
			}
		},
		components:{
			NavHeader,
			NavBread,
			NavFooter,
			Modal
		}
	}
</script>

<style scoped>
	@import './../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
</style>