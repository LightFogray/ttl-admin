<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane label="未处理" name="undispose">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="index" label="序号" width="80">
          <template slot-scope="scope">
            {{scope.$index + (currentPage-1)*pageSize + 1}}
            <!-- {{scope.row.novels_id}} -->
          </template>
        </el-table-column>
        <el-table-column prop="wx_name" label="举报人" width="120"></el-table-column>
        <el-table-column prop="a_desc" label="举报信息描述" width="320"></el-table-column>
        <el-table-column prop="a_img_url" label="图片凭证" width="140">
          <template slot-scope="scope">
            <el-button v-if="scope.row.a_img_url != null" type="info" plain @click="watchPics(scope.row.a_img_url)"><i class="el-icon-picture-outline"></i>查看附图</el-button>
            <el-tag type="info" v-else>未附图</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="举报类型" width="120">
          <template slot-scope="scope">
            <el-tag type="primary">{{scope.row.type}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" sortable label="举报时间" width="160"></el-table-column>
        
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="warning" plain @click="dispose(scope.row.a_id)">处理</el-button>
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
    </el-tab-pane>
    <el-tab-pane label="已处理" name="disposed">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="index" label="序号" width="80">
          <template slot-scope="scope">
            {{scope.$index + (currentPage-1)*pageSize + 1}}
            <!-- {{scope.row.novels_id}} -->
          </template>
        </el-table-column>
        <el-table-column prop="wx_name" label="举报人" width="100"></el-table-column>
        <el-table-column prop="a_desc" label="举报信息描述" width="140"></el-table-column>
        <el-table-column prop="a_img_url" label="图片凭证" width="140">
          <template slot-scope="scope">
            <el-button v-if="scope.row.a_img_url != null" type="info" plain @click="watchPics(scope.row.a_img_url)"><i class="el-icon-picture-outline"></i>查看附图</el-button>
            <el-tag type="info" v-else>未附图</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="举报类型" width="100">
          <template slot-scope="scope">
            <el-tag type="primary">{{scope.row.type}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" sortable label="举报时间" width="100"></el-table-column>
        <el-table-column prop="a_dispose" label="处理结果" width="200"></el-table-column>
        <el-table-column prop="disposed_at" sortable label="处理时间" width="100"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="danger" plain @click="del(scope.row.a_id)">删除</el-button>
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
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  export default {
    data() {
      return {
        currentPage:1,
        tableData:[],
        pageSize:6,
        total:0,
        activeName: 'undispose'
      };
    },
    mounted() {
      this.loadList(0);
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab.name);
        if (tab.name == 'disposed') {
          this.loadList(1)
        } else {
          this.loadList(0)
        }
      },
      async loadList(status) {
        const url = `/accusation/list?curPage=${this.currentPage}&pageSize=${this.pageSize}&status=${status}`;
        const res = await this.$http.get(url);
        this.total = res.data.total[0].total
        this.tableData = res.data.data
        console.log(this.tableData)
      },
      del(aid) {
        this.$msgbox.confirm("确认删除?", "删除该条举报信息", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          type: "warning",
        }).then(() => {
          let url = `/accusation/delete/${aid}`
          this.$http.get(url).then(res=>{
            this.loadList(1);
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
      handleSizeChange(val) {
        this.pageSize = val;
        this.loadList();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.loadList();
      },
      dispose(aid) {
        this.$prompt('输入最终处理结果', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          let url = '/accusation/dispose'
          this.$http.post(url, {
            a_id:aid,
            a_status:1,
            a_dispose:value
          }).then(res=>{
            this.loadList(0);
            this.$message({
              type: 'success',
              message: res.data
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消处理'
          });       
        });
      }
    }
  };
</script>