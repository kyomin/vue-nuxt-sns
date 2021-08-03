<template>
    <div>
        <!-- 게시글 이미지들 -->
        <PostImages :images="post.Images || []" />

        <!-- 게시글 작성자 -->
        <v-card-title>
            <h3>
                <nuxt-link :to="'/user/' + post.User.id">{{ post.User.nickname }}</nuxt-link>
                <v-btn v-if="canFollow" @click="onFollow">팔로우</v-btn>
                <v-btn v-if="canUnfollow" @click="onUnfollow">언팔로우</v-btn>
            </h3>
        </v-card-title>

        <!-- 게시글 내용 -->
        <v-card-text>
            <div>
                <!-- 
                    해시태그(#)가 있는 것은 넉스트 링크로,
                    아닌 것은 일반 텍스트로 렌더링핸다.
                -->
                <template v-for="(node, i) in nodes">
                    <nuxt-link v-if="node.startsWith('#')" :key="i" :to="`/hashtag/${node.slice(1)}`">{{ node }}</nuxt-link>
                    <template v-else>{{ node }}</template>
                </template>
            </div>
        </v-card-text>
    </div>
</template>

<script>
import PostImages from './PostImages'

export default {
    components: {
        PostImages
    },
    props: {
        post: {
            type: Object
        }
    },
    computed: {
        nodes() {
            return this.post.content.split(/(#[^\s#]+)/)
        },
        me() {
            return this.$store.state.users.me
        },
        canFollow() {
            /* 
                어떤 상황에서 게시글 닉네임 옆에 팔로우 버튼을 활성화해야 할까?
                
                1. 우선 내가 로그인 한 상태여야 한다.
                2. 현재 게시글을 작성한 사람이 내가 아니어야 한다.
                3. 내가 팔로잉 한 목록 중에 현 게시글의 작성자가 없어야 한다. 
            */
            return this.me && this.post.User.id !== this.me.id && !this.me.Followings.find(v => v.id === this.post.User.id)
        },
        canUnfollow() {
            // 위의 3번 조건에서 내가 팔로잉 한 목록 중에 있어야 언팔로우 버튼을 활성화시킨다.
            return this.me && this.post.User.id !== this.me.id && this.me.Followings.find(v => v.id === this.post.User.id)
        }
    },
    methods: {
        onFollow() {
            this.$store.dispatch('users/following', {
                userId: this.post.User.id
            })
        },
        onUnfollow() {
            this.$store.dispatch('users/unfollowing', {
                userId: this.post.User.id
            })
        }
    }
};
</script>

<style scoped>
a {
    text-decoration: none;
    color: inherit;
}
</style>