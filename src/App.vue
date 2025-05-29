<template>
    <div class="container">
        <div class="container__top">
            <div class="controls">
                <div class="controls__item">
                    <label for="price" class="controls__label">Цена </label>
                    <input
                        v-model.number="model.price"
                        class="controls__input"
                        type="number"
                        name="price"
                        id="price"
                        placeholder="цена"
                    />
                </div>
                <div class="controls__item">
                    <label for="qty" class="controls__label">Количество </label>
                    <input
                        v-model.number="model.qty"
                        class="controls__input"
                        type="number"
                        name="qty"
                        id="qty"
                        placeholder="кол-во"
                    />
                </div>
                <div class="controls__item">
                    <label for="amount" class="controls__label">Сумма </label>
                    <input
                        v-model.number="model.amount"
                        class="controls__input"
                        type="number"
                        name="amount"
                        id="amount"
                        placeholder="сумма"
                    />
                </div>
                <button
                    @click="handleClick"
                    class="controls__item controls__item--btn"
                >
                    Отправить
                </button>
            </div>
            <div class="labels">
                <span class="labels__item">{{ model.price }}</span>
                <span class="labels__item">{{ model.qty }}</span>
                <span class="labels__item">{{ model.amount }}</span>
                <div class="labels__item labels__item--local-storage">
                    {{ jsonFromLocalStorage }}
                </div>
            </div>
        </div>
        <div class="container__bottom">
            <div class="events">
                <div
                    v-for="(event, index) in events"
                    :key="index"
                    class="event"
                >
                    {{ event }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, watch } from 'vue';

const model = reactive({
    counter: 0,
    price: 0,
    qty: 0,
    amount: 0,
});

const jsonFromLocalStorage = ref('');
const events = ref<string[]>([]);
type Field = 'price' | 'qty' | 'amount';
const changedOrder = ref<Field[]>([]);

function addEvent(message: string) {
    events.value.unshift(message);
}
function handleClick() {
    addEvent('Вы нажали на кнопку');
}

function updateChangedOrder(field: Field) {
    const idx = changedOrder.value.indexOf(field);
    if (idx !== -1) {
        changedOrder.value.splice(idx, 1);
    }
    changedOrder.value.push(field);
}

function recalculate(changedField: Field) {
    updateChangedOrder(changedField);

    const fields: Field[] = ['price', 'qty', 'amount'];
    const { price, qty, amount } = model;

    if (changedOrder.value.length < 2) return;

    const [first, second] = changedOrder.value.slice(-2);
    const remaining = fields.find((f) => f !== first && f !== second);

    if (!remaining) return;

    switch (remaining) {
        case 'price':
            model.price = qty !== 0 ? amount / qty : 0;
            break;
        case 'qty':
            model.qty = price !== 0 ? amount / price : 0;
            break;
        case 'amount':
            model.amount = price * qty;
            break;
    }
}

watch(
    () => model.price,
    () => {
        addEvent('Инпут изменен');
        recalculate('price');
    }
);
watch(
    () => model.qty,
    () => {
        addEvent('Инпут изменен');
        recalculate('qty');
    }
);
watch(
    () => model.amount,
    () => {
        addEvent('Инпут изменен');
        recalculate('amount');
    }
);

onMounted(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            model.counter = parsed.counter ?? model.counter;
            model.price = parsed.price ?? model.price;
            model.qty = parsed.qty ?? model.qty;
            model.amount = parsed.amount ?? model.amount;

            jsonFromLocalStorage.value = JSON.stringify(parsed, null, 2);
        } catch (e) {
            console.warn('Ошибка при чтении данных из localStorage', e);
        }
    }
});
</script>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    min-height: 80vh;
    padding: 50px;
    background-color: slategray;

    &__top,
    &__bottom {
        width: 80vw;
        border: 1px solid red;
    }
}

.controls,
.labels {
    display: flex;
    margin-bottom: 20px;
}

.controls__item,
.labels__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-basis: 15vw;
    flex-grow: 0;
    padding: 10px;
    font-size: 20px;
    border: 1px solid greenyellow;
}

.controls__item--btn,
.labels__item--local-storage {
    flex-basis: 20vw;
    flex-grow: 1;
}

.controls__input {
    padding: 10px;
    font-size: 16px;
}

.events {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
}

.event {
    background-color: green;
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-weight: bold;
}
</style>
