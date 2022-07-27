<template>
    <div id="data-select">
        <div class="select-menu">
            <multiselect
                v-model="mode"
                :options="modes"
                :allow-empty="false"
                :show-labels="false"
                :placeholder="$t('lblSelectMode')"
                :label="getLabelSource()" />
        </div>
        <div class="select-menu">
            <multiselect 
                v-model="filter.dataType" 
                :options="dataTypes"
                :allow-empty="false"
                :show-labels="false"
                :placeholder="$t('lblSelectDataType')"
                :label="getLabelSource()" />
        </div>
        <div class="select-menu">
            <multiselect
                v-model="filter.year"
                :allow-empty="false"
                :show-labels="false"
                :placeholder="$t('lblSelectYear')"
                :options="years" />
        </div>
        <div 
            v-show="filter.dataType && filter.dataType.IsQuarterly"
            class="select-menu">
            <multiselect
                v-model="filter.quarter"
                :allow-empty="false"
                :show-labels="false"
                :placeholder="$t('lblSelectQuarter')"
                :options="quarters" />
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import dataLogic from './dataLogic';
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
            modes: [ { code: "AFTER_2021_ATR", TextLat: "Pēc 2021.07 reformas" }, { code: "BEFORE_2021_ATR", TextLat: "Līdz 2021.07 reformai" } ],
            dataTypes: [],
            years: [],
            quarters: [],
            filter: {
                mode: null,
                dataType: null,
                year: null,
                quarter: null,
            },
            mode: {},
        }
    },

    watch: {
        filter: {
            deep: true,
            handler() {
                this.datasetChanged(this.filter.dataType);
                this.loadData();
            }
        },
        mode: {
            handler() {
                let basemapVersion = "";
                if (this.mode.code === "BEFORE_2021_ATR") {
                    basemapVersion = "basemap";
                } else {
                    basemapVersion = "basemap-2021";
                }
                
                this.$emit("loadBasemap", basemapVersion);
            }
        }
    },

    methods: {
        ...mapMutations([
            'setData',
            'setError',
            'setLoading',
        ]),
        ...mapGetters([
            'getBaseUri'
        ]),

        datasetChanged(dataset)
        {
            this.years = dataset.Years ? dataset.Years : [];
            this.quarters = dataset.Quarters ? dataset.Quarters : [];
            if (!this.years.includes(this.filter.year))
            {
                this.filter.year = null;
                this.setData(null);
            }

            if (dataset.IsQuarterly) {
                if (this.years.indexOf(this.filter.year) === 0) {
                    this.quarters = dataset.FirstYearQuarters;
                } else if (this.years.indexOf(this.filter.year) === this.years.length - 1) {
                    this.quarters = dataset.LastYearQuarters;
                }
            }

            if (!this.quarters.includes(this.filter.quarter)) {
                this.filter.quarter = null;
                this.setData(null);
            }
        },

        loadData: function () {
            if (!this.isDataSetSelected()) {
                return;
            }

            const dataQuery = dataLogic.buildQuery(this.mode, this.filter.dataType, this.filter.year, this.filter.quarter);
            const uri = `https://data.stat.gov.lv:443/api/v1/lv/OSP_PUB/${this.filter.dataType.Uri}`;
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

        isDataSetSelected: function() {
            return this.filter.dataType && this.filter.year && (this.filter.quarter || !this.filter.dataType.IsQuarterly);
        },

        getLabelSource: function() {
            if (this.language === 'lv') {
                return 'TextLat';
            }

            return 'TextEng';
        }
    },

    mounted() {
        const uri = `${document.URL}datasettings.json`;
        axios
            .get(uri)
            .then(response => {
                this.dataTypes = response.data.DataSetConfigurations;
            })
            .catch(error => {
                this.setError(error);
            });
        this.mode = this.modes[0];
    },

    computed: 
        mapState([
            'language'
        ])
};
</script>
