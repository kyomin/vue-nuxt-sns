<template>
    <v-app>
        <nav>
            <v-toolbar dark color="green">
                <v-toolbar-title>
                    <nuxt-link to="/">KyoSNS</nuxt-link>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-form @submit.prevent="onSearchHashtag">
                        <div :style="{ display: 'flex', alignItems: 'center', height: '100%' }">
                            <v-text-field
                                v-model="hashtag"
                                label="검색" 
                                hide-details 
                                prepend-icon="mdi-magnify" 
                            />
                        </div>
                    </v-form>
                    <v-btn text nuxt to="/profile" :style="{ display: 'flex', alignItems: 'center' }">
                        <div>프로필</div>
                    </v-btn>
                    <v-btn text nuxt to="/signup" :style="{ display: 'flex', alignItems: 'center' }">
                        <div>회원가입</div>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
        </nav>

        <v-row no-gutters>
            <!-- 
                보통 html의 그리드 시스템에서는 가로 12등분을 한다.

                cols : 브라우저 가로를 얼마로 나눌 것인가?
                md(노트북 디스플레이) : cols로 나눈 것에 대해 얼마나 차지할 것인가?
                xs(스마트폰 디스플레이) : 디폴트로 이 정도 사이즈로 줄어들면 한 줄을 다 차지하게 된다.
            -->
            <v-col cols="12" md="4">
                <LoginForm />
            </v-col>
            <v-col cols="12" md="8">
                <!-- 
                    경로에 따라 바뀌는 페이지가 여기에 삽입된다. 
                    경로는 pages 하위 경로를 따른다.
                    nuxt가 자동으로 관리해 준다.
                    따라서 폴더명은 철저히 지켜야 한다.
                -->
                <nuxt />
            </v-col>
        </v-row>
    </v-app>
</template>

<script>
// 레이아웃에서도 외부 컴포넌트를 불러와 등록할 수 있다.
// ~는 nuxt 프로젝트 경로의 root 경로이다.
import LoginForm from '~/components/LoginForm'

export default {
    components: {
        LoginForm
    },
    data() {
        return {
            hashtag: ''
        }
    },
    methods: {
        onSearchHashtag() {
            this.$router.push({
                path: `/hashtag/${this.hashtag}`
            })
            this.hashtag = ''
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