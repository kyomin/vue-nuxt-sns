/* 
    state는 일반 함수로 객체 리턴 형태
    mutations는 일반 객체 형태 value
*/
export const state = () => ({})

export const mutations = {}

export const actions = {
    /* 
        예약된 액션 이름이다(때문에 이름을 꼭 지켜줘야 한다).

        SSR에서 핵심적인 기능을 한다.
        모든 페이지에서 화면 그려지기 전에 실행하는 것이다.
        기존 layout에 fetch를 넣었던 것 대신에 nuxtServerInit을 사용하면 된다.

        즉, 특정 개별 페이지에서만 가져올 데이터가 아니라,
        모든 페이지에서 동일하게 가져올 데이터를 여기서 명시한다.
    */
    nuxtServerInit({ commit, dispatch, state }, { req }) {
        /* 
            비동기 Promise는 return을 붙여주는게 좋다.
            그래야지 Promise가 끝나기를 기다린다.
        */
        return dispatch('users/loadUser')
    }
}