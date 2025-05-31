import { ref } from 'vue';
type Field = 'price' | 'qty' | 'amount';

export function useRecalculate(model: any) {
    const changedOrder = ref<Field[]>(['price', 'qty', 'amount']);

    function recalculate(changedField: Field) {
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

    return { recalculate };
}
