<template>
    <v-form ref="form" v-model="valid" style="position: relative" @submit.prevent="onSubmitForm">
        <v-textarea 
            v-model="content"
            filled
            auto-grow
            clearable
            label="댓글을 남겨주세요"
            :hide-details="hideDetails"
            :success-messages="successMessages"
            :success="success"
            :rules="contentRules"
            @input="onChangeTextarea"
        />
        <v-btn type="submit" color="green" dark absolute top right>삐약</v-btn>
    </v-form>
</template>

<script>
export default {
    props: {
        // 어떤 게시글의 댓글인지 알기 위해 게시글의 id 값만 props로 받아온다.
        postId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            valid: false,
            hideDetails: true,
            successMessages: '',
            success: false,
            content: '',
            contentRules: []
        }
    },
    computed: {
        me() {
            return this.$store.state.users.me
        }
    },
    methods: {
        onChangeTextarea() {
            // 한 글자라도 치면
            if (this.content) {
                this.hideDetails = true
            } 

            this.success = false
            this.successMessages = ''
        },
        onSubmitForm() {
            if (!this.content) {
                this.contentRules = [v => !!v || '내용을 입력하세요.']
                this.hideDetails = false
                this.success = false
                this.successMessages = ''
                return
            }

            if (this.$refs.form.validate()) {
                this.$store.dispatch('posts/addComment', {
                    postId: this.postId,
                    content: this.content
                })
                    .then(() => {
                        this.content = ''
                        this.hideDetails = false
                        this.success = true
                        this.successMessages = '댓글이 작성되었습니다.'
                        this.contentRules = []
                    })
                    .catch((err) => {

                    })
            }
        }
    }
};
</script>

<style>

</style>