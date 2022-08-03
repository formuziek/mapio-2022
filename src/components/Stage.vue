<template>
    <div>
        <div id="color-options">
            <div
                v-for="color in colorSet.colors"
                class="color-entry"
                :key="color.value">
                <div
                    @click="toggleColor(color.value, !color.isActive)"
                    class="color-tile"
                    :class="{ active: color.isActive }"
                    :style="bindStyle('background-color', color.value)"></div>
                <p class="color-range">{{ getDataRangeText(color) }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import * as SVG from '@svgdotjs/svg.js';
import multiselect from 'vue-multiselect';
import colorSets from '../static/colorSets.json';
import {
    mapState,
    mapMutations
} from 'vuex';

export default {

    name: 'stage',

    components: { multiselect },

    watch: {
        colorSet: function () {
            this.changeColorSet();
        },
        data: function() {
            this.setMapState();
        },
    },

    methods: {
        ...mapMutations([
            'setColorSets',
            'setColorSet',
        ]),
        
        /**
         * Bindable css function.
         */
        bindStyle: function(element, value) {
            return `${element}: ${value};`;
        },

        /**
         * Updates the map state.
         */
        setMapState: function () {
            // Reset range indicator values.
            this.colorSet.colors.forEach(color => {
                color.min = null;
                color.max = null;
            });

            if (!this.data) {
                return;
            }

            // Basic way to dynamically drop data entries into different color colorSets.
            // Getting the total number of active colors.
            const activeColors = this.colorSet.colors.filter(color => color.isActive);
            const groupCount = activeColors.length;
            const dataLength = this.data.length;

            // Dividing data into roughly similar sized sets.
            const colorSetsize = Math.floor(dataLength / groupCount);
            const groupMask = new Array(groupCount).fill(colorSetsize);

            // Since we're flooring the group size, need to increase some colorSets until there's enough entries in total.
            let addIndex = 0;
            while (groupMask.reduce((a, b) => a + b, 0) < dataLength) {
                groupMask[addIndex]++;
                if (addIndex++ >= groupMask.length) {
                    addIndex = 0;
                }
            }

            // Iterate through data entries, set color based on mask and update the data range min/max values.
            let currentGroupIndex = 0;
            this.data.forEach(entry => {
                // If this is the last entry in the group, set the min value for the group.
                if (groupMask[currentGroupIndex] === 1) {
                    this.colorSet.colors.find(color => color.value === activeColors[currentGroupIndex].value).min = entry.value;
                }

                // If the current mask index is empty, proceed to next one and set the max value for the new range.
                if (groupMask[currentGroupIndex] === 0) {
                    currentGroupIndex++;
                    this.colorSet.colors.find(color => color.value === activeColors[currentGroupIndex].value).max = entry.value;
                }

                // Reduce mask size and set the color on map.
                groupMask[currentGroupIndex]--;
                this.setCountyColor(entry.name, activeColors[currentGroupIndex].value);
            });

            this.setTitle(this.dataTitle);
        },

        /**
         * Updates the fill color of county polygons by county identifier with specified color.
         */ 
        setCountyColor: function (county, value) {
            SVG.find(`.${county}`).fill(value);
        },

        setTitle: function (value) {
            // SVG.find("#title")[0].node.textContent = value;
        },

        /**
         * Toggles a color in the current set and updates the map.
         */
        toggleColor: function (color, isActive) {
            this.colorSet.colors.find(item => item.value === color).isActive = isActive;
            this.setMapState();
        },

        /**
         * Retrieves the text to display based on min/max values for the color entry.
         */
        getDataRangeText: function(color) {
            if (!color.isActive || (color.min === null && color.max === null)) {
                return '';
            }

            if (color.max === null)
            {
                return `>= ${color.min}`;
            }

            if (color.min === null) {
                return `${color.max} <=`;
            }

            return `${color.min} ... ${color.max}`;
        },

        /**
         * Changes the currently used color set and updates the map.
         */
        changeColorSet: function() {
            if (!this.previousColorSet) {
                return;
            }

            // Copy the previous group colors, set current group to the new one and update values in new one to match old group.
            const oldGroupColors = [...this.previousColorSet.colors];
            this.colorSet.colors.forEach((color, index) => {
                const prevColor = oldGroupColors[index];
                color.min = prevColor.min;
                color.max = prevColor.max;
                color.isActive = prevColor.isActive;
            });
            this.setMapState();
        }
    },

    created() {
        this.setColorSets(colorSets);
        
        // Set initial color set.
        this.setColorSet(this.colorSets.find(x => x.selected));
    },

    computed: 
        mapState([
            'data',
            'dataTitle',
            'language',
            'colorSets',
            'previousColorSet',
            'colorSet',
        ]),
};
</script>
