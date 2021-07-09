<template>
    <div>
        <div>main page</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: 'Nuxt.js'
        }
    },
    // html의 head 태그 안에 들어가는 정보를 여기서 관리할 수 있다!!
    head() {
        return {
            title: '메인페이지'
        }
    }
};
</script>

<style>

</style>