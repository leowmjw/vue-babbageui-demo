/**
 * Created by leow on 7/11/16.
 */
"use strict"

import util from 'util'
// Component under test
import FixtureRepo from './components/BabbageUI/Model'
import PopItPostRepo from './components/RelatedMinistriesInfo/Model'

// scenario_test_fixture_fifth_cabinet_najib_razak()
scenario_test_get_post_details_from_ministry()

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