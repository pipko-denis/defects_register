<template>
    <div>
        <trains-list></trains-list>
    </div>
</template>

<script>
import TrainsList from '../components/TrainsList'

    export default {
        components:{
            TrainsList
        },
        beforeMount() {
            if (!this.$store.getters.getIsAuth) {
                this.$router.push("/signin")            
            }
        }
    }
</script>

<style scoped>

</style>