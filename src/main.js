//constante para usar axios//
const api = axios.create({
    //ingresamos la url de la api que nunca cambia//
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },  
    params: {
        'api_key': API_KEY,
    }
}); 

//trae las peliculas favoritas que estan en el localstorage//
function likedMovieList(){
    //transforma la informacion de localStorage en un string y la mete a una variable//
    const item = JSON.parse( localStorage.getItem('liked_movies'));
    let movies;
    if(item){
        movies = item;
    }else{
        movies = {};
    }
    return movies;
}
//Guarda las peliculas que nos gustan//
function likeMovie(movie) {
    //mete en una variable la lista de peliculas favoritas//
    const likedMovies = likedMovieList();
    console.log(likedMovies);
    //si la pelicula que le dimos like ya esta en la lista de favoritos la elimina de la lista sino la agrega//
    if (likedMovies[movie.id]){
        //elimina de la lista la pelicula
        likedMovies[movie.id] = undefined;        
    }else {
        //guarda la informacion de la pelicula en la lista de favoritos//
        likedMovies[movie.id] = movie;        
    }
    //actualiza la lista de favoritos en formato string//
    localStorage.setItem('liked_movies',JSON.stringify(likedMovies));
}
//funciones que reutilizan codigo//
//carga solo las cosas que se ven en pantalla//
//el obsevador se usara en todo el html por lo cual no se le agrega el atributo options//
//entries son los elementos del htmo que estamos observando//
const lazyLoader = new IntersectionObserver((entries)=>{
    //recibe cada elemento observado en el intersection//
    entries.forEach((entry)=>{
        //si la entrada se esta viendo carga el src de la imagen, sino no la carga//
        if(entry.isIntersecting){
        //mete en una variable el atributo 'data-img' que contiene el src de las imagenes de las peliculas//
        const url = entry.target.getAttribute('data-img');
        //pone la url de las imagenes en src de las moviesImg//
        entry.target.setAttribute('src', url)
        }
    })
});

//container sera donde se insertara la pelicula/
function createMovies(movies,container, 
    //como envia varias propiedades true o false las encierra en un objeto para que sea mas comodo visualmente//
    {lazyLoad = true, clean = true}= {}){
    //si clean esta activo limpia el html sino no//
    if(clean){
        //limpia la seccion//
    container.innerHTML= ' ';
    }
    
    movies.forEach(movie => {
        //por cada pelicula crea un div//
        const movieContainer = document.createElement('div');
        //agrega css al div creado//
        movieContainer.classList.add('movie-container');
        //por cada pelicula crea una imagen en el html//
        const movieImg = document.createElement('img');
        //agrega css al img creado//
        movieImg.classList.add('movie-img');
        //modifica el texto alternativo de la imagen//
        movieImg.setAttribute('alt',movie.title);
        //modifica el src de la imagen y le pone la que trae la pelicula con un width de 300//
        movieImg.setAttribute(
            //si lazyloader es true agrega los valores en data-img, sino lo agrega directamente al src//
            lazyLoad ? 'data-img' : 'src',
            'https://image.tmdb.org/t/p/w300/' + movie.poster_path);
        //cuando se le haga click a la pelicula te redigira a la pagina de la pelicula//
        movieImg.addEventListener('click',() => {
            //cambia el hash por el id de la pelicula elegida//
            location.hash = '#movie=' + movie.id;
        });    
         //verifica si hay un error cuando carga la imagen de la pelicula//
         movieImg.addEventListener('error',()=>{
            //reemplaza la imagen que no cargo por una imagen predefinida//
            movieImg.setAttribute('src','https://static.platzi.com/static/images/error/img404.png');
         });  
         //creara un boton por cada imagen//
         const movieBtn =document.createElement('button');  
         //le agrega una clase al boton//
         movieBtn.classList.add('movie-btn');
         //si likedMovieList ya tiene el id de esta pelicula le agrega a su boton la clase de liked//
         likedMovieList()[movie.id] && movieBtn.classList.add ('movie-btn--liked');
         //al hacer clic en el boton cambia de color y manda la pelicula a favoritos//
         movieBtn.addEventListener('click', ()=>{
            //le agregara una clase al boton dependiendo si le hicieron click o no//
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
         });
        //si lazyLoader es true solo cargará las imagenes que se vean//
        if(lazyLoad){
        //le decimos que observe al metodo movieImg//
        lazyLoader.observe(movieImg);}
        //mete todos los atributos de movieImg dentro de movieContainer//
        movieContainer.appendChild(movieImg);
          //mete el movieBtn en el movieContainer//
          movieContainer.appendChild(movieBtn);
        //mete los atributos de movieContainer dentro de la clase trendingPreview-movieList//
        container.appendChild(movieContainer);
      
})
}

