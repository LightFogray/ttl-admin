import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import User from '../components/user/List.vue'
import Chart from '../components/statistic/Chart.vue'
import Radio from '../components/radio-play/List.vue'
import RadioEpisode from '../components/radio-play/Episode.vue'
import NoticeAdd from '../components/notice/Add.vue'
import NoticeList from '../components/notice/List.vue'
import Novel from '../components/novel/List.vue'
import NovelChapter from '../components/novel/Chapter.vue'
import Video from '../components/video/List.vue'
import Post from '../components/post/List.vue'
import Tag from '../components/tag/List.vue'
import Accusation from '../components/accusation/List.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/index',
    name: 'index',
    component: Index,
    children:[{
      path: '/user',
      name: 'user',
      component: User
    },{
      path: '/chart',
      name: 'chart',
      component: Chart
    },{
      path: '/radio',
      name: 'radio',
      component: Radio
    },{
      path: '/radio/:rid/episodes',
      name: 'radioEpisode',
      component: RadioEpisode
    },{
      path: '/notice/add',
      name: 'noticeAdd',
      component: NoticeAdd
    },{
      path: '/notice/list',
      name: 'noticeList',
      component: NoticeList
    },{
      path: '/novel',
      name: 'novel',
      component: Novel
    },{
      path: '/novel/:nid/chapter',
      name: 'novelChapter',
      component: NovelChapter
    },{
      path: '/video',
      name: 'video',
      component: Video
    },{
      path: '/post',
      name: 'post',
      component: Post
    },{
      path: '/tag',
      name: 'tag',
      component: Tag
    },{
      path: '/accusation',
      name: 'accusation',
      component: Accusation
    }]
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const adminInfo = window.sessionStorage.getItem('adminInfo');
  if (!adminInfo) {
    return next('/login');
  }
  next();
})

export default router
