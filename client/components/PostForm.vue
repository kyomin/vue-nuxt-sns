<template>
    <v-card>
        <v-container>
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                <v-textarea 
                    v-model="content"
                    outlined
                    auto-grow
                    clearable
                    label="오늘은 무슨 일이 있었나요?"
                    :hide-details="hideDetails"
                    :success-messages="successMessages"
                    :success="success"
                    :rules="[v => !!v || '내용을 입력하세요.']"
                    @input="onChangeTextarea"
                />
            </v-form>
            <v-btn type="submit" color="green" absolute right>짹짹</v-btn>
            <v-btn>이미지 업로드</v-btn>
        </v-container>
    </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data() {
        return {
            valid: false,
            hideDetails: false,
            successMessages: '',
            success: false,
            content: ''
        }
    },
    computed: {
        ...mapState('users', ['me'])
    },
    methods: {
        onChangeTextarea() {
            // 한 글자라도 치면
            if (this.content) {
                this.hideDetails = true
                this.success = false
                this.successMessages = ''
            } else {
                this.hideDetails = false
            }
        },
        onSubmitForm() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('posts/add', {
                    content: this.content,
                    user: {
                        nickname: this.me.nickname
                    },
                    comments: [],
                    images: [],
                    id: Date.now(),
                    createdAt: Date.now()
                })
                    .then(() => {
                        this.hideDetails = false
                        this.success = true
                        this.successMessages = '게시글 등록 성공!'
                    })
                    .catch((err) => {

                    })
            }
        }
    }
}
</script>

<style>
    
</style>