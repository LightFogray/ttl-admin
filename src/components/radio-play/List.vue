<template>
  <div>
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/radio' }">广播剧管理</el-breadcrumb-item>
      </el-breadcrumb>
      <template>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input @change="search" v-model="keyword" clearable placeholder="请输入广播剧名称">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button @click="addRadio"
            type="primary" style="background-color:#506d6f !important;border:none">+ 添加新剧</el-button>
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
        <el-table-column prop="r_name" label="剧名" width="140"></el-table-column>
        <el-table-column prop="r_intro" label="简介" width="220"></el-table-column>
        <el-table-column prop="r_cover_img" label="封面" width="120">
          <template slot-scope="scope">
            <img :src="scope.row.r_cover_img" width="60" alt="" style="box-shadow:0 0 10px #506d6f">
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" width="200">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.tags == null">暂无作品</el-tag>
            <el-tag style="margin:5px;"
            type="success" v-for="(item,index) in scope.row.tags" :key="index">{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="openid" label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="info" plain @click="toDetail(scope.row.r_id)">详情</el-button>
            <el-button v-if="scope.row.r_status == 0" type="danger" plain @click="updateStatus(scope.row.r_id,'下架',1)">下架</el-button>
            <el-button v-else type="success" plain @click="updateStatus(scope.row.r_id,'上线',0)">上线</el-button>
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
    <el-dialog title="添加新剧" :visible.sync="dialogFormVisible">
      <el-form :model="newRadioForm">
        <el-form-item label="新剧名称" :label-width="formLabelWidth">
          <el-input type="text" placeholder="请填写新剧名称" style="width:300px" v-model="newRadioForm.name"></el-input>
        </el-form-item>
        <el-form-item label="新剧简介" :label-width="formLabelWidth">
          <el-input v-model="newRadioForm.intro" placeholder="请填写新剧简介" style="width:300px" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="选择标签" :label-width="formLabelWidth">
          <div style="width:460px">
            <el-tag style="margin:5px;cursor:pointer"
              @click="choose(index)"
              v-for="(item,index) in tags"
              :key="index"
              type="primary"
              :effect="item.effect">
              {{ item.t_name }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="上传封面图" :label-width="formLabelWidth">
          <el-upload style="width:300px" 
            ref="uploads"
            :auto-upload="false"
            class="upload-demo"
            action="http://127.0.0.1:7001/admin/radioplay/cover/upload" 
            :data="newRadioForm"   
            :on-success="upFile"
            :on-exceed="handleExceed"
            :before-upload="handleAdd"
            multiple
            :limit="1"
            name="files"
            :file-list="fileList"
            accept=".jpg,.png,.jpeg" 
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
      tags:[],
      dialogFormVisible:false,
      formLabelWidth: '120px',
      newRadioForm:{
        name:'',
        intro:'',
        tag:"",
      },
      fileList:[],
      replaceList:[]
    }
  },
  mounted() {
    this.loadList();
    this.loadTags();
  },
  methods:{
    choose(index) {
      this.tags[index].effect = this.tags[index].effect == 'plain' ? 'dark' : 'plain';
    },
    async loadTags() {
      const url = `/tag/alllist`;
      const res = await this.$http.get(url);
      this.tags = res.data.data.map(function(item){
        item.effect = 'plain';
        return item;
      })
    },
    async loadList() {
      const url = `/radioplay/list?curPage=${this.currentPage}&pageSize=${this.pageSize}&keyword=${this.keyword}`;
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
    search() {
      this.loadList();
    },
    addRadio() {
      this.dialogFormVisible = true;
    },
    submitForm() {
      this.$msgbox.confirm("确定添加?", "提示信息", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      }).then(() => {
        for (let item of this.tags) {
          if (item.effect == 'dark') {
            this.newRadioForm.tag += item.id + ",";
          }
        }
        this.newRadioForm.tag = this.newRadioForm.tag.substring(0,this.newRadioForm.tag.lastIndexOf(','));
        console.log(this.newRadioForm.tag)
        this.$refs.uploads.submit();
      })
    },
    /* 上传文件操作 */
    upFile(res, file) {
      console.log(res);
      if (res.status == 200) {
        // 文件上传成功后的回调，比如一些提示信息或者页面跳转都写在这里
        this.$message.success(res.msg);
        this.resetForm();
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
      const extension = testmsg === 'png' || testmsg === 'jpg' || testmsg === 'jpeg'
      if(!extension){
        this.$message({
          message:"上传失败！上传文件只能是png/jpg/jpeg格式！",
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
    resetForm() {
      this.$refs.uploads.clearFiles();
      this.chapterForm.num = 0;
      this.chapterForm.title = '';
      this.chapterForm.intro = '';
    },
    toDetail(rid) {
      this.$router.push(`/radio/${rid}/episodes`)
    },
    updateStatus(rid,opt,status) {
      this.$confirm(`此操作将${opt}该广播剧, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/radioplay/restatus'
        this.$http.post(url, {
          r_id:rid,
          r_status:status
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
<style>
.el-breadcrumb {
  height: 30px;
}
.el-pagination {
  margin-top: 20px;
}
</style>