var searchBoxHandler = (function (windowScope) {

    var cardList = [];

    function getSearchResult(query) {
        var xmlhttp = new XMLHttpRequest(),
            url = "https://api.github.com/users/" + query;
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var result = JSON.parse(xmlhttp.responseText);
                generateTemplate(result);
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();

    }


    function searchClicked() {
        var searchDom = document.getElementById("_searchBox");
        getSearchResult(searchDom.value);
    }

    function generateTemplate(data) {

        var compiled = windowScope.Handlebars.compile(document.getElementById("template").innerHTML),
        cardNode,
        dom;


        cardNode = new CardNode(data);
        dom = compiled(cardNode);

        cardNode.templateString = dom;
        cardList.push(cardNode);

        document.getElementById("cardsContainer").innerHTML += dom;
    }


    function render() {
        var cardsContainer = document.getElementById("cardsContainer");

        cardsContainer.innerHTML = "";

        cardList.forEach(function (card) {
            cardsContainer.innerHTML += card.templateString;
        });
    }

    function removeCard(id) {
        removeArrayEntry(id);
        render();
    }


    function removeArrayEntry(id) {
        cardList.forEach(function (item, index, object) {
            if (item.id.toString() === id) {
                object.splice(index, 1);
            }
        });
    }

    function sort(target) {

        document.getElementById("sortName").classList.remove("selected");
        document.getElementById("sortFollowers").classList.remove("selected");
        document.getElementById("sortLocation").classList.remove("selected");

        target.classList.add("selected");

        if (target.value === "Name") {
            cardList.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
        } else if (target.value === "Location") {
            cardList.sort(function (a, b) {
                return a.location.localeCompare(b.location);
            });
        } else {
            cardList.sort(function (a, b) {
                return b.followers - a.followers;
            });
        }

        render();
    }


    function CardNode(data) {
        this.name = data.name;
        this.url = data.avatar_url;
        this.location = data.location;
        this.followers = data.followers;
        this.id = cardList.length;
        this.templateString = "";
    }

    return {
        search: searchClicked,
        sort: sort,
        removeCard: removeCard
    };

})(this);