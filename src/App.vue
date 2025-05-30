<template>
    <div class="container">
        <div class="container__top">
            <div class="controls">
                <div class="controls__item">
                    <label for="price" class="controls__label">Цена </label>
                    <input
                        v-model.number="model.price"
                        @input="(e) => onInput(e, 'price')"
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
                        @input="(e) => onInput(e, 'qty')"
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
                        @input="(e) => onInput(e, 'amount')"
                        class="controls__input"
                        type="number"
                        name="amount"
                        id="amount"
                        placeholder="сумма"
                    />
                </div>
                <button @click="handleClick" class="controls__item--btn">
                    Отправить
                </button>
            </div>
            <div class="labels">
                <span class="labels__item">{{ model.price }}</span>
                <span class="labels__item">{{ model.qty }}</span>
                <span class="labels__item">{{ model.amount }}</span>
                <pre class="labels__item--local-storage">
                    {{
                        parsedJson
                            ? JSON.stringify(parsedJson, null, 2)
                            : 'Некорректный JSON'
                    }}
                </pre>
            </div>
        </div>
        <div class="container__bottom">
            <div class="events">
                <div
                    v-for="(event, index) in events"
                    :key="index"
                    :class="['event', { 'event--colored': index % 2 === 0 }]"
                >
                    <span class="events__text">
                        {{ event.split('+')[0] }}
                    </span>
                    <span class="events__text">
                        {{ event.split('+')[1] }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, computed } from 'vue';

const model = reactive({
    counter: 0,
    price: 0,
    qty: 0,
    amount: 0,
});

const jsonFromLocalStorage = ref('');
const events = ref<string[]>([]);

type Field = 'price' | 'qty' | 'amount';
const changedOrder = ref<Field[]>(['price', 'qty', 'amount']);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const lastChangedField = ref<Field | null>(null);
let lastValue = 0;

const parsedJson = computed(() => {
    try {
        return JSON.parse(jsonFromLocalStorage.value);
    } catch {
        return null;
    }
});

function onInput(event: Event, field: Field) {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;
    const value = Number(target.value);
    handleInputDebounced(field, value);
}

function handleInputDebounced(field: Field, value: number) {
    lastChangedField.value = field;
    lastValue = value;

    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        model[field] = lastValue;
        addEvent('Инпут изменен после дебаунса');
        recalculate(field);
    }, 300);
}

function addEvent(message: string) {
    events.value.unshift(message);
}

async function handleClick() {
    addEvent(
        `Отправлено: ${JSON.stringify(model)}+Текущий localStorage: ${
            localStorage.getItem('formData') ?? ''
        }`
    );

    const result = await sendData(model);

    addEvent(
        `Ответ бекенда: ${JSON.stringify(result)}+Текущий localStorage: ${
            localStorage.getItem('formData') ?? ''
        }`
    );

    jsonFromLocalStorage.value = localStorage.getItem('formData') ?? '{}';
}

function recalculate(changedField: Field) {
    const index = changedOrder.value.indexOf(changedField);
    if (index !== -1) {
        changedOrder.value.splice(index, 1);
    }
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

async function sendData(data: typeof model): Promise<{ success: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (data.amount % 2 === 0) {
        data.counter++;

        localStorage.setItem(
            'formData',
            JSON.stringify({
                counter: data.counter,
                price: data.price,
                qty: data.qty,
                amount: data.amount,
            })
        );

        return { success: true };
    } else {
        return { success: false };
    }
}

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
    } else {
        jsonFromLocalStorage.value = '{}';
    }
});
</script>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;

    max-width: 100vw;
    min-height: 95vh;
    padding: 30px 30px 0;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    background-color: rgb(230, 230, 230);

    &__top,
    &__bottom {
        width: 80vw;
        min-height: 100px;
        overflow: hidden;
    }
}

.controls,
.labels {
    display: flex;
}

.controls__item,
.labels__item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    text-align: center;

    width: percentage(1 / 6);
    padding: 5px 10px;
    font-size: 20px;
}

.controls__item--btn {
    width: 200px;
    height: 50px;
    margin: auto;

    font-size: 18px;
    border: none;
    border-radius: 10px;
    background-color: #646cff;

    &:hover {
        cursor: pointer;
        background-color: rgba(#646cff, 0.7);
    }

    &:active {
        border: 1px solid #646cff;
        background-color: rgba(#646cff, 0.5);
    }
}
.labels__item--local-storage {
    width: 200px;
    min-height: 50px;
    padding: 0 20px;
    margin: 0;
}

.controls__input {
    min-width: 50px;
    padding: 10px;
    font-size: 16px;
}

.events {
    display: flex;
    flex-direction: column;
    min-height: 100px;
    gap: 10px;
    padding: 20px;
}

.event {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-radius: 5px;
    background-color: #646cff;

    &--colored {
        background-color: #9a9fff;
    }
}
</style>
