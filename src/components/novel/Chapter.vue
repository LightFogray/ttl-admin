<template>
  <div>
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/novel' }">小说管理</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column sortable prop="index" label="章节" width="100">
          <template slot-scope="scope">
            第{{scope.row.nc_number}}章
          </template>
        </el-table-column>
        <el-table-column prop="nc_title" label="章节标题" width="200"></el-table-column>
        <el-table-column prop="nc_id" label="章节内容" width="220">
          <template slot-scope="scope">
            <el-button type="info" plain @click="watch(scope.row.nc_id)"><i class="el-icon-document"></i>查看本章内容</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="章节发布时间" width="200"></el-table-column>
        <el-table-column prop="e_id" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="danger" v-if="scope.row.status==0" plain @click="updateStatus(scope.row.nc_id,'封锁',1)">封锁该章节</el-button>
            <el-button type="success" v-else plain @click="updateStatus(scope.row.nc_id,'解封',0)">解封该章节</el-button>
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
  data() {
    return {
      nid:-1,
      currentPage:1,
      tableData:[],
      pageSize:4,
      total:0,
    }
  },
  mounted() {
    console.log(this.$route.params)
    this.nid = this.$route.params.nid;
    this.loadList();
  },
  methods: {
    async watch(ncid){
      const url = `/novel/chapters/${ncid}`;
      const res = await this.$http.get(url);
      this.$alert(res.data[0].nc_content, '章节内容', {
        dangerouslyUseHTMLString: true,
        customClass:"n-alert"
      });
    },
    async loadList() {
      const url = `/novel/chapters?curPage=${this.currentPage}&pageSize=${this.pageSize}&nid=${this.nid}`;
      const res = await this.$http.get(url);
      this.total = res.data.total[0].total
      this.tableData = res.data.data
      console.log(res)
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.loadList();
    },
    updateStatus(ncid,opt,status) {
      this.$confirm(`此操作将${opt}该章节, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/novel/chapter/restatus'
        this.$http.post(url, {
          nc_id:ncid,
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
  }
}
</script>
<style lang="scss">
  .n-alert {
    width:620px;
    height: 600px;
    .el-message-box__container{
      height: 500px;
      overflow: auto;
    }
  }
</style>