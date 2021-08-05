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

        this.$axios,
        this.$moment
        와 같은 식으로 접근이 가능하다.
    */
    modules: [
        '@nuxtjs/axios',
    ],
    buildModules: [
        '@nuxtjs/vuetify',
        '@nuxtjs/moment'
    ],
    moment: {
        locales: ['ko']
    },
    build: {
        analyze: false,   // 빌드 결과 보고서를 html 파일로 만들어 띄운다. 개발자 확인용이므로 실제 배포 시에는 false로
        extend(config, { isClient, isServer, isDev }) {    // 넉스트가 자동으로 해주는 웹팩 설정을 개발자가 수정할 때
            // 디폴트로 cheap-module-source-map로 되어 있다.
            // 배포 시에는 보안을 위해 다음과 같이 바꿔준다.
            if (isServer && !isDev) {
                config.devtool = 'hidden-source-map'
            }

            console.log('webpack', config, isClient, isServer)
        }
    },
    vuetify: {},
    axios: {
        browserBaseURL: 'http://localhost:3085',
        baseURL: 'http://localhost:3085',
        https: false
    },
    server: {
        port: 3080
    }
}