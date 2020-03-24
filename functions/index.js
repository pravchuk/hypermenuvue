const functions = require('firebase-functions');
const firebase = require('firebase-admin'); 

const express = require('express');
const { google } = require("googleapis");

//analytics requirements
const authKey = require("./auth.json");
const scopes = "https://www.googleapis.com/auth/analytics.readonly";
const view_id = "181054081";

// Some useful code later on
/*const engines = require('consolidate');*/

const firebasApp = firebase.initializeApp(
    functions.config().firebase
);

var firestore = firebase.firestore();
var settings = { timestampsInSnapshots: true };
firestore.settings(settings);

const app  = express();
/*app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine', 'hbs');*/

var IS_NON_VEG = 1; 			// 0001
var IS_DISABLED = 2; 			// 0010
var IS_RECOMMENDED = 4;			// 0100
var IS_TODAYS_SPECIAL = 8;		// 1000

function isNonVeg(flag)
{
    return flag & IS_NON_VEG ? true : false;
}

function isDisabled(flag)
{
	return flag & IS_DISABLED ? true : false;
}

function isRecommended(flag)
{
	return flag & IS_RECOMMENDED ? true : false;
}

function isTodaysSpecial(flag)
{
	return flag & IS_TODAYS_SPECIAL ? true : false;
}

app.get('/restaurant.json', (request,response) => {
    response.set('Cache-Control','public,max-age=300,s-maxage=10800');
    var restaurantId = request.query.id;
    //console.log("restaurantId = "+restaurantId);
    var content = {};
    
    const restDoc = firestore.collection("Restaurants").doc(restaurantId);
    const p1 = restDoc.get()
    const p2 = restDoc.collection("Food").get()
    const p3 = restDoc.collection("Categories").orderBy("index").get()
    
    const promises = [p1,p2,p3];
    const finalPromise = Promise.all(promises);
    finalPromise.then(results => {
        var infoData = results[0].data();
        content.RestaurantName = infoData.Name;
        content.ThemeId = infoData.ThemeId;
        content.ShowDescription = infoData.ShowDescription;
        var mapIdToFood = new Map();
        
        results[1].forEach(doc => {
            mapIdToFood.set(doc.id,doc.data());
        });

        content.TodaysSpecial = [];
        content.Recommended = [];
        content.Categories = [];
        results[2].forEach(doc=> {
            var category = {};
            category.Name = doc.id;
            category.Food = [];
            doc.data().ids.forEach(id=>{
                var food = {}
                var foodData = mapIdToFood.get(id);
                food.Name = foodData.Name;
                food.IsNonVeg = isNonVeg(foodData.Flag);
                food.IsDisabled = isDisabled(foodData.Flag);
                food.Price = foodData.Price;
                food.Description = foodData.Description;
                category.Food.push(food);
                if(isTodaysSpecial(foodData.Flag))
                    content.TodaysSpecial.push(food);
                if(isRecommended(foodData.Flag))
                    content.Recommended.push(food); 
            });
            content.Categories.push(category);
        });
        response.json(content);
        return; 
    })
    .catch(error=>{
        console.log(error);
        response.status(500).send(error);   
    })
});

app.get('/anal.json', (request, response) => {
    //TODO: check if user is authorized as an owner
    const jwt = new google.auth.JWT(
        authKey.client_email,
        null,
        authKey.private_key,
        scopes
      );
    jwt.authorize((err, res) => {
        if(err !== null &&  err.message !== null && error.message !== ""){
            resonse.send(err.message);
        }else{
            console.log(res);
            response.json(res);
        } 
    });
});

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.RestaurantJson = functions.https.onRequest(app);
exports.Anal = functions.https.onRequest(app);

