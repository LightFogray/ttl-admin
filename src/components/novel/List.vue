<template>
  <div>
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/novel' }">小说管理</el-breadcrumb-item>
      </el-breadcrumb>
      <template>
        <el-row :gutter="20">
          <el-col :span="3">
            <el-dropdown @command="filterByTag">
              <el-button type="primary" style="background-color:#506d6f !important;border:none">
                选择标签<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="">全部</el-dropdown-item>
                <el-dropdown-item 
                v-for="(item,index) in aprTags" :key="index" :command="item">{{item}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col :span="6">
            <el-input @change="search" v-model="keyword" clearable placeholder="请输入小说名称">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          
        </el-row>
      </template>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="index" label="序号" width="80">
          <template slot-scope="scope">
            {{scope.$index + (currentPage-1)*pageSize + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="wx_penname" label="作者" width="120"></el-table-column>
        <el-table-column prop="n_name" label="小说名" width="120"></el-table-column>
        <el-table-column prop="n_intro" label="小说简介" width="180"></el-table-column>
        <el-table-column prop="n_cover_img" label="小说封面" width="80">
          <template slot-scope="scope">
            <img :src="scope.row.n_cover_img" width="60" alt="" style="box-shadow:0 0 10px #506d6f">
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" width="220" >
          <template slot-scope="scope">
            <el-tag style="margin:5px;"
            type="success" v-for="(item,index) in scope.row.tags" :key="index">{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="openid" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="info" plain @click="toDetail(scope.row.n_id)">查看详情</el-button>
            <el-button v-if="scope.row.status == 1" type="success" plain @click="updateStatus(scope.row.n_id,'上线',0)">上线</el-button>
            <el-button v-else type="danger" plain @click="updateStatus(scope.row.n_id,'下架',1)">下架</el-button>
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
      keyword:"",
      aprTags:[],
      keytag:""
    }
  },
  mounted() {
    this.loadTags();
    this.loadList();
  },
  methods:{
    toDetail(nid) {
      this.$router.push(`/novel/${nid}/chapter`)
    },
    async loadTags() {
      const url = `/tag/list`;
      const res = await this.$http.get(url);
      this.aprTags = res.data;
    },
    async loadList() {
      const url = `/novel/list?curPage=${this.currentPage}&pageSize=${this.pageSize}&keyword=${this.keyword}&keytag=${this.keytag}`;
      const res = await this.$http.get(url);
      // console.log(res);
      this.total = res.data.total[0].total
      this.tableData = res.data.data
    },
    filterByTag(tagname) {
      let tagtip = tagname == "" ? "全部" : `含有${tagname}标签的`; 
      this.$message.success(`查看${tagtip}小说`);
      this.keytag = tagname;
      this.loadList();
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.loadList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // console.log(`当前页: ${val}`);
      this.loadList();
    },
    updateStatus(nid,opt,status) {
      this.$confirm(`此操作将${opt}该小说, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/novel/restatus'
        this.$http.post(url, {
          n_id:nid,
          status:status
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
          message: '已取消'+ opt +'操作'
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
.el-dropdown-link {
  cursor: pointer;
  color: #506d6f;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>