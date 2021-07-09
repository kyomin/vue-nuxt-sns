<template>
    <div>
        <nav>
            <nuxt-link to="/">Home</nuxt-link>
            <nuxt-link to="/profile">Profile</nuxt-link>
            <nuxt-link to="/signup">Signup</nuxt-link>
        </nav>
        <!-- 넉스트 라우터 경로에 따라 바뀔 레이아웃이 여기에 삽입된다. -->
        <nuxt />
    </div>
</template>

<script>
export default {
    
};
</script>

<style>

</style>