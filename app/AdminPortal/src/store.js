import { createStore, applyMiddleware } from "redux";
import firestoredb from "myfirebase";
import thunkMiddleware from "redux-thunk";
//Usually we would have separate reducer files and combine them in a store index file. This application will be a simple one, so we will just put everything in one file for simplicity sake.

/**
 * ACTION TYPES
 */
const GET_FOOD_MENU = "GET_FOOD_MENU";
const SET_ITEM = "SET_ITEM";

/**
 * ACTION CREATORS
 */
export const getFoodMenu = foodMenu => ({
  type: GET_FOOD_MENU,
  foodMenu
});

export let foodMenuMap = new Map();
export let foodMenuUpdated = new Map();

/**
 * THUNKS
 */
export function getFoodMenuThunk(restaurantId) {
  return dispatch => {
    const mapIdToFood = [];
    const realMapIdFood = new Map();
    const foodCollection = firestoredb
      .collection("Restaurants")
      .doc(restaurantId)
      .collection("Food");
    foodCollection
      .get()
      .then(snapshot => {
        console.log(snapshot.docs);
        snapshot.forEach(doc => {
          //this.mapIdToFood.set(doc.id, doc.data());
          mapIdToFood.push(doc);
          //realMapIdFood[doc.id] = doc.data();
          realMapIdFood.set(doc.id, doc.data());
          foodMenuMap = realMapIdFood;
          //this.foodIds.push(parseInt(doc.id, 10));
        });
      })
      .then(() => dispatch(getFoodMenu(realMapIdFood)))
      .catch(err => {
        console.log("Error getting documents", err);
      });
  };
}

export function getGoogleAnalyticsThunk(restaurantId) {
  return dispatch => {
    return (
      fetch("/api/todos")
        // Here, we are getting json body(in our case it will contain `todos` or `error` prop, depending on request was failed or not) from server response
        // And providing `response` and `body` variables to the next chain.
        .then(response => response.json().then(body => ({ response, body })))
        .then(({ response, body }) => {
          if (!response.ok) {
            // If request was failed, dispatching FAILURE action.
            dispatch({
              type: "FETCH_TODOS_FAILURE",
              error: body.error
            });
          } else {
            // When everything is ok, dispatching SUCCESS action.
            dispatch({
              type: "FETCH_TODOS_SUCCESS",
              todos: body.todos
            });
          }
        })
    );
  };
}

export function updateFoodMenuThunk(restaurantId, setIdsToUpdate, newFoodMenu) {
  //restaurantId: string , batchUpdates: Map()
  return dispatch => {
    const batch = firestoredb.batch();
    const foodCollection = firestoredb
      .collection("Restaurants")
      .doc(restaurantId)
      .collection("Food");
    setIdsToUpdate.forEach(function(foodId) {
      const b = foodCollection.doc(foodId);
      const foodObj = newFoodMenu.get(foodId);
      batch.set(b, foodObj);
    });
    batch
      .commit()
      .then(() => {
        window.onbeforeunload = null;
        dispatch(getFoodMenu(newFoodMenu));
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  };
}

// export function loginForAdminThunk(phoneNumber) {
//   return dispatch => {
//     var appVerifier = window.recaptchaVerifier;
//     firebaseAuth
//       .signInWithPhoneNumber(phoneNumber, appVerifier)
//       .then(function(confirmationResult) {
//         // SMS sent. Prompt user to type the code from the message, then sign the
//         // user in with confirmationResult.confirm(code).
//         window.confirmationResult = confirmationResult;
//       })
//       .catch(function(error) {
//         // Error; SMS not sent
//         // ...
//       });
//   };
// }

/**
 * REDUCER
 */

const initialState = {
  foodMenu: [],
  updatedIds: new Set()
};

function Reducer(state = initialState, action) {
  let tempMap = new Map();
  let tempSet = new Set();
  switch (action.type) {
    // case GET_TASKS:
    //   return action.tasks;
    // case ADD_TASK:
    //   return [...state, action.task];
    // case REMOVE_TASK:
    //   return state.filter(task => task.id !== action.task.id);
    case GET_FOOD_MENU:
      return {
        ...state,
        foodMenu: action.foodMenu
      };
    case SET_ITEM:
      tempMap = state.foodMenu;
      tempSet = state.updatedIds;
      tempMap.set(action.payload.foodId, action.payload.foodObj);
      tempSet.add(action.payload.foodId);
      console.log(state);
      return {
        foodMenu: tempMap,
        updatedIds: tempSet
      };
    default:
      return state;
  }
}

export default createStore(Reducer, applyMiddleware(thunkMiddleware));
