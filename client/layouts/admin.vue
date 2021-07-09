<template>
    <!-- 
        관리자, 유저에 따라 레이아웃이 바뀔 수 있다.
        사용하는 곳은 profile 페이지 참조!
    -->
    <div>
        <nav>
            <nuxt-link to="/">Home</nuxt-link>
            <nuxt-link to="/profile">Profile</nuxt-link>
            <nuxt-link to="/signup">Signup</nuxt-link>
            <nuxt-link to="/admin">Admin</nuxt-link>
            <nuxt />
        </nav>
    </div>
</template>

<script>
export default {
    
};
</script>

<style>

</style>