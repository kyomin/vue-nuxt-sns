<template>
    <v-container>
        <PostForm v-if="me" />
        <div>
            <PostCard v-for="p in mainPosts" :key="p.id" :post="p" />
        </div>
    </v-container>
</template>

<script>
import PostCard from '~/components/PostCard'
import PostForm from '~/components/PostForm'

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
        },
        mainPosts() {
            return this.$store.state.posts.mainPosts
        },
        hasMorePost() {
            return this.$store.state.posts.hasMorePost
        }
    },
    // nuxt에서 제공하는 기능이다.
    // 페이지가 처음 마운트 되기 전에, 데이터를 로드하는 것이다.
    fetch({ store }) {
        // 액션을 호출해 서버에서 데이터를 가져와 state에 셋팅한다.
        return store.dispatch('posts/loadPosts', { reset: true })
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
        /* 
            무한 스크롤링을 구현하기 위해서는 다음 3가지 요소를 사용한다.

            1. document.documentElement.clientHeight
            : 얘는 스크롤을 무시하고 사용자에게 보여지는 화면의 높이이다.
            URL 입력 창 바로 밑 단부터 아래까지

            2. document.documentElement.scrollHeight
            : 얘는 스크롤을 포함한 높이이다.
            만일 컨텐츠가 많아 화면에 스크롤이 걸려 있다면, 
            주소 입력 창부터 스크롤을 맨 아래로 내렸을 때까지의 높이이다.

            3. window.scrollY
            : 말 그대로 스크롤로 움직인 거리이다.

            그래서 만일 스크롤을 끝까지 내렸다면, 다음 규칙이 발생한다.

            window.scrollY + document.documentElement.clientHeight === document.documentElement.scrollHeight

            그래서 맨 끝에 도달해서야 데이터를 가져오는 것이 아닌,
            미리 데이터를 로드하기 위해 다음과 같은 조건에서 가져온다.
            딱 맞을 때가 아니라 확 내렸을 때, 넘어가기 때문에 ===가 아닌 부등호를 사용한다.

            window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300
        */
        onScroll() {
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                if (this.hasMorePost) {
                    this.$store.dispatch('posts/loadPosts')
                }
            }
        }
    }
};
</script>

<style>

</style>