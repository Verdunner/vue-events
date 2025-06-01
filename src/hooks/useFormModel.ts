import { reactive, ref } from 'vue';
import type { TypeField, TypeFormModel } from '@/types';

export function useFormModel(addEvent?: (msg: string) => void) {
    const model = reactive<TypeFormModel>({
        counter: 0,
        price: 0,
        qty: 0,
        amount: 0,
    });

    const changedOrder = ref<TypeField[]>(['price', 'qty', 'amount']);
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let lastValue = 0;

    function recalculate(changedField: TypeField) {
        const index = changedOrder.value.indexOf(changedField);
        if (index !== -1) changedOrder.value.splice(index, 1);
        changedOrder.value.push(changedField);

        const [toRecalculate] = changedOrder.value;

        if (toRecalculate === 'price') {
            model.price = model.qty !== 0 ? model.amount / model.qty : 0;
        } else if (toRecalculate === 'qty') {
            model.qty = model.price !== 0 ? model.amount / model.price : 0;
        } else if (toRecalculate === 'amount') {
            model.amount = model.price * model.qty;
        }
    }

    function onInput(event: Event, field: TypeField) {
        const target = event.target as HTMLInputElement | null;
        if (!target) return;
        const value = Number(target.value);
        lastValue = value;

        if (debounceTimer) clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            model[field] = lastValue;
            if (addEvent) {
                addEvent(`Инпут "${field}" изменен после дебаунса`);
            }
            recalculate(field);
        }, 300);
    }

    return { model, onInput };
}
