export const state = () => ({
    me: null,       // 로그인 여부를 확인해 로그인한 유저 정보 me에 넣기
    other: null,    // 남의 정보
    followingList: [],
    followerList: [],
    hasMoreFollowings: true,
    hasMoreFollowers: true,
})

const limit = 3

// 뮤테이션에서는 비동기 작업 처리를 하지 못한다.
export const mutations = {
    setme(state, payload) {
        state.me = payload
    },
    setOther(state, payload) {
        state.other = payload
    },
    changeNickname(state, payload) {
        state.me.nickname = payload.nickname
    },
    addFollowing(state, payload) {
        state.followingList.push(payload)
    },
    addFollower(state, payload) {
        state.followerList.push(payload)
    },
    removeFollowing(state, payload) {
        let index = state.me.Followings.findIndex(v => v.id === payload.userId)
        state.me.Followings.splice(index, 1)
        index = state.followingList.findIndex(v => v.id === payload.userId)
        state.followingList.splice(index, 1)
    },
    removeFollower(state, payload) {
        let index = state.followerList.findIndex(v => v.id === payload.userId)
        state.followerList.splice(index, 1)
        index = state.followerList.findIndex(v => v.id === payload.userId)
        state.followerList.splice(index, 1)
    },
    loadFollowings(state, payload) {
        if (payload.offset === 0) {
            state.followingList = payload.data
        } else {
            state.followingList = state.followingList.concat(payload.data)
        }
        state.hasMoreFollowings = payload.data.length === limit
    },
    loadFollowers(state, payload) {
        if (payload.offset === 0) {
            state.followerList = payload.data
        } else {
            state.followerList = state.followerList.concat(payload.data)
        }
        state.hasMoreFollowers = payload.data.length === limit
    },
    following(state, payload) {
        state.me.Followings.push({ id: payload.userId })
    }
}

// 비동기 작업은 액션에 위임한다.
export const actions = {
    async loadUser({ commit }) {
        try {
            const res = await this.$axios.get('/user', {
                withCredentials: true
            })
            commit('setme', res.data)
        } catch (err) {
            console.error(err)
        }
    },
    async loadOther({ commit }, payload) {
        try {
            const res = await this.$axios.get(`/user/${payload.userId}`)
            commit('setOther', res.data)
        } catch (err) {
            console.error(err)
        }
    },
    signup({ }, payload) {
        return new Promise((resolve, reject) => {
            this.$axios.post('/user', {
                email: payload.email,
                nickname: payload.nickname,
                password: payload.password,
            })
                .then((res) => {
                    console.log('signup response data : ', res.data)
                    resolve(res.data)
                })
                .catch((err) => {
                    console.error(err)
                    reject(err)
                })
        })
    },
    login({ commit }, payload) {
        return this.$axios.post('/user/login', {
            email: payload.email,
            password: payload.password
        }, { withCredentials: true })
            .then((res) => {
                console.log('login response data : ', res.data)
                commit('setme', res.data)
            })
            .catch((err) => {
                console.error(err)
            })
    },
    logout({ commit }) {
        return this.$axios.post('/user/logout', {}, { withCredentials: true })
            .then((res) => {
                commit('setme', null)
                this.$router.push({
                    path: '/'
                })
            })
            .catch((err) => {
                console.error(err)
            })
    },
    changeNickname({ commit }, payload) {
        return this.$axios.patch('/user/nickname', { nickname: payload.nickname }, {
            withCredentials: true
        })
            .then(() => {
                commit('changeNickname', payload)
            })
            .catch((err) => {
                console.error(err)
            })
    },
    addFollowing({ commit }, payload) {
        commit('addFollowing', payload)
    },
    addFollower({ commit }, payload) {
        commit('addFollower', payload)
    },
    loadFollowings({ commit, state }, payload) {
        // 초기 로딩도 아니고, 더 불러올 팔로워도 없다면 바로 함수를 끝내 아무 작업도 하지 않는다.
        if (!(payload && payload.offset === 0) && !state.hasMoreFollowings) {
            return
        }

        let offset = state.followingList.length
        if (payload && payload.offset === 0) {  // 초기 페이지 로딩인 경우
            offset = 0
        }

        return this.$axios.get(`/user/${state.me.id}/followings?limit=3&offset=${offset}`, {
            withCredentials: true
        })
            .then((res) => {
                commit('loadFollowings', {
                    data: res.data,
                    offset
                })
            })
            .catch((err) => {
                console.error(err)
            })
    },
    loadFollowers({ commit, state }, payload) {
        // 초기 로딩도 아니고, 더 불러올 팔로워도 없다면 바로 함수를 끝내 아무 작업도 하지 않는다.
        if (!(payload && payload.offset === 0) && !state.hasMoreFollowers) {
            return
        }

        let offset = state.followerList.length
        if (payload && payload.offset === 0) {  // 초기 페이지 로딩인 경우
            offset = 0
        }

        return this.$axios.get(`/user/${state.me.id}/followers?limit=3&offset=${offset}`, {
            withCredentials: true
        })
            .then((res) => {
                commit('loadFollowers', {
                    data: res.data,
                    offset
                })
            })
            .catch((err) => {
                console.error(err)
            })
    },
    following({ commit }, payload) {
        return this.$axios.post(`/user/${payload.userId}/follow`, {}, {
            withCredentials: true
        })
            .then(() => {
                commit('following', payload)
            })
            .catch((err) => {
                console.error(err)
            })
    },
    unfollowing({ commit }, payload) {
        return this.$axios.delete(`/user/${payload.userId}/follow`, {
            withCredentials: true
        })
            .then(() => {
                commit('removeFollowing', payload)
            })
            .catch((err) => {
                console.error(err)
            })
    },
    removeFollower({ commit }, payload) {
        return this.$axios.delete(`/user/${payload.userId}/follower`, {
            withCredentials: true
        })
            .then(() => {
                commit('removeFollower', payload)
            })
            .catch((err) => {
                console.error(err)
            })
    }
}