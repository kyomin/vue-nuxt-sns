/* 
    state는 일반 함수로 객체 리턴 형태
    mutations는 일반 객체 형태 value
*/
export const state = () => ({
    hello: 'vuex'
})

export const mutations = {
    bye(state) {
        state.hello = 'goodbye'
    }
}