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
  async (_, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.get("/shoppingcart");
      if(response.status !== 200) throw new Error(response.error);
      return response.data.data;
    } catch(error) {
      return rejectWithValue(error.error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/shoppingcart/${id}`);
      if(response.status !== 200) throw new Error(response.error);
      dispatch(
        showToastMessage({
          message:"The item is deleted.", 
          status:"success",
        }));
      dispatch(getCartList());
      return response.data.cartItemQty;
    } catch(error) {
      showToastMessage({
        message:"Oops! Failed to delete the item.", 
        status:"fail",
    });
      return rejectWithValue(error.error);
    }
   }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/shoppingcart/${id}`,{qty:value});
      if(response.status!==200) throw new Error(response.error);

      return response.data.data;
    } catch(error) {
      return rejectWithValue(error.error);
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.get("/shoppingcart/qty");
      if(response.status!==200) throw new Error(response.error);
      dispatch(getCartList());
      return response.data.data;
    } catch(error) {
      return rejectWithValue(error.error);
    }
  }
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
      .addCase(getCartList.pending,(state,action) => {
        state.loading=true;
    })
      .addCase(getCartList.fulfilled,(state,action) => {
        state.loading=false;
        state.error="";
        state.cartList=action.payload;
        state.totalPrice=action.payload.reduce(
          // 0 means reduce is a kind of number so inital set up is 0
          (total,item)=>total+item.itemId.price*item.qty, 0).toFixed(2);
    })
      .addCase(getCartList.rejected,(state,action) => {
        state.loading=false;
        state.error=action.payload;
    })
      .addCase(deleteCartItem.pending,(state,action) => {
        state.loading=true;
      })
      .addCase(deleteCartItem.fulfilled,(state,action) => {
        state.loading=false;
        state.error="";
        state.cartList=action.payload;
        state.cartItemCount=action.payload;
        state.totalPrice=action.payload.reduce(
          (total,item)=>total+item.itemId.price*item.qty, 0).toFixed(2);
      })
      .addCase(deleteCartItem.rejected,(state,action) => {
        state.loading=false;
        state.error=action.payload;
      })
      .addCase(updateQty.pending,(state,action) => {
        state.loading=true;
      })
      .addCase(updateQty.fulfilled,(state,action) => {
        state.loading=false;
        state.error="";
        state.cartItemQty=action.payload;
        state.cartItemCount=action.payload;
        state.totalPrice=action.payload.reduce(
          (total,item)=>total+item.itemId.price*item.qty, 0).toFixed(2);
      })
      .addCase(updateQty.rejected,(state,action) => {
        state.loading=false;
        state.error=action.payload;
      })
      .addCase(getCartQty.pending,(state,action) => {
        state.loading=true;
      })
      .addCase(getCartQty.fulfilled,(state,action) => {
        state.loading=false;
        state.error="";
        state.cartItemCount=action.payload;
        state.cartItemQty=action.payload;
      })
      .addCase(getCartQty.rejected,(state,action) => {
        state.loading=false;
        state.error=action.payload;
      })
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
