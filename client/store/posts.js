export const state = () => ({
    mainPosts: [],
    hasMorePost: true,  // 스크롤하여 더 가져올 데이터가 있는가?
    imagePaths: []
})

const totalPosts = 31;
const limit = 10    // 게시글은 10개씩 끊어 가져온다 가정

export const mutations = {
    addMainPost(state, payload) {
        state.mainPosts.unshift(payload)    // 최신 게시글을 맨 앞에 보여주기 위해 unshift를 쓴다.
        state.imagePaths = []
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
            User: {
                id: 1,
                nickname: 'kyomin'
            },
            content: `Hello infinite scrolling! ${Math.random().toString()}`,
            comments: [],
            images: []
        }))

        state.mainPosts = state.mainPosts.concat(fakePosts)
        state.hasMorePost = fakePosts.length === limit      // 가져온 게시물이 limit 미만이라면 다음은 없다.
    },
    concatImagePaths(state, payload) {
        state.imagePaths = state.imagePaths.concat(payload)
    },
    removeImagePath(state, payload) {
        state.imagePaths.splice(payload, 1)
    }
}

export const actions = {
    add({ commit, state }, payload) {
        // 서버에 게시글 등록 요청 보냄
        this.$axios.post('http://localhost:3085/post', {
            content: payload.content,
            imagePaths: state.imagePaths
        }, {
            withCredentials: true
        })
            .then((res) => {
                console.log('res.data : ', res.data)
                commit('addMainPost', res.data)
            })
            .catch((err) => {
                console.error(err)
            })
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
    },
    uploadImages({ commit }, payload) {
        this.$axios.post('http://localhost:3085/post/images', payload, { 
            withCredentials: true
        })
            .then((res) => {
                commit('concatImagePaths', res.data)
            })
            .catch((err) => {
                console.error(err)
            })
    }   
}