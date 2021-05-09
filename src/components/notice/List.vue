<template>
  <div>
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/notice/list' }">通知管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="index" label="序号" width="80">
          <template slot-scope="scope">
            {{scope.$index + (currentPage-1)*pageSize + 1}}
            <!-- {{scope.row.novels_id}} -->
          </template>
        </el-table-column>
        <el-table-column prop="title" label="通知标题" width="140"></el-table-column>
        <el-table-column prop="content" label="通知内容" width="350">
          <template slot-scope="scope">
            <p v-html="scope.row.content"></p>
          </template>
        </el-table-column>
        <el-table-column prop="wx_name" label="接收用户" width="140"
        :filters="users"
        :filter-method="filterUser"
        filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag type="info">{{scope.row.wx_name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" sortable label="通知时间" width="200"></el-table-column>
        
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="danger" plain @click="del(scope.row.id)">删除</el-button>
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
      users:[]
    }
  },
  mounted() {
    this.loadUsers();
    this.loadList();
  },
  methods:{
    async loadUsers() {
      const url = `/user/nlist`;
      const res = await this.$http.get(url);
      this.users = res.data.map(function(item){
        item.text = item.name;
        item.value = item.name;
        return item;
      })
    },
    async loadList() {
      const url = `/notice/list?curPage=${this.currentPage}&pageSize=${this.pageSize}`;
      const res = await this.$http.get(url);
      this.total = res.data.total[0].total
      this.tableData = res.data.data
      console.log(res.data)
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.loadList();
    },
    filterUser(value, row) {
      return row.wx_name === value;
    },
    del(id) {
      this.$msgbox.confirm("确定删除?", "提示信息", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      }).then(() => {
        const url = `/notice/remove?nid=${id}`;
        const res = this.$http.get(url).then((item)=>{
          if (item.data == 1) {
            this.$message.success('删除成功');
            this.loadList();
          }else{
            this.$message.info('删除失败');
          }
        });
      })
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