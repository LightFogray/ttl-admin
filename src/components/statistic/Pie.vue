<template>
    <div class="pie">
        <div ref="pie" class="pie-item"></div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            msg:null,
            allData:null
        }
    },
    mounted(){
        this.initChart()
        this.getData()
        window.addEventListener('resize',this.resizeChart)
    },
    destroyed(){
        window.addEventListener('resize',this.resizeChart)
    },
    methods:{
        initChart(){
            this.msg = this.$echarts.init(this.$refs.pie)
        },
        async getData(){
          let data = await this.$http.get('/novel/statistic');
          console.log(data)
          this.allData = data.data
          //  获取完数据更新图表
          this.updateChart()
        },
        updateChart(){
            const sellerNames = this.allData.map(item =>{
                return item.name
            })
            const seller = this.allData.map(item =>{
                return item
            })
            
            const option = {
              title:{
                text: '小说热门标签分布',
                right:'center'
              },
              tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b} : {c} ({d}%)'
              },
              legend: {
                  orient: 'vertical',
                  left: 'left',
                  data:sellerNames
              },
              color : [ '#2ec7c9', '#b6a2de', '#ffb980', '#5ab1ef', '#d87a80'],
              series: [
                {
                  name: '小说类别分布',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '60%'],
                  data:seller,
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            }
            this.msg.setOption(option)
        },
        resizeChart(){
            this.msg ? this.msg.resize() : ''
        }
    }
}
</script>
<style scoped>
.pie-item{
    width: 400px;
    height: 400px;
}
</style>