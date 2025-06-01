<template>
    <div class="events">
        <div
            v-for="(event, index) in events"
            :key="index"
            :class="[
                'events__item',
                { 'events__item--colored': (events.length - index) % 2 === 0 },
            ]"
        >
            <span class="events__item-text">{{ event.split('+')[0] }}</span>
            <span class="events__item-text">{{ event.split('+')[1] }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    events: string[];
}>();
</script>

<style scoped lang="scss">
.events {
    display: flex;
    flex-direction: column;
    min-height: 100px;
    gap: 10px;
    padding: 20px;

    &__item {
        display: flex;
        flex-direction: column;
        padding: 10px;
        border-radius: 5px;
        background-color: #646cff;

        &--colored {
            background-color: #9a9fff;
        }
    }
}
</style>
