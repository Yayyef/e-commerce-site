// Fonction usine pour la création d'objets. Les itérations contiennent une méthode pour la gestion de leur stack et quantité dans le panier
const ItemFactory = (reference, category, name, price,  image, stock = 5, description = `${category} de qualité!`, quantity = 0) => {
    const getReference = () => reference;
    const getCategory = () => category;
    const getName = () => name;
    const getPrice = () => price;
    const getImage = () => image;
    const getStock = () => stock;
    const getDescription = () => description;
    const getQuantity = () => quantity;
    const changeQuantity = (operator) => {
        switch (operator) {
            case ("+"):
                if (stock <= 0) return dom.displayFlash(`Il n'y a plus de ${name}! Choisissez un autre produit.`);
                quantity += 1;
                stock -= 1;
                dom.displayFlash(`Vous avez ${quantity} ${name}(s) dans votre panier. Il reste ${stock} ${name}(s) en stock.`);
                break;
            case ("-"):
                if (quantity <= 0) return dom.displayFlash(`Votre panier ne contient pas cet article.`);
                quantity -= 1;
                stock += 1;
                dom.displayFlash(`Vous avez ${quantity} ${name}(s) dans votre panier. Il reste ${stock} ${name}(s) en stock.`);
                break;
        }
    }

    return {
        changeQuantity,
        getReference,
        getCategory,
        getName,
        getPrice,
        getImage,
        getDescription,
        getStock,
        getQuantity
    }
}

// Les trois tableaux
const items = [
    ItemFactory("1-1", "Légumes", "Tomate", 2.99, "img/tomates.jpg", 2, "Tomates du verger du voisin."),
    ItemFactory("1-2", "Légumes", "Concombre", 0.99, "img/concombre.jpg"),
    ItemFactory("1-3", "Légumes", "Panet", 1.99, "img/panet.jpg"),
    ItemFactory("1-4", "Légumes", "Fenouil", 0.99, "img/fenouil.jpg"),

    ItemFactory("2-1", "Fruits", "Abricot", 4.50, "img/abricots.jpg", 20),
    ItemFactory("2-2", "Fruits", "Pommes", 2, "img/pommes.jpg", 20),
    ItemFactory("2-3", "Fruits", "Clémentines", 4, "img/clementines.jpg", 20),

    ItemFactory("3-1", "Légumineuses", "Pois Chiche", 1.20, "img/pois-chiches.jpg", 15),
    ItemFactory("3-2", "Légumineuses", "Lentilles", 3.30, "img/lentilles-vertes.jpg", 15),

    ItemFactory("4-1", "Produits Laitiers", "Lait Bouteille", 4.50, "img/lait.jpg", 6),
    ItemFactory("4-2", "Produits Laitiers", "Fromage de chèvre", 4.99, "img/chèvre.jpg", 5),

    ItemFactory("5-1", "Viande", "Cuisses de Poulet", 11.99, "img/cuisse-poulet.jpg", 7),
    ItemFactory("5-2", "Viande", "Côte de boeuf", 16.99, "img/cote-de-boeuf.jpg", 3),
    ItemFactory("5-3", "Viande", "Poitrine de porc", 8.99, "img/poitrine-de-porc.jpg", 5),
    ItemFactory("5-4", "Viande", "Oeufs", 3.99, "img/oeufs.jpg", 5),

];
const categoryItems = [];
const cartItems = [];

// Un module contenant toutes les fonctions relative à la manipulation des données
const data = (() => {
    
    // 
    const referenceMatch = (item, reference) => {
        return item.getReference() === reference;
    }

    const cleanCart = () => {
        for (item = 0; item < cartItems.length; item++) {
            if (cartItems[item].getQuantity() === 0) cartItems.splice(item, 1)
        }
    }

    const generateCategoryItemsArray = (category) => {
        // Je vide le tableau
        categoryItems.length = 0;
        items.forEach(item => {
            if (item.getCategory() !== category) return;
            categoryItems.push(item);
        });
    }
    
    const pushToCart = (reference, operator) => {
        // On cherche un item dans l'array item par sa référence unique
        const match = items.find(item => referenceMatch(item, reference));
        match.changeQuantity(operator);
        // On retire du tableau les objets dont la quantité est nulle
        cleanCart();

        // On ne push dans le tableau cartItems que si l'article ne s'y trouve pas déjà
        if (cartItems.find(item => referenceMatch(item, reference)) || operator === "-") return;
        cartItems.push(match);
        
    }

    // Calcule le prix total
    const totalPrice = () => {
        let total = 0;
        cartItems.forEach(item => {
            console.log(item.getQuantity(), item.getPrice());
            total += (item.getQuantity() * item.getPrice());
            total.toFixed(2);
            console.log(total);
        })
        return total;
    }

    return {
        generateCategoryItemsArray,
        pushToCart,
        totalPrice
    }
})();



