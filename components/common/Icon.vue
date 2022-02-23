<template>
    <span class="material-icons mb-1" :class="classNames">{{ iconName }}</span> 
</template>

<script>
export default {
    props: {
        iconName: {
            type: String, 
            default: ""
        },
        classNames: {
            type: String,
            default: "",
            required: false,
        }
    }
};
</script>

<style lang="scss" scoped>
</style>