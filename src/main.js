import Vue from 'vue';
import Mapio from './Mapio.vue';

import { store } from './store';
import { i18n } from './i18n';

Vue.config.productionTip = false;

new Vue({
	store,
	i18n,
	render: h => h(Mapio),
}).$mount('#mapio');


