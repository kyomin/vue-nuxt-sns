export const state = () => ({
    me: null    // me를 통해 로그인 여부를 확인한다.
})

// 뮤테이션에서는 비동기 작업 처리를 하지 못한다.
export const mutations = {
    setme(state, payload) {
        state.me = payload
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
    }
}