// Un module pour tout ce qui concerne la manipulation du dom
const dom = (() => {

    const displayTotal = () => {
        document.querySelector("#totalPriceRow").textContent = data.totalPrice();
    }

    const itemsCounter = () => {
        return document.querySelector("#itemsCounter").textContent = cartItems.length;
    }    

    const clearFlash = () => {
        document.querySelector("#flashMessage").innerHTML = "";
    }

    // Gère l'affichage des messages flash
    const displayFlash = (flashContent, color) => {
        document.querySelector("#flashMessage").innerHTML = `
                <div class="alert alert-primary mt-4" role="alert" style="position: fixed; z-index: 2; right: 0;">
                    ${flashContent}
                </div>`
        window.setTimeout(clearFlash, 2000);
    }

    const buildItems = (itemsArray, category) => {
        // Si on entre une catégorie comme argument, on remplit d'abord le tableau catégories avant de le représenter dans le DOM
        if (category) {
            data.generateCategoryItemsArray(category)
        };
        const cardsContainer = document.querySelector("#cardsContainer");
        cardsContainer.innerHTML = "";
        itemsArray.forEach(item => {
            cardsContainer.innerHTML += `
                <div class="card col-sm-6 col-md-4 col-xl-3 mb-2">
                    <img src="${item.getImage()}" class="card-img-top"alt="${item.getName()}">
                    <div class="card-body">
                      <div class="row">
                        <h5 class="card-title col-10">${item.getName()}</h5><p class="badge bg-secondary col-2">${item.getPrice()}€</p>
                      </div>
                      <p class="card-text">${item.getCategory()}</p>
                      <p class="card-text"${item.getDescription()}</p>
                      <div class="d-flex justify-content-between">
                        <div class="badge bg-secondary">Qté: ${item.getStock()}</div>
                        <div class="btn-group" role="group" aria-label="Ajouter au panier, moins, plus">
                          <button type="button" class="btn btn-warning" id="item" data-reference="${item.getReference()}" data-operator="-">-</button>
                          <button type="button" class="btn btn-warning" id="item" data-reference="${item.getReference()}" data-operator="+">+</button>
                        </div>
                      </div>
                    </div>
                </div>
                `
        });
    }
    const buildCart = () => {
        const cartContent = document.querySelector("#cartContent");
        cartContent.innerHTML = "";
        cartItems.forEach(item => {
            cartContent.innerHTML += `
            <div class="row gy-5">
                <div class="col-2"><img src="${item.getImage()}" class="d-block w-100" style="background-position: cen;"
                    alt="Image ${item.getName()}" id="${item.getCategory()}"></div>
                <div class="col-2">${item.getName()}</div>
                <div class="col-2">${item.getQuantity()}</div>
                <div class="col-2">${item.getStock()}</div>
                <div class="col-2">${item.getPrice()}</div>
      
                <div class="btn-group col-2" role="group" aria-label="Ajouter au panier, moins, plus">
                  <button type="button" class="btn btn-warning" id="item" data-reference="${item.getReference()}" data-operator="-">-</button>
                  <button type="button" class="btn btn-warning" id="item" data-reference="${item.getReference()}" data-operator="+">+</button>
                </div>
            </div>    
            `
        })
        displayTotal();
    }
 
    return {
        buildItems,
        buildCart,
        itemsCounter,
        displayFlash
    }
})();

// Un module contenant tous les event listeners
const listeners = (() => {
    document.addEventListener('click', (e) => {
        switch (e.target.id) {
            case "Légumes":
                dom.buildItems(categoryItems, "Légumes");
                break;
            case "Fruits":
                dom.buildItems(categoryItems, "Fruits");
                break;
            case "Légumineuses":
                dom.buildItems(categoryItems, "Légumineuses");
                break;
            case "Produits Laitiers":
                dom.buildItems(categoryItems, "Produits Laitiers");
                break;
            case "Boucherie":
                dom.buildItems(categoryItems, "Boucherie");
                break;
            case "item":
                data.pushToCart(e.target.attributes["data-reference"].value, e.target.attributes["data-operator"].value);
                dom.itemsCounter();
                dom.buildCart();
                break;
            case "cart":
                dom.buildCart();
                break;
        }
    })
    document.addEventListener("onload", dom.buildItems(items));

})();


