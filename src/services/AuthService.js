import auth from '@react-native-firebase/auth';

export const loginUser = async (email, password) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const registerUser = async (email, password) => {
  try {
    await auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    throw new Error(error.message);
  }
};
