<template>
    <div class="app">
        <div v-if="error" class="error-panel">{{ error }}</div>
        <div v-if="loading" class="loading-indicator">
            <div class="sk-folding-cube">
                <div class="sk-cube1 sk-cube"></div>
                <div class="sk-cube2 sk-cube"></div>
                <div class="sk-cube4 sk-cube"></div>
                <div class="sk-cube3 sk-cube"></div>
            </div>
        </div>
        <div v-if="initialLoadComplete">
            <!-- <div id="language-selection">
                <div id="en" @click="setLanguage('en')">
                    <flag :squared="false" iso="gb" />
                </div>
                <div id="lv" @click="setLanguage('lv')">
                    <flag :squared="false" iso="lv" />
                </div>
            </div> -->
            <Filters @loadBasemap="loadBasemap"/>
            <Stage />
            <div id="map">
                <span v-html="svg"></span>
            </div>
        </div>
        <div id="version">
            Datu avots - <a href="https://www.csb.gov.lv/">Centrālā statistikas pārvalde</a> Mapio v0.1.2
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Filters from './components/Filters.vue';
import Stage from './components/Stage.vue';
import {
    mapState,
    mapGetters,
    mapMutations
} from 'vuex';

export default {
    name: 'mapio',

    components: {
        Filters,
        Stage,
    },

    data() {
        return {
            svg: null,
            initialLoadComplete: false,
        }
    },

    methods: {
        ...mapMutations([
            'setError',
            'setLanguage',
            'setLoading',
        ]),
        ...mapGetters([
            'getBaseUri',
        ]),

        loadBasemap(version) {
            const uri = `${document.URL}${version}.svg`;
            axios
                .get(uri)
                .then(response => {
                    this.svg = response.data;
                    this.initialLoadComplete = true;
                    this.setLoading(false);
                })
                .catch(error => {
                    this.setError(error);
                });
        }
    },

    watch: {
        error: function(val) {
            if (val !== null) {
                setTimeout(() => this.setError(null), 10000);
            }
        }
    },

    mounted() {
        this.loadBasemap("basemap-2021");
    },

    computed: {
        ...mapState([
            'error',
            'loading',
        ]),
    },
};
</script>
