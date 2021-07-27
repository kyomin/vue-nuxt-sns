module.exports = {
    // 여러 레이아웃이 같은 head 정보를 가질 시에, 이렇게 중복을 제거할 수 있다.
    // 따로 설정하지 않은 페이지는 이 곳 head 정보를 따른다.
    head: {
        title: 'KyoSNS'
    },
    /*
        nuxt와 외부 install한 외부 모듈 연결!
        Vue.use를 사용해 외부 모듈에 연결하게 되면, 
        매 페이지마다 중복이 생기므로,
        Nuxt는 이렇게 한 번의 설정으로 모든 페이지에 적용해준다.
    */
    modules: [
        '@nuxtjs/axios',
    ],
    buildModules: [
        '@nuxtjs/vuetify',
    ],
    vuetify: {},
    axios: {
        browserBaseURL: 'http://localhost:3085',
        baseURL: 'http://localhost:3085',
        https: false
    }
}