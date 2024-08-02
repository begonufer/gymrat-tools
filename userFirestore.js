// userFirestore.js
import { db } from './firebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";

export const storeUserInfo = async (userId, userInfo) => {
  try {
    await setDoc(doc(db, "users", userId), userInfo);
    console.log("User information successfully written!");
  } catch (error) {
    console.error("Error writing user information: ", error);
  }
};

export const getUserInfo = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user information: ", error);
    return null;
  }
};
