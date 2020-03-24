var restaurantId = getRestaurantId(window.location.href);
var restaurantName = "Zero";
var contactNo = "9912581389";
var showDescription = false;
var themeId = null;
var loadingInfo = ["A hungry stomach has no ears", "Dear stomach, you're bored, not hungry.So shut up"];
var infoLoaded = false;
var foodLoaded = false;
var categoriesLoaded = false;
var inLandscapeMode = false;
var isLoading = true;
var mapIdToFood = new Map();
var mapCategoryToIds = new Map();

var firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

function getRestaurantId(url) {
    var params = getParams(url);
    if ("id" in params)
        return params["id"];

    return "-1";
}

function getParams(url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};

function applyTheme() {
    var bgColor;
    var footerBgColor;

    if (themeId == 0) {
        bgColor = "#282828";
        footerBgColor = "#404040";
    } else if (themeId == 1) {
        bgColor = "#2c7572";
        footerBgColor = "#2f938e";
    } else if (themeId == 2) {
        bgColor = "#154560";
        footerBgColor = "#1a6db1";
    } else {
        return;
    }

    document.body.style.backgroundColor = bgColor;
    var footerRow = document.getElementById("footerRow");
    footerRow.style.backgroundColor = footerBgColor;
    var categoryModalContent = document.getElementById("categoryModalContent");
    categoryModalContent.style.backgroundColor = footerBgColor;

    var feedbackModalContent = document.getElementById("feedbackModalContent");
    feedbackModalContent.style.backgroundColor = footerBgColor;

    var buttons = document.getElementsByClassName("categoryButton");
    for (var i = 0; i < buttons.length; ++i) {
        buttons[i].style.backgroundColor = footerBgColor;
        buttons[i].style.color = "#ffa500";
    }
}

function applyOrientation() {
    if (window.innerHeight > window.innerWidth) {
        inLandscapeMode = false;
    } else {
        inLandscapeMode = true;
    }

    updateOrientation();
}

function updateOrientation() {
    var landscape = document.getElementById("landscape");
    var mainContent = document.getElementById("mainContent");
    var loading = document.getElementById("loading");

    if (inLandscapeMode) {
        landscape.style.display = "block";
        mainContent.style.display = "none";
        loading.style.display = "none";
    } else {
        landscape.style.display = "none";
        if (isLoading) {
            loading.style.display = "block";
            mainContent.style.display = "none";
        } else {
            loading.style.display = "none";
            mainContent.style.display = "block";
        }
    }
}

function retrieveInfo() {
    var docRef = firestore.collection("Restaurants").doc(restaurantId).get()
        .then(function(doc) {
            if (doc.exists) {
                restaurantName = doc.data().Name;
                contactNo = doc.data().ContactNo;
                showDescription = doc.data().ShowDescription;
                themeId = doc.data().ThemeId;
                onInfoLoaded();

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}

function retrieveCategories() {
    var docRef = firestore.collection("Restaurants").doc(restaurantId).collection("Categories").orderBy("index").get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                mapCategoryToIds.set(doc.id, doc.data());
            });

            onCategoriesLoaded();
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}

function retrieveFood() {
    var docRef = firestore.collection("Restaurants").doc(restaurantId).collection("Food").get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                mapIdToFood.set(doc.id, doc.data());
            });
            onFoodLoaded();
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}

function createMenu(categoryName, data) {
    var menuScroll = document.getElementById("menuScroll");
    var section = document.createElement("div");
    section.classList.add("text-center");
    section.classList.add("section");
    var sectionHeader = document.createElement("p");
    sectionHeader.className = "sectionHeader";
    sectionHeader.id = categoryName;
    sectionHeader.appendChild(document.createTextNode(categoryName));
    section.appendChild(sectionHeader);
    menuScroll.appendChild(section);

    var categoryModalContent = document.getElementById("categoryModalContent");
    var categoryButton = document.createElement("button");
    categoryButton.classList.add("categoryButton");
    categoryButton.innerHTML = categoryName;
    categoryButton.addEventListener("click", function() { jumpToCategory(categoryName); });
    categoryModalContent.appendChild(categoryButton);

    for (var id in data.ids) {
        var sectionContent = document.createElement("div");
        sectionContent.classList.add("container");
        sectionContent.classList.add("text-center");
        sectionContent.classList.add("sectionContent");

        var itemTable = document.createElement("div");
        itemTable.classList.add("container");
        itemTable.classList.add("itemTable");

        var item = document.createElement("div");
        item.classList.add("item");

        var name = document.createElement("p");
        name.classList.add("text-left");
        name.classList.add("name");
        name.appendChild(document.createTextNode(mapIdToFood.get(data.ids[id]).Name));
        item.appendChild(name);

        if (mapIdToFood.get(data.ids[id]).IsNonVeg) {
            var nonVegIcon = document.createElement("img");
            nonVegIcon.classList.add("nonVegIcon");
            nonVegIcon.src = "Assets/Nonveg.png";
            item.appendChild(nonVegIcon);
        }

        if (mapIdToFood.get(data.ids[id]).Price > 0) {
            var price = document.createElement("p");
            price.classList.add("text-right");
            price.classList.add("price");
            price.appendChild(document.createTextNode(mapIdToFood.get(data.ids[id]).Price));
            item.appendChild(price);
        }

        itemTable.appendChild(item);
        sectionContent.appendChild(itemTable);

        if (showDescription) {
            var itemDescription = document.createElement("div");
            itemDescription.classList.add("container");
            itemDescription.classList.add("itemDescription");
            var description = document.createElement("p");
            description.classList.add("text-left");
            description.classList.add("description");
            description.appendChild(document.createTextNode(mapIdToFood.get(data.ids[id]).Description));
            itemDescription.appendChild(description);
            sectionContent.appendChild(itemDescription);
        }

        section.appendChild(sectionContent);
    }

    section.appendChild(document.createElement("br"));

}

