<style scoped>

    .placeholder {
        margin-bottom: 20px;
    }

    .placeholder2 {
        margin-top: 120px;
    }

    .placeholder h4 {
        margin-bottom: 0;
    }

    .placeholder img {
        display: inline-block;
        border-radius: 40%;
    }

    .placeholder .mycontent {
        text-align: center;
    }

</style>

<template>
    <div class="col-md-6" v-for="m of ministers">
        <template v-if="m == null || m == undefined">
            .. Loading ...
        </template>
        <template v-else>
            <div class="placeholder" v-if="m.details">
                <h3><strong>{{ m.post_name }}</strong></h3>
                <div class="mycontent">
                    <img :src="m.details.image ? m.details.image.toString() :
            'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Replace_this_image_female.svg/150px-Replace_this_image_female.svg.png'"
                         width="100" height="auto"
                         class="img-thumbnail" alt="{{ m.details.name ? m.details.name.toString() : '' }}">
                    <h4>{{ m.details.name ? m.details.name.toString() : '' }}</h4>
                    <h5> {{ m.details.summary ? m.details.summary.toString() : '' }}</h5>
            <span class="text-muted">
                {{ m.details.email ? m.details.email.toString() + ' ' : '' }}
                {{ m.details.gender ? m.details.gender.toString() + " " : ''  }}
                {{ m.details.birth_date ? m.details.birth_date.toString() : ''  }}
            </span>

                </div>
            </div>
            <div class="placeholder" v-else>No Result</div>
        </template>
    </div>
</template>

<script>

    // DEBUG
    import util from 'util'
    // Libs
    import PopItPostRepo from './RelatedMinistriesInfo/Model'

    export default {
        props: ['chosen_ministry', 'repo'],
        components: {},
        watch: {
            'repo': function (val, old_val) {
                // If the ministryid changes; reload the data for the details?
                // console.error("repo -> NEW: %s OLD: %s", val, old_val)
                // if wanted; can mark where when ready?? and queue actions??
            },
            'chosen_ministry': function (val, old_val) {
                // If the ministryid changes; reload the data for the details?
                // console.error("chosen_ministry -> NEW: %s OLD: %s", val, old_val)
                // Do nothing if null, undefiedn, empty
                if (val == null || val == undefined || val == "") {
                    // Do nothing ...
                } else {
                    this.refreshMinistersList()
                }
            }
        },
        events: {},
        data () {
            return {
                ministers: [],
                minister_details: {}
            }
        },
        ready () {

            // DEBUG:
            // console.error("INIT RelatedMinistiresInfo!!")
            // Next time; have choices based on year??
        },
        methods: {
            refreshMinistersList: function () {
                // DEBUG:
                // console.error("GET_MINISTERS for:", this.chosen_ministry)
                const all_ministers = this.repo.query({action: "ministers", find: this.chosen_ministry})
                // reset
                this.ministers = []
                // Extract to Primary + Deputy Slot .. (reverse ror not decided by user??)
                let enriched_ministers = all_ministers.reverse()
                // Get Post Details
                enriched_ministers.map(function (post, index) {
                    // DEBUG:
                    // console.error("POST", util.inspect(post.post_id, {depth: 10}))
                    const p = PopItPostRepo.getPostDetails(post.post_id)
                    p.then(
                            function (result) {
                                // console.log("RESULT:", util.inspect(result, {depth: 10}))
                                // HOWTO combine below into one line??
                                // maybe `${index}.details`; try it next ..
                                // this.ministers.$set(`${index}.details`, result)
                                enriched_ministers[index]['details'] = result
                                this.ministers.$set(index, enriched_ministers[index])
                                // DEBUG:
                                // console.log("ENRICHED:", util.inspect(this.ministers, {depth: 10}))
                            }.bind(this)
                    ).catch(
                            function (err) {
                                console.error("ERR:", err)
                            }
                    )
                }.bind(this))
            }
        },
        computed: {}

    }

</script>