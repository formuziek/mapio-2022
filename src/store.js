import Vue from 'vue';
import Vuex from 'vuex';
import i18n from 'i18n';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        data: null,
        error: null,
        language: 'lv',
        loading: true,
        dataTitle: null,
    },
    getters: {
        getBaseUri: () => {
            const location = window.location.href;
            if (location.includes('localhost')) {
                return 'http://localhost:50514/';
            }

            return window.location.href;
        }
    },
    mutations: {
        setData: (state, data) => {
            state.data = data;
        },
        setError: (state, error) => {
            state.error = error;
        },
        setLanguage: (state, language) => {
            i18n.locale = language;
            state.language = language;
        },
        setLoading: (state, loading) => {
            state.loading = loading;
        },
        setDataTitle: (state, title) => {
            state.dataTitle = title;
        },
    },
    actions: {

    }
});