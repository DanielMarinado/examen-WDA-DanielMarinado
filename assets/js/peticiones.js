// En constantes por convección uso mayúsculas y no CamelCase
// Fuente: https://es.wikipedia.org/wiki/Convenci%C3%B3n_de_nombres_(programaci%C3%B3n)

const CANT_REGISTROS = 4;
const URI = `https://api.giphy.com/v1/gifs`;
const API_KEY = "8f8g82LMwlCzZ6O4sQDkHcW7O7WalHAx";
const API_TREND_URL  = `${URI}/trending?api_key=${API_KEY}&limit=${CANT_REGISTROS}`;         // BÚSQUEDAS TRENDING
const API_SEARCH_URL = `${URI}/search?api_key=${API_KEY}&limit=${CANT_REGISTROS}`;           // BÚSQUEDAS PERSONALIZADAS

let offsetTrend = 0;
let offsetSearch = 0;
let listadoRecientes = [];
let observer;

const getStorage = () => {
    const elemRecientes = localStorage.getItem('elemRecientes');
    return JSON.parse(elemRecientes);
}

const setStorage = (word) => {
    listadoRecientes = getStorage() ? getStorage() : [];

    if(listadoRecientes.length>2) listadoRecientes.shift();

    listadoRecientes.push(word);
    toastOkMsg(`Se ha añadido al localStorage: ${word}`);
    localStorage.setItem('elemRecientes', JSON.stringify(listadoRecientes));
}

const handleSubmit = (e) => {
    e.preventDefault();
    search();
}

const validateForm = () => {
    const input = document.querySelector("#input");

    if( input.value.trim() === '' ){
        input.focus();
        toastErrMsg(`Error, debe ingresar al menos un carácter distinto de vacio o nulo.`);
        return false;
    }
}

const printCard = (gif) => {
    const wrapper = document.createElement("div");
    wrapper.className = "card";
    const content = document.createElement("p");
    content.className = "tituloCard";
    content.innerText = gif.title;
    const wrapperImg = document.createElement("img");
    wrapperImg.src = gif.images.original.webp;

    wrapper.appendChild(wrapperImg);
    wrapper.appendChild(content);
    document.querySelector(".results").appendChild(wrapper);
};

const getGif = async (url) => {
    const respuesta = await fetch(url);
    const gifs = await respuesta.json();
    return gifs;
};

const search = () => {
    const input = document.querySelector("#input");
    const word = input.value;

    if( validateForm() === false ) return;

    clearGifs();
    cantResult = loadApi(API_SEARCH_URL + `&q="${word}"`);
    setStorage(word);
    loadRecientes();
    observer.unobserve(document.querySelector(".more"));
    observer = initInfiniteScrollSearch(word);
    input.value = "";
}

const searchHistory = (word) => {
    clearGifs();
    loadApi(API_SEARCH_URL + `&q="${word}"`);
}

const trendInfiniteScroll = () => {
    offsetTrend += CANT_REGISTROS;
    loadApi(API_TREND_URL + `&offset=${offsetTrend}`);
}
const searchInfiniteScroll = (word) => {
    offsetSearch += CANT_REGISTROS;
    loadApi(API_SEARCH_URL + `&q="${word}"&offset=${offsetSearch}`);
}

const clearGifs = () => {
    document.querySelector(".results").innerHTML = "";
}

const loadApi = async (url) => {
    const wrapperEmptyCards = document.querySelector('#emptyCards');
    const gifs = await getGif(url);

    if(gifs.data.length===0){
        wrapperEmptyCards.style.display = "block";
        toastWarnMsg(`No se han encontrado resultados.`);
    }else {
        wrapperEmptyCards.style.display = "none";
    }

    for (let gif of gifs.data)
        printCard(gif);
};

const loadRecientes = () => {
    listadoRecientes = getStorage() ? getStorage() : [];
    printRecents();
}

const printRecents = () => {
    const wrapperEmptyRecientes = document.querySelector('#emptyRecientesErr');
    const wrapperListaRec = document.querySelector('#listaRecientes');

    (listadoRecientes.length === 0) 
        ? wrapperEmptyRecientes.style.display = "block"
        : wrapperEmptyRecientes.style.display = "none";

    wrapperListaRec.innerHTML = "";

    for (let element of listadoRecientes){
        const wrapper = document.createElement("li");
        wrapper.className = "wrapperReciente";
        const content = document.createElement("a");
        content.className = "linkReciente";
        content.innerText = element;
        content.addEventListener('click', () => searchHistory(element));
       
        wrapper.appendChild(content);
        wrapperListaRec.appendChild(wrapper);
    }
}

const initApp = () => {
    const formulario = document.querySelector('#frmSearch');
    const button = document.querySelector('#btnBuscar');
    formulario.addEventListener('submit', handleSubmit)
    button.addEventListener('click', search);
}

const toastOkMsg = (word) => {
    Toastify({
        text: word,
        duration: 4000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
}

const toastErrMsg = (msg) => {
    Toastify({
        text: msg,
        duration: 2000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true,
        style: {
          background: "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)"
        }
    }).showToast();
}

const toastWarnMsg = (msg) => {
    Toastify({
        text: msg,
        duration: 4000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true,
        style: {
          background: "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(253,85,29,1) 48%, rgba(252,176,69,1) 100%)"
        }
    }).showToast();
}

const initInfiniteScrollTrend = () => {
    const intersectionObserver = new IntersectionObserver(entries => {
        if (entries[0].intersectionRatio <= 0) return;
        trendInfiniteScroll();
    });
    intersectionObserver.observe(document.querySelector(".more"));
    return intersectionObserver;
}

const initInfiniteScrollSearch = (word) => {
    observer.unobserve(document.querySelector(".more"));
    const intersectionObserver = new IntersectionObserver(entries => {
        if (entries[0].intersectionRatio <= 0) return;
        searchInfiniteScroll(word);
    });
    intersectionObserver.observe(document.querySelector(".more"));
    return intersectionObserver;
}

initApp();
loadApi(API_TREND_URL);
loadRecientes();
observer = initInfiniteScrollTrend();