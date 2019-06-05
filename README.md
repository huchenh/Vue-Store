## shopstore
>- 商城管理系统，前台是vue + vue-router +vuex
>- 后台是node + koa + mysql 提供接口
>- sequelize 操作数据库，sequence-cli 数据迁移备份


## 项目运行
**`前台`**
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
**`后台`**
```bash
# 进入server 目录
# 创建数据库命令
..\node_modules\.bin\sequelize  db:create
# 创建表
..\node_modules\.bin\sequelize  db:migrate
# 初始数据
..\node_modules\.bin\sequelize  db:seed:all
# server目录包含后台的所有处理逻辑 启动后台
node app.js

```

## 遇到的坑
- 新版vue-lazyload 要在图片加上 :key=‘图片路径’ 图片才会随着数据改变
- sequelize 多对多联合查询 需要一张中间表 记录 users 和 商品goods 之间的联系。且 中间表（carts） 要关联到 users表和goods的主键
- 目前完成 商品展示分页接口 用户登录，注册，登出， 购物车展示接口
- 待续。。。。
## API(后台路由)设计
API概览（参照）：[https://github.com/huchenh/storeProject/blob/master/README.md]


## 数据库结构设计
### 用户表
> **Table: users**

|名称|类型|允许空|默认值|主键|说明|
|:--:|:--:|:--:|:--:|:--:|:--:|
| id | INTEGER | No | - | Yes | 用户id |
| user_id | Integer(9) | No | - | No | 用户id |
| username | VARCHAR(20) | No | - | No | 用户名 |
| password | CHAR(32) | No | - | No | 密码 |

> **Indexes**

|名称|字段|类型|
|:--:|:--:|:--:|
| user_id| user_id | unique |

### 商品表
> **Table: goods**

|名称|类型|允许空|默认值|主键|说明|
|:-:|:--:|:----:|:---:|:--:|:--:|
| id | INTEGER | No | - | Yes | 内容id |
| product_id | INTEGER | No | - | No | 商品id |
| product_name | VARCHAR(50) | No | - | No | 商品名称 |
| sale_price | INTEGER | No | 0 | No | 商品价格 |
| product_image | VARCHAR(100) | No | 0 | No | 商品图片 |
| product_url | VARCHAR(100) | No | 0 | No | 商品链接 |
> **Indexes**

|名称|字段|类型|
|:--:|:--:|:--:|
| product_id | product_id| Normal |

> 用户和商品是 多对多关系

### 用户商品表（购物车） carts

|名称|类型|允许空|默认值|主键|说明|
|:-:|:--:|:----:|:---:|:--:|:--:|
| id | INTEGER | No | - | yes | id 
| user_id | INTEGER | No | - | No | 用户id |
| product_id | INTEGER | No | - | No | 商品id |
| product_count | INTEGER | No | - | No | 商品数量 |

> **Indexes**

|名称|字段|类型|
|:--:|:--:|:--:|
| user_id | user_id| Normal |
| product_id | product_id| Normal |

> **Foreign Key** 
|名称|外键表|外键表字段|
|:--:|:--:|:--:|
| user_id | users | user_id |
| product_id | products | product_id |

### 地址表
> **Table: address**

|名称|类型|允许空|默认值|主键|说明|
|:-:|:--:|:----:|:---:|:--:|:--:|
| id | INTEGER | No | - | Yes |id |
| user_id | INTEGER | No | - | No | 用户id |
| address_id | INTEGER | No | - | No | 地址id |
| user_name | VARCHAR(10) | No | - | No | 收货人姓名 |
| street_name | VARCHAR(50) | No | - | No | 收货人姓名 |
| post_code |  VARCHAR(10) | No | - | No | 邮编 |
| tel |  VARCHAR(11) | No | - | No | 电话 |
| is_default | Interger | No | - | No | 是否默认 |

> **Indexes**

|名称|字段|类型|
|:--:|:--:|:--:|
| user_id | user_id | Normal |

> **Foreign Key**

|名称|外键表|外键表字段|
|:--:|:--:|:--:|
| user_id | users | user_id |

### 订单表
> **Table: orders**

|名称|类型|允许空|默认值|主键|说明|
|:-:|:--:|:----:|:---:|:--:|:--:|
| id | INTEGER | No | - | Yes | _id |
| user_id | INTEGER | No | - | No | 用户id |
| order_id | INTEGER | No | - | No | 订单id |
| address_id | INTEGER | No | - | No | 地址id |
| order_total | INTEGER | No | - | No | 订单金额 |

> **Indexes**

|名称|字段|类型|
|:--:|:--:|:--:|
| address_id | address_id | Normal |
| user_id | user_id | Normal |

> **Foreign Key**

|名称|外键表|外键表字段|
|:--:|:--:|:--:|
| address_id | address | address_id |
| user_id | users | user_id |

