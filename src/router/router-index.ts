import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import TitleView from '../views/TitleView.vue';
import GameView from '../views/GameView.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'TitleView',
    component: TitleView,
  },
  {
    path: '/game',
    name: 'Game',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    component: GameView,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // console.log(from);
  // console.log(to);
  //立ち上げ時はname==nullのとめ、それは除外
  // if (from.name == null && to.name !== 'Home') {
  //   alert('このアプリはURLのダイレクト入力は禁止です');
  //   next({ name: 'Home' });
  // } else {
  //   next();
  // }
  next();
});

export default router;
