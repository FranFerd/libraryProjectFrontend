import { defineStore } from "pinia";

export const useModeStore = defineStore('mode', {
    state: () => ({
        editMode: false,
        deleteMode: false
    }),
    actions: {
        setEditMode(value) {
            this.editMode = value
        },
        setDeleteMode(value){
            this.deleteMode = value
        }
    }
})
