/**
 * Created by leow on 7/3/16.
 */
"use strict"

import util from 'util'

const request = require('superagent-promise')(require('superagent'), Promise)

export default {
    getPostDetails: function (post_id) {
        // Need to check if no post_id??
        // Use superagent to get the needed data .. from PopIt API
        // Use stampit to stub out?? maybe ..
        return new Promise(function (resolve, reject) {
            // DEBUG:
            // console.error("POST_ID: ", post_id)
            request
                .get(`http://api.popit.sinarproject.org/en/posts/${post_id}/`)
                .then(
                    (res) => {
                        // DEBUG:
                        // console.error(util.inspect(res))
                        if (res.ok) {
                            // DEBUG:
                            // console.error("JSON:", util.inspect(res.body))

                            const payload = res.body
                            const person = payload.result.memberships[0].person
                            const contact_details = payload.result.memberships[0].contact_details

                            // Extract out only the interesting bits ..
                            resolve({
                                name: person.name,
                                image: person.image,
                                summary: person.summary,
                                email: person.email,
                                gender: person.gender,
                                birth_date: person.birth_date,
                                contact_details: contact_details
                            })
                        } else {
                            // Check other results??
                            console.error("TYPE:", res.resultType)
                            reject(res.statusCode)
                        }
                    }
                )
                .catch((err) => reject(err))
        })
    }
}