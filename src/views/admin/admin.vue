<template>
	<div>
		<nav-header></nav-header>
		<nav-bread>
			<span>admin</span>
		</nav-bread>
		<div class="container-fluid">
		    <div class="row">
		        <div class="col-sm-2">
				 	<a href="javascript:;" class="list-group-item active">商品管理</a>

					<router-link class="list-group-item" to="/admin">商品列表</router-link>
					<router-link class="list-group-item" to="/admin/add">增加商品</router-link>
				    <!-- <a href="javascript:;" class="list-group-item">
				        商品列表</a> -->
				    <!-- <a href="javascript:;" class="list-group-item">
				        增加商品</a> -->
		        </div>
		        <div class="col-sm-10">
		            <ol class="breadcrumb">
		                <li class="active">商品管理
		                </li>
		                <li class="active">商品列表
		                </li>
		            </ol>
		            <div class="panel panel-default">
		                <div class="panel-heading">
		                    搜索
		                </div>
		                <div class="panel-body">
		                    <form role="form" class="form-inline">
		                        <div class="form-group">
		                            <label for="name">名称</label>
		                            <input type="text" class="form-control" id="name" placeholder="请输入名称" v-model="searchName" @keyup.enter="searchList">
		                        </div>

		                        <div class="form-group">
		                            <button  class="btn btn-default" @click="searchList">开始搜索</button>
		                        </div>
		                    </form>
		                </div>
		            </div>
		            <!--
		                列表展示
		            -->
		            <div class="table-responsive">
		                <table class="table table-striped ">
		                    <thead>
		                    <tr>
		                        <th>编号</th>
		                        <th>图标</th>
		                        <th>名称</th>
		                        <th>价格</th>
		                        <th class="text-center">操作</th>
		                    </tr>
		                    </thead>
		                    <tbody>

		                    <tr v-for="(item,index) in newList">
		                        <td>{{item.productId}}</td>
		                        <td><img style="width:60px;" :src="'/static/'+item.productImage" /></td>
		                        <td>{{item.productName}}</td>
		                        <td>{{item.salePrice}}</td>
		                        <td class="text-center">
		                        	<router-link :to="{name:'editgoods',params:{goodId:item.productId} }">编辑</router-link>
		                        	<!-- <a href="javascript:;">编辑</a>  -->
		                        	<a href="javascript:;" @click="delGood(item.productId)">删除</a>
		                        </td>
		                    </tr>
		                    </tbody>
		                </table>
		            </div>

		        </div>
		    </div>
		</div>
		<my-page :total="total" :current-page='current' @pagechange="pagechange"></my-page>
		<Modal v-bind:mdShow="mdShow" v-on:close="closeModal" v-show="mdShow==true">
			<p slot="message">
				删除商品信息成功！！
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
  	import MyPage from './../../components/MyPage.vue'
  	import Modal from './../../components/Modal'
  	import axios from 'axios'
	export default {
		data(){
			return{
				list:[],
				searchName:'',
				mdShow:false,
				newList:[],
				total: 150,     // 记录总条数
        display: 10,   // 每页显示条数
        current: 1,   // 当前的页数
			}
		},
		mounted(){
			this.init()
		},
		methods:{
			init(){
				this.pagechange(1)
			},
			closeModal(){
				this.mdShow = false;
			},
			delGood(id){
				axios.post('/admin/del',{productId:id}).then((response)=>{
					let res = response.data;
					if(res.status == '0'){
						this.mdShow = true;
						this.init();
					}
				})
			},
			 pagechange:function(currentPage){
		       console.log(currentPage);
		       // ajax请求, 向后台发送 currentPage, 来获取对应的数据
				axios.get('/admin/list',{params: {currentPage: currentPage,pageSize:this.display} }).then((response)=>{
					let res =response.data;
					this.newList = res.result.list;
					this.total = res.result.count;
					this.list = res.result.list
				})
		     },
			searchList(){
				if(this.searchName){
					this.newList = this.newList.filter((item)=>{
						return item.productName.indexOf(this.searchName) > -1
					})
				}else{
					this.newList = this.list;
					// console.log(this.list,this.newList)
				}
			}
		},
		components:{
			NavHeader,
			NavFooter,
			NavBread,
			MyPage,
			Modal
		}
	}
</script>

<style scoped>
	@import './../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
</style>
