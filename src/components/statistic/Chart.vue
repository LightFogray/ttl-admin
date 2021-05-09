<template>
    <div class="home">
        <el-card class="box-card">
            <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/user' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/chart' }">数据统计</el-breadcrumb-item>
            </el-breadcrumb>
            <el-row :gutter="20">
                <el-col class="echarts-box"  :span="14">
                     <Bars/>
                </el-col>
                 <el-col class="echarts-box" :span="10">
                     <Pie/>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script>
import Bars from './Bar.vue'
import Pie from './Pie.vue'
export default {
    components:  {Bars, Pie}
}
</script>