import "firebase/app";
import "firebase/firestore";
import fb from "firebase/app";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebase = !fb.apps.length
  ? fb.initializeApp(firebaseConfig)
  : fb.app();
export const firestore = firebase.firestore();

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

export const signupWithEmailAndPassword = async (email, password) => {
  try {
    const user = await auth.createUserWithEmailAndPassword(email, password);

    // await auth.currentUser.sendEmailVerification();

    alert("登録に成功しました。");
    return user;
  } catch (error) {
    alert(
      "登録に失敗しました。もう一度メールアドレスとパスワードを入力してください。"
    );
  }
};

export const signinWithEmailAndPassword = async (email, password) => {
  try {
    const user = await auth.signInWithEmailAndPassword(email, password);

    alert("サインイン完了");
    return user;
  } catch (error) {
    alert("サインアウト失敗");
    console.log(error);
  }
};
export const signout = async () => {
  const user1 = await auth.currentUser;
  console.log("サインアウト前:", user1);

  await auth.signOut();

  const user2 = await auth.currentUser;
  console.log("サインアウト後:", user2);
};
