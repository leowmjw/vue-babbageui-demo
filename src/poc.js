/**
 * Created by leow on 7/11/16.
 */
"use strict"

import util from 'util'
// Component under test
import FixtureRepo from './components/BabbageUI/Model'

scenario_test_fixture_fifth_cabinet_najib_razak()

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