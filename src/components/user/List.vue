<template>
  <div>
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/user' }">用户管理</el-breadcrumb-item>
      </el-breadcrumb>
      <template>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input @change="search" v-model="keyword" clearable placeholder="请输入用户名称">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
        </el-row>
      </template>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="index" label="序号" width="80">
          <template slot-scope="scope">
            {{scope.$index + (currentPage-1)*pageSize + 1}}
            <!-- {{scope.row.novels_id}} -->
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用户名" width="140"></el-table-column>
        <el-table-column prop="penname" label="笔名" width="140"></el-table-column>
        <el-table-column prop="avatar" label="头像" width="140">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" width="70" alt="" style="box-shadow:0 0 10px #506d6f">
          </template>
        </el-table-column>
        <el-table-column prop="novels" label="作品" width="380">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.novels == null">暂无作品</el-tag>
            <el-tag style="margin:5px;"
            type="success" v-for="(item,index) in scope.row.novels" :key="index">{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="openid" label="操作" width="150">
          <template slot-scope="scope">
            <el-button v-if="scope.row.power == 1" type="success" plain @click="unKnockUser(scope.row.openid)">解封账号</el-button>
            <el-button v-else type="danger" plain @click="knockUser(scope.row.openid)">封禁账号</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[4, 8, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </template>
    </el-card>
  </div>
</template>
<script>
export default {
  data(){
    return  {
      currentPage:1,
      tableData:[],
      pageSize:4,
      total:0,
      keyword:""
    }
  },
  mounted() {
    this.loadList();
  },
  methods:{
    async loadList() {
      const url = `/user/list?curPage=${this.currentPage}&pageSize=${this.pageSize}&keyword=${this.keyword}`;
      const res = await this.$http.get(url);
      // console.log(res);
      this.total = res.data.total[0].total
      this.tableData = res.data.data
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.loadList();
    },
    knockUser(openid) {
      this.$prompt('输入封禁该账号原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        let url = '/user/knock'
        this.$http.post(url, {
          openid:openid,
          reason:value
        }).then(res=>{
          this.loadList();
          this.$message({
            type: 'success',
            message: res.data
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });       
      });
    },
    unKnockUser(openid) {
      this.$confirm('此操作将解封该账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/user/unknock'
        this.$http.post(url, {
          openid:openid
        }).then(res=>{
          this.loadList();
          this.$message({
            type: 'success',
            message: res.data
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消解封'
        });          
      });
    },
    search() {
      this.loadList();
    }
  }
}
</script>
<style>
.el-breadcrumb {
  height: 30px;
}
.el-pagination {
  margin-top: 20px;
}
</style>