<style>

    .alert-babbage {
        overflow-x: scroll;
        min-height: 25em
    }

    .alert-babbage::-webkit-scrollbar {
        -webkit-appearance: none
    }

    .alert-babbage::-webkit-scrollbar:horizontal {
        height: 11px
    }

    .alert-babbage::-webkit-scrollbar-thumb {
        border-radius: 8px;
        background-color: rgba(0, 0, 0, .5)
    }

    .alert-babbage::-webkit-scrollbar-track {
        background-color: #fff;
        border-radius: 8px
    }

    .c3 svg {
        font: 10px sans-serif;
        -webkit-tap-highlight-color: transparent
    }

    .c3 line, .c3 path {
        fill: none;
        stroke: #000
    }

    .c3 text {
        user-select: none
    }

    .c3-bars path, .c3-event-rect, .c3-legend-item-tile, .c3-xgrid-focus, .c3-ygrid {
        shape-rendering: crispEdges
    }

    .c3-chart-arc path {
        stroke: #fff
    }

    .c3-chart-arc text {
        fill: #fff;
        font-size: 13px
    }

    .c3-grid line {
        stroke: #aaa
    }

    .c3-grid text {
        fill: #aaa
    }

    .c3-xgrid, .c3-ygrid {
        stroke-dasharray: 3 3
    }

    .c3-text.c3-empty {
        fill: gray;
        font-size: 2em
    }

    .c3-line {
        stroke-width: 1px
    }

    .c3-circle._expanded_ {
        stroke-width: 1px;
        stroke: #fff
    }

    .c3-selected-circle {
        fill: #fff;
        stroke-width: 2px
    }

    .c3-bar {
        stroke-width: 0
    }

    .c3-bar._expanded_ {
        fill-opacity: .75
    }

    .c3-target.c3-focused {
        opacity: 1
    }

    .c3-target.c3-focused path.c3-line, .c3-target.c3-focused path.c3-step {
        stroke-width: 2px
    }

    .c3-target.c3-defocused {
        opacity: .3 !important
    }

    .c3-region {
        fill: #4682b4;
        fill-opacity: .1
    }

    .c3-brush .extent {
        fill-opacity: .1
    }

    .c3-legend-item {
        font-size: 12px
    }

    .c3-legend-item-hidden {
        opacity: .15
    }

    .c3-legend-background {
        opacity: .75;
        fill: #fff;
        stroke: #d3d3d3;
        stroke-width: 1
    }

    .c3-title {
        font: 14px sans-serif
    }

    .c3-tooltip-container {
        z-index: 10
    }

    .c3-tooltip {
        border-collapse: collapse;
        border-spacing: 0;
        background-color: #fff;
        empty-cells: show;
        box-shadow: 7px 7px 12px -9px #777;
        opacity: .9
    }

    .c3-tooltip tr {
        border: 1px solid #CCC
    }

    .c3-tooltip th {
        background-color: #aaa;
        font-size: 14px;
        padding: 2px 5px;
        text-align: left;
        color: #FFF
    }

    .c3-tooltip td {
        font-size: 13px;
        padding: 3px 6px;
        background-color: #fff;
        border-left: 1px dotted #999
    }

    .c3-tooltip td > span {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 6px
    }

    .c3-tooltip td.value {
        text-align: right
    }

    .c3-area {
        stroke-width: 0;
        opacity: .2
    }

    .c3-chart-arcs-title {
        dominant-baseline: middle;
        font-size: 1.3em
    }

    .c3-chart-arcs .c3-chart-arcs-background {
        fill: #e0e0e0;
        stroke: none
    }

    .c3-chart-arcs .c3-chart-arcs-gauge-unit {
        fill: #000;
        font-size: 16px
    }

    .c3-chart-arcs .c3-chart-arcs-gauge-max, .c3-chart-arcs .c3-chart-arcs-gauge-min {
        fill: #777
    }

    .c3-chart-arc .c3-gauge-value {
        fill: #000
    }

    .loading {
        z-index: 1000;
        position: absolute;
        width: 700px;
        height: 400px
    }

    .spaced {
        margin-bottom: 20px
    }

    .ng-link {
        cursor: pointer
    }

    .ng-icon, .ng-icon:hover {
        text-decoration: none !important
    }


</style>

