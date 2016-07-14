/**
 * Created by leow on 5/12/16.
 */
"use strict"

// import util from 'util'
import stampit from 'stampit'
import repoInterface from './repo-base'

const repoDummy = stampit
    .props()
    .init()
    .methods()
    .refs()

export default stampit.compose(repoInterface, repoDummy)