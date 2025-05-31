import { ref, onMounted, computed } from 'vue';

export function useLocalStorage(model: any, key = 'formData') {
    const localStorageString = ref('{}');

    const beautifiedLocalStorageString = computed(() => {
        try {
            const parsed = JSON.parse(localStorageString.value);
            const beautified = JSON.stringify(parsed, null, 2);
            return beautified;
        } catch (e) {
            console.log('error: ', e);
            return '{}';
        }
    });

    onMounted(() => {
        const savedDataString = localStorage.getItem(key);
        if (savedDataString) {
            try {
                const parsed = JSON.parse(savedDataString);
                model.counter = parsed.counter ?? model.counter;
                model.price = parsed.price ?? model.price;
                model.qty = parsed.qty ?? model.qty;
                model.amount = parsed.amount ?? model.amount;

                localStorageString.value = savedDataString;
            } catch (e) {
                localStorageString.value = '{}';
            }
        } else {
            localStorageString.value = '{}';
        }
    });

    function saveToLocalStorage() {
        localStorage.setItem(
            key,
            JSON.stringify({
                counter: model.counter,
                price: model.price,
                qty: model.qty,
                amount: model.amount,
            })
        );
        localStorageString.value = localStorage.getItem(key) ?? '{}';
    }

    return {
        localStorageView: beautifiedLocalStorageString,
        saveToLocalStorage,
    };
}
