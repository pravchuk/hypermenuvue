import * as firebase from "firebase";

var config = {
  apiKey: "AIzaSyDN7h6ABClV2cCbU7ws0ZFGttK-We8swss",
  authDomain: "zero-cf369.firebaseapp.com",
  databaseURL: "https://zero-cf369.firebaseio.com",
  projectId: "zero-cf369",
  storageBucket: "zero-cf369.appspot.com",
  messagingSenderId: "1056412988912"
};
firebase.initializeApp(config);

const firestoredb = firebase.firestore();
const settings = { timestampsInSnapshots: false };
firestoredb.settings(settings);
export const firebaseAuth = firebase.auth();

// export const getFoodMenu = restaurantId => {
//   //this will give us a unique id for our tasks
//   const rootRef = firebase.firestore();
//   const settings = { timestampsInSnapshots: false };
//   rootRef.settings(settings);
//   const foodCollection = rootRef
//     .collection("Restaurants")
//     .doc(restaurantId)
//     .collection("Food");
//   foodCollection
//     .get()
//     .then(snapshot => {
//       console.log(snapshot.docs);
//       snapshot.forEach(doc => {
//         //this.mapIdToFood.set(doc.id, doc.data());
//         this.mapIdToFood.push(doc);
//         this.foodIds.push(parseInt(doc.id, 10));
//       });
//       this.setState({
//         menuSnapshot: this.mapIdToFood
//       });
//     })
//     .catch(err => {
//       console.log("Error getting documents", err);
//     });
// };

export default firestoredb;
