/**
 * Created by leow on 5/12/16.
 */
"use strict"

// import util from 'util'
import stampit from 'stampit'
import arangojs from 'arangojs'
import repoInterface from './repo-base'

const repoArangoDB = stampit
    .props({
            type: "arangodb",
            collectionName: "flll-er-up"
        }
    ).init(function ({instance, args}) {
            // Init the ArangoDB connection
            instance.collectionName = args[0]
            // Using th db config ...
            this.dbconn = new arangojs.Database({
                url: `http://${instance.db.host}:${instance.db.port}`
            })
            // DEBUG:
            // this.log("instance %s args %s", util.inspect(instance), util.inspect(args))
            // Switch to the db config name
            this.dbconn.useDatabase(`${instance.db.name}`)
        }
    ).methods({
            _promiseQueryAllArangoRepo: function (aql_query = null, bind_vars = null, options = null) {

                // console.log("CONTEXT", util.inspect(this))
                return new Promise(function (resolve, reject) {

                    // DEBUG:
                    // this.err("DBCONN", util.inspect(this.dbconn))
                    // Execute async stuff here ..
                    // with needed bindings??
                    if ((this.dbconn == null) || (this.dbconn == undefined)) {
                        // DEBUG:
                        // this.err("No change when init!!; is NULL!!!")
                        reject("No dbconn too!!")
                        return
                    }

                    // GET this far is ok
                    // this.log("ARANGODB", util.inspect(this.dbconn))

                    this.dbconn.query(aql_query, bind_vars, options).then(
                        cursor => {
                            this.log("%s result(s) returned!!", cursor.count)
                            // self.result = cursor.count
                            return cursor.all()
                        },
                        err => {
                            // DEBUG:
                            // console.error("QUERY_ERR: ", util.inspect(err))
                            reject(err.code)
                        }
                    ).then(
                        value => {
                            // console.log("Got back from ARANGODB: ", util.inspect(value))
                            // DEBUG:
                            // console.log(JSON.stringify(value))
                            resolve(value)
                        },
                        err => {
                            // DEBUG:
                            // this.err("RAW_ERR_ARANGODB: ", util.inspect(err))
                            reject(err.code)
                        }
                    )
                }.bind(this))

            },
            query(...opts) {
                // Validation to be injected here perhaps??
                // DEBUG:
                // this.err("QUERY INVOKED with ", util.inspect(opts))
                return this._promiseQueryAllArangoRepo(...opts)
            }
        }
    ).refs({
            dbconn: null
        }
    )


export default stampit.compose(repoInterface, repoArangoDB)
