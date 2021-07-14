<template>
    <v-card style="margin-bottom: 20px">
        <v-img />
        <v-card-text>
            <div>
                <h3>{{ post.user.nickname }}</h3>
                <div>{{ post.content }}</div>
            </div>
        </v-card-text>
        <v-card-actions>
            <v-btn text color="orange">
                <v-icon>mdi-twitter-retweet</v-icon>
            </v-btn>
            <v-btn text color="orange">
                <v-icon>mdi-heart-outline</v-icon>
            </v-btn>
            <v-btn text color="orange">
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
</template>

<script>
export default {
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
    methods: {
        onRemovePost() {
            this.$store.dispatch('posts/remove', {
                id: this.post.id
            })
        },
        onEditPost() {

        }
    }
};
</script>

<style>

</style>