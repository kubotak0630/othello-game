import Vue from 'vue';
// import ElementUI from 'element-ui';
import { Button, RadioGroup, RadioButton } from 'element-ui';
Vue.component(Button.name, Button);
Vue.component(RadioGroup.name, RadioGroup);
Vue.component(RadioButton.name, RadioButton);
// Vue.use(ElementUI);

import App from './App.vue';
import router from './router/router-index';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
