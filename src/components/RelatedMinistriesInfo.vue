<style scoped>

</style>

<template>
    <div v-for="minister of ministers">
        <h3>{{ minister.post_name }}</h3>
        <h4>{{ minister_details | json }}</h4>
        <div class="placeholder" v-for="item of minister_details[minister.post_id]">
            <img :src="item.image ? item.image.toString() :
            'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Replace_this_image_female.svg/150px-Replace_this_image_female.svg.png'"
                 width="100" height="auto"
                 class="img-thumbnail" alt="{{ item.area.id ? item.area.id.toString() : '' }}">
            <h4>{{ item.name ? item.name.toString() : '' }}</h4>
            <h5> {{ item.summary ? item.summary.toString() : '' }}</h5>
            <span class="text-muted">
                {{ item.email ? item.email.toString() : '' }},
                {{ item.gender ? item.gender.toString() : ''  }},
                {{ item.birth_date ? item.birth_date.toString() : ''  }},
                {{ item.contact_details ? item.contact_details | json : ''  }}
            </span>
        </div>
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
                console.error("repo -> NEW: %s OLD: %s", val, old_val)
                // if wanted; can mark where when ready?? and queue actions??
            },
            'chosen_ministry': function (val, old_val) {
                // If the ministryid changes; reload the data for the details?
                console.error("chosen_ministry -> NEW: %s OLD: %s", val, old_val)
                // Do nothing if null, undefiedn, empty
                if (val == null || val == undefined || val == "") {
                    // Do nothing ...
                } else {
                    this.refreshMinistersList()
                }
            },
            'ministers': function (val, old_val) {
                // Regenerate the details when we have the ministers changing!!
                console.error("ministers -> NEW: %s OLD: %s", util.inspect(val, {depth: 10}), old_val)
                // Do nothing if null, undefiedn, empty
                if (val == null || val == undefined) {
                    // Do nothing ...
                } else {
                    // console.error("CALL --> refreshMinisterDetails")
                    this.refreshMinisterDetails()
                }
            },
            'minister_details': function(val, old_val) {
                console.error("MIN_DETAILS:", util.inspect(val, {depth: 10}), util.inspect(old_val, {depth: 10}))

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
                // NOTE: Should be a better way here ... fo sorting; pulling the chief??
                this.ministers = this.repo.query({action: "ministers", find: this.chosen_ministry}).reverse()
                // Get Post Details
                // Extract to Primary + Deputy Slot ..
            },
            refreshMinisterDetails: function () {
                // Triggers and it puts into the daat structur minister_details
                // Firstly; reset minister_details here first!!! so NO remnnants
                this.minister_details = {}
                // Shallow clone of this.ministers
                // const all_ministers = this.ministers.slice()
                // Go through each Minister and add the needed details as we go ..
                this.ministers.map(function (post, index) {
                    // console.error("POST", util.inspect(post.post_id, {depth: 10}))
                    const p = PopItPostRepo.getPostDetails(post.post_id)
                    p.then(
                            function (result) {
                                // console.log("RESULT:", util.inspect(result, {depth: 10}))
                                this.$set(this.minister_details[post.post_id], result)
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