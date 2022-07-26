import Vue from 'vue';
import VueI18n from 'vue-i18n';
import localization from './components/localization.json';

Vue.use(VueI18n);

export const i18n = new VueI18n({
	locale: 'lv',
	fallbackLocale: 'en',
	messages: localization
});