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
            <Stage ref="stageRef" />
            <div id="map">
                <span id="map-data" v-html="svg"></span>
            </div>
        </div>
        <div id="version">
            <!--<span @click="download" class="material-icons md-36">download_for_offline</span>-->
            <span @click="toggleInfo" class="material-icons md-36">info</span>
            <div id="version-expanded" v-if="showInfo">
                Datu avots - <a href="https://www.csb.gov.lv/">Centrālā statistikas pārvalde</a>
                Mapio v0.1.4
            </div>
        </div>
    </div>
</template>

<script>
import { SVG } from '@svgdotjs/svg.js';
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
            showInfo: false,
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

        toggleInfo() {
            this.showInfo = !this.showInfo;
        },

        download() {
            const svgRoot = document.getElementById("map-data").firstElementChild;
            const height = svgRoot.getAttribute("height");
            const width = svgRoot.getAttribute("width");
            svgRoot.setAttribute("height", "1000pt");
            svgRoot.setAttribute("width", "1700pt");
            const svgBlob = new Blob([svgRoot.outerHTML], { type: "application/octet-stream" });
            const url = URL.createObjectURL(svgBlob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = "mapio.svg";
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            svgRoot.setAttribute("height", height);
            svgRoot.setAttribute("width", width);
        },

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
