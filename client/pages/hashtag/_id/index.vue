<template>
    <v-container>
        <div>
            <PostCard v-for="(p, idx) in mainPosts" :key="idx" :post="p" />
        </div>
    </v-container>
</template>

<script>
import PostCard from '~/components/PostCard'

export default {
    components: {
        PostCard
    },
    computed: {
        mainPosts() {
            return this.$store.state.posts.mainPosts
        },
        hasMorePost() {
            return this.$store.state.posts.hasMorePost
        }
    },
    fetch({ store, params }) {
        return store.dispatch('posts/loadHashtagPosts', {
            hashtag: encodeURIComponent(params.id),
            reset: true
        })
    },
    mounted() {
        // 브라우저 객체 window는 mounted 됐을 때에 접근 가능하다.
        window.addEventListener('scroll', this.onScroll)
    },
    beforeDestroy() {
        // create, mounted 시에 등록한 이벤트는 소멸 전에 제거 시켜야 한다.
        // 안 그러면 메모리 누수가 발생한다.
        window.removeEventListener('scroll', this.onScroll)
    },
    methods: {
        onScroll() {
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                if (this.hasMorePost) {
                    this.$store.dispatch('posts/loadUserPosts', { userId: this.$route.params.id })
                }
            }
        }
    }
};
</script>

<style>

</style>