function createCategories(categories, container){
    container.innerHTML= ' ';
    categories.forEach(category => {
        //por cada categoria crea un div//
        const categoryContainer = document.createElement('div');
        //agrega css al div creado//
        categoryContainer.classList.add('category-container');
        //por cada categoria crea un subtitulo en el html//
        const categoryTitle = document.createElement('h3');
        //cuando se hace click en la categoria nos mande a la vista de la categoria con ese id//
        categoryTitle.addEventListener('click', () => {
            location.hash = '#category=' + category.id + '-' + category.name;
        });
        //agrega css al h3 creado//
        categoryTitle.classList.add('category-title');
        //le da un color a la categoria dependiendo del id//
        categoryTitle.setAttribute('id', 'id' + category.id);
        //agrega un texto en el html//
        const categoryTitleText = document.createTextNode(category.name);
        //mete el texto de categoryTitleText dentro del h3//
        categoryTitle.appendChild(categoryTitleText);
        //mete en el div el h3//
        categoryContainer.appendChild(categoryTitle);
        //mete los atributos del div dentro de la clase categoriesPreview-list//
        container.appendChild(categoryContainer);
    });
}

//llamados a la API//
//muestra una preview de las peliculas en tendencia//
async function getTrendingMoviesPreview () {
    //nos conectamos con la seccion tendencias de peliculas de cada dia de API//
    const res = await fetch ('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY);
    //transforma la informacion que nos trae la api en formato json//
    //data nos dara un array de objetos con distintas caracteristicas//
    const data = await res.json();
    //ingresamos el objeto results que contiene objetos con peliculas, en una variable//
    const movies = data.results;
     //selecciona al elemento html que tenga dentro de trendingPreview la clase trendingPreview-movieList
     const trendingPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList');
    //borra el contenido antes de cargar nuevamente los datos//
    trendingPreviewMoviesContainer.innerHTML = '';
    //a cada pelicula le dara un formato html//
    movies.forEach(movie => {
        //por cada pelicula crea un div//
        const movieContainer = document.createElement('div');
        //agrega css al div creado//
        movieContainer.classList.add('movie-container');
        //por cada pelicula crea una imagen en el html//
        const movieImg = document.createElement('img');
        //agrega css al img creado//
        movieImg.classList.add('movie-img');
        //modifica el texto alternativo de la imagen//
        movieImg.setAttribute('alt',movie.title);
        //modifica el src de la imagen y le pone la que trae la pelicula con un width de 300//
        movieImg.setAttribute('src','https://image.tmdb.org/t/p/w300/' + movie.poster_path);
        //mete todos los atributos de movieImg dentro de movieContainer//
        movieContainer.appendChild(movieImg);
        //mete los atributos de movieContainer dentro de la clase trendingPreview-movieList//
        trendingPreviewMoviesContainer.appendChild(movieContainer);
           //cuando se le haga click a la pelicula te redigira a la pagina de la pelicula//
           movieContainer.addEventListener('click',() => {
            //cambia el hash por el id de la pelicula elegida//
            location.hash = '#movie=' + movie.id;
        });
    });
    
}

//muestra las peliculas por categorias en tendencia//
async function getCategoriesPreview () {
    //nos conectamos con la seccion categorias de peliculas de la API//
    //const res = await fetch ('https://api.themoviedb.org/3/genre/movie/list?api_key=' + API_KEY);
    //al conectarse a la api usando axios no necesitamos el direccion raiz de la api y la api key porque ya la pusimos en axios//
    const {data} = await api ('genre/movie/list');
    //transforma la informacion que nos trae la api en formato json//
    //data nos dara un array de objetos con distintas caracteristicas//
    //const data = await res.json();
    //axios nos devuelve la respuesta de la api parseada entonces no necesitamos usar res.json();
    //ingresamos el objeto genres que contiene objetos con cantegorias, en una variable//
    const categories = data.genres;
    //selecciona al elemento html que tenga dentro de categoriesPreview la clase categoriesPreview-list
    const PreviewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list');
    //borra el contenido antes de cargar nuevamente los datos//
    PreviewCategoriesContainer.innerHTML = ' ',
    //a cada categoria le dara un formato html//
    categories.forEach(category => {
        //por cada categoria crea un div//
        const categoryContainer = document.createElement('div');
        //agrega css al div creado//
        categoryContainer.classList.add('category-container');
        //por cada categoria crea un subtitulo en el html//
        const categoryTitle = document.createElement('h3');
        //cuando se hace click en la categoria nos mande a la vista de la categoria con ese id//
        categoryTitle.addEventListener('click', () => {
            location.hash = '#category=' + category.id + '-' + category.name;
        });
        //agrega css al h3 creado//
        categoryTitle.classList.add('category-title');
        //le da un color a la categoria dependiendo del id//
        categoryTitle.setAttribute('id', 'id' + category.id);
        //agrega un texto en el html//
        const categoryTitleText = document.createTextNode(category.name);
        //mete el texto de categoryTitleText dentro del h3//
        categoryTitle.appendChild(categoryTitleText);
        //mete en el div el h3//
        categoryContainer.appendChild(categoryTitle);
        //mete los atributos del div dentro de la clase categoriesPreview-list//
        PreviewCategoriesContainer.appendChild(categoryContainer);
    });
}

//muestra las peliculas de cada categoria//
async function getMoviesByCategory (id) {
    //nos conectamos con la seccion categorias de peliculas de la API//
    //const res = await fetch ('https://api.themoviedb.org/3/genre/movie/list?api_key=' + API_KEY);
    //al conectarse a la api usando axios no necesitamos el direccion raiz de la api y la api key porque ya la pusimos en axios//
    const {data} = await api ('discover/movie', {
        params: {
            //envia el id del genero que queremos que nos traiga//
            with_genres: id,
        },  
    });
    //transforma la informacion que nos trae la api en formato json//
    //data nos dara un array de objetos con distintas caracteristicas//
    //const data = await res.json();
    //axios nos devuelve la respuesta de la api parseada entonces no necesitamos usar res.json();
    //ingresamos el objeto resultados que contiene objetos con peliculas , en una variable//
    const movies = data.results;
    maxPage = data.total_pages;
    //borra el contenido antes de cargar nuevamente los datos//
    genericSection.innerHTML = ' ',
    //a cada categoria le dara un formato html//
    movies.forEach(movie => {
        //por cada pelicula crea un div//
        const movieContainer = document.createElement('div');
        //agrega css al div creado//
        movieContainer.classList.add('movie-container');
        //por cada pelicula crea una imagen en el html//
        const movieImg = document.createElement('img');
        //agrega css al img creado//
        movieImg.classList.add('movie-img');
        //modifica el texto alternativo de la imagen//
        movieImg.setAttribute('alt',movie.title);
        //modifica el src de la imagen y le pone la que trae la pelicula con un width de 300//
        movieImg.setAttribute('src','https://image.tmdb.org/t/p/w300/' + movie.poster_path);
        //mete todos los atributos de movieImg dentro de movieContainer//
        movieContainer.appendChild(movieImg);
        //mete los atributos de movieContainer dentro de la clase genericSection//
        genericSection.appendChild(movieContainer);
           //cuando se le haga click a la pelicula te redigira a la pagina de la pelicula//
           movieContainer.addEventListener('click',() => {
            //cambia el hash por el id de la pelicula elegida//
            location.hash = '#movie=' + movie.id;
        });
    });
}
//muestra mas peliculas de la categoria usando infinitescroll//
//al recibir una variable hay que sacarle el async para que funcione//
//llama y ejecuta la funcion//
function getPaginatedMoviesByCategory(id){
    //esta funcion asincrona aun no se ejecuta//
    return async function (){
    //toma el scrollTop, scrollHeight y el clienteHeight de la pagina//
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    //dara true si el scroll esta cerca del final//
    const scrollIsBottom = (scrollTop+clientHeight)>= (scrollHeight -15);
    //pageIsNotMax es true si las paginas cargadas son menores que las paginas que tiene la api//
    const pageIsNotMax = page < maxPage;
    //valida si el scroll llega a cierto lugar o no y si aun quedan paginas para traer de la API//
    if(scrollIsBottom && pageIsNotMax){
         //cada vez que se busquen mas paginas sumara uno a la pagina que traera la api//
    page++;
       //al conectarse a la api usando axios no necesitamos el direccion raiz de la api y la api key porque ya la pusimos en axios//
       const {data} = await api ('discover/movie', {
        params: {
            //envia la palabra que queremos que nos busque y traiga//
            with_genres: id,
            page,
        }  
    });
    //ingresamos el objeto results que contiene objetos con peliculas, en una variable//
    const movies = data.results;
    //tomara las peliculas trending, les dara formato html y las mostrara en genericSection//
    createMovies(movies,genericSection, {lazyLoad: true, clean: false});
    }
}
 }

//muestra las peliculas filtradas en el buscador//
async function getMoviesBySearch (query) {
    //nos conectamos con la seccion categorias de peliculas de la API//
    //const res = await fetch ('https://api.themoviedb.org/3/genre/movie/list?api_key=' + API_KEY);
    //al conectarse a la api usando axios no necesitamos el direccion raiz de la api y la api key porque ya la pusimos en axios//
    const {data} = await api ('search/movie', {
        params: {
            //envia la palabra que queremos que nos busque y traiga//
            query,
        }  
    });
    //ingresamos el objeto resultados que contiene objetos con peliculas , en una variable//
    const movies = data.results;
    maxPage = data.total_pages;
    //tomara las peliculas de la busqueda, les dara formato html y las mostrara en genericSection//
    createMovies(movies,genericSection);
}

//muestra las peliculas en tendencia//
async function getTrendingMovies () {
    //nos conectamos con la seccion tendencias de peliculas de cada dia de API//
    const res = await fetch ('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY);
    //transforma la informacion que nos trae la api en formato json//
    //data nos dara un array de objetos con distintas caracteristicas//
    const data = await res.json();
    //ingresamos el objeto results que contiene objetos con peliculas, en una variable//
    const movies = data.results;
    //ingresamos la cantidad maxima de paginas trending//
    maxPage = data.total_pages;
    //tomara las peliculas trending, les dara formato html y las mostrara en genericSection//
    createMovies(movies,genericSection);
    //crea un boton en el html si se usa paginacion//
   // const btnLoadMore = document.createElement('button');
    //pone un texto en el boton//
    //btnLoadMore.innerText ='cargar más';
    //cada vez que se haga click llamara a una funcion para que cargue mas peliculas
    //btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    //inserta el boton en la seccion //
    //genericSection.appendChild(btnLoadMore);
    };

//muestra mas peliculas de la busqueda usando infinitescroll//
//al recibir una variable hay que sacarle el async para que funcione//
//llama y ejecuta la funcion//
 function getPaginatedMoviesBySearch(query){
    //esta funcion asincrona aun no se ejecuta//
    return async function (){
    //toma el scrollTop, scrollHeight y el clienteHeight de la pagina//
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    //dara true si el scroll esta cerca del final//
    const scrollIsBottom = (scrollTop+clientHeight)>= (scrollHeight -15);
    //pageIsNotMax es true si las paginas cargadas son menores que las paginas que tiene la api//
    const pageIsNotMax = page < maxPage;
    //valida si el scroll llega a cierto lugar o no y si aun quedan paginas para traer de la API//
    if(scrollIsBottom && pageIsNotMax){
         //cada vez que se busquen mas paginas sumara uno a la pagina que traera la api//
    page++;
       //al conectarse a la api usando axios no necesitamos el direccion raiz de la api y la api key porque ya la pusimos en axios//
       const {data} = await api ('search/movie', {
        params: {
            //envia la palabra que queremos que nos busque y traiga//
            query,
            page,
        }  
    });
    //ingresamos el objeto results que contiene objetos con peliculas, en una variable//
    const movies = data.results;
    //tomara las peliculas trending, les dara formato html y las mostrara en genericSection//
    createMovies(movies,genericSection, {lazyLoad: true, clean: false});
    }
}
 }
//muestra mas peliculas de la lista usando infinitescroll//
async function getPaginatedTrendingMovies(){
    //toma el scrollTop, scrollHeight y el clienteHeight de la pagina//
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    //dara true si el scroll esta cerca del final//
    const scrollIsBottom = (scrollTop+clientHeight)>= (scrollHeight -15);
    //pageIsNotMax es true si las paginas cargadas son menores que las paginas que tiene la api//
    const pageIsNotMax = page < maxPage;
    //valida si el scroll llega a cierto lugar o no y si aun quedan paginas para traer de la API//
    if(scrollIsBottom && pageIsNotMax){
         //cada vez que se busquen mas paginas sumara uno a la pagina que traera la api//
    page++;
    //nos conectamos con la seccion tendencias de peliculas de cada dia de API//
    const {data} = await api ('trending/movie/day', {
       params : {
           page,
       }
    });
    //ingresamos el objeto results que contiene objetos con peliculas, en una variable//
    const movies = data.results;
    //tomara las peliculas trending, les dara formato html y las mostrara en genericSection//
    createMovies(movies,genericSection, {lazyLoad: true, clean: false});
    }
    //esta parte serviria para hacer un boton si se usara paginacion//
    // const btnLoadMore = document.createElement('button');
     //pone un texto en el boton//
    // btnLoadMore.innerText ='cargar más';
     //cada vez que se haga click llamara a una funcion para que cargue mas peliculas
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
     //inserta el boton en la seccion //
    // genericSection.appendChild(btnLoadMore);
}

//muestra los detalles de una pelicula//
async function getMovieById(id) {
    //nos conectamos con la seccion categorias de peliculas de la API//
    //const res = await fetch ('https://api.themoviedb.org/3/genre/movie/list?api_key=' + API_KEY);
    //al conectarse a la api usando axios no necesitamos el direccion raiz de la api y la api key porque ya la pusimos en axios//
   //axios nos dara un objeto llamado data y con {data:movie} renombramos el objeto data con el nombre movie//
    const {data:movie} = await api ('movie/'+ id);
    //guarda la url de la pelicula en un width de 500//
    const movieImgUrl = 'https://image.tmdb.org/t/p/w500/' + movie.poster_path;
    //modifica el css para agregar de fondo la imagen de la pelicula//
    //linear-gradient solo modifica el color de la flecha para que se vea mejor//
    headerSection.style.background = `linear-gradient(
        180deg, 
        rgba(0, 0, 0, 0.35) 19.27%, 
        rgba(0, 0, 0, 0) 29.17%
    ) , url(${movieImgUrl})`
    //agrega el titulo de la pelicula en el html//
    movieDetailTitle.textContent = movie.title;
    //agrega la descripcion de la pelicula en el html//
    movieDetailDescription.textContent = movie.overview;
    //agrega la puntuacion de la pelicula en el html//
    movieDetailScore.textContent = movie.vote_average;
    //muestra las categorias de la pelicula en el html//
    createCategories(movie.genres, movieDetailCategoriesList);
    getRelatedMoviesById(id)
}

async function getRelatedMoviesById(id){
    const {data} = await api (`movie/${id}/recommendations`);
    const relatedMovies = data.results;
    createMovies(relatedMovies,relatedMoviesContainer);
};

//muestra las peliculas favoritas//
function getLikedMovies (){
    //mete la lista de peliculas favoritas en una variable//
    const likedMovies = likedMovieList();
    //Object.values nos permite crear un array con todos los valores de un objeto//
    const moviesArray = Object.values(likedMovies);
    createMovies(moviesArray, likedMovieListArticle, {lazyLoad: true, clean: true} );
    console.log(likedMovies)
}

getTrendingMoviesPreview();
getCategoriesPreview();