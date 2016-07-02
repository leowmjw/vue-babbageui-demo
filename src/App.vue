<style>
    body {
        font-family: Helvetica, sans-serif;
        padding-top: 70px;
        /*
           Required padding for .navbar-fixed-top.
           Remove if using .navbar-static-top. Change if height of navigation changes.
        */
    }

    footer {
        margin: 50px 0;
    }

</style>

<template>

    <div id="app">

        <h2>{{ msg }}</h2>

        <navigation></navigation>

        <div class="container">
            <div class="row">
                <babbageui></babbageui>
            </div>

            <hr>

            <footer>Sinar Project 2016</footer>
        </div>

    </div>

</template>

<script>

    import util from 'util'
    // Actual subcomponents below ...
    import Navigation from './components/Navigation.vue'
    import BabbageUI from './components/BabbageUI.vue'

    export default {
        components: {
            navigation: Navigation,
            babbageui: BabbageUI
        },
        data () {
            return {
                // note: changing this line won't causes changes
                // with hot-reload because the reloaded component
                // preserves its current state and we are modifying
                // its initial state.
                msg: 'Demo - Try Drilldown!'
            }
        }
    }
</script>

