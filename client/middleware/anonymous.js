export default function({ store, redirect }) {
    // 로그인한 상태라면
    if (store.state.users.me) {
        redirect('/')
    }
}