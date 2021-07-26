<template>
    <div v-if="images.length === 0"></div>
    <!-- 이미지 1개일 때 -->
    <div v-else-if="images.length === 1">
        <v-img 
            :src="`http://localhost:3085/${images[0].src}`"
            contain
            aspect-ratio="2"
            @click="zoomImages"
        />
        <ImageZoom v-if="imageZoomed" :close-modal="closeModal" :images="images" />
    </div>

    <!-- 이미지 2개일 때 -->
    <div v-else-if="images.length === 2" style="display: flex">
        <v-img 
            :src="`http://localhost:3085/${images[0].src}`"
            contain
            aspect-ratio="2"
            style="flex: 1"
            @click="zoomImages"
        />
        <v-img 
            :src="`http://localhost:3085/${images[1].src}`"
            contain
            aspect-ratio="2"
            style="flex: 1"
            @click="zoomImages"
        />
        <ImageZoom v-if="imageZoomed" :close-modal="closeModal" :images="images" />
    </div>

    <!-- 이미지 3개 이상일 때 -->
    <div v-else-if="images.length > 2" style="display: flex">
        <v-img 
            :src="`http://localhost:3085/${images[0].src}`"
            contain
            aspect-ratio="2"
            style="flex: 1"
            @click="zoomImages"
        />
        <div style="flex: 1; align-items: center; justify-content: center; display: flex" @click="zoomImages">
            <div style="text-align: center">
                <div>더보기</div>
                <v-icon>mdi-dots-horizontal</v-icon>
            </div>
        </div>
        <ImageZoom v-if="imageZoomed" :close-modal="closeModal" :images="images" />
    </div>
</template>

<script>
import ImageZoom from './ImageZoom'

export default {
    components: { ImageZoom },
    props: {
        images: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            imageZoomed: false
        }
    },
    methods: {
        closeModal() {
            this.imageZoomed = false
        },
        zoomImages() {
            this.imageZoomed = true
        }
    }
};
</script>

<style>

</style>