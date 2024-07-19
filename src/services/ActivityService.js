import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const getUserTrips = async () => {
  const user = auth().currentUser;
  if (user) {
    const snapshot = await firestore()
      .collection('trips')
      .where('userId', '==', user.uid)
      .orderBy('startTime', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
  return [];
};
