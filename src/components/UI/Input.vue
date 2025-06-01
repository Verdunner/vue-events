<template>
    <div class="form-input">
        <label :for="name" class="form-input__label">{{ label }}</label>
        <input
            :id="name"
            :name="name"
            type="number"
            class="form-input__input"
            :placeholder="placeholder"
            :value="modelValue"
            @input="handleInput"
        />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: number;
    label: string;
    name: string;
    placeholder: string;
}>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void;
    (e: 'input', event: Event): void;
}>();

function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.valueAsNumber;
    emit('update:modelValue', value);
    emit('input', event);
}
</script>

<style scoped lang="scss">
.form-input {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    text-align: center;

    width: 16%;
    padding: 5px 10px;
    font-size: 20px;

    &__input {
        min-width: 50px;
        padding: 10px;
        font-size: 16px;
    }
}
</style>
