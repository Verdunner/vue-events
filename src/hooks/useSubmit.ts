import type { TypeFormModel } from '@/types';

export function useSubmit(
    model: TypeFormModel,
    addEvent: (msg: string) => void,
    saveToLocalStorage: () => void,
    getLocalStorageSnapshot: () => string
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

    async function onSubmit() {
        const snapshotBefore = getLocalStorageSnapshot();
        addEvent(
            `Отправлено: ${JSON.stringify(
                model
            )}+Текущий localStorage: ${snapshotBefore}`
        );
        const result = await sendData(model);
        const snapshotAfter = getLocalStorageSnapshot();
        addEvent(
            `Ответ бекенда: ${JSON.stringify(
                result
            )}+Текущий localStorage: ${snapshotAfter}`
        );
    }

    return { onSubmit };
}
