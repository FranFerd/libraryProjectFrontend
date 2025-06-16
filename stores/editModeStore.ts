import { defineStore } from "pinia";

export const useModeStore = defineStore('mode', {
    state: () => ({
        editMode: false,
        deleteMode: false
    }),
    actions: {
        setEditMode(value: boolean) {
            this.editMode = value
        },
        setDeleteMode(value: boolean){
            this.deleteMode = value
        }
    }
})
