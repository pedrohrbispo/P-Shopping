let totalPrice = 0; // Variável que armazaena o preço total
const round = (num) => {
	if (!("" + num).includes("e")) {
		return +(Math.round(num + "e+" + 2)  + "e-" + 2);
	} else {
		let arr = ("" + num).split("e");
		let sig = ""
		if (+arr[1] + 2 > 0) {
			sig = "+";
		}

		return +(Math.round(+arr[0] + "e" + sig + (+arr[1] )) + "e-" );
	}
}

const verifyifPricesHas2Decimals = (num) => {
    return num = round(num);
} 
const createSectionTotalPriceAssyncAwait = async (atualPrice, signal) => {
  if (signal === '+') {
    totalPrice += atualPrice;
  } else {
    totalPrice -= atualPrice;
  }
  totalPrice = verifyifPricesHas2Decimals(totalPrice);
  try {
    const span = await document.createElement('span');
    span.className = 'total-price';
    span.innerHTML = `Preço Total: R$ ${totalPrice},00`;
    const sectionOl = await document.querySelector('.cart_border');
    sectionOl.appendChild(span);
  } catch (error) {
    window.alert(error);
  }
};
  // Deleta o texto de preço total
const deleteSectionTotalPriceAssyncAeait = async () => {
  try {
    const span = await document.querySelector('.total-price');
    const sectionOl = await document.querySelector('.cart_border');
    sectionOl.removeChild(span);
  } catch (error) {
    window.alert(error);
  }
};
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
const handleWithSearchResults = (object) => {
  object.results.forEach((result) => {
    const infosComput = {};
    infosComput.sku = result.id;
    infosComput.name = result.title;
    infosComput.image = result.thumbnail;
    const section = document.querySelector('.items');
    section.appendChild(createProductItemElement(infosComput));
  });
};

const createLoading = () => {
  const loading = document.createElement('span');
  loading.className = 'loading';
  loading.innerText = 'LOADING';
  loading.style.fontSize = '40px';
  return loading;
};
const deleteLoading = () => {
  const sectionItems = document.querySelector('.items');
  const loading = document.querySelector('.loading');
  sectionItems.removeChild(loading);
};

const fetchComputers = (endpoint) => {
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      if (object.results.length === 0) {
        error = 'Produto não existe';
        throw new Error(error);
      }
      deleteLoading();
      handleWithSearchResults(object);
    })
    .catch((error) => {
      window.alert(error);
    });
};
function createStoreItens(item) {
  if (item === undefined || item === '') {
    item = 'computador';
  }
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(createLoading());
  fetchComputers(endpoint);
}
const removeItemLocalStorage = (id) => {
  const arrayItems = getArrayFromLocalStorage();
  arrayItems.forEach((item, index) => {
    if (item.sku == id) {
      arrayItems.splice(index, 1);
      return false;
    }
  });
  addlocalStorage(arrayItems);
};
const catchPriceById = (id) => {
  const arrayItems = getArrayFromLocalStorage();
  const object = arrayItems.find(element => id === element.sku);
  return object.salePrice;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const ol = document.querySelector('ol');
  const li = document.querySelectorAll('.cart__item');
  let ConditionToRunJustOneTime = false;
  const textOfClickedLi = event.path[0].innerText;
  li.forEach((liItem) => {
    if (liItem.innerText === textOfClickedLi && ConditionToRunJustOneTime === false) {
      let atualPrice = catchPriceById(liItem.id);
      removeItemLocalStorage(liItem.id);
      deleteSectionTotalPriceAssyncAeait();
      createSectionTotalPriceAssyncAwait(atualPrice, '-');
      ol.removeChild(liItem);
      ConditionToRunJustOneTime += true;
    }
  });
}
const getArrayFromLocalStorage = () => {
  if (localStorage.hasOwnProperty("itensLi")) {
    itemsLi = JSON.parse(localStorage.getItem("itensLi"))
    return itemsLi;
  }
  return [];
};

let arrayInfos = getArrayFromLocalStorage();
const addArrayInfos = (infosObject) => {
  arrayInfos = getArrayFromLocalStorage();
  arrayInfos.push(infosObject);
  return arrayInfos;
};
const addlocalStorage = (array) => {
  localStorage.setItem("itensLi", JSON.stringify(array));

};

const fillCartItems = () => {
  const ol = document.querySelector('.cart__items');
  const arrayItems = getArrayFromLocalStorage();
  arrayItems.forEach((element) => {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.id = element.sku;
    li.innerText = `SKU: ${element.sku} | NAME: ${element.name} | PRICE: $${element.salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    totalPrice += element.salePrice;
    ol.appendChild(li);
  });
  const span = document.createElement('span');
  span.className = 'total-price';
  span.innerHTML = `Preço Total: ${totalPrice}`;
  const sectionOl = document.querySelector('.cart_border');
  sectionOl.appendChild(span);
};

function createCartItemElement(infosItem) {
  const arrayItems = getArrayFromLocalStorage();
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.id = infosItem.sku;
    li.innerText = `SKU: ${infosItem.sku} | NAME: ${infosItem.name} | PRICE: $${infosItem.salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    deleteSectionTotalPriceAssyncAeait();
    createSectionTotalPriceAssyncAwait(infosItem.salePrice, '+');
    return li;
}
const handleWithSearchId = (object) => {
  const ol = document.querySelector('.cart__items');
  const infosItem = {};
  infosItem.sku = object.id;
  infosItem.name = object.title;
  infosItem.salePrice = object.price;
  addlocalStorage(addArrayInfos(infosItem));
  ol.appendChild(createCartItemElement(infosItem));
};

const fetchItemById = (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      if (object.error) {
        throw new Error(object.error);
      }
      handleWithSearchId(object);
    })
  .catch((error) => {
    window.alert(error);
  });
};
const deleteSectionItems = () => {
  const items = document.querySelectorAll('.item');
  const section = document.querySelector('.items');
  items.forEach((item) => {
    section.removeChild(item);
  });
};

window.onload = function onload() {
  // Chamada de funções e recuperação de variáveis
  createStoreItens();
  const sectionOfItensStore = document.querySelector('.items');
  sectionOfItensStore.addEventListener('click', (event) => {
    if (event.target.className === 'item__add'){
    const itemId = event.path[1].childNodes[0].innerText;
    fetchItemById(itemId);
    }
  });
  const buttonCleanCart = document.querySelector('.empty-cart');
  buttonCleanCart.addEventListener('click', () => {
    const allCartLi = document.querySelectorAll('.cart__item');
    const ol = document.querySelector('.cart__items');
    allCartLi.forEach((li) => {
      ol.removeChild(li);
    });
    localStorage.clear();
    totalPrice = 0;
    deleteSectionTotalPriceAssyncAeait();
    createSectionTotalPriceAssyncAwait(0);
  });
  const searchButton = document.querySelector('#search-button');
  searchButton.addEventListener('click', () => {
    deleteSectionItems();
    const itemSearched = document.querySelector('#search-input').value;
    createStoreItens(itemSearched);
  });
  fillCartItems();
};
