<template>
    <div class="labels">
        <span class="labels__item">{{ model.price }}</span>
        <span class="labels__item">{{ model.qty }}</span>
        <span class="labels__item">{{ model.amount }}</span>
        <pre class="labels__item--local-storage">{{ localStorageView }}</pre>
    </div>
</template>

<script setup lang="ts">
import type { TypeFormModel } from '@/types';

defineProps<{
    model: TypeFormModel;
    localStorageView: string;
}>();
</script>

<style scoped lang="scss">
.labels {
    display: flex;

    &__item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        text-align: center;

        width: 16%;
        padding: 5px 10px;
        font-size: 20px;

        &--local-storage {
            width: 200px;
            min-height: 50px;
            padding: 0 20px;
            margin: 0;
        }
    }
}
</style>
