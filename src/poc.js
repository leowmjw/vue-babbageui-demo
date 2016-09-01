/**
 * Created by leow on 7/11/16.
 */
"use strict"

import util from 'util'
// Component under test
import FixtureRepo from './components/BabbageUI/Model'
import PopItPostRepo from './components/RelatedMinistriesInfo/Model'
import BabbagePackageRepo from './components/BabbageUI/BabbagePackage/Model'

// scenario_test_fixture_fifth_cabinet_najib_razak()
// scenario_test_get_post_details_from_ministry()
// scenario_test_various_filters()
scenario_test_hierarchy_avoid_date.call({
    cube: "23cdc48554ae8648deff7837c025d8c0:kbs2016_detailed",
    endpoint: "http://next.openspending.org/api/3",
    state: {
        hierarchies: {
            items: null
        },
        measures: {
            items: null
        },
        dimensions: {
            items: null
        }
    }
})

function scenario_test_hierarchy_avoid_date() {
    // Simulate somewhat the ready() state of the BabbagePackage ..
    const mypro = BabbagePackageRepo.buildState({cube: this.cube, endpoint: this.endpoint}, {})

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
            chooseStateParams.call(this)
            console.log("SCENARIO: SYNTHETIC *********************************")
            // OK above test real item; now below test synthetic with only Date item ..
            this.state.hierarchies.items = { date: { label: 'Date', levels: [ 'date_2' ], ref: 'date' } }
            chooseStateParams.call(this)

        }.bind(this)
    ).catch(
        function (err) {
            console.error("ERR:", util.inspect(err))
        }
    )

    function chooseStateParams(defaultParams) {
        console.error("HIERARCHIES:", util.inspect(this.state.hierarchies.items, {depth: 10}))
        const hierarchies = this.state.hierarchies.items
        // Still choose type Date if no other options ..
        let chosen_hierarchy
        for (let key of Object.keys(hierarchies)) {
            // TODO: What is ES6 way to make this more robust when it does not fit the exception??
            chosen_hierarchy = hierarchies[key].levels[0]
            console.log("CHOSEN:", chosen_hierarchy)
            // console.log("Default Selection: ", util.inspect(chosen_dimension, {depth: 10}))
            // If ref of type date; try to continue ...
            if (hierarchies[key].ref == "date") {
                console.log("Hit DATE; try to continue ...")
            } else {
                break
            }
        }
        console.log("FINAL_HIER:" , chosen_hierarchy)
    }
}

function scenario_test_various_filters() {
    const filter1 = "1.1"
    const filter2 = '"1.2"'

    let new_filter = null
    new_filter = `abc_Level_1:${JSON.stringify(filter1)}`
    console.log("FILTERED1:", new_filter)

    new_filter = `abc_Level_1:${JSON.stringify(filter2)}`
    console.log("FILTERED2:", new_filter)

}

function scenario_test_get_post_details_from_ministry() {
    /*
     '55b759a7ed2606a46a89c500': { name: 'David Cameron' },
     '55b75a35222b329d5ce62cbd': { name: 'David Cameron' }
     */

    const ministers = [
        {post_id: "55b759a7ed2606a46a89c500", post_name: "Deputy Minister"},
        {post_id: "55b75a35222b329d5ce62cbd", post_name: "Minister"}
    ]

    let filled_in_details = {}
    ministers.reverse().map(function (post, index) {
        // console.error("POST", util.inspect(post.post_id, {depth: 10}))

        const p = PopItPostRepo.getPostDetails(post.post_id)
        p.then(
            (result) => {
                // console.log("RESULT:", util.inspect(result, {depth: 10}))
                filled_in_details[post.post_id] = result
                console.error("FILLED: ", util.inspect(filled_in_details, {depth: 10}))
            }
        ).catch(
            (err) => {
                console.error("ERR:", err)
            }
        )
    })
}

function scenario_test_fixture_fifth_cabinet_najib_razak() {
    const test_fixture = FixtureRepo(Object.create({}), "FifthCabinetNajibRazak")
    // Test getAvailablePackagesByName
    const search_name = "Prime Minister's Department"

    // Extract out ALL Ministries
    const available_ministries = test_fixture.query({action: "ministries"})
    test_fixture.log(util.inspect(available_ministries, {depth: 10}))

    // Extract out Ministers per Ministry
    const available_ministers = test_fixture.query({action: "ministers", find: search_name})
    test_fixture.log(util.inspect(available_ministers, {depth: 10}))

    // Extract out Budget Packages per Ministry
    const available_packages = test_fixture.query({action: "packages", find: search_name})
    test_fixture.log(util.inspect(available_packages, {depth: 10}))

    // -- FIN --
}