<template>

    <!--
    <div>
        <h4>
            Analyze more at:
            <strong>
                <a href="{{ viewerUrl }}/{{ cube }}">OSNext</a>
            </strong>
        </h4>
        <h4><strong>Cube:</strong> {{ cube }}</h4>
        <h4><strong>API URL:</strong> {{ apiUrl }}</h4>
        <babbage_package
                :packageid="packageid"
                :cube="cube"
                :endpoint="apiUrl"
                type="drilldown">
        </babbage_package>
    </div>
    -->

    <div>
        <select v-model="chosen_ministry" @change="chooseMinistryToShow()">
            <option value="" selected="selected">Choose Ministry</option>
            <option v-for="ministry of ministries"
                    value="{{ ministry }}">
                {{ ministry }}
            </option>
        </select>

        <div>
            <h3>Available Budgets</h3>
            <ul v-for="budget of budgets">
                <li>
                    <input
                            v-model="chosen_packages"
                            type="checkbox"
                            value="{{ budget.cube }}"
                            @change="changeInCheckBox"/>
                    <label>{{ budget.label ? budget.label : budget.title }}</label>
                </li>
            </ul>
            <div v-for="cube of chosen_packages">
                Put BabbagePackage {{ cube }} here!!
            </div>
        </div>

    </div>

    <div>
        <h3>About {{ chosen_ministry }}</h3>
        <!-- Hard coded for now to iron out the problems -->
        <related_ministires_info
                chosen_ministry="Ministry of Education"
                :repo="repo"
        >
        </related_ministires_info>
    </div>


</template>

<script>

    // Debug ..
    import util from 'util'
    // Supporting libs
    import FixtureRepo from './BabbageUI/Model'

    // Actual subcomponents
    import BabbagePackage from './BabbageUI/BabbagePackage.vue'
    import RelatedMinistriesInfo from './RelatedMinistriesInfo.vue'

    export default {
        props: ['search_term'],
        components: {
            babbage_package: BabbagePackage,
            related_ministires_info: RelatedMinistriesInfo
        },
        data () {
            return {
                repo: null,
                cube: "0638aadc448427e8b617257ad01cd38a:kpkt-propose-2016-hierarchy-test",
                viewerUrl: "http://next.openspending.org/viewer",
                apiUrl: "http://next.openspending.org/api/3",
                packageid: "kpkt",
                ministries: null,
                chosen_ministry: null,
                ministers: null,
                budgets: null,
                chosen_packages: []
            }
        },
        watch: {
            'search_term': function (val, old_val) {
                console.error("VAL: %s OLD: %s", val, old_val)
            }
        },
        events: {},
        ready () {
            // Setup API to "pull" the available Packages; tie them to the Ministries?
            this.initRepo()
            // packageid must be unique??
            // Fill up all the MInsitries
            this.refreshMinistriesList()
        },
        methods: {
            initRepo: function () {
                this.repo = FixtureRepo(Object.create({}), "FifthCabinetNajibRazak")
            },
            chooseMinistryToShow: function () {
                // Need to reset chosen_packes???
                // Possibly head off and not execute below if chosen_minstry is empty??
                this.refreshAvailablePackages(this.chosen_ministry)
                // How to reset Babbage?? Needed or is it responsive??
            },
            refreshMinistriesList: function () {
                this.ministries = this.repo.query({action: "ministries"})
                // DEBUG:
                // console.error("REFRESH_MINISTRIES:", util.inspect(this.ministries, {depth: 10}))
            },
            refreshAvailablePackages: function (chosen_ministry) {
                // use Fixture Repo .. to query needed information
                // use GraphQL like statement?
                // SHould we want to check if the return value had anything?? hmm..
                this.budgets = this.repo.query({action: "packages", find: chosen_ministry})
                // DEBUG:
                console.error("REFRESH_BUDGETS:", util.inspect(this.budgets, {depth: 10}))
            },
            changeInCheckBox: function (element, x) {

                // console.error("CHANGE: ", util.inspect(element, {depth: 10}))
                // If select; push into the array of chosen_packages
                // console.error("X: ", util.inspect(x, {depth: 10}))

                // If deselect then slice out the item from the array

                // Just use the simple scan across array; will not be a lot ...

                // What is the state to add a selected??
                console.error("CHOSEN:", util.inspect(this.chosen_packages, {depth: 10}))
            }
        },
        computed: {}
    }

</script>