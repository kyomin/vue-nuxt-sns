// 첫 번째 인자를 구조분해하여 vuex 스토어에 접근할 수 있다.
export default function({ store, redirect }) {
    // 로그인한 상태가 아니라면
    if (!store.state.users.me) {
        redirect('/')
    }
}