<template>
    <div>
        <protocols-list></protocols-list>
    </div>
</template>

<script>
import ProtocolsList from '../components/ProtocolsList'

export default {
    components: {
        ProtocolsList,
    },
        mounted() {
            if (!this.$store.getters.getIsAuth) {
                this.$router.push("/signin")            
            }
        }        
    }
</script>

<style scoped>

</style>