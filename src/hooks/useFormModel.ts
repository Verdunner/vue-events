import { reactive } from 'vue';
import type { TypeField } from '@/types';

export function useFormModel() {
    const model = reactive({
        counter: 0,
        price: 0,
        qty: 0,
        amount: 0,
    });

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let lastValue = 0;

    function onInput(
        event: Event,
        field: TypeField,
        callback: (field: TypeField) => void
    ) {
        const target = event.target as HTMLInputElement | null;
        if (!target) return;
        const value = Number(target.value);
        lastValue = value;

        if (debounceTimer) clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            model[field] = lastValue;
            callback(field);
        }, 300);
    }

    return { model, onInput };
}
