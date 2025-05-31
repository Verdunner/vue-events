<template>
    <div class="container">
        <div class="container__top">
            <div class="controls">
                <div class="controls__item">
                    <label for="price" class="controls__label">Цена </label>
                    <input
                        v-model.number="model.price"
                        @input="(e) => onInputWithLogic(e, 'price')"
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
                        @input="(e) => onInputWithLogic(e, 'qty')"
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
                        @input="(e) => onInputWithLogic(e, 'amount')"
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
                    {{ localStorageView }}
                </pre>
            </div>
        </div>
        <div class="container__bottom">
            <div class="events">
                <div
                    v-for="(event, index) in events"
                    :key="index"
                    :class="[
                        'event',
                        { 'event--colored': (events.length - index) % 2 === 0 },
                    ]"
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
import type { TypeField } from '@/types';
import { useFormModel } from '@/hooks/useFormModel.ts';
import { useRecalculate } from '@/hooks/useRecalculate.ts';
import { useEvents } from '@/hooks/useEvents.ts';
import { useLocalStorage } from '@/hooks/useLocalStorage.ts';
import { useSubmit } from '@/hooks/useSubmit.ts';

const { model, onInput } = useFormModel();
const { recalculate } = useRecalculate(model);
const { events, addEvent } = useEvents();

const { localStorageView, saveToLocalStorage } = useLocalStorage(model);
const { handleClick } = useSubmit(
    model,
    addEvent,
    saveToLocalStorage,
    () => localStorageView.value
);

function onInputWithLogic(event: Event, field: TypeField) {
    onInput(event, field, (changedField) => {
        addEvent(`Инпут "${changedField}" изменен после дебаунса`);
        recalculate(changedField);
    });
}
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

    width: 16%;
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
