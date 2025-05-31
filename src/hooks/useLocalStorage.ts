import { onMounted, ref } from 'vue';

export function useLocalStorage(
    model: any,
    key = 'formData',
    fields: string[] = []
) {
    const localStorageView = ref('{}');

    function updateLocalStorageView() {
        try {
            const saved = localStorage.getItem(key);
            localStorageView.value = saved
                ? JSON.stringify(JSON.parse(saved), null, 2)
                : '{}';
        } catch (e) {
            console.error('Invalid JSON in localStorage:', e);
            localStorageView.value = '{}';
        }
    }

    onMounted(() => {
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                (fields.length ? fields : Object.keys(parsed)).forEach(
                    (field) => {
                        if (field in parsed) {
                            model[field] = parsed[field];
                        }
                    }
                );
            } catch (e) {
                console.error('Failed to parse saved data:', e);
            }
        }
        updateLocalStorageView();
    });

    function saveToLocalStorage() {
        const data: Record<string, any> = {};
        (fields.length ? fields : Object.keys(model)).forEach((field) => {
            data[field] = model[field];
        });

        localStorage.setItem(key, JSON.stringify(data));
        updateLocalStorageView();
    }

    return {
        localStorageView,
        saveToLocalStorage,
    };
}
