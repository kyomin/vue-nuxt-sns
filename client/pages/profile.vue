<template>
    <div>
        <v-container>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>내 프로필</v-subheader>
                    <v-form v-model="valid" @submit.prevent="onChangeNickname">
                        <v-text-field 
                            v-model="nickname"
                            label="닉네임"
                            :rules="nicknameRules"
                            required 
                        />
                        <v-btn dark color="blue" type="submit">수정</v-btn>
                    </v-form>
                </v-container>
            </v-card>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>팔로잉</v-subheader>
                    <FollowList :users="followingList" :remove="removeFollowing" />
                    <v-btn v-if="hasMoreFollowings" dark color="blue" style="width: 100%" @click="loadMoreFollowings">더보기</v-btn>
                </v-container>
            </v-card>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>팔로워</v-subheader>
                    <FollowList :users="followerList" :remove="removeFollower" />
                    <v-btn v-if="hasMoreFollowers" dark color="blue" style="width: 100%" @click="loadMoreFollowers">더보기</v-btn>
                </v-container>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import FollowList from '~/components/FollowList'

export default {
    components: {
        FollowList
    },
    data() {
        return {
            valid: false,
            nickname: '',
            nicknameRules: []
        }
    },
    computed: {
        followingList() {
            return this.$store.state.users.followingList
        },
        followerList() {
            return this.$store.state.users.followerList
        },
        hasMoreFollowings() {
            return this.$store.state.users.hasMoreFollowings
        },
        hasMoreFollowers() {
            return this.$store.state.users.hasMoreFollowers
        }
    },
    fetch({ store }) {
        /* 
            여기서 호출하는 follow 로드 액션은 초기에 이 페이지 진입 시 하는 것이다.
            따라서 다시 처음부터 진행(이전에 로드했던 정보들 다시 처음 limit부터 시작하게)하려면
            이 부분에서 offset 값을 전달하는 식으로 분기 처리한다.
            액션의 payload에서 받아서 값이 있는지, 없는지로 판단한다.
        */
        return Promise.all([
            store.dispatch('users/loadFollowings', { offset: 0 }),
            store.dispatch('users/loadFollowers', { offset: 0 })
        ])
    },
    methods: {
        onChangeNickname() {
            if (!this.nickname) {
                this.nicknameRules = [v => !!v || '닉네임을 입력하세요.']
                return
            }

            this.$store.dispatch('users/changeNickname', {
                nickname: this.nickname
            })
                .then(() => {
                    this.nickname = ''
                    this.nicknameRules = []
                })
                .catch((err) => {
                    console.error(err)
                })
        },
        removeFollowing(userId) {
            this.$store.dispatch('users/unfollowing', { userId })
        },
        removeFollower(userId) {
            this.$store.dispatch('users/removeFollower', { userId })
        },
        loadMoreFollowings() {
            this.$store.dispatch('users/loadFollowings')
        },
        loadMoreFollowers() { 
            this.$store.dispatch('users/loadFollowers')
        }
    },
    head() {
        return {
            title: '프로필'
        }
    },
    // 미들웨어는 컴포넌트가 렌더링 되기 전에 거치며 실행되는 곳이다.
    middleware: 'authenticated'
};
</script>

<style>

</style>