<template>
    <div class="container">
        <div class="container__top">
            <form @submit.prevent="onSubmit" class="controls" novalidate>
                <Input
                    v-model.number="model.price"
                    @input="(e: Event) => onInput(e, 'price')"
                    :label="'Цена'"
                    :name="'price'"
                    :placeholder="'цена'"
                />
                <Input
                    v-model.number="model.qty"
                    @input="(e: Event) => onInput(e, 'qty')"
                    :label="'Количество'"
                    :name="'qty'"
                    :placeholder="'кол-во'"
                />
                <Input
                    v-model.number="model.amount"
                    @input="(e: Event) => onInput(e, 'amount')"
                    :label="'Сумма'"
                    :name="'amount'"
                    :placeholder="'сумма'"
                />
                <button type="submit" class="controls__btn">Отправить</button>
            </form>
            <ModelLabels :model="model" :localStorageView="localStorageView" />
        </div>
        <div class="container__bottom">
            <EventsList :events="events" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Input from '@/components/UI/Input.vue';
import ModelLabels from '@/components/ModelLabels.vue';
import EventsList from '@/components/EventsList.vue';
import { useFormModel } from '@/hooks/useFormModel.ts';
import { useEvents } from '@/hooks/useEvents.ts';
import { useLocalStorage } from '@/hooks/useLocalStorage.ts';
import { useSubmit } from '@/hooks/useSubmit.ts';

const { events, addEvent } = useEvents();
const { model, onInput } = useFormModel(addEvent);

const { localStorageView, saveToLocalStorage } = useLocalStorage(model);
const { onSubmit } = useSubmit(
    model,
    addEvent,
    saveToLocalStorage,
    () => localStorageView.value
);
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

.controls {
    display: flex;
}

.controls__btn {
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
</style>
