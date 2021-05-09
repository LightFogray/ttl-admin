<template>
  <div>
    <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
      <el-card class="box-card" style="width:400px;min-height:300px;margin-top:160px">
        <h2 style="text-align:center;color:#506d6f">TenderLand文学社区管理系统</h2>
        <el-form style="width:90%" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="ruleForm.name" style="width:240px"></el-input>
          </el-form-item>
          <el-form-item type="password" label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" style="width:240px"></el-input>
          </el-form-item>
          <el-form-item style="text-align:right;width:240px">
            <el-button type="primary" style="background-color:#506d6f;border-color:#506d6f" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        password: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
    
  },

  mounted() {
    document.querySelector('body').setAttribute('style', 'background-color:#506d6f')
  },
  beforeDestroy() {
    document.querySelector('body').removeAttribute('style')
  },
  methods:{
    login(){
      const url = '/login';
      const data = {name: this.ruleForm.name, password:this.ruleForm.password};
      this.$http.post(url, data)
      .then(res=>{
        // console.log(res.data);
        if (res.data != null) {
          this.$message.success("登录成功");
          window.sessionStorage.setItem('adminInfo',res.data);
          this.$router.push('/chart')
        }else{
          this.$message.error("用户名或密码不正确");
        }
        
      }).catch(err=>{
        this.$message.error("服务器访问出错");
      })
    }
  }
}
</script>
