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
        const index = state.followingList.findIndex(v => v.id === payload.id)
        state.followingList.splice(index, 1)
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
    }
}

// 비동기 작업은 액션에 위임한다.
export const actions = {
    signup({ commit, state }, payload) {
        // 서버에 회원가입 요청(post)을 보내는 부분
        commit('setme', payload)
    },
    login({ commit }, payload) {
        commit('setme', payload)
    },
    logout({ commit }, payload) {
        commit('setme', null)
    },
    changeNickname({ commit }, payload) {
        commit('changeNickname', payload)
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
    }
}