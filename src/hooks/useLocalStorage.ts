import { onMounted, ref } from 'vue';
import type { TypeFormModel } from '@/types';

export function useLocalStorage(model: TypeFormModel) {
    const LOCAL_STORAGE_KEY = 'formData';
    const FIELDS = ['price', 'qty', 'amount', 'counter'] as const;
    const localStorageView = ref('{}');

    function updateLocalStorageView() {
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            localStorageView.value = saved
                ? JSON.stringify(JSON.parse(saved), null, 2)
                : '{}';
        } catch (e) {
            console.error('Invalid JSON in localStorage:', e);
            localStorageView.value = '{}';
        }
    }

    onMounted(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                for (const field of FIELDS) {
                    if (field in parsed) {
                        model[field] = parsed[field];
                    }
                }
            } catch (e) {
                console.error('Failed to parse saved data:', e);
            }
        }
        updateLocalStorageView();
    });

    function saveToLocalStorage() {
        const data: Partial<TypeFormModel> = {};
        for (const field of FIELDS) {
            data[field] = model[field];
        }

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        updateLocalStorageView();
    }

    return {
        localStorageView,
        saveToLocalStorage,
    };
}
