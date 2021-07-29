<template>
    <v-card style="margin-bottom: 20px">
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
                    :rules="contentRules"
                    @input="onChangeTextarea"
                />
                <v-btn type="submit" color="green" absolute right>짹짹</v-btn>
                
                <!-- 
                    type이 file인 input 태그는 숨겨준 후, 버튼 클릭을 통해 발생하는 이벤트 함수에서 접근해 클릭을 시킨다.
                    기본적으로 form 안에 있는 button은 submit 타입이므로, 다른 동작을 하는 버튼은 button 타입이라 명시하는 것이 좋다.
                -->
                <!-- <input ref="imageInput" type="file" multiple hidden @change="onChangeImages"> -->
                <input 
                    ref="imageInput" 
                    type="file" 
                    multiple 
                    hidden 
                    @change="onChangeImages"
                />
                <v-btn type="button" @click="onClickImageUpload">이미지 업로드</v-btn>
                <div>
                    <div v-for="(p, i) in imagePaths" :key="p" style="display: inline-block">
                        <img :src="`http://localhost:3085/${p}`" :alt="p" style="width: 200px" />
                        <div>
                            <button type="button" @click="onRemoveImage(i)">제거</button>
                        </div>
                    </div>
                </div>
            </v-form>
        </v-container>
    </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
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
        ...mapState('users', ['me']),
        ...mapState('posts', ['imagePaths'])
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
                this.$store.dispatch('posts/add', {
                    content: this.content
                })
                    .then(() => {
                        this.content = ''
                        this.hideDetails = false
                        this.success = true
                        this.successMessages = '게시글 등록 성공!'
                        this.contentRules = []
                    })
                    .catch((err) => {
                        console.error(err)
                        this.hideDetails = false
                        this.success = false
                        this.successMessages = ''
                    })
            }
        },
        onClickImageUpload() {
            this.$refs.imageInput.click()   // 돔에 접근해 클릭 발생!
        },
        onChangeImages(e) {
            console.log('업로드 할 파일들 : ', e.target.files)
            const files = e.target.files
            const imageFormData = new FormData()

            for (let i = 0; i < files.length; i++) {
                imageFormData.append('image', files[i])
            }

            this.$store.dispatch('posts/uploadImages', imageFormData)
        },
        onRemoveImage(index) {
            this.$store.commit('posts/removeImagePath', index)
        }
    }
}
</script>

<style>
    
</style>