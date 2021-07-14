export const state = () => ({
    mainPosts: []
})

export const mutations = {
    addMainPost(state, payload) {
        state.mainPosts.unshift(payload)    // 최신 게시글을 맨 앞에 보여주기 위해 unshift를 쓴다.
    },
    removeMainPost(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.id)
        state.mainPosts.splice(index, 1)
    },
    addComment(state, payload) {
        console.log('addComment mutation payload : ', payload)
        const index = state.mainPosts.findIndex(v => v.id === payload.postId)
        state.mainPosts[index].comments.unshift(payload)
    }
}

export const actions = {
    add({ commit }, payload) {
        /* 
            기본적으로 같은 모듈 내에 있는 mutation이나 action을 호출할 때,
            posts/addMainPost와 같이 명시할 필요가 없다.

            하지만 만일 addMainPost를 스토어의 root인 index.js도 가지고 있고,
            여기서 이것을 호출하고 싶다면 3번째 인자로 { root: true } 속성을 부여한다. 
        */
        // commit('addMainPost', payload, { root: true })
        commit('addMainPost', payload)
    },
    remove({ commit }, payload) {
        commit('removeMainPost', payload)
    },
    addComment({ commit }, payload) {
        commit('addComment', payload)
    }
}