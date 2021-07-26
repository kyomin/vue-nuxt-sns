<template>
    <div style="margin-bottom: 20px">
        <v-card>
            <!-- 게시글 이미지들 -->
            <PostImages :images="post.Images || []" />

            <!-- 게시글 작성자 -->
            <v-card-title>
                <h3>
                    <nuxt-link :to="'/user/' + post.id">{{ post.User.nickname }}</nuxt-link>
                </h3>
            </v-card-title>

            <!-- 게시글 내용 -->
            <v-card-text>
                <div>
                    <div>{{ post.content }}</div>
                </div>
            </v-card-text>

            <!-- 게시글 옵션들 -->
            <v-card-actions>
                <v-btn text color="orange">
                    <v-icon>mdi-twitter-retweet</v-icon>
                </v-btn>
                <v-btn text color="orange">
                    <v-icon>mdi-heart-outline</v-icon>
                </v-btn>
                <v-btn text color="orange" @click="onToggleComment">
                    <v-icon>mdi-comment-outline</v-icon>
                </v-btn>

                <v-menu offset-y open-on-hover>
                    <template v-slot:activator="{ on }">
                        <v-btn text color="orange" v-on="on">
                            <v-icon>mdi-dots-horizontal</v-icon>
                        </v-btn>
                    </template>
                    <!-- 버튼을 눌렀을 때 나타날 메뉴들 정의 -->
                    <div style="background: white">
                        <v-btn dark color="red" @click="onRemovePost">삭제</v-btn>
                        <v-btn text color="orange" @click="onEditPost">수정</v-btn>
                    </div>
                </v-menu>
            </v-card-actions>
        </v-card>
        <template v-if="commentOpened">
            <!-- 댓글 입력 창 -->
            <CommentForm :post-id="post.id" />

            <!-- 등록된 댓글들 -->
            <v-list>
                <v-list-item v-for="c in post.comments" :key="c.id">
                    <v-list-item-avatar color="teal">
                        <span>{{ c.User.nickname[0] }}</span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ c.User.nickname }}</v-list-item-title>
                        <v-list-item-subtitle>{{ c.comment }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </template>
    </div>
</template>

<script>
import CommentForm from '~/components/CommentForm'
import PostImages from '~/components/PostImages'

export default {
    components: {
        CommentForm,
        PostImages
    },
    /* 
        기존에는 
            props: ['post']
        와 같이 간단히 명시하였다.

        하지만, 아래와 같이 자세히 써 주면 좋다.
    */
    props: {
        post: {
            type: Object,
            required: true  // 부모가 필수적으로 내려주는 props인가?
        }
    },
    data() {
        return {
            commentOpened: false
        }
    },
    methods: {
        onRemovePost() {
            this.$store.dispatch('posts/remove', {
                postId: this.post.id
            })
        },
        onEditPost() {

        },
        onToggleComment() {
            // 댓글 창 여는 동작을 할 때 서버로부터 로드해 오기!
            if (!this.commentOpened) {
                this.$store.dispatch('posts/addComment', {
                    postId: this.post.id
                })
            }

            this.commentOpened = !this.commentOpened
        }
    }
};
</script>

<style scoped>
    a {
        color: inherit;
        text-decoration: none;
    }
</style>