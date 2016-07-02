/**
 * Created by leow on 6/13/16.
 */
"use strict"

import util from 'util'
import {Api} from '../babbage.ui/src/api/index'

const api = new Api()

// Port from ...os-viewer/app/front/scripts/services/os-viewer-service/index.js

// Possible idea is to stampit with the API from BabbageUI

// Compose anything else missing?? Like Getting Package Info
// can port from:
// ...os-viewer/app/front/scripts/services/data-package-api/index.js

const osViewerService = {
    initState: function (state) {

    },
    getState: function () {

    },
    _getDimensionsSortingIndexes: function (model) {

    },
    _buildHierarchies: function (model, dimensionItems) {

    },
    getPossibleValues: function (packageName, dimension) {

    },
    lazyLoadDimensionValues: function (dimension, packageName) {

    },
    buildState: function (connection, options) {
        // init ..
        options = options || {}
        let model = null

        // DEBUG:
        // console.error("IN buildState, cube: %s, endpoint: %s", connection.cube, connection.endpoint)

        let mypro = []

        // Build Hierarchy
        const r = new Promise(function (resolve, reject) {

            const p = api.getPackageModel(connection.endpoint, connection.cube)
            p.then(
                (model) => {
                    // DEBUG:
                    // console.error("getPackageModel:", util.inspect(model, {depth:10}))
                    resolve(model.hierarchies)
                }
            ).catch(
                (err) => {
                    reject("ERR_getPackageModel:", util.inspect(err))
                }
            )
        })
        mypro.push(r)

        // Build Measures
        const q = new Promise(function (resolve, reject) {
            const p = api.getMeasures(connection.endpoint, connection.cube)
            p.then(
                (measures) => {
                    // DEBUG:
                    // console.error("getMeasures:", util.inspect(measures, {depth:10}))
                    resolve(measures)
                }
            ).catch(
                (err) => {
                    reject("ERR_getMeasures:", err)
                }
            )
        })
        mypro.push(q)

        // Build Dimensions
        const p = new Promise(function (resolve, reject) {
            const p1 = api.getDimensions(connection.endpoint, connection.cube)
            p1.then(
                (dimensions) => {
                    resolve(dimensions)
                })
                .catch(
                    (err) => {
                        reject("ERR_getDimensions:", err)
                    }
                )
        })
        mypro.push(p)

        // console.error(mypro)
        return mypro

    },
    getPackageInfo: function (packageName) {

    },
    start: function (initState) {

    }
}

export default osViewerService