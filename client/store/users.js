export const state = () => ({
    name: 'users'
})

export const mutations = {
    bye(state) {
        state.name = 'goodbye users'
    }
}