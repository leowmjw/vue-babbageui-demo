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
    const available_packages = test_fixture.query({action: "packages", find: search_name})

    test_fixture.log(util.inspect(available_packages, {depth: 10}))

    const available_ministries = test_fixture.query({action: "ministries"})
    test_fixture.log(util.inspect(available_ministries, {depth: 10}))
}