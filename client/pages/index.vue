<template>
    <div>
        <v-container>
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
        </v-container>
    </div>
</template>

<script>
import PostCard from '~/components/PostCard.vue'

export default {
    components: {
        PostCard
    },
    data() {
        return {
            name: 'Nuxt.js'
        }
    }
};
</script>

<style>

</style>