<style scoped>

</style>

<template>
    <h2>RelatedMinistriesInfo Component HERE!!</h2>
    <div v-for="minister of ministers">
        <h3>{{ minister.post_name }}</h3>
        <div class="placeholder" v-for="item of minister_details[minister.post_id]">
            <img :src="item.image ? item.image.toString() :
            'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Replace_this_image_female.svg/150px-Replace_this_image_female.svg.png'"
                 width="100" height="auto"
                 class="img-thumbnail" alt="{{ item.area.id ? item.area.id.toString() : '' }}">
            <h4>{{ item.name ? item.name.toString() : '' }}</h4>
            <span class="text-muted">
                {{ item.area.id ? item.area.id.toString() : '' }}:
                {{ item.label ? item.label.toString() : '' }},
                {{ item.area.state ? item.area.state.toString() : ''  }}
            </span>
        </div>
    </div>
</template>

<script>

    // DEBUG
    import util from 'util'
    // Libs
    import Model from './RelatedMinistriesInfo/Model'

    export default {
        props: ['chosen_ministry', 'repo'],
        components: {},
        watch: {
            'repo': function (val, old_val) {
                // If the ministryid changes; reload the data for the details?
                console.error("repo -> OLD: %s NEW: %s", val, old_val)
                this.getMinisters()
            },
            'chosen_ministry': function (val, old_val) {
                // If the ministryid changes; reload the data for the details?
                console.error("chosen_ministry -> OLD: %s NEW: %s", val, old_val)
                this.getMinisters()
            },
            'ministers': function (val, old_val) {
                // Regenerate the details when we have the ministers changing!!
                console.error("ministers -> OLD: %s NEW: %s", val, old_val)
            }
        },
        events: {},
        data () {
            return {
                ministers: null,
                minister_details: null,
                current: {
                    ministry: null,
                    cube: null
                }
            }
        },
        ready () {

            console.error("INIT RelatedMinistiresInfo!!")
            // For now; assuem the setup based on Najib's Fifth Cabinet??
            // this.getMinisters()

            // Next time; have choices based on year??
        },
        methods: {
            getMinisters: function () {
                console.error("GET_MINISTERS for:", this.chosen_ministry)
                this.ministers = this.repo.query({action: "ministers", find: this.chosen_ministry})
                // Get Post Details
                // Extract to Primary + Deputy Slot ..
            },
            getMinisterDetails: function (post_id) {
                console.error("POST_ID:", post_id)
                // Call Promise and resolve it here ..
                Model.getPostDetails(post_id)
                // Put it into the minister_details; index by id ...
                return []
            }
        },
        computed: {
            formalMinistryName: function () {
                // A nicely labeled and printed / formatted Ministry??
                // Use the language tag?
            },
            minister_details: function () {
                const filled_in_details = {}
                // When ministers change; will trigger this chnage when it is needed
                this.ministers.map(function (post, index) {
                    // With the post object; you can extract the ID
                    console.error("POSTS: ", util.inspect(post, {depth: 10}))
                    // can resolve the promise here??
                    // return the enriched item??
                    filled_in_details[post.post_id] = {
                        name: "David Cameron"
                    }
                })

                console.error("FILLED: ", util.inspect(filled_in_details, {depth: 10}))
                return filled_in_details
            }
        }

    }

</script>