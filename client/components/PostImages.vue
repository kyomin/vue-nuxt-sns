<template>
    <div v-if="images.length === 0"></div>
    <!-- 이미지 1개일 때 -->
    <div v-else-if="images.length === 1">
        <v-img 
            :src="`http://localhost:3085/${images[0].src}`"
            contain
            aspect-ratio="2"
        />
    </div>

    <!-- 이미지 2개일 때 -->
    <div v-else-if="images.length === 2" style="display: flex">
        <v-img 
            :src="`http://localhost:3085/${images[0].src}`"
            contain
            aspect-ratio="2"
            style="flex: 1"
        />
        <v-img 
            :src="`http://localhost:3085/${images[1].src}`"
            contain
            aspect-ratio="2"
            style="flex: 1"
        />
    </div>

    <!-- 이미지 3개 이상일 때 -->
    <div v-else-if="images.length > 2" style="display: flex">
        <v-img 
            :src="`http://localhost:3085/${images[0].src}`"
            contain
            aspect-ratio="2"
            style="flex: 1"
        />
        <div style="flex: 1; align-items: center; justify-content: center; display: flex">
            <div style="text-align: center">
                <div>더보기</div>
                <v-icon>mdi-dots-horizontal</v-icon>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        images: {
            type: Array,
            required: true
        }
    }
};
</script>

<style>

</style>