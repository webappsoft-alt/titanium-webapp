import { createSlice } from '@reduxjs/toolkit';

export const productSlice = createSlice({
  name: 'prod',
  initialState: {
    metalType: [],
    tableData: [],
    quoteData: null,
    faqs: [],
    terms: null,
    competMarkup: null,
    customerData: null,
    countriesList: [],
    statesList: [],
    rolesList: [],
  },
  reducers: {
    setMetalType: (state, action) => {
      state.metalType = action.payload;
    },
    setCustomerData: (state, action) => {
      state.customerData = action.payload;
    },
    setCountriesList: (state, action) => {
      state.countriesList = action.payload;
    },
    setStatesList: (state, action) => {
      state.statesList = action.payload;
    },
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setRolesList: (state, action) => {
      state.rolesList = action.payload;
    },
    setQuoteData: (state, action) => {
      state.quoteData = action.payload;
    },
    setCompetMarkup: (state, action) => {
      state.competMarkup = action.payload;
    },
    setFaqs: (state, action) => {
      state.faqs = action.payload;
    },
    setTerms: (state, action) => {
      state.terms = action.payload;
    },
    removeTableData: (state, action) => {
      state.tableData = state.tableData.filter((_, index) => index !== action.payload);
    },
    updateTableData: (state, action) => {
      const newItem = action.payload;
      const existingIndex = state.tableData.findIndex(item => (item.uniqueID === newItem.uniqueID && (newItem.customCut ? !!item?.customCut : !item?.customCut)));
      if (existingIndex !== -1) {
        // Update existing item
        state.tableData[existingIndex] = newItem;
      } else {
        // Push new item
        state.tableData.push(newItem);
      }
    }
  },
});

export const { setMetalType, setRolesList, setStatesList, setCustomerData, setCountriesList, setCompetMarkup, setFaqs, setTerms, setTableData, setQuoteData, removeTableData, updateTableData } = productSlice.actions;

export default productSlice.reducer;