var restaurantId = getRestaurantId(window.location.href);
var restaurantName = "Zero";
var contactNo = "9912581389";
var showDescription = false;
var themeId = -1;
var inLandscapeMode = false;
var isLoading = true;
var bgColor;
var footerBgColor;
var fontColor;
var sectionHeaderColor;
var companyColor;

var config = {
    apiKey: "AIzaSyDN7h6ABClV2cCbU7ws0ZFGttK-We8swss",
    authDomain: "zero-cf369.firebaseapp.com",
    databaseURL: "https://zero-cf369.firebaseio.com",
    projectId: "zero-cf369",
    storageBucket: "zero-cf369.appspot.com",
    messagingSenderId: "1056412988912"
};
firebase.initializeApp(config);

var firestore = firebase.firestore();
var settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// When the user changes the mode
window.onresize = function (event) {
    applyOrientation();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == document.getElementById("categoryModal")) {
        closeCategoryPanel();
    } else if (event.target == document.getElementById("feedbackModal")) {
        closeFeedbackPanel();
    }
}

function getRestaurantId(url) {
    /*Still usinng ?id for params*/
    var params = getParams(url);
    if ("id" in params)
        return params["id"];
    else {
        var splitArr = window.location.href.split('/');
        return splitArr[splitArr.length - 1];
    }
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

    if (themeId == 0) {
        bgColor = "#eecd34";
        footerBgColor = "#3b3b3b";
        fontColor = "#3b3b3b";
        sectionHeaderColor = "#3b3b3b";
        companyColor = "#ffffff";
        var categoryIcon = document.getElementById("categoryIcon").src = "Assets/Expand-White.png";
        var feedbackIcon = document.getElementById("feedbackIcon").src = "Assets/Feedback-White.png";
    }
    else if (themeId == 1) {
        bgColor = "#3b3b3b";
        footerBgColor = "#eecd34";
        fontColor = "#ffffff";
        sectionHeaderColor = "#eecd34";
        companyColor = "#3b3b3b";
        var categoryIcon = document.getElementById("categoryIcon").src = "Assets/Expand-Black.png";
        var feedbackIcon = document.getElementById("feedbackIcon").src = "Assets/Feedback-Black.png";
    }
    else if (themeId == 2) {
        bgColor = "#3b3b3b";
        footerBgColor = "#eecd34";
        fontColor = "#eecd34";
        sectionHeaderColor = "#ffffff";
        companyColor = "#3b3b3b";
        var categoryIcon = document.getElementById("categoryIcon").src = "Assets/Expand-Black.png";
        var feedbackIcon = document.getElementById("feedbackIcon").src = "Assets/Feedback-Black.png";
    }
    else if (themeId == 3) {
        bgColor = "#ffffff";
        footerBgColor = "#3b3b3b";
        fontColor = "#3b3b3b";
        sectionHeaderColor = "#3b3b3b";
        companyColor = "#eecd34";
        var categoryIcon = document.getElementById("categoryIcon").src = "Assets/Expand-Gold.png";
        var feedbackIcon = document.getElementById("feedbackIcon").src = "Assets/Feedback-Gold.png";
    } else {
        return;
    }

    document.body.style.backgroundColor = bgColor;
    document.body.style.color = fontColor;

    var footerRow = document.getElementById("footerRow");
    footerRow.style.backgroundColor = footerBgColor;

    var company = document.getElementById("company");
    company.style.color = companyColor;

    var restaurant = document.getElementById("restaurant");
    restaurant.style.color = sectionHeaderColor;

    var categoryModalContent = document.getElementById("categoryModalContent");
    categoryModalContent.style.backgroundColor = footerBgColor;

    var feedbackModalContent = document.getElementById("feedbackModalContent");
    feedbackModalContent.style.backgroundColor = footerBgColor;
    feedbackModalContent.style.color = companyColor;
}

