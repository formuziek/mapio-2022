<template>
    <div id="data-select">
        <div class="filters" :class="{expanded: expanded}">
            <div class="select-menu">
                <multiselect
                    v-model="version"
                    :options="versions"
                    :allow-empty="false"
                    :show-labels="false"
                    :placeholder="$t('lblSelectVersion')"
                    label="Text">
                    <template><span slot="noResult">{{ $t('lblNoVersion') }}</span></template>
                </multiselect>
            </div>
            <div class="select-menu">
                <multiselect 
                    v-model="dataType" 
                    :options="dataTypes"
                    :allow-empty="false"
                    :show-labels="false"
                    :placeholder="$t('lblSelectDataType')"
                    label="Text">
                    <template><span slot="noResult">{{ $t('lblNoDataType') }}</span></template>
                </multiselect>
            </div>
            <div v-for="variable in publicVariables" class="select-menu">
                <multiselect
                    v-model="variable.value"
                    :options="variable.ValueItems"
                    :allow-empty="false"
                    :show-labels="false"
                    :placeholder="variable.Text"
                    label="Text"
                    track-by="Value">
                </multiselect>
            </div>
            <div class="select-menu">
                <multiselect
                    v-model="colorSetLocal"
                    :options="colorSetsLocal"
                    :allow-empty="false"
                    :show-labels="false"
                    :placeholder="$t('lblSelectColorSchema')"
                    label="textLat">
                    <template><span slot="noResult">{{ $t('lblNoColorSchema') }}</span></template>
                </multiselect>
            </div>
        </div>
        <div class="collapse-filters">
            <span @click="toggleFilters()" class="material-icons md-48">{{ getArrow() }}</span>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import DataLogic from './dataLogic';
import { Version } from "../static/versions";
import multiselect from 'vue-multiselect';
import {
    mapState,
    mapGetters,
    mapMutations
} from 'vuex';

export default {

    name: 'filters',

    components: { multiselect },

    data() {
        return {
            expanded: false,
            allDataTypes: [],
            versions: [ { code: Version.AFTER_2021_ATR, Text: "Pēc 2021.07 reformas" }, { code: Version.BEFORE_2021_ATR, Text: "Līdz 2021.07 reformai" } ],
            dataTypes: [],
            version: {},
            dataType: null,
            publicVariables: [],
        }
    },

    watch: {
        dataType: {
            deep: true,
            handler() {
                if (!this.dataType) {
                    return;
                }

                this.publicVariables = this.dataType.Variables.filter(x => x.Code !== "AREA" && x.Code !== "ContentsCode");
                if (this.dataType.Variables.every(x => x.Code === "AREA" || x.Code === "ContentsCode" || x.value)) {
                    this.loadData();
                }
            }
        },
        version: {
            handler() {
                let basemapVersion = "";
                if (this.version.code === Version.BEFORE_2021_ATR) {
                    basemapVersion = "basemap";
                } else {
                    basemapVersion = "basemap-2021";
                }

                this.dataTypes = this.allDataTypes.filter(t => t.Version === this.version.code);
                this.dataType = null;
                this.publicVariables = [];

                this.$emit("loadBasemap", basemapVersion);
            }
        }
    },

    methods: {
        ...mapMutations([
            'setData',
            'setError',
            'setLoading',
            'setDataTitle',
            'setColorSet',
        ]),
        ...mapGetters([
            'getBaseUri'
        ]),

        loadData: function () {
            const dataQuery = DataLogic.buildQuery(this.version.code, this.dataType);
            const uri = `https://data.stat.gov.lv:443/api/v1/lv/OSP_PUB${this.dataType.Uri}`;
            let resultList = [];
            axios
                .post(uri, dataQuery)
                .then(response => {
                    response.data.data.forEach(item => {
                        resultList.push({
                            name: item.key.find(v => v.startsWith('LV')),
                            value: isNaN(item.values[0]) ? 0 : item.values[0],
                        });
                    });
                    resultList = resultList.sort((a, b) => b.value - a.value);
                    this.setData(resultList);
                })
                .catch(error => {
                    this.setError(error);
                });
        },

        getArrow() {
            return this.expanded ? "keyboard_double_arrow_left" : "keyboard_double_arrow_right";
        },

        toggleFilters() {
            this.expanded = !this.expanded;
        }
    },

    mounted() {
        const uri = `${document.URL}datasettings.json`;
        axios
            .get(uri)
            .then(response => {
                this.allDataTypes = response.data;
                this.version = this.versions[0];
            })
            .catch(error => {
                this.setError(error);
            });
    },

    computed: {
        ...mapState([
            'language',
            'colorSets',
            'colorSet',
        ]),
        colorSetsLocal: {
            get() {
                return this.colorSets;
            },
        },
        colorSetLocal: {
            get() {
                return this.colorSet;
            },
            set(value) {
                this.setColorSet(value);
            },
        },
    },
};
</script>
