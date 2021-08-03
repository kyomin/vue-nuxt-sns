import Vue from 'vue'
import throttle from "lodash.throttle"

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
        const index = state.mainPosts.findIndex(v => v.id === payload.postId)
        state.mainPosts[index].Comments.unshift(payload.data)
    },
    loadComments(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId)
        Vue.set(state.mainPosts[index], 'Comments', payload.data)
    },
    loadPost(state, payload) {
        // 하나만 넣어준다.
        state.mainPosts = [payload]
    },
    loadPosts(state, payload) {
        if (payload.reset) {
            state.mainPosts = payload.data
        } else {
            state.mainPosts = state.mainPosts.concat(payload.data)
        }
        state.hasMorePost = payload.data.length === limit      // 가져온 게시물이 limit 미만이라면 다음은 없다.
    },
    concatImagePaths(state, payload) {
        state.imagePaths = state.imagePaths.concat(payload)
    },
    removeImagePath(state, payload) {
        state.imagePaths.splice(payload, 1)
    },
    likePost(state, payload) {
        // 좋아요를 눌렀으면 먼저 좋아요 누른 그 게시글을 먼저 찾는다.
        const index = state.mainPosts.findIndex(v => v.id === payload.postId)
        state.mainPosts[index].Likers.push({
            id: payload.userId
        })
    },
    unlikePost(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId)   // 게시글 찾고
        const userIndex = state.mainPosts[index].Likers.findIndex(v => v.id === payload.userId)     // 게시글 내의 Likers 배열에서 유저 찾고
        state.mainPosts[index].Likers.splice(userIndex, 1)     // 지워준다.
    }
}

export const actions = {
    add({ commit, state }, payload) {
        return new Promise((resolve, reject) => {
            this.$axios.post('/post', {
                content: payload.content,
                image: state.imagePaths
            }, {
                withCredentials: true
            })
                .then((res) => {
                    commit('addMainPost', res.data)
                    resolve(res.data)
                })
                .catch((err) => {
                    console.error(err)
                    alert(err.response.data)
                    reject(err)
                })
        })
    },
    remove({ commit }, payload) {
        // get, delete의 경우는 request body가 없기 때문에, 두 번째 인자가 바로 옵션이다.
        this.$axios.delete(`/post/${payload.postId}`, {
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
        this.$axios.post(`/post/${payload.postId}/comment`, {
            content: payload.content
        }, {
            withCredentials: true
        })
            .then((res) => {
                commit('addComment', {
                    postId: payload.postId,
                    data: res.data
                })
            })
            .catch((err) => {
                console.error(err)
            })
        
    },
    loadComments({ commit }, payload) {
        this.$axios.get(`/post/${payload.postId}/comments`)
            .then((res) => {
                commit('loadComments', {
                    postId: payload.postId,
                    data: res.data
                })
            })
            .catch((err) => {
                console.error(err)
            })
    },
    async loadPost({ commit, state }, payload) {
        try {
            const res = await this.$axios.get(`/post/${payload}`)
            commit('loadPost', res.data)
        } catch (err) {
            console.error(err)
        }
    },
    loadPosts: throttle(async function({ commit, state }, payload) {     // 한 번 실행되면, 3초가 지나기 전까지는 같은 함수가 실행되지 못 하게 한다.
        try {
            if (payload && payload.reset) {
                const res = await this.$axios.get(`/posts?limit=${limit}`)
                commit('loadPosts', {
                    data: res.data,
                    reset: true
                })
                return
            }

            if (state.hasMorePost) {
                const lastPost = state.mainPosts[state.mainPosts.length - 1]
                const res = await this.$axios.get(`/posts?lastId=${lastPost && lastPost.id}&limit=${limit}`)
                commit('loadPosts', {
                    data: res.data
                })
                return
            }
        } catch (err) {
            console.error(err)
        }
    }, 3000),
    loadUserPosts: throttle(async function({ commit, state }, payload) {     
        try {
            if (payload && payload.reset) {
                const res = await this.$axios.get(`/user/${payload.userId}/posts?limit=${limit}`)
                commit('loadPosts', {
                    data: res.data,
                    reset: true
                })
                return
            }

            if (state.hasMorePost) {
                const lastPost = state.mainPosts[state.mainPosts.length - 1]
                const res = await this.$axios.get(`/user/${payload.userId}/posts?lastId=${lastPost && lastPost.id}&limit=${limit}`)
                commit('loadPosts', {
                    data: res.data
                })
                return
            }
        } catch (err) {
            console.error(err)
        }
    }, 3000),
    loadHashtagPosts: throttle(async function({ commit, state }, payload) {     
        try {
            if (payload && payload.reset) {
                const res = await this.$axios.get(`/hashtag/${payload.hashtag}?limit=${limit}`)
                commit('loadPosts', {
                    data: res.data,
                    reset: true
                })
                return
            }

            if (state.hasMorePost) {
                const lastPost = state.mainPosts[state.mainPosts.length - 1]
                const res = await this.$axios.get(`/hashtag/${payload.hashtag}?lastId=${lastPost && lastPost.id}&limit=${limit}`)
                commit('loadPosts', {
                    data: res.data
                })
                return
            }
        } catch (err) {
            console.error(err)
        }
    }, 3000),
    uploadImages({ commit }, payload) {
        this.$axios.post('/post/images', payload, { 
            withCredentials: true
        })
            .then((res) => {
                commit('concatImagePaths', res.data)
            })
            .catch((err) => {
                console.error(err)
            })
    },
    retweet({ commit }, payload) {
        this.$axios.post(`/post/${payload.postId}/retweet`, {}, {
            withCredentials: true
        })
            .then((res) => {
                console.log('리트윗 응답 데이터 : ', res.data)
                commit('addMainPost', res.data)
            })
            .catch((err) => {
                console.error(err)
                alert(err.response.data)
            })
    },
    likePost({ commit }, payload) {
        this.$axios.post(`/post/${payload.postId}/like`, {}, {
            withCredentials: true
        })
            .then((res) => {
                commit('likePost', {
                    userId: res.data.userId,
                    postId: payload.postId
                })
            })
            .catch((err) => {
                console.error(err)
            })
    },
    unlikePost({ commit }, payload) {
        this.$axios.delete(`/post/${payload.postId}/like`, {
            withCredentials: true
        })
            .then((res) => {
                commit('unlikePost', {
                    userId: res.data.userId,
                    postId: payload.postId
                })
            })
            .catch((err) => {
                console.error(err)
            })
    }
}