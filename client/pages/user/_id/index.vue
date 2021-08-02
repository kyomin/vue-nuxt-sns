<template>
    <v-container>
        <v-card style="margin-bottom: 20px">
            <v-container>
                {{ other.nickname }}
                <v-row>
                    <v-col cols="4">{{ other.Followings.length }} 팔로잉</v-col>
                    <v-col cols="4">{{ other.Followers.length }} 팔로워</v-col>
                    <v-col cols="4">{{ other.Posts.length }} 게시글</v-col>
                </v-row>
            </v-container>
        </v-card>
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
        other() {
            return this.$store.state.users.other
        },
        mainPosts() {
            return this.$store.state.posts.mainPosts
        },
        hasMorePost() {
            return this.$store.state.posts.hasMorePost
        }
    },
    fetch({ store, params }) {
        store.dispatch('users/loadOther', {
            userId: params.id
        })
        return store.dispatch('posts/loadUserPosts', {
            userId: params.id,
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