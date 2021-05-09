<template>
  <div>
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/video' }">视频管理</el-breadcrumb-item>
      </el-breadcrumb>
      <template>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input @change="search" v-model="keyword" clearable placeholder="请输入视频名称">
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
        <el-table-column prop="v_title" label="视频名称" width="140"></el-table-column>
        <el-table-column prop="v_intro" label="简介" width="140"></el-table-column>
        <el-table-column prop="v_cover_img" label="封面图" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.v_cover_img" width="80" alt="" style="box-shadow:0 0 10px #506d6f">
          </template>
        </el-table-column>
        <el-table-column prop="v_src" label="视频" width="120">
          <template slot-scope="scope">
            <el-button type="info" plain @click="play(scope.row.v_src)"><i class="el-icon-video-play"></i>播放</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="wx_name" label="发布者" width="80"></el-table-column>
        <el-table-column prop="v_likes_num" sortable label="点赞数" width="70"></el-table-column>
        <el-table-column prop="v_collects_num" sortable label="收藏数" width="70"></el-table-column>
        <el-table-column prop="v_play_times" sortable label="播放次数" width="70"></el-table-column>
        <el-table-column prop="created_at" sortable label="发布时间" width="100"></el-table-column>
        <el-table-column prop="" label="操作" width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == 1" type="success" plain @click="updateStatus(scope.row.v_id,'上线',0)">上线</el-button>
            <el-button v-else type="danger" plain @click="updateStatus(scope.row.v_id,'下架',1)">下架</el-button>
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
      
    }
  },
  mounted() {
    this.loadList();
  },
  methods:{
    play(src) {
      this.$alert(`<video style="width:90%;margin:0 auto;" ref="video" src="${src}" controls width="380" autoplay></video>`, '视频详情', {
        dangerouslyUseHTMLString: true
      }).then(()=>{

      });
    },
    async loadList() {
      const url = `/video/list?curPage=${this.currentPage}&pageSize=${this.pageSize}&keyword=${this.keyword}`;
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
    updateStatus(vid,opt,status) {
      this.$confirm(`此操作将${opt}该短剧, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/video/restatus'
        this.$http.post(url, {
          v_id:vid,
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
</style>