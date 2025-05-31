export function useSubmit(
    model: any,
    addEvent: (msg: string) => void,
    saveToLocalStorage: () => void
) {
    async function sendData(data: typeof model): Promise<{ success: boolean }> {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (data.amount % 2 === 0) {
            data.counter++;
            saveToLocalStorage();
            return { success: true };
        } else {
            return { success: false };
        }
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
    }

    return { handleClick };
}
