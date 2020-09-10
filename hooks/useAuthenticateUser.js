import { useEffect } from "react";

import { useDispatch } from "react-redux";

import firebase from "firebase/app";
import "firebase/auth";

export default function useAuthenticateUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = firebase.auth().onAuthStateChanged(user => {
        if (user) {
          //sign in the user
          // this.props.signIn(user);
          dispatch({ type: "SIGN_IN", payload: user });
        } else {
          console.log("No user signed in");
          dispatch({ type: "SIGN_OUT" });
          //sign out the user
          // this.props.signOut();
        }
        unsubscribe();
      });
    } catch (e) {
      //sign out user
      // this.props.signOut();
      dispatch({ type: "SIGN_OUT" });
    }
  }, [dispatch]);
}
