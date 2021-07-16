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
                        <v-btn color="blue" type="submit">수정</v-btn>
                    </v-form>
                </v-container>
            </v-card>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>팔로잉</v-subheader>
                    <FollowList :users="followingList" :remove="removeFollowing" />
                </v-container>
            </v-card>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>팔로워</v-subheader>
                    <FollowList :users="followerList" :remove="removeFollower" />
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
        }
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

                })
        },
        removeFollowing(id) {
            this.$store.dispatch('users/removeFollowing', { id })
        },
        removeFollower(id) {
            this.$store.dispatch('users/removeFollower', { id })
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