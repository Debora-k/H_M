import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.post("/shoppingcart", {itemId:id,size,qty:1});
      if(response.status !== 200) throw new Error(response.error);
      dispatch(
        showToastMessage({
        message:"Add this item into your shopping cart!", 
        status:"success",
      })
    );
      return response.data.cartItemQty; 
    } catch(error) {
      dispatch(
        showToastMessage({
        message:"Failed to add this item into your shopping cart.", 
        status:"fail",
      })
    );
      return rejectWithValue(error.error);
    }
  }

);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  // async ([items], { rejectWithValue, dispatch }) => {
  //   try{
  //     const response = api.get("/shoppingcart", [items]);
  //     if(response.status !== 200) throw new Error(response.error);
  //     dispatch(cartList);
  //     return response.data.getCartList;
  //   } catch(error) {
  //     return rejectWithValue(error.error);
  //   }
  // }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
  //   try {
  //     const response = api.delete("/shoppingcart", id);
  //     if(response.status !== 200) throw new Error(response.error);
  //     dispatch(
  //       showToastMessage({
  //         message:"The item is successfully deleted.", 
  //         status:"success",
  //       }),
  //       cartList
  //     );
  //     return 
  //   } catch(error) {
  //     showToastMessage({
  //       message:"Oops! Failed to delete the item.", 
  //       status:"fail",
  //   });
  //     return rejectWithValue(error.error);
  //   }
   }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue }) => {}
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {}
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending,(state,action) => {
        state.loading=true;
    })
      .addCase(addToCart.fulfilled,(state,action) => {
        state.loading=false;
        state.error="";
        state.cartItemCount=action.payload;
    })
      .addCase(addToCart.rejected,(state,action) => {
        state.loading=false;
        state.error=action.payload;
    })
    //   .addCase(getCartList.pending,(state,action) => {
    //     state.loading=true;
    // })
    //   .addCase(getCartList.fulfilled,(state,action) => {
    //     state.loading=false;
    //     state.error="";
    //     state.cartList=action.payload;
    //     state.cartItemCount=action.payload;
    //     state.totalPrice=action.payload;
    // })
    //   .addCase(getCartList.rejected,(state,action) => {
    //     state.loading=false;
    //     state.error=action.payload;
    // })
    //   .addCase(deleteCartItem.pending,(state,action) => {
    //     state.loading=true;
    //   })
    //   .addCase(deleteCartItem.fulfilled,(state,action) => {
    //     state.loading=false;
    //     state.error="";
    //     state.cartList=action.payload;
    //     state.cartItemCount=action.payload;
    //     state.totalPrice=action.payload;
    //   })
    //   .addCase(deleteCartItem.rejected,(state,action) => {
    //     state.loading=false;
    //     state.error=action.payload;
    //   })
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
