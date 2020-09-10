import React from "react";

import { Provider } from "react-redux";
import { firebaseConfig } from "./config/config";

import store from "./redux/store";

import BookWorm from "./BookWorm";

import firebase from "firebase/app";

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export default function App() {
  return (
    <Provider store={store}>
      <BookWorm />
    </Provider>
  );
}