function onInfoLoaded() {
    infoLoaded = true;
    // hacky way , because while loop causing weird behaviour, just to be on safer side
    if (infoLoaded && foodLoaded && categoriesLoaded)
        constructElements();

}

function onFoodLoaded() {
    foodLoaded = true;
    // hacky way , because while loop causing weird behaviour, just to be on safer side
    if (infoLoaded && foodLoaded && categoriesLoaded)
        constructElements();
}

function onCategoriesLoaded() {
    categoriesLoaded = true;
    // hacky way , because while loop causing weird behaviour, just to be on safer side
    if (infoLoaded && foodLoaded && categoriesLoaded)
        constructElements();
}

function constructElements() {
    mapCategoryToIds.forEach(function(value, key, map) {
        createMenu(key, value)
    });
    isLoading = false;
    applyTheme();
    updateOrientation();
    adjustToScreenRes();
}

function jumpToCategory(categoryName) {
    location.href = "#" + categoryName;
    document.getElementById("categoryModal").style.display = "none";
}

function adjustToScreenRes() {
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var footer = document.getElementById("footer");
    var flunkey = document.getElementById("flunkey");
    //flunkey.style.lineHeight = footer.clientHeight + "px";
    var menuScroll = document.getElementById("menuScroll");
    menuScroll.style.height = (height - footer.clientHeight - 16) + "px";
    menuScroll.style.width = width + "px";
    menuScroll.style.marginTop = "16px";
}

function openCategoryPanel() {
    var modal = document.getElementById("categoryModal");
    modal.style.display = "block";
}

function closeCategoryPanel() {
    var modal = document.getElementById("categoryModal");
    modal.style.display = "none";
}

function openFeedbackPanel() {
    var modal = document.getElementById("feedbackModal");
    modal.style.display = "block";
}

function closeFeedbackPanel() {
    var modal = document.getElementById("feedbackModal");
    modal.style.display = "none";
}

window.onresize = function(event) {
    applyOrientation();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    var categoryModal = document.getElementById("categoryModal");
    var feedbackModal = document.getElementById("feedbackModal");
    if (event.target == categoryModal) {
        closeCategoryPanel();
    } else if (event.target == feedbackModal) {
        closeFeedbackPanel();
    }

}

function onCheckboxStateChange() {
    var anyFeedback = false;
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; ++i) {
        if (inputs[i].type == "checkbox")
            anyFeedback = anyFeedback || inputs[i].checked;
    }

    var submit = document.getElementById("submit");
    if (anyFeedback)
        submit.style.display = "block";
    else
        submit.style.display = "none";

}

function submitFeedback() {
    document.getElementById("feedbackMain").style.display = "none";
    document.getElementById("feedbackSecondary").style.display = "block";

    var inputs = document.getElementsByTagName("input");
    var states = [];
    var count = [0, 0];
    for (var i = 0; i < inputs.length; ++i) {
        if (inputs[i].type == "checkbox") {
            states.push(inputs[i].checked);
        }
    }

    if (states.length != count.length) {
        console.log("something is wrong");
        return;
    }

    const docRef = firestore.collection("Feedbacks").doc(restaurantId).get()
        .then(function(doc) {
            if (doc.exists) {
                count = doc.data().Count;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
            for (var i = 0; i < states.length; ++i) {
                if (states[i])
                    count[i] += 1;
            }
            writeFeedbackToDB(count)
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}

function writeFeedbackToDB(count) {
    const docRef = firestore.collection("Feedbacks").doc(restaurantId).set({
            Count: count
        })
        .then(function() {
            console.log("Feedback successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing info document: ", error);
        });
}

applyOrientation();
retrieveInfo();
retrieveCategories();
retrieveFood();