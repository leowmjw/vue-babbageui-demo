<style>

    .x-visualization-add, .x-visualization-container.well {
        background: #fff;
        margin: .5em 0
    }

    .x-visualization-container.x-fixed-visualization .table-babbage {
        min-height: 0
    }

    /* Awesome Font; like arrows */

    .fa {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .fa-caret-up {
        background-image: url("/assets/icons/arrow_up_fa.svg");
    }

    .fa-caret-down {
        background-image: url("/assets/icons/arrow_down_fa.svg");
    }

</style>

<template>

    <div class="col-md-12 well x-visualization-container">
        <a href="javascript:;" @click="toggleSubComponent('treemap')" v-show="components.treemap_show">
            <span class="fa fa-caret-up">&nbsp;&nbsp;&nbsp;</span>
            Hide TreeMap
        </a>
        <a href="javascript:;" @click="toggleSubComponent('treemap')" v-show="!components.treemap_show">
            <span class="fa fa-caret-down">&nbsp;&nbsp;&nbsp;</span>
            Show TreeMap
        </a>
        <treemap
                v-show="components.treemap_show"
                :treemapid="packageid"
                :cube="cube"
                :endpoint="endpoint"
        ></treemap>
    </div>

    <div class="col-md-8 well x-visualization-container">
        <a href="javascript:;" @click="toggleSubComponent('bubbletree')" v-show="components.bubbletree_show">
            <span class="fa fa-caret-up">&nbsp;&nbsp;&nbsp;</span>
            Hide BubbleTree
        </a>
        <a href="javascript:;" @click="toggleSubComponent('bubbletree')" v-show="!components.bubbletree_show">
            <span class="fa fa-caret-down">&nbsp;&nbsp;&nbsp;</span>
            Show BubbleTree
        </a>
        <bubbletree
                v-show="components.bubbletree_show"
                :bubbletreeid="packageid"
                :cube="cube"
                :endpoint="endpoint"
        ></bubbletree>
    </div>
    <div class="col-md-4 well x-visualization-container">
        <a href="javascript:;" @click="toggleSubComponent('pie')" v-show="components.pie_show">
            <span class="fa fa-caret-up">&nbsp;&nbsp;&nbsp;</span>
            Hide Pie
        </a>
        <a href="javascript:;" @click="toggleSubComponent('pie')" v-show="!components.pie_show">
            <span class="fa fa-caret-down">&nbsp;&nbsp;&nbsp;</span>
            Show Pie
        </a>
        <pie
                v-show="components.pie_show"
                :pieid="packageid"
                :cube="cube"
                :endpoint="endpoint"
        ></pie>
    </div>

</template>

<script>

    import util from 'util'
    // libs ..
    import Utils from './BabbagePackage/Utils'
    import Model from './BabbagePackage/Model'
    // Subcomponents inside ..
    import TreeMap from './babbage.ui/src/bindings/vuejs/TreeMap.vue'
    import BubbleTree from './babbage.ui/src/bindings/vuejs/BubbleTree.vue'
    import Pie from './babbage.ui/src/bindings/vuejs/Pie.vue'

    // NOTE: We will only support drilldown types
    // For now; no use of "type" props

    export default {
        props: ['cube', 'endpoint', 'type', 'packageid', 'params'],
        components: {
            treemap: TreeMap,
            bubbletree: BubbleTree,
            pie: Pie
        },
        data () {
            return {
                state: {
                    hierarchies: {
                        current: null,
                        items: null
                    },
                    dimensions: {
                        current: {
                            columns: null,
                            filters: null,
                            groups: null,
                            row: null,
                            series: null
                        },
                        items: null
                    },
                    measures: {
                        current: null,
                        items: null
                    },
                    filters: null,
                    orderBy: null
                },
                initstate: {
                    aggregates: null,
                    group: null,
                    filter: [],
                    drillDown: null
                },
                components: {
                    treemap_show: true,
                    bubbletree_show: true,
                    pie_show: true
                }
            }
        },
        watch: {},
        events: {
            'babbage-click': function (chosen_key) {
                // DEBUG:
                // console.error("BABBAGE-CLICK!!! KEY:", chosen_key)
                // Call the Drilldown method now ...
                // Should behavior be different when with BubbleTree vs TreeMap??
                this.drillDown(chosen_key)
            }
        },
        ready () {
            // Return the Hierarchy Available with Labels; and the Top Level Reference
            // along with all the Dimensions with their Drill Down ..
            // console.error("ready: cube: %s endpoint: %s type: %s", this.cube, this.endpoint, this.type)
            // Atatch it to babbage; which is a prepped representative of its overall mapping ??
            const mypro = Model.buildState({cube: this.cube, endpoint: this.endpoint}, {})

            const o = Promise.all(mypro)
            o.then(
                    function (values) {
                        // DEBUG:
                        // console.error("ALL:", util.inspect(values, {depth: 10}))
                        // Attach to the items; use spread method ..
                        let [ hierarchies, measures, dimensions ]  =  values
                        // console.error("ORIG_HIERARCHIES:", util.inspect(Object.assign({}, hierarchies), {depth: 10}))
                        this.state.hierarchies.items = hierarchies
                        // console.error("HIERARCHIES:", util.inspect(this.state.hierarchies.items, {depth: 10}))
                        this.state.measures.items = measures
                        // console.error("MEASURES:", util.inspect(this.state.measures.items, {depth: 10}))
                        this.state.dimensions.items = dimensions
                        // console.error("DIMENSIONS:", util.inspect(this.state.dimensions.items, {depth: 10}))
                        // If any default "params" is passed in via the props; chooseStateParams will use it
                        this.chooseStateParams(this.params)

                        // Set the currents; dupe here??

                        // Pass to the component; one time?
                    }.bind(this)
            ).catch(
                    function (err) {
                        console.error("ERR:", util.inspect(err))
                    }
            )


        },
        methods: {
            chooseStateParams: function (defaultParams) {
                // if have defaultParams; extract those and set in the DATA set
                if (defaultParams == null || defaultParams == undefined) {
                    // Nothign passed; so that the babage overall and select
                    // Pick from the first item of hierarchies, measures, dimensions ..
                    const hierarchies = this.state.hierarchies.items
                    const measures = this.state.measures.items
                    const dimensions = this.state.dimensions.items

                    // Select first item from hierarchies; pick it; pick the first item in its levels
                    // == save to ==> chosen_dimension
                    let chosen_hierarchy
                    for (let key of Object.keys(hierarchies)) {
                        // TODO: What is ES6 way to make this more robust when it does not fit the exception??
                        chosen_hierarchy = hierarchies[key].levels[0]
                        // console.log("Default Selection: ", util.inspect(chosen_dimension, {depth: 10}))
                        this.state.hierarchies.current = chosen_hierarchy
                        break
                    }

                    // Select first item from measures == save to ==> initstate.aggregates
                    this.state.measures.current = measures[0].key
                    this.initstate.aggregates = this.state.measures.current

                    // Select first item from dimensions with key <chosen_dimension> == save to ==> initstate.groups
                    for (let dimension of dimensions) {

                        // What is the key used to refer ==> ID .id
                        // DEBUG:
                        // console.log("DIM: %s STRUCT: %s", dimension.id, util.inspect(dimension, {depth: 10}))
                        // Pull out the drilldown too??
                        if (chosen_hierarchy == dimension.id) {
                            // Store for later reuse ..
                            this.state.dimensions.current.groups = dimension
                            // console.error("KEY: %s DRILLDOWN: %s", dimension.key, dimension.drillDown)
                            this.initstate.group = [dimension.key]
                            this.initstate.drillDown = dimension.drillDown
                            break
                        }

                    }

                    // What would be the default orderBy?? The first item??
                    // console.error("INIT_STATE: A: %s G: %s", util.inspect(this.initstate.aggregates), util.inspect(this.initstate.group))

                } else {
                    // set the current state using the passed defaultParams
                }
                // else Choose the defaults ..
                // Set the currents ..

                // OK; DEBUG: defaultinitSTate is
                // console.error("STATE:", util.inspect(this.state, {depth: 10}))
                // Finally
                this.updateBabbage()

            },
            drillDown: function (chosen_key) {
                // DEBUG:
                // console.error("drillDown on KEY: %s TO: %s", util.inspect(chosen_key), this.initstate.drillDown)

                if (this.initstate.drillDown == undefined || this.initstate.drillDown == null) {
                    // Do nothing
                } else {
                    // ADDD to filter: current_level : chosen_key
                    // Change the group to drillDown; that will become the new current_level
                    let new_filter = `${this.initstate.group}:${JSON.stringify(chosen_key)}`
                    // Append it into the filter array ..
                    this.initstate.filter.push(new_filter)

                    for (let dimension of this.state.dimensions.items) {
                        // DEBUG:
                        // console.error("Compare: %s to %s", this.initstate.drillDown, dimension.key)
                        // Look for the matching item; use KEY here instead of ID; may be confusing; better way to encapsulate??
                        if (this.initstate.drillDown == dimension.key) {
                            // Store for later reuse ..
                            this.state.dimensions.current.groups = dimension
                            // DEBUG:
                            // console.error("KEY: %s DRILLDOWN: %s", dimension.key, dimension.drillDown)
                            this.initstate.group = [dimension.key]
                            this.initstate.drillDown = dimension.drillDown
                            break
                        }
                    }
                    // If want to be robust; make sure there is a new_filter??
                    // console.log("NEW_FILTER: ", util.inspect(this.initstate.filter, {depth: 10}))
                    // refresh ...
                    this.updateBabbage()
                }

            },
            updateBabbage: function () {
                // call Utils.prepareBabbageParams; bind to current context state so we get the state we need
                // const new_initstate = Utils.prepareBabbageParams.call(this.state)
                this.$broadcast('update-babbage', this.initstate)
                // call updateBreadCrumbs
                // call refreshBabbageComponents

            },
            updateBreadCrumbs: function () {

            },
            refreshBabbageComponents: function () {
                // Maybe: http://stackoverflow.com/questions/34255351/is-there-a-version-of-settimeout-that-returns-an-es6-promise
                // why??
                // changes state.flag.renderingCharts
                // Promise within promise ??
                // Requeueing as per: http://stackoverflow.com/questions/779379/why-is-settimeoutfn-0-sometimes-useful
            },
            toggleSubComponent: function(component) {
                switch (component) {
                    case 'treemap':
                        this.components.treemap_show = !this.components.treemap_show
                        break
                    case 'bubbletree':
                        this.components.bubbletree_show = !this.components.bubbletree_show
                        break
                    case 'pie':
                        this.components.pie_show = !this.components.pie_show
                        break
                    default:
                        // Reset??
                        this.components.treemap_show = true
                        this.components.bubbletree_show = true
                        this.components.pie_show = true
                        break
                }
            }

        },
        computed: {}

    }


</script>