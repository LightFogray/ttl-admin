<template>
    <div>
        <el-card class="box-card" v-loading="loading">
            <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/fake' }">通知管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/fake' }">发布通知</el-breadcrumb-item>
            </el-breadcrumb>
            <el-divider></el-divider>
          <el-form :model="notice">
            <el-form-item label="通知标题" label-width="70px">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-input type="text" placeholder="请填写通知标题" v-model="notice.title"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="通知对象">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-select v-model="notice.target" placeholder="请选择通知对象">
                    <el-option v-for="(item,index) in options" :label="item.name" :value="item.id" :key="index"></el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <el-row>
            <el-col :lg="22">
              <el-tiptap
                v-model="notice.content"
                :extensions="extensions"
                placeholder="请填写通知内容"
                lang="zh"
              />
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="22">
              <el-button type="primary" @click="sub"
              style="margin:20px 0;background-color:#506d6f !important;border:none;float:right">发布</el-button>
            </el-col>
          </el-row>
        </el-card>

        
    </div>
</template>
<script>
import 'element-tiptap/lib/index.css';
import { ElementTiptap,Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Image,
  CodeBlock,
  FontType,
  Indent
  
  } from 'element-tiptap';
  export default {
    components: {
    'el-tiptap': ElementTiptap
  },
    data() {
      return {
        loading:true,
        notice:{
          title:'',
          content:'',
          target:'',
          from:''
        },
        options:[],
        extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }),
        new Underline({ bubble: true, menubar: false }),
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new Image(),
        new CodeBlock(),
        new FontType(),
        new Indent()
      ],
      }
    },
    created(){
        setTimeout(()=>{
            this.loading = false
        },500)
    },
    mounted(){
      this.notice.from = window.sessionStorage.getItem('adminInfo');
      this.loadUsers();
    },
    methods:{
      async loadUsers(){
        const url = `/user/nlist`;
        const res = await this.$http.get(url);
        console.log(res.data);
        this.options = res.data
      },
      sub() {
        const url = '/notice/add';
        const data = this.notice;
        this.$http.post(url, data)
        .then(res=>{
          if (res.data != null) {
            this.$message.success("发布通知成功");
            this.$router.push('/notice/add')
          }else{
            this.$message.error("发布失败用户名或密码不正确");
          }
          
        }).catch(err=>{
          this.$message.error("服务器访问出错");
        })
      }
    }
    
  }
</script>