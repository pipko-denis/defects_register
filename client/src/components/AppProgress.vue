<template>
        <v-progress-linear v-if="this.$store.getters.getIsAuth && processing" xs12  v-slot:progress color="blue" height="2" indeterminate></v-progress-linear>
</template>

<script>
    export default {
        computed: {
            processing: function() {             
                return true//this.$store.getters.getProcessing
            },
        }        
    }
</script>

<style scoped>

</style>