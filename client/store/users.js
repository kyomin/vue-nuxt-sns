export const state = () => ({
    me: null,    // me를 통해 로그인 여부를 확인한다.
    followingList: [{
        id: 1,
        nickname: 'Jake'
    }, {
        id: 2,
        nickname: 'Jerry'
    }, {
        id: 3,
        nickname: 'Tom'
    }],
    followerList: [{
        id: 1,
        nickname: 'Jake'
    }, {
        id: 2,
        nickname: 'Jerry'
    }, {
        id: 3,
        nickname: 'Tom'
    }]
})

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
    }
}