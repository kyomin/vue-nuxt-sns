export const state = () => ({
    mainPosts: [],
    hasMorePost: true,  // 스크롤하여 더 가져올 데이터가 있는가?

})

const totalPosts = 31;
const limit = 10    // 게시글은 10개씩 끊어 가져온다 가정

export const mutations = {
    addMainPost(state, payload) {
        state.mainPosts.unshift(payload)    // 최신 게시글을 맨 앞에 보여주기 위해 unshift를 쓴다.
    },
    removeMainPost(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.id)
        state.mainPosts.splice(index, 1)
    },
    addComment(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId)
        state.mainPosts[index].comments.unshift(payload)
    },
    loadPosts(state) {
        const diff = totalPosts - state.mainPosts.length    // 아직 안 불러온 게시글 수

        const fakePosts = Array(diff > limit ? limit : diff).fill().map(v => ({
            id: Math.random().toString(),
            user: {
                id: 1,
                nickname: 'kyomin'
            },
            content: `Hello infinite scrolling! ${Math.random().toString()}`,
            comments: [],
            images: []
        }))

        state.mainPosts = state.mainPosts.concat(fakePosts)
        state.hasMorePost = fakePosts.length === limit      // 가져온 게시물이 limit 미만이라면 다음은 없다.
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
    },
    loadPosts({ commit, state }) {
        if (state.hasMorePost) {
            commit('loadPosts')
        }
    }
}