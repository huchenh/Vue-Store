<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>add goods</span>
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
            <li class="active">商品添加
            </li>
          </ol>
          <form>
            <div class="form-group">
              <label for="name1">商品名称</label>
              <input type="hidden" name="id"/>
              <input type="text" class="form-control" v-model="productName">
            </div>
            <div class="form-group">
              <label for="age">价格</label>
              <input type="text" class="form-control" v-model="salePrice">
            </div>
            <div class="form-group">
              <label for="classname">编号</label>
              <input type="text" class="form-control" v-model="productId">
            </div>
            <div class="form-group">
              <label for="classname">图片</label>
              <input type="file" @change="update">
            </div>
            <button type="button" @click="add" class="btn btn-default">Submit</button>
          </form>

        </div>
      </div>
    </div>
    <Modal v-bind:mdShow="mdShow" v-on:close="closeModal" v-show="mdShow==true">
      <p slot="message">
        {{msg}}
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
  import Modal from './../../components/Modal';
  import axios from 'axios';
  export default {
    data() {
      return {
        imgUrl: '',
        productName: '',
        salePrice: '',
        productId: '',
        mdShow:false,
        flag:false,
        msg:'商品添加成功!!'
      }
    },
    methods: {
      closeModal(){
        this.mdShow = true;
      },
      update(e) {
        let oFile = e.target.files[0];   //获取文件对象
        let param = new FormData();    //new一个formData
        param.append('file', oFile, oFile.name);  //将文件添加到formdata中
        param.append('chunk', '0');
        let imgName = oFile.name.replace(/\.\w*/,'');
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        axios.post(`/admin/add?img=${imgName}&productId=${this.productId}&price=${this.salePrice}&productName=${this.productName}`,param,config).then((response)=>{
          let res = response.data;
          if(res.status == '0'){
            // this.mdShow = true;
            this.flag = true;
          }else{
            this.msg= res.msg;
          }
        })
      },
      add() {
        if(this.flag){
          this.mdShow =true;
        }
      }
    },
    components: {
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
