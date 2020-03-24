var admin = require("firebase-admin");
var serviceAccount = require("./zero-cf369-firebase-adminsdk-bt2k4-8218ad7ef7.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://zero-cf369.firebaseio.com"
});

var firestore = admin.firestore();
const settings = { /* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);

var fs = require('fs');

console.log("arguments are " + process.argv);
var myArgs = process.argv.slice(2);
myArgs.forEach(arg => {

    var infoPath = "Data/" + arg + " - Info.csv";
    var menuPath = "Data/" + arg + " - Menu.csv";
    WriteToDB(infoPath, menuPath);
});

function WriteToDB(infoPath, menuPath) {
    var id;

    fs.readFile(infoPath, 'utf8', function (err, data) {
        if (err) {
            console.log(infoPath + " not found");
            throw err;
        }

        var infoLines = ProcessToArray(data);

        // format of restaurant info
        // Id
        // Name
        // ContactNo
        // ShowDescription
        // ThemeId

        id = infoLines[0][1];
        console.log(id);
        var contactNo = "+91" + infoLines[2][1];
        console.log(contactNo);

        const docRef = firestore.collection("Restaurants").doc(id).set({
            Name: infoLines[1][1], // name of restaurant
            ContactNo: contactNo, // contact no
            ShowDescription: (infoLines[3][1] == "TRUE"), // showdescription
            ThemeId: Number(infoLines[4][1]) // theme id
        })
            .then(function () {
                console.log("Info successfully written!");
            })
            .catch(function (error) {
                console.error("Error writing info document: ", error);
            });

        const phoneBookRef = firestore.collection("OwnerPhoneNumbers").doc(contactNo);
        phoneBookRef.get().then(function (doc) {
            if (doc.exists) {
                phoneBookRef.update({
                    owns: admin.firestore.FieldValue.arrayUnion(id)
                });
                console.log("new restaurant added to existing phone number");
            } else {
                phoneBookRef.set({
                    owns: [id]
                })
                    .then(function () {
                        console.log("phonenumber successfully written!");
                    })
                    .catch(function (error) {
                        console.error("Error writing phone number : ", error);
                    });
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

        fs.readFile(menuPath, 'utf8', function (err, data) {
            if (err) {
                console.log(menuPath + " not found");
                throw err;
            }

            var dictionary = new Map();
            var menuLines = ProcessToArray(data);

            // format of restaurant menu
            // Id
            // Name
            // Description
            // IsNonVeg
            // Price
            // Category

            menuLines.forEach(function (line) {
                var foodObject = {
                    Name: line[1], // name
                    Description: line[2], // description
                    Price: Number(line[4]), // Price
                    Flag: line[3] == "TRUE" ? 1 : 0 // flag is IS_NON_VEG 1 //0001
                };

                const docRef = firestore.collection("Restaurants").doc(id).collection("Food").doc(line[0]).set(foodObject)
                    .then(function () {
                        console.log("Food successfully written!");
                    })
                    .catch(function (error) {
                        console.error("Error writing document: ", error);
                    });

                if (!dictionary.has(line[5])) {
                    var ids = []
                    dictionary.set(line[5], ids);
                }
                dictionary.get(line[5]).push(line[0]);

            });

            var index = 0;
            for (var [key, value] of dictionary) {
                const docRef = firestore.collection("Restaurants").doc(id).collection("Categories").doc(key).set({ ids: value, index: index })
                    .then(function () {
                        console.log("Category successfully written!");
                    })
                    .catch(function (error) {
                        console.log("Error2");
                        console.error("Error writing document: ", error);
                    });
                ++index
            }
        });
    });
}

// Create an array of arrays
// Remove first line
// Split by ","
function ProcessToArray(dataString) {
    //console.log(dataString);
    var lines = dataString
        .split(/\r?\n|\r/) // Convert to one string per line
        .map(function (lineStr) {
            return lineStr.split(","); // Convert each line to array (,)
        })
        .slice(1); // Discard header line

    return lines;
}

// Create an array of arrays
// Remove first line
// Split by ","
function ProcessToJSON(dataString) {
    var lines = dataString
        .split(/\r?\n|\r/) // Convert to one string per line
        .map(function (lineStr) {
            return lineStr.split(","); // Convert each line to array (,)
        })
        .slice(1); // Discard header line

    return JSON.stringify(lines, null, 2);
}