<template>
  <div style="width:100%;height:100%">
    <el-container>
      <el-header>
        <el-menu
          style="border-bottom:none;position:relative"
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <span style="color:#fff;font-size:24px;line-height:60px">TenderLand原创文学社区后台管理系统</span>
          <el-submenu style="position:absolute;right:0;top:0">
            <template slot="title">管理员:[ {{name}} ]</template>
            <el-menu-item @click="logout">退出登录</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
                <el-submenu index="1">
                  <template slot="title"><i class="el-icon-s-management"></i>作品管理</template>
                  <el-menu-item index="/novel">系列小说管理</el-menu-item>
                  <!-- <el-menu-item index="1-4-1">诗歌管理</el-menu-item>
                  <el-menu-item index="1-4-1">随笔管理</el-menu-item> -->
                </el-submenu>
                <el-menu-item index="/user"><i class="el-icon-user-solid"></i>用户管理</el-menu-item>
                <el-menu-item index="/tag"><i class="el-icon-s-promotion"></i>标签管理</el-menu-item>
                <el-menu-item index="/radio"><i class="el-icon-star-on"></i>广播剧管理</el-menu-item>
                <el-menu-item index="/video"><i class="el-icon-video-camera-solid"></i>视频管理</el-menu-item>
                <el-menu-item index="/post"><i class="el-icon-s-order"></i>帖子管理</el-menu-item>
                <el-submenu index="2">
                  <template slot="title"><i class="el-icon-message-solid"></i>通知管理</template>
                  <el-menu-item index="/notice/list">通知列表</el-menu-item>
                  <el-menu-item index="/notice/add">发布通知</el-menu-item>
                </el-submenu>
                <el-menu-item index="/accusation"><i class="el-icon-s-opportunity"></i>举报信息管理</el-menu-item>
                <el-menu-item index="/chart"><i class="el-icon-s-marketing"></i>数据统计</el-menu-item>
              
            </el-menu>
          </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data(){
    return {
      name:""
    }
  },
  mounted(){
    let id = window.sessionStorage.getItem('adminInfo');
    this.$http.get(`/info/${id}`).then(res=>{
      this.name = res.data;
    });

    this.$http.get(`/accusation/getTip`).then(res=>{
      let total = res.data[0].total;
      if (total > 0) {
        this.$notify({
          title: '通知',
          message: `有${total}条举报信息未处理`,
          duration: 0,
          position: 'bottom-right'
        });
      }
      
    });


  },
  methods:{
    logout() {
      window.sessionStorage.setItem('adminInfo','');
      this.$router.push('/login')
    }
  }
}
</script>

<style>
.el-container,.el-aside {
  height: 100%;
}
.el-aside{
  background-color: rgb(81,92,100);
}
.el-header {
  background-color: rgb(81,92,100);
  /* border-bottom: 1px solid #ccc; */
}
.el-main {
  background-color: rgba(81,92,100,.1);
}
</style>