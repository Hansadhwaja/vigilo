import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isEditSchedulingModalOpen: false
};

const schedulingSlice = createSlice({
    name: "scheduling",
    initialState,
    reducers: {
        openEditSchedulingModal: (state) => {
            state.isEditSchedulingModalOpen = true;
        },
        closeEditSchedulingModal: (state) => {
            state.isEditSchedulingModalOpen = false;
        },

    },
});

export const { openEditSchedulingModal, closeEditSchedulingModal } = schedulingSlice.actions;

export default schedulingSlice.reducer;