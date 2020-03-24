import request from '@/utils/request'
import firebase from 'firebase'

let db, storage, restaurantId, tableId;

function initDb(){
  if(!db){
    db = firebase.firestore()
  }
}

function initStorage(){
  if(!storage){
    debugger
    storage = firebase.storage();
  }
}


export function getProducts (query) {
  return request({
    url: '/transaction/list',
    method: 'get',
    params: query
  })
}

export function getRestaurantObj(restId, cb){
  restaurantId = restId;
  var itemsRef = db.collection('Restaurants').doc(restaurantId);
  itemsRef.get().then(function(doc){
    if(doc.exists){
      var data = doc.data();
      console.log("Document data", data);
      cb(data);
    }else{
      console.log("Restaurant doesn't exist");
    }
  }).catch(function(error){
    console.log("Error getting document", error);
  })
}

export function sendOrder(order){
  let orderCollection = db.collection('Restaurants').doc(restaurantId).collection('Orders');
  orderCollection.add(order).then(ref => {
    console.log("added your order");
  });
}

export function getRestaurantFromTable(tableId, cb){
  initDb();
  let itemsRef = db.collection('TableIds').doc(tableId);
  itemsRef.get().then(function(doc){
    if(doc.exists){
      var data = doc.data();
      console.log("Document data", data);
      cb(data);
    }else{
      console.log("Table doesn't exist");
    }
  }).catch(function(error){
    console.log("Error getting document", error);
  })
}

export function getFoodImage(imageRef){
  debugger
  initStorage();
  return new Promise((resolve, reject) => {
    let foodRef = storage.ref("food/"+restaurantId+"/"+imageRef);
    // Get the download URL
    foodRef.getDownloadURL().then(function(url) {
      resolve(url);
    }).catch(function(error) {
      reject(error);
    });
  });
}