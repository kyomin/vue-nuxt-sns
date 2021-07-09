<template>
    <div>
        profile page
    </div>
</template>

<script>
export default {
    layout: 'admin',    // 이로인해 profile 페이지는 default가 아닌, admin 레이아웃을 갖는다.
    data() {
        return {
            name: 'Nuxt.js'
        }
    },
    head() {
        return {
            title: '프로필'
        }
    }
};
</script>

<style>

</style>