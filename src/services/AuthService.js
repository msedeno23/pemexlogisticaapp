import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

export const registerUser = async (email, password, additionalData) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const { uid } = userCredential.user;

    await firestore().collection('users').doc(uid).set({
      email,
      ...additionalData,
    });

    // Registrar la hora de entrada del usuario
    const today = moment().startOf('day').toDate();
    await firestore().collection('shifts').add({
      userId: uid,
      startTime: new Date(),
    });

  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const { uid } = userCredential.user;

    // Verificar y registrar la hora de entrada del usuario
    const today = moment().startOf('day').toDate();
    const shiftsRef = firestore().collection('shifts').where('userId', '==', uid).orderBy('startTime', 'desc').limit(1);
    const shiftsSnapshot = await shiftsRef.get();

    if (!shiftsSnapshot.empty) {
      const lastShift = shiftsSnapshot.docs[0].data();
      const lastShiftDate = moment(lastShift.startTime.toDate()).startOf('day').toDate();

      // Si la última entrada de turno no es de hoy, registrar una nueva
      if (today > lastShiftDate) {
        await firestore().collection('shifts').add({
          userId: uid,
          startTime: new Date(),
        });
      }
    } else {
      // Si no hay registros de turnos anteriores, registrar una nueva
      await firestore().collection('shifts').add({
        userId: uid,
        startTime: new Date(),
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
