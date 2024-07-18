import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const registerUser = async (email, password, additionalData) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const { uid } = userCredential.user;

    await firestore().collection('users').doc(uid).set({
      email,
      ...additionalData,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    throw new Error(error.message);
  }
};