function updateRestaurantName() {
    var restaurant = document.getElementById("restaurant");
    restaurant.innerText = restaurantName;
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

function jumpToCategory(categoryName) {
    location.href = "#" + categoryName;
    document.getElementById("categoryModal").style.display = "none";
}

function adjustToScreenRes() {
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var footer = document.getElementById("footer");
    var menuScroll = document.getElementById("menuScroll");
    menuScroll.style.height = (height - footer.clientHeight) + "px";
    menuScroll.style.width = width + "px";
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

    var docRef = firestore.collection("Feedbacks").doc(restaurantId).get()
        .then(function (doc) {
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
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function writeFeedbackToDB(count) {
    var docRef = firestore.collection("Feedbacks").doc(restaurantId).set({
        Count: count
    })
        .then(function () {
            console.log("Feedback successfully written!");
        })
        .catch(function (error) {
            console.error("Error writing info document: ", error);
        });
}

function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function createMenu(categoryName, data) {
    var menuScroll = document.getElementById("menuScroll");
    var section = document.createElement("div");
    section.style.textAlign = "left";
    var sectionHeader = document.createElement("p");
    sectionHeader.style.paddingLeft = "12px";
    sectionHeader.style.marginBottom = "8px";
    sectionHeader.style.fontWeight = 800;
    sectionHeader.style.fontSize = "1rem";
    sectionHeader.style.color = sectionHeaderColor;
    sectionHeader.id = categoryName;
    sectionHeader.appendChild(document.createTextNode(categoryName));
    section.appendChild(sectionHeader);
    menuScroll.appendChild(section);

    var categoryModalContent = document.getElementById("categoryModalContent");
    var categoryButton = document.createElement("button");
    categoryButton.style.backgroundColor = footerBgColor;
    categoryButton.style.color = companyColor;
    categoryButton.innerHTML = categoryName;
    categoryButton.addEventListener("click", function () { jumpToCategory(categoryName); });
    categoryModalContent.appendChild(categoryButton);

    data.forEach(data => {
        var sectionContent = document.createElement("div");
        sectionContent.classList.add("container");
        sectionContent.classList.add("text-center");
        sectionContent.style.padding = 0;

        var itemTable = document.createElement("div");
        itemTable.classList.add("container");
        itemTable.style.display = "table";
        itemTable.style.padding = "0px";
        itemTable.style.margin = "0px";

        var item = document.createElement("div");
        item.style.display = "table-row";

        var name = document.createElement("p");
        name.style.textAlign = "left";
        name.style.paddingLeft = "12px";
        name.style.display = "table-cell";
        name.style.width = "80%";

        name.appendChild(document.createTextNode(data.Name));
        item.appendChild(name);

        if (data.IsNonVeg) {
            var nonVegIcon = document.createElement("img");
            nonVegIcon.src = "Assets/Nonveg.png";
            nonVegIcon.style.display = "table-cell";
            nonVegIcon.style.height = "12px";
            nonVegIcon.style.width = "12px";
            nonVegIcon.style.backgroundColor = "#ffffff";
            item.appendChild(nonVegIcon);
        }

        if (data.Price > 0) {
            var price = document.createElement("p");
            price.style.textAlign = "right";
            price.style.paddingRight = "12px";
            price.style.display = "table-cell";
            price.style.width = "80%";

            price.appendChild(document.createTextNode(data.Price));
            item.appendChild(price);
        }

        itemTable.appendChild(item);
        sectionContent.appendChild(itemTable);

        if (showDescription) {
            var itemDescription = document.createElement("div");
            itemDescription.classList.add("container");
            itemDescription.style.paddingTop = "0px";
            itemDescription.style.paddingLeft = "0px";
            itemDescription.style.paddingRight = "0px";
            itemDescription.style.margin = "0px";

            var description = document.createElement("p");
            description.style.textAlign = "left";
            description.style.paddingLeft = "12px";
            description.style.paddingRight = "12px";
            description.style.fontSize = "0.9rem";

            description.appendChild(document.createTextNode(id.Description));
            itemDescription.appendChild(description);
            sectionContent.appendChild(itemDescription);
        }

        section.appendChild(sectionContent);
    });

    section.appendChild(document.createElement("br"));
}

function constructElements(todaysspecial, recommended, categories) {
    applyTheme();
    updateRestaurantName();

    if (todaysspecial.length > 0)
        createMenu("TodaysSpecial", todaysspecial);

    if (recommended.length > 0)
        createMenu("Recommended", recommended);

    categories.forEach(data => {
        createMenu(data.Name, data.Food);
    })

    isLoading = false;
    updateOrientation();
    adjustToScreenRes();
}

function init() {
    applyOrientation();
    var pathToJSON = "/restaurant.json?id=" + restaurantId;
    loadJSON(pathToJSON,
        function (data) {
            isLoading = false;
            restaurantName = data.RestaurantName;
            themeId = data.ThemeId;
            showDescription = data.ShowDescription;
            constructElements(data.TodaysSpecial, data.Recommended, data.Categories);

        },
        function (xhr) {
            console.error(xhr);
            document.getElementById("loadingText").innerHTML = "This page is not associated with any restaurant.If you want to have your restaurant menu here, contact us on +91-9912581389";
        }
    );
}