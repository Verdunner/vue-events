import { ref } from 'vue';

export function useEvents() {
    const events = ref<string[]>([]);

    function addEvent(message: string) {
        events.value.unshift(message);
    }

    return { events, addEvent };
}
