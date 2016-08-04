<style>

    /* NOTE: This component style CANNOT be scoped!! */

    .treemap-chart {
        overflow: hidden
    }

    .treemap-chart .node {
        display: block;
        border: 0;
        color: #fff;
        overflow: hidden;
        position: absolute;
        outline: #fff solid 1px;
        font-size: .8em;
        text-indent: 2px;
        padding: 5px;
        box-sizing: border-box;
        z-index: 5;
        font-weight: 300;
        text-shadow: -2px -2px 13px rgba(150, 150, 150, .9)
    }

    .treemap-chart .amount {
        display: block;
        padding-bottom: .2em;
        font-size: 1.5em
    }

    .treemap-chart .node:hover {
        text-decoration: none
    }

    .treemap-list .treemap-table-bar {
        margin-top: 10px;
        text-align: left
    }

    .treemap-list .treemap-table {
        width: 100%;
        color: #2a2d34
    }

    .treemap-list .treemap-table tr {
        border-top: 1px solid #ddd;
        line-height: 2em
    }

    .treemap-list .treemap-table tfoot tr {
        border-top: #ddd solid 2px
    }

    .treemap-list .treemap-table th {
        font-weight: 700
    }

    .treemap-list .treemap-table td:not(:first-child), .treemap-list .treemap-table th:not(:first-child) {
        text-align: right;
        padding-left: 20px
    }

    .treemap-list .treemap-table tbody tr:hover {
        background-color: #3a99d9;
        color: #fff
    }

    .treemap-list .treemap-table tfoot td {
        font-weight: bolder
    }

    .treemap-list .treemap-table .colorbox {
        height: 1em;
        width: 1em;
        display: inline-block;
        margin-right: .5em;
        vertical-align: middle
    }

</style>

<template>

    <div>
        <!--
                <div class="alert-babbage">
                    <div class="alert alert-info">
                        <strong>You have not selected any data.</strong> Please choose a breakdown for
                        your treemap.
                    </div>
                </div>

                <div class="alert alert-warning">
                    <strong>Too many tiles.</strong> The breakdown you have selected contains many
                    different categories, only the ((XXX CUTOFF)) biggest are shown.
                </div>

        -->
        <div id="treemap-{{ treemapid }}" class="treemap-chart">
            <div v-show="treeMapTable.data == null || treeMapTable.data == undefined">... Loading ...</div>
        </div>

        <div class="treemap-list">
            <div class="treemap-table-bar">
                <a href="javascript:;" @click="toggleTreeMapList()" v-show="treeMapTable.show">
                    <span class="fa fa-caret-up">&nbsp;&nbsp;&nbsp;</span>
                    Hide list
                </a>
                <a href="javascript:;" @click="toggleTreeMapList()" v-show="!treeMapTable.show">
                    <span class="fa fa-caret-down">&nbsp;&nbsp;&nbsp;</span>
                    Show list
                </a>
            </div>
            <table class="treemap-table table-striped">
                <thead>
                <tr>
                    <th>
                        <a href="javascript:;" @click="invertSortTreeMapList('_name')">
                            title
                            <span v-show="treeMapTable.sortAttr == '_name'" class="fa"
                                  :class="(treeMapTable.sortDesc >= 0) ? 'fa-caret-up' : 'fa-caret-down'">
                                &nbsp;&nbsp;&nbsp;
                            </span>
                        </a>
                    </th>
                    <th>
                        <a href="javascript:;" @click="invertSortTreeMapList('value')">
                            amount
                            <span v-show="treeMapTable.sortAttr == 'value'" class="fa"
                                  :class="(treeMapTable.sortDesc >= 0) ? 'fa-caret-up' : 'fa-caret-down'">
                                 &nbsp;&nbsp;&nbsp;
                            </span>
                        </a>
                    </th>
                    <th>
                        <a href="javascript:;" @click="invertSortTreeMapList('_percentage')">
                            share
                            <span v-show="treeMapTable.sortAttr == '_percentage'" class="fa"
                                  :class="(treeMapTable.sortDesc >= 0) ? 'fa-caret-up' : 'fa-caret-down'">
                                 &nbsp;&nbsp;&nbsp;
                            </span>
                        </a>
                    </th>
                </tr>
                </thead>
                <template v-if="treeMapTable.data == null || treeMapTable.data == undefined">
                    <tbody>
                    <tr>
                        .. Loading ..
                    </tr>
                    </tbody>

                </template>
                <template v-else>
                    <tbody>
                    <tr v-for="item of treeMapTable.data.children | orderBy treeMapTable.sortAttr treeMapTable.sortDesc"
                        class="datarow" @click="selectTreeMapListRow(item)">
                        <td>
                            <span class="colorbox" :style="{'background-color':item._color}"></span>
                            {{ item._name }}
                        </td>
                        <td>{{ item._area_fmt_currency }}</td>
                        <td>{{ (item._percentage * 100).toFixed(2) }}%</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>Total</td>
                        <td>{{ treeMapTable.data.summary_fmt_currency }}</td>
                        <td>100%</td>
                    </tr>
                    </tfoot>

                </template>

            </table>
        </div>

    </div>

