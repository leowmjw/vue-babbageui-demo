/**
 * Created by leow on 5/12/16.
 */
"use strict"

import util from 'util'
import stampit from 'stampit'

const Logger = stampit({
    methods: {
        // Need to use .bind the console in order to avoid Illegal Invocation Error
        // http://stackoverflow.com/questions/18426408/illegal-invocation-error-when-console-log-passed-in-a-function
        log: console.log.bind(console),
        err: console.error.bind(console)
    }
})

const repoInterface = stampit
    .init(

    ).methods({
            query (opts) {
                this.err("Please IMPLEMENT!! Opts passed is", util.inspect(opts))
            },
            save () {
                this.err("Please IMPLEMENT!!!", util.inspect(this.myerr))
            },
            bob() {
                console.error("I am a BOB!!!")
            }
        }
    ).refs(

    ).compose(
        Logger
    )

export default repoInterface
