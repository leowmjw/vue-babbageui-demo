/**
 * Created by leow on 7/10/16.
 */
"use strict"
import util from 'util'
import stampit from 'stampit'
import repoInterface from '../../libs/repo-base'

const repoFixture = stampit
    .props()
    .init(function ({instance, args}) {
        // Look up in the fixture directtory based on the args being passed in?
        // DEBUG:
        // this.err("INSTANCE:", util.inspect(instance, {depth: 10}))
        // this.err("ARGS:", util.inspect(args, {depth: 10}))
        // Load on demand ...
        // instance.repoObj = require(`${__dirname}/fixture/${args[0]}.js`)
        // NOTE: When using CommonJS loading for ES6 module; extract out "default" as per below
        //  else will need to use module.exports instead .. which is the best dunno ..
        instance.repoObj = require(`./fixture/${args[0]}.js`).default
        // DEBUG:
        // console.log("INIT:", util.inspect(instance.repoObj, {depth: 10}))
    })
    .methods({
        query: function (...opts) {

            // Based on the type; simple case select for now?
            // Next time got extra can pass further modifers??
            const [ command, extra ] = opts
            // Should still be the same later ... use this or instance??
            // DEBUG:
            // console.log("THIS:", util.inspect(this.repoObj, {depth: 10}))
            // Try both; below does NOT work!!
            // console.log("INSTANCE:", util.inspect(instance.repoObj, {depth: 10}))
            this.log("ACTION: %s FIND: %s ", command.action, command.find)
            // Below are the sample of data to be returned when selection of diff actions above
            // return this.repoObj.getMinisters()
            if (command.action == "ministries") {
                return this.repoObj.getMinistries().map(function (e, f) {
                    // DEUBG:Element
                    // this.log("ELEM: ", util.inspect(e, {depth: 10}))
                    // DEBUG: Index in array
                    // this.log("F:", util.inspect(f, {depth: 10}))
                    return e.name
                }.bind(this))

            } else if (command.action == "ministers") {
                return this.repoObj.getMinistries()
                    .filter(function (a, b) {
                        if (a.name == command.find) {
                            this.log("MATCHED: ", a.name, command.find)
                            return true
                        }
                        return false
                    }.bind(this))
                    .map(function (e, f) {
                        return e.members
                    }.bind(this))[0]
                // Above needs to select first item from array so we get the expected data strcuture out as per below
                /*
                 ACTION: ministers FIND: Prime Minister's Department
                 MATCHED:  Prime Minister's Department Prime Minister's Department
                 [ { post_id: '55b734577070042c250b332e',
                 post_name: 'Deputy Minister in the Prime Minister\'s Department' },
                 { post_id: '55b72903869c13f57048ca7e',
                 post_name: 'Ministers in the Prime Minister\'s Department' } ]
                 */

            }
            else if (command.action == "packages") {
                return this.repoObj.getBudgetsOfMinistries().filter(function (a, b) {
                    // this.err("A:", util.inspect(a, {depth: 10}))
                    // this.err("B:", util.inspect(b, {depth: 10}))
                    if (a.name == command.find) {
                        // this.log("MATCHED: ", a.name, command.find)
                        return true
                    }
                    return false
                }.bind(this))[0].budgets
            } else {
                // No result ..
                return []
            }

        }
    })
    .refs()

export default stampit.compose(repoInterface, repoFixture)
