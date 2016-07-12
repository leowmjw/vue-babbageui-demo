<style scoped>

</style>

<template>
    <h2>RelatedMinistriesInfo Component HERE!!</h2>
</template>

<script>

    import util from 'util'

    export default {
        props: ['chosen_ministry', 'repo'],
        components: {},
        watch: {
            'chosen_ministry': function(val, old_val) {
                // If the ministryid changes; reload the data for the details?
                console.error("OLD: %s NEW: %s", val, old_val)
            }
        },
        events: {},
        data () {
            return {
                minsters: null,
                current: {
                    ministry: null,
                    cube: null
                }
            }
        },
        ready () {

            console.error("INIT RelatedMinistiresInfo!!")
            // For now; assuem the setup based on Najib's Fifth Cabinet??

            // Next time; have choices based on year??
        },
        methods: {
            getMinisters: function () {
                this.ministers = this.repo.query({action: "ministers", find: this.chosen_minstry})
                // Get Post Details
                // Extract to Primary + Deputy Slot ..
            },
            getPostDetails: function(post_id) {

            }
        },
        computed: {
            formalMinistryName: function() {
                // A nicely labeled and printed / formatted Ministry??
                // Use the language tag?
            }
        }

    }

</script>