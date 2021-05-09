<template>
  <div>
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/post' }">帖子管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-table  @expand-change="detail"
      :row-key="getRowKeys" 
      :expand-row-keys="expands" 
      :data="tableData"
      stripe
      style="width: 100%">
        <el-table-column prop="index" label="序号" width="80">
          <template slot-scope="scope">
            {{scope.$index + (currentPage-1)*pageSize + 1}}
            <!-- {{scope.row.novels_id}} -->
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form style="background-color:#ccc;padding:10px;" label-position="left" inline class="demo-table-expand">
              <el-form-item label="帖子详情:">
                <!-- <el-avatar shape="square" :size="32" :src="props.row.wx_avatar_url"></el-avatar> -->
                <span style="font-size:16px;font-weight:bold">{{ props.row.p_content }}</span>
              </el-form-item>
              <el-form-item label="附图:" v-if="props.row.p_img_url != null">
                  <img style="box-shadow:0 0 10px #ccc;margin:10px" v-for="(item,index) in props.row.p_img_url" :src="item" alt="" :key="index" width="80" />
              </el-form-item>
              <el-form-item label="评论列表：">
                <span v-if="comments.length == 0">暂无评论</span>
                <div v-for="(item,index) in comments" :key="index">
                  <div style="display:flex;flex-direction:row;align-items:center;">
                    <el-avatar style="margin-right:10px" shape="square" :size="30" :src="item.wx_avatar_url"></el-avatar>
                    <span>{{item.wx_name}} : </span>
                    <span>{{item.c_content}}</span>
                  </div>
                  <p style="color:#506d6f;font-size:12px;line-height:12px;margin:0;text-align:right">
                    <a href="javascript:;" @click="del(item.c_id)">删除</a>
                    {{item.created_at}}
                  </p>
                  <el-divider></el-divider>
                </div>
                
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="帖子内容"
          prop="p_content">
        </el-table-column>
        <el-table-column label="发帖人" prop="wx_name">
          <template slot-scope="scope">
            <el-tag type="info">{{scope.row.wx_name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="点赞数"
          prop="p_likes_num">
        </el-table-column>
        <el-table-column
          label="评论数"
          prop="p_comments_num">
        </el-table-column>
        <el-table-column sortable
          label="发帖时间"
          prop="created_at">
        </el-table-column>
        <el-table-column prop="p_id" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" plain @click="delPost(scope.row.p_id)">删除</el-button>
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
      expands: [],
      getRowKeys: (row) => {
        return row.p_id
      },
      pageSize:4,
      total:0,
      comments:[],
      pid:-1
    }
  },
  mounted() {
    this.loadList();
  },
  methods:{
    detail (row, expandedRows) {
      var that = this
      if (expandedRows.length) {
        that.expands = []
        if (row) {
          that.expands.push(row.p_id)
        }
        this.pid = row.p_id;
        this.loadComts()
        
      } else {
        that.expands = []
      }
    },
    delPost(pid) {
      this.$msgbox.confirm("确认删除?", "删除帖子", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      }).then(() => {
        let url = `/post/delete/${pid}`
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
          message: '已取消删除'
        });          
      });
    },
    async loadComts() {
      const url = `/comment/list?ptype=3&pid=${this.pid}`;
      const res = await this.$http.get(url);
      this.comments = res.data;
    },
    async loadList() {
      const url = `/post/list?curPage=${this.currentPage}&pageSize=${this.pageSize}`;
      const res = await this.$http.get(url);
      console.log(res)
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
    del(cid) {
      this.$confirm('此操作将删除该条评论, 是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = `/comment/delete/${cid}`
        this.$http.get(url).then(res=>{
          this.loadComts();
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

.demo-table-expand label {
  width: 90px;
  color: #506d6f;
  font-weight: bold;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.el-form-item__content{
  width:100%;
  padding:10px;
}
</style>