</template>

<script>

    import util from 'util'
    // Actual component below ... as an emitter object
    import TreeMapComponent from '../../components/treemap'

    export default {
        props: ['cube', 'endpoint', 'treemapid', 'simulation'],
        components: {},
        data () {
            return {
                state: {
                    aggregates: null,
                    group: null,
                    filter: null
                },
                treeMapTable: {
                    show: true,
                    sortAttr: '_percentage',
                    sortDesc: 1,
                    data: null
                }
            }
        },
        watch: {},
        events: {
            'update-babbage': function (new_initstate) {
                // DEBUG:
                // console.error("FROM_PARENT_UPDATE_BABBAGE::")
                this.state = new_initstate
                this.rebuildTreeMap()
            }
        },
        ready () {

            // pass props "simulation" = true to hardcode api +data source
            if (this.simulation) {
                console.error("TREEMAP: Simulation Mode ON")
                const endpoint = "http://next.openspending.org/api/3"
                // const cube = "boost:boost-moldova-2005-2014"
                const cube = "0638aadc448427e8b617257ad01cd38a:kpkt-propose-2016-hierarchy-test"
                const state = {
                    // Aggregates? REQUIRED!!!!
                    aggregates: "Amount.sum",
                    // source: "functional_classification_2.Item",
                    // target: "economic_classification_Level_2.Level_2_x_3",

                    // group is calculated automatically; so no point specifying
                    //     params.group = [params.source, params.target];

                    // Top Level
                    group: ["economic_classification_Top_x.Top_Level_x_1"]
                    // Level 1:
                    // group: ["economic_classification_Level.Level_1_x_2"]
                    // Level 2:
                    // group: ["economic_classification_Level_2.Level_2_x_3"]
                    // group: ["functional_classification_2.Item", "economic_classification_Level_2.Level_2_x_3"]
                    // group: ["economic_classification_Level_2.Level_2_x_3", "functional_classification_2.Item"]
                    // group: ["economic_classification_Level_2.Level_2_x_3"]
                    // group: ["economic_classification_Level.Level_1_x_2"]
                    // group: ["functional_classification_2.Item"]

                    // If Order not defined; then combo like below
                    //        {key: params.aggregates, direction: 'desc'},
                    //        {key: params.source, direction: 'asc'},
                    //        {key: params.target, direction: 'asc'}
                    // order: [{key: "Amount.sum", direction: 'asc'}]

                    // filter === cut ..
                    // Object; each key/value separated by |
                    // key: [value]
                }

                const treeMap = new TreeMapComponent()
                const wrapper = document.querySelector("div#treemap-kpkt")
                // Build and track events??
                // Maybe assign it to a map; so can drill up and down; cached??
                treeMap.build(endpoint, cube, state, wrapper)
                treeMap.on('click', function (treeMapComponent, item) {
                            this.$emit('treemap-click', treeMapComponent, item)
                            // console.error("TREE:", util.inspect(treeMapComponent.treemap(), {depth: 4}))
                            // DEBUG:
                            // console.error("ITEM:", util.inspect(item, {depth: 10}))
                            console.error("KEY:", item._key)
                            // Simulate a drilldown happening
                            this.simulateDrillDown()
                        }.bind(this)
                )

            } else {
                // Do nothing
            }

        },
        methods: {
            rebuildTreeMap: function () {
                // DEBUG:
                // console.error("TREEMAP: Real thing here .. :P PACKAGEID: ", this.treemapid)
                const treeMap = new TreeMapComponent()
                const wrapper = document.querySelector(`div#treemap-${this.treemapid}`)

                treeMap.on('dataLoaded', (treeMapComponent, root) => {
                    // DEBUG:
                    // console.error("dataLoaded event!!! DATA: ", util.inspect(root, {depth: 10}))
                    this.treeMapTable.data = root
                    // Below may not be needed as if data change it should be reactive above?
                    // $scope.$apply();
                })

                treeMap.on('click', (treeMapComponent, item) => {
                    // item has a whole bunch of stuff; make sure you pass on only the key!!
                    this.$dispatch('babbage-click', item._key)
                })

                treeMap.build(this.endpoint, this.cube, this.state, wrapper)
            },
            invertSortTreeMapList: function (sort_attr) {
                // DEBUG:
                // console.error("invertSortTreeMapList called!! sort_attr:", sort_attr)
                // console.error("BEFORE: ", util.inspect(this.treeMapTable.sortDesc, {depth: 10}))
                this.treeMapTable.sortAttr = sort_attr
                // See: https://vuejs.org/api/#orderBy
                // order >= 0 asc, order < 0 desc
                if (this.treeMapTable.sortDesc >= 0) {
                    this.treeMapTable.sortDesc = -1
                } else {
                    this.treeMapTable.sortDesc = 1
                }
                // DEBUG:
                // console.error("ATTR: %s DIRECT: %s ", this.treeMapTable.sortAttr, util.inspect(this.treeMapTable.sortDesc, {depth: 10}))
            },
            toggleTreeMapList: function () {
                // DEBUG:
                // console.error("toggleTreeMapList called!!")
                /*
                 let treeMapTable = $scope.treeMapTable;
                 let treeMapSection = $(".treemap-table");
                 treeMapTable.show ? treeMapSection.fadeOut() : treeMapSection.fadeIn();
                 treeMapTable.show = !treeMapTable.show;

                 */
                // Below has JQuery deps; to be removed ..
                let treeMapSection = $(".treemap-table")
                // TODO: Port and add some sort of "transition"?? For now port the JQuery fadeIn/fadeOut??
                this.treeMapTable.show ? treeMapSection.fadeOut() : treeMapSection.fadeIn()
                this.treeMapTable.show = !this.treeMapTable.show
            },
            selectTreeMapListRow: function (item) {
                // DEBUG:
                // console.error("selectTreeMapListRow called!! item: ", util.inspect(item))
                // console.error("pass KEY %s to drillDown", item._key)
                this.$dispatch('babbage-click', item._key)

            },
            simulateDrillDown: function () {
                // Triggered on click of each item??
                // Should get the treeMap and datum ...
                // use that as the new wrapper??
                /*

                 First level cut: ==> cut=economic_classification_Level.Level_1_x_2%3A%221.1.2%22
                 Request URL:
                 http://next.openspending.org/api/3/cubes/0638aadc448427e8b617257ad01cd38a:kpkt-propose-2016-hierarchy-test/facts?drilldown=economic_classification_Level_2.Level_2_x_3&aggregates=Amount.sum&pagesize=20&cut=economic_classification_Level.Level_1_x_2%3A%221.1.2%22

                 Params:
                 drilldown:economic_classification_Level_2.Level_2_x_3
                 aggregates:Amount.sum
                 pagesize:20
                 cut:economic_classification_Level.Level_1_x_2:"1.1.2"

                 First level aggregte:
                 Request URL:
                 http://next.openspending.org/api/3/cubes/0638aadc448427e8b617257ad01cd38a:kpkt-propose-2016-hierarchy-test/aggregate?drilldown=economic_classification_Level_2.Level_2_x_3&pagesize=30&cut=economic_classification_Level.Level_1_x_2%3A%221.1.2%22&order=Amount.sum%3Adesc
                 Params:
                 drilldown:economic_classification_Level_2.Level_2_x_3
                 pagesize:30
                 cut:economic_classification_Level.Level_1_x_2:"1.1.2"
                 order:Amount.sum:desc

                 ======= ******************** ======
                 Second level cut: ==>
                 Request URL:http://next.openspending.org/api/3/cubes/0638aadc448427e8b617257ad01cd38a:kpkt-propose-2016-hierarchy-test/facts?
                 drilldown=economic_classification_Level_3.Level_3_x_4&aggregates=Amount.sum&pagesize=20&cut=economic_classification_Level.Level_1_x_2%3A%221.1.2%22%7C
                 economic_classification_Level_2.Level_2_x_3%3A%220%22

                 drilldown:economic_classification_Level_3.Level_3_x_4
                 aggregates:Amount.sum
                 pagesize:20
                 cut:economic_classification_Level.Level_1_x_2:"1.1.2"|economic_classification_Level_2.Level_2_x_3:"0"

                 */
                const endpoint = "http://next.openspending.org/api/3"
                // const cube = "boost:boost-moldova-2005-2014"
                const cube = "0638aadc448427e8b617257ad01cd38a:kpkt-propose-2016-hierarchy-test"
                const state = {
                    // Aggregates? REQUIRED!!!!
                    aggregates: "Amount.sum",
                    // Level 1:
                    group: ["economic_classification_Level.Level_1_x_2"]
                }

                const treeMap = new TreeMapComponent()
                const wrapper = document.querySelector("div#treemap-kpkt")
                // Build and track events??
                // Maybe assign it to a map; so can drill up and down; cached??
                treeMap.build(endpoint, cube, state, wrapper)
                treeMap.on('click', function (treeMapComponent, item) {
                            console.error("IN SUBTREE!!")
                        }.bind(this)
                )
            }
        },
        computed: {}

    }

</script>