<style scoped>

</style>

<template>

</template>

<script>

    import util from 'util'

    export default {
        props: ['ministryid'],
        components: {},
        watch: {
            'ministryid': function(val, old) {
                // If the ministryid changes; reload the data for the details?
            }
        },
        events: {},
        data () {
            return {
                current: {
                    ministry: null,
                    cube: null
                }
            }
        },
        ready () {

            // For now; assuem the setup based on Najib's Fifth Cabinet??

            // Next time; have choices based on year??
        },
        methods: {
            getMinisters: function() {
                // Includes Ministers and all Deputy Ministers
            },
            getCubesRelatedToMinistry: function() {

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