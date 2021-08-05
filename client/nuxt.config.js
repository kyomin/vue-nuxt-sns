module.exports = {
    /*
        여러 레이아웃이 같은 head 정보를 가질 시에, 이렇게 중복을 제거할 수 있다.
        따로 설정하지 않은 페이지는 이 곳 head 정보를 따른다.

        즉, 모든 페이지가 공통으로 갖는 메타 데이터를 넣는다.
        서버 사이드 렌더링의 장점을 위해 여기가 아닌,
        개별 페이지의 head 함수에 알맞게 설정을 해준다.

        개별 페이지마다 head 설정이 되어 있다면 개별 페이지 설정 우선순위가 더 높다.
        하지만, 덮어씌울 때, 그대로 이 부분의 내용이 head에 들어가 있으므로
        공통된 속성을 hid를 통해 제거한다.
    */
    head: {
        title: 'KyoSNS',    // 이를 통해 검색 엔진은 이 페이지의 제목을 파악하고
        meta: [{
            charset: 'utf-8'
        }, {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=yes, viewport-fit=cover'
        }, {
            'http-equiv': 'X-UA-Compatible', content: 'IE=edge'
        }, {
            hid: 'desc', name: 'description', content: 'Kyomin의 SNS'    // 이 페이지의 주제를 안다.
        }, {
            hid: 'ogtitle', name: 'og:title', content: 'KyoSNS'            // 카톡 등에서 공유했을 때 뜨는 제목
        }, {    
            hid: 'ogdesc', name: 'og:description', content: 'Kyomin의 SNS' // 카톡 등에서 공유했을 때 뜨는 내용
        }, {
            property: 'og:type', content: 'website'
        }, {
            hid: 'ogimage', property: 'og:image', content: 'https://vue.nodebird.com/vue-nodebird.png'               // 카톡 등에서 공유했을 때 뜨는 이미지
        }, {
            hid: 'ogurl', property: 'og:url', content: 'https://vue.nodebird.com'                 // 카톡 등에서 공유했을 때 뜨는 URL
        }],
        link: [{ rel: 'shortcut icon', href: '/kyostagram.png' }]     // 탭에 나타나는 사이트의 아이콘. 프론트 서버의 static 폴더로 정적파일 서빙할 수 있음
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