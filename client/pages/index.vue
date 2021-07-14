<template>
    <v-container>
        <PostForm v-if="me" />
        <div>
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
        </div>
    </v-container>
</template>

<script>
import PostCard from '~/components/PostCard.vue'
import PostForm from '~/components/PostForm.vue'

export default {
    components: {
        PostCard,
        PostForm
    },
    data() {
        return {
            name: 'Nuxt.js'
        }
    },
    computed: {
        me() {
            return this.$store.state.users.me
        }
    }
};
</script>

<style>

</style>