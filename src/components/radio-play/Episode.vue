<template>
  <div>
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/radio' }">广播剧</el-breadcrumb-item>
        <el-breadcrumb-item>{{rname}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="info" style="background-color:#506d6f;border:none" @click="addEpisode">+ 添加新集</el-button>
      <el-table :data="tableData" stripe
       style="width: 100%">
        <el-table-column sortable :sort-by="e_number" prop="index" label="集数" width="100">
          <template slot-scope="scope">
            第{{scope.row.e_number}}集
          </template>
        </el-table-column>
        <el-table-column prop="e_title" label="该集标题" width="140"></el-table-column>
        <el-table-column prop="e_src" label="音频文件" width="400">
          <template slot-scope="scope">
            <audio controls style="width:400px;box-shadow:0 0 10px #506d6f">
              <source :src="scope.row.e_src" type="audio/mp3">
            </audio>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" sortable label="发布时间" width="200"></el-table-column>
        <el-table-column prop="e_id" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="warning" plain @click="edit(scope.row.e_id,scope.row.e_title,scope.row.e_number)">修改</el-button>
            <el-button type="danger" plain @click="del(scope.row.e_id)">删除</el-button>
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
    <el-dialog title="添加新集" :visible.sync="dialogFormVisible">
      <el-form :model="episodeForm">
        <el-form-item label="添加集数" :label-width="formLabelWidth">
          <el-input type="number" placeholder="请填写添加集数,只能填写数字" style="width:300px" v-model="episodeForm.num"></el-input>
        </el-form-item>
        <el-form-item label="该集标题" :label-width="formLabelWidth">
          <el-input v-model="episodeForm.title" placeholder="请填写该集标题" style="width:300px" type="text"></el-input>
        </el-form-item>
        <el-form-item label="上传音频" :label-width="formLabelWidth">
          <el-upload style="width:300px" 
            ref="uploads"
            :auto-upload="false"
            class="upload-demo"
            action="http://127.0.0.1:7001/admin/radioplay/upload" 
            :data="episodeForm"   
            :on-success="upFile"
            :on-exceed="handleExceed"
            :before-upload="handleAdd"
            multiple
            :limit="1"
            name="files"
            :file-list="fileList"
            accept=".mp3,.wav,.m4a" 
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改剧集信息" :visible.sync="updateFormVisible">
      <el-form :model="updateForm">
        <el-form-item label="修改集数" :label-width="formLabelWidth">
          <el-input type="number" style="width:300px" v-model="updateForm.num"></el-input>
        </el-form-item>
        <el-form-item label="该集标题" :label-width="formLabelWidth">
          <el-input v-model="updateForm.title"  style="width:300px" type="text"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdate()">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rid:-1,
      rname:"",
      currentPage:1,
      tableData:[],
      pageSize:4,
      total:0,
      dialogFormVisible:false,
      updateFormVisible:false,
      formLabelWidth: '120px',
      episodeForm:{
        title:'',
        num:0,
        rid:-1,
      },
      updateForm:{
        title:'',
        num:0,
        eid:-1,
        rid:-1
      },
      fileList:[],
      replaceList:[],
    }
  },
  mounted() {
    console.log(this.$route.params)
    this.rid = this.$route.params.rid;
    this.loadList();
    this.findNameByRid();
  },
  methods: {
    edit(eid,title,num) {
      this.updateFormVisible = true;
      this.updateForm.title = title;
      this.updateForm.num = num;
      this.updateForm.eid = eid;
    },
    del(eid) {
      this.$msgbox.confirm("确认删除?", "删除剧集", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      }).then(() => {
        let url = `/radioplay/episode/delete/${eid}`
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
    async findNameByRid() {
      const url = `/radioplay/name/${this.rid}`;
      const res = await this.$http.get(url);
      // console.log(res)
      this.rname = res.data[0].r_name;

    },
    async loadList() {
      const url = `/radioplay/episode?curPage=${this.currentPage}&pageSize=${this.pageSize}&rid=${this.rid}`;
      const res = await this.$http.get(url);
      this.total = res.data.total[0].total
      this.tableData = res.data.data
      // console.log(res)
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
    addEpisode() {
      this.episodeForm.rid = this.rid;
      this.dialogFormVisible = true;
    },
    submitForm() {
      this.$msgbox.confirm("确定添加?", "添加剧集", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      }).then(() => {
        this.$refs.uploads.submit();
      })
    },
    submitUpdate() {
      this.$msgbox.confirm("确定修改?", "修改剧集信息", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      }).then(() => {
        let url = '/radioplay/episode/update'
        this.$http.post(url, {
          eid:this.updateForm.eid,
          title:this.updateForm.title,
          num:this.updateForm.num
        }).then(res=>{
          this.updateFormVisible = false;
          this.loadList();
          this.$message({
            type: 'success',
            message: res.data
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });          
      });
    },
    /* 上传文件操作 */
    upFile(res, file) {
      console.log(res);
      if (res.status == 200) {
        // 文件上传成功后的回调，比如一些提示信息或者页面跳转都写在这里
        this.$message.success(res.msg);
        this.dialogFormVisible = false;
        this.loadList();
      } else {
        this.$message.error(res.msg);
        let _this = this;
        setTimeout(function() {
          _this.$refs.uploads.clearFiles();
        }, 1000);
      }
    },
    handleAdd(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.')+1)
      const extension = testmsg === 'mp3'
      if(!extension){
        this.$message({
          message:"上传失败！上传文件只能是mp3格式！",
          type:'error'
        })
      }
      return extension;
    },
    handleExceed(file) {
      this.$message({
        message: "上传文件超出限制个数！",
        type: "warning"
      });
    },
  }
}
</script>