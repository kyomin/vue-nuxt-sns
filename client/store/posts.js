export const state = () => ({
    mainPosts: [],
    hasMorePost: true,  // 스크롤하여 더 가져올 데이터가 있는가?
    imagePaths: []
})

const limit = 10    // 게시글은 10개씩 끊어 가져온다 가정

export const mutations = {
    addMainPost(state, payload) {
        state.mainPosts.unshift(payload)    // 최신 게시글을 맨 앞에 보여주기 위해 unshift를 쓴다.
        state.imagePaths = []
    },
    removeMainPost(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId)
        state.mainPosts.splice(index, 1)
    },
    addComment(state, payload) {
        console.log('payload.postId : ', payload.postId)
        const index = state.mainPosts.findIndex(v => v.id === payload.postId)
        console.log('index : ', index)
        state.mainPosts[index].comments.unshift(payload)
    },
    loadComments(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId)
        state.mainPosts[index].comments.unshift(payload)
    },
    loadPosts(state, payload) {
        console.log('loadPosts Mutation payload : ', payload)
        state.mainPosts = state.mainPosts.concat(payload)
        state.hasMorePost = payload.length === limit      // 가져온 게시물이 limit 미만이라면 다음은 없다.
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
            image: state.imagePaths
        }, {
            withCredentials: true
        })
            .then((res) => {
                commit('addMainPost', res.data)
            })
            .catch((err) => {
                console.error(err)
            })
    },
    remove({ commit }, payload) {
        // get, delete의 경우는 request body가 없기 때문에, 두 번째 인자가 바로 옵션이다.
        this.$axios.delete(`http://localhost:3085/post/${payload.postId}`, {
            withCredentials: true
        })
            .then((res) => {
                commit('removeMainPost', payload)
            })
            .catch((err) => {
                console.error(err)
            })
    },
    addComment({ commit }, payload) {
        this.$axios.post(`http://localhost:3085/post/${payload.postId}/comment`, {
            content: payload.content
        }, {
            withCredentials: true
        })
            .then((res) => {
                commit('addComment', res.data)
            })
            .catch((err) => {
                console.error(err)
            })
        
    },
    loadComments({ commit }, payload) {
        this.$axios.get(`http://localhost:3085/post/${payload.postId}/comments`)
            .then((res) => {
                commit('loadComments', res.data)
            })
            .catch((err) => {
                console.error(err)
            })
    },
    loadPosts({ commit, state }) {    
        if (state.hasMorePost) {
            this.$axios.get(`http://localhost:3085/posts?offset=${state.mainPosts.length}&limit=${limit}`)
                .then((res) => {
                    console.log('loadPosts response data : ', res.data)
                    commit('loadPosts', res.data)
                })
                .catch((err) => {
                    console.error(err)
                })
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