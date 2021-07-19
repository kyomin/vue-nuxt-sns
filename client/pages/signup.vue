<template>
    <div>
        <v-container>
            <v-card>
                <v-container>
                    <v-subheader>회원가입</v-subheader>
                    <v-form v-model="valid" @submit.prevent="onSubmitForm" ref="form">
                        <v-text-field 
                            v-model="email" 
                            label="이메일" 
                            type="email"
                            :rules="emailRules"
                            required 
                        />
                        <v-text-field 
                            v-model="password" 
                            label="비밀번호" 
                            type="password"
                            :rules="passwordRules"
                            required 
                        />
                        <v-text-field 
                            v-model="passwordCheck" 
                            label="비밀번호 확인" 
                            type="password"
                            :rules="passwordCheckRules"
                            required 
                        />
                        <v-text-field 
                            v-model="nickname" 
                            label="닉네임" 
                            type="nickname"
                            :rules="nicknameRules"
                            required 
                        />
                        <v-checkbox 
                            v-model="terms" 
                            label="Kyomin이 세운 규칙을 잘 준수할 것을 동의합니다"
                            :rules="[v => !!v || '약관에 동의해야 합니다.']"
                            required 
                        />
                        <v-btn color="green" type="submit" :disabled="!valid">가입하기</v-btn>
                    </v-form>
                </v-container>
            </v-card>
        </v-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            valid: false,   // 전체 validation이 유효하여 회원가입 버튼을 누를 수 있는지?
            email: '',
            password: '',
            passwordCheck: '',
            nickname: '',
            terms: false,    // 약관 동의
            emailRules: [
                v => !!v || '이메일은 필수입니다.',
                v => /.+@.+/.test(v) || '이메일 형식이 유효하지 않습니다.'
            ],
            nicknameRules: [
                v => !!v || '닉네임은 필수입니다.'
            ],
            passwordRules: [
                v => !!v || '비밀번호는 필수입니다.'
            ],
            passwordCheckRules: [
                v => !!v || '비밀번호를 확인해 주십시오!',
                v => v === this.password || '비밀번호가 일치하지 않습니다.'
            ]
        }
    },
    methods: {
        onSubmitForm() {
            /* 
                vuetify가 제공하는 기능이다.
                v-form 태그에 ref를 명시하고,
                내부에 있는 입력 폼들의 rules가 모두 만족 되면,
                this.valid를 true로,
                아니면 false로 자동 셋팅해준다.

                vuetify를 사용하지 않으면 직접 구현해야 한다.
            */
            if (this.$refs.form.validate()) {
                console.log('회원가입 form submit 시도!!')
                this.$store.dispatch('users/signup',  {
                    email: this.email,
                    nickname: this.nickname,
                    password: this.password
                })
            } else {
                alert('폼이 유효하지 않습니다.')
            }
        }
    },
    head() {
        return {
            title: '회원가입'
        }
    },
    middleware: 'anonymous'
};
</script>

<style>

</style>