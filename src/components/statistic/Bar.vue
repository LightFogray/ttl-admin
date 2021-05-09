<template>
    <div class="bar">
        <div ref="bar" class="bar-item"></div>
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
        //  初始化msg
        initChart(){
            this.msg = this.$echarts.init(this.$refs.bar)
        },
        //  获取服务器数据
        async getData(){
          let data = await this.$http.get('/novel/billboard');
          console.log(data)
          this.allData = data.data
          //  获取完数据更新图表
          this.updateChart()
        },
        updateChart(){
            const sellerNames = this.allData.map(item =>{
                return item.name
            })
            const sellerValues = this.allData.map(item =>{
                return item.value
            })
            let newpldataY = [];
            let colors = ["rgb(250,209,41)", "rgb(254,128,44)", "rgb(253,89,88)", "rgb(248,93,185)",
                        "rgb(166,75,255)", "rgb(23,30,207)", "rgb(77,112,238)", "rgb(0,197,213)"];
            
            for(let i = 0; i < sellerValues.length; i++) {
              let obj = {
                value: sellerValues[i],
                itemStyle:{
                  normal:{
                    color:colors[i % colors.length]
                  }
                }
              }
              newpldataY.push(obj);
            }
            var option = {
                title: {
                  text: ''
                },
                tooltip: {},
                legend: {
                  data:[{
                    name: '热门小说榜单top10',
                    textStyle: {
                      color:"#000"
                    }
                  }]
                },
                xAxis: {
                  axisLine:{
                    lineStyle:{
                      color:'#000',
                    }
                  },
                  axisLabel:{
                    interval: 0,//横轴信息全部显示
                    rotate: -30,//-30度角倾斜显示
                  },
                  data: sellerNames
                },
                yAxis: {
                  axisLine:{
                    lineStyle:{
                      color:'#ffffff',
                    }
                  }
                },
                series: [{
                  name:"热门小说榜单top10",
                  data: newpldataY,
                  type: 'bar',
                  smooth: true
                }]
              };



            this.msg.setOption(option)
        },
        resizeChart(){
            this.msg ? this.msg.resize() : ''
        }
    }
}
</script>
<style scoped>
.bar-item{
    width: 600px;
    height: 400px;
}
</style>