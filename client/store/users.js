export const state = () => ({
    me: null,    // me를 통해 로그인 여부를 확인한다.
    followingList: [],
    followerList: [],
    hasMoreFollowings: true,
    hasMoreFollowers: true
})

/*
    실무에서는 limit 방식이 아니라 last id 방식을 많이 쓴다.
    더보기 버튼을 누르는 도중에 서버의 데이터가 바뀔 수 있기 때문이다.
*/
const totalFollowings = 6
const totalFollowers = 8
const limit = 3

// 뮤테이션에서는 비동기 작업 처리를 하지 못한다.
export const mutations = {
    setme(state, payload) {
        state.me = payload
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
        const index = state.me.Followings.findIndex(v => v.id === payload.userId)
        state.me.Followings.splice(index, 1)
    },
    removeFollower(state, payload) {
        const index = state.followerList.findIndex(v => v.id === payload.id)
        state.followerList.splice(index, 1)
    },
    loadFollowings(state) {
        const diff = totalFollowings - state.followingList.length

        const fakeUsers = Array(diff > limit ? limit : diff).fill().map(v => ({
            id: Math.random().toString(),
            nickname: Math.floor(Math.random() * 1000)
        }))

        state.followingList = state.followingList.concat(fakeUsers)
        state.hasMoreFollowings = fakeUsers.length === limit
    },
    loadFollowers(state) {
        const diff = totalFollowers - state.followerList.length

        const fakeUsers = Array(diff > limit ? limit : diff).fill().map(v => ({
            id: Math.random().toString(),
            nickname: Math.floor(Math.random() * 1000)
        }))

        state.followerList = state.followerList.concat(fakeUsers)
        state.hasMoreFollowers = fakeUsers.length === limit
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
        this.$axios.post('/user/login', {
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
        this.$axios.post('/user/logout', {}, { withCredentials: true })
            .then((res) => {
                console.log('logout response data : ', res.data)
                commit('setme', null)
            })
            .catch((err) => {
                console.error(err)
            })
    },
    changeNickname({ commit }, payload) {
        this.$axios.patch('/user/nickname', { nickname: payload.nickname }, {
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
    removeFollowing({ commit }, payload) {
        commit('removeFollowing', payload)
    },
    removeFollower({ commit }, payload) {
        commit('removeFollower', payload)
    },
    loadFollowings({ commit, state }) {
        if (state.hasMoreFollowings) {
            commit('loadFollowings')
        }
    },
    loadFollowers({ commit, state }) {
        if (state.hasMoreFollowers) {
            commit('loadFollowers')
        }
    },
    following({ commit }, payload) {
        this.$axios.post(`/user/${payload.userId}/follow`, {}, {
            withCredentials: true
        })
            .then(() => {
                commit('following', payload)
            })
            .catch((err) => {
                console.error(err)
            })
    },
    unfollowinf({ commit }, payload) {
        this.$axios.delete(`/user/${payload.userId}/follow`, {
            withCredentials: true
        })
            .then(() => {
                commit('removeFollowing', payload)
            })
            .catch((err) => {
                console.error(err)
            })
    }
}