console.clear();

// En constantes por convección uso mayúsculas y no CamelCase
// Fuente: https://es.wikipedia.org/wiki/Convenci%C3%B3n_de_nombres_(programaci%C3%B3n)

const CANT_REGISTROS = 20;
const API_KEY = "8f8g82LMwlCzZ6O4sQDkHcW7O7WalHAx";
const API_TREND_URL = `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=${CANT_REGISTROS}&offset=0`;         // BÚSQUEDAS TRENDING
const API_SEARCH_URL = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&limit=${CANT_REGISTROS}&offset=0`;           // BÚSQUEDAS PERSONALIZADAS

let offset = 0;
let listadoRecientes = [];

const button = document.getElementById('btnBuscar');

const addCard = (gif) => {
    const contenedor = document.createElement("div");
    contenedor.className = "card";
    const contenido = document.createElement("p");
    contenido.className = "tituloCard";
    contenido.innerText = gif.title;
    const contenedorImagen = document.createElement("img");
    contenedorImagen.src = gif.images.original.webp;

    contenedor.appendChild(contenedorImagen);
    contenedor.appendChild(contenido);
    document.querySelector(".results").appendChild(contenedor);
};

const getGif = async (url) => {
    const respuesta = await fetch(url);
    const gifs = await respuesta.json();
    return gifs;
};

const search = () => {
    const palabra = document.getElementById("input").value;
    clear();
    loadApi(API_SEARCH_URL + `&q='${palabra}'`);
}

const searchHistory = (palabra) => {
    console.log(palabra);
    loadApi(API_SEARCH_URL + `&q='${palabra}'`);
}

const clear = () => {
    document.querySelector(".results").innerHTML = "";
}

const loadApi = async (url) => {
    const gifs = await getGif(url);
    console.log(gifs);
    for (let gif of gifs.data)
        addCard(gif);
};

const loadRecientes = () => {
    // Buscar en LocalStorage y add al listado
    const recientes = document.getElementById('listaRecientes');
    const items = recientes.getElementsByTagName("li");
    for (var i = 0; i < items.length; ++i) {
        let palabra = document.getElementById('input').value
        items[i].addEventListener('click', searchHistory);
    }
}

loadApi(API_TREND_URL);
loadRecientes();
button.addEventListener('click', search);