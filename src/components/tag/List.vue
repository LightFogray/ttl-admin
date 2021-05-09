<template>
  <div>
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/tag' }">标签管理</el-breadcrumb-item>
      </el-breadcrumb>
      <template>
        <el-button @click="addTag"
            type="primary" 
            style="background-color:#506d6f !important;border:none">+ 添加新标签</el-button>
      </template>
      
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="index" label="序号" width="80">
          <template slot-scope="scope">
            {{scope.$index + (currentPage-1)*pageSize + 1}}
            <!-- {{scope.row.novels_id}} -->
          </template>
        </el-table-column>
        <el-table-column prop="t_name" label="标签名">
          <template slot-scope="scope">
            <el-tag type="primary">{{scope.row.t_name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button plain @click="modify(scope.row.id,scope.row.t_name)">修改</el-button>
            <el-button type="danger" plain @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[6, 12, 18]"
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
      pageSize:6,
      total:0,
      
    }
  },
  mounted() {
    this.loadList();
  },
  methods:{
    async loadList() {
      const url = `/tag/alllist?curPage=${this.currentPage}&pageSize=${this.pageSize}`;
      const res = await this.$http.get(url);
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
    addTag() {
      this.$prompt('输入新标签名', '添加新标签', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        let url = '/tag/add'
        this.$http.post(url, {
          t_name:value
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
          message: '取消添加'
        });       
      });
    },
    modify(id,val) {
      this.$prompt(`修改标签“${val}”为`, '修改标签', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        let url = '/tag/update'
        this.$http.post(url, {
          id:id,
          t_name:value
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
          message: '取消修改'
        });       
      });
    },
    del(id) {
      this.$confirm('此操作将删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = `/tag/delete/${id}`
        this.$http.get(url).then(res=>{
          this.loadList();
          this.$message({
            type: 'success',
            message: res.data
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除操作'
        });          
      });
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