import { createStore, combineReducers } from "redux";

import booksReducer from "../reducers/BooksReducer";
import authReducer from "../reducers/authReducer";
const store = createStore(
  combineReducers({
    books: booksReducer,
    auth: authReducer
  })
);

export default store;
