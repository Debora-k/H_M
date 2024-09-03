import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get("/item", {params:{...query}});
      if(response.status!==200) throw new Error(response.error); 

      console.log(response.data);
      return response.data;
    } catch(error) {
      rejectWithValue(error.error);
    }
  }
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {}
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/item", formData);
      if(response.status!==200) throw new Error(response.error);
      dispatch(showToastMessage({message:"Success to create an item!", status:"success"}));
      return response.data.data;
    }catch(error) {
      return rejectWithValue(error.error);
    }

  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { dispatch, rejectWithValue }) => {
    // try {
    //   const response = await api.delete("/item", id);
    //   dispatch(deleteProduct({status:"success",}))
    // } catch (error) {
    //   return rejectWithValue(error.error);
    // }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, page, ...formData }, { dispatch, rejectWithValue }) => {
    try{
      const response = await api.put(`/item/${id}`, formData);
      if(response.status !==200) throw new Error (response.error);
      // after editing, updates right away by "dispatch"
      dispatch(getProductList({page}));
      return response.data.data;
    } catch(error) {
      return rejectWithValue(error.error);
    }
  }
);

// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  // without Thunk, goes into reducers
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProduct.pending,(state,action) =>{
      state.loading=true;
    })
    .addCase(createProduct.fulfilled,(state,action) =>{
      state.loading=false;
      state.error=""; //set up error message erase after success
      state.success=true; //ABOUT SUCCESS: after success of creating an item, it helps to close the dialog
      // if failed, then it pops up a fail message and it doesn't close the dialog
    })
    .addCase(createProduct.rejected,(state,action) =>{
      state.loading=false;
      state.error=action.payload;
      state.success=false;
    })
    .addCase(getProductList.pending,(state,action) => {
      state.loading=true;
    })
    .addCase(getProductList.fulfilled,(state,action) => {
      state.loading=false;
      state.productList = action.payload.data;
      state.error="";
      state.totalPageNum= action.payload.totalPageNum;
    })
    .addCase(getProductList.rejected,(state,action) => {
      state.loading=false;
      state.error=action.payload;
    })
    .addCase(editProduct.pending,(state,action) => {
      state.loading=true;
    })
    .addCase(editProduct.fulfilled,(state,action) => {
      state.loading=false;
      state.error="";
      state.success=true;
    })
    .addCase(editProduct.rejected,(state,action) => {
      state.loading=false;
      state.error=action.payload;
      state.success=false;
    })
  },
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;
