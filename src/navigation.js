//la cantidad maxima de paginas que tiene la api para cada seccion//
let maxPage ;
//el parametro de pagina que le vamos a pasar a la api
let page =1;
//cambiara su valor dependiendo el hash de la pagina que lo use
let infiniteScroll;
//llamara las funciones de main.js solo cuando se necesiten//
//cuando se haga clic en el boton search cambiara el hash para ir mostrar lo que hay en search//
searchFormBtn.addEventListener('click',()=>{
    //agarra el valor que busquemos en el buscador//
    location.hash ='#search=' +  searchFormInput.value;
});
//cuando se haga clic en el ver mas  cambiara el hash para ir mostrar lo que hay en trending//
trendingBtn.addEventListener('click',()=>{
    location.hash ='#trends';
});
//cuando se haga clic en la flecha cambiara el hash para ir mostrar lo que hay en home//
arrowBtn.addEventListener('click',()=>{
    //History.back() hace que el navegador retroceda una página en el historial de la sesión.
    history.back();
});
//cuando se active el evento hashchange ejecutara la funciona navigator//
window.addEventListener('hashchange', navigator, false);
//cuando se haga scroll en la pagina llama a la funcion de paginacion//
window.addEventListener('scroll', infiniteScroll);
//cuando cargue la aplicacion ejecutará la función navigator//
window.addEventListener('DOMContentloaded', navigator, false);

function navigator (){
    //deshabilita el infinityScroll hasta que sea llamado por una funcion//
    if(infiniteScroll){
        window.removeEventListener('scroll',infiniteScroll, {passive: false});
        infiniteScroll = undefined;
    }
    //dependiendo el hash de la pagina mostrará una seccion distinta
    //.startsWith sirve para encontrar un string que empiece con cierta palabra//
    //si el hash de la url empieza por trends mostrará las tendencias//
    if(location.hash.startsWith('#trends')){
        trendsPage();
    //si el hash de la url empieza por search mostrará las busquedas//
    }else if (location.hash.startsWith('#search=')){
        searchPage();
    //si el hash de la url empieza por movie mostrará los detalles de la pelicula//
    }else if(location.hash.startsWith('#movie=')){
        moviesDetailsPage();
    //si el hash de la url empieza por category mostrará las peliculas que tengan esa categoria//     
    }else if(location.hash.startsWith('#category=')){
        categoriesPage()
    //si no hay ningun hash mostrará directamente el home//    
    }else {
        homePage();
    }
   //cada vez que se entra a una pagina aparece desde la parte superior//
   document.body.scrollTop = 0;
   document.documentElement.scrollTop = 0;
   //si alguna de las funciones llamo infinityScroll entonces lo habilita//
    if(infiniteScroll){
        document.addEventListener('scroll', infiniteScroll,  {passive: false})
    }
}


function homePage(){
    //quita una clase del headerSection ya q solo se usa solo para el movieDetails//
    headerSection.classList.remove('header-container--long');
    //vacia la imagen de fondo //
    headerSection.style.background = '';
    //borra la flecha para retroceder//
    arrowBtn.classList.add('inactive');
     //borra la flecha en blanco
     arrowBtn.classList.remove('header-arrow--white');
    //borra el categoryTitle//
    headerCategoryTitle.classList.add('inactive');
    //muestra el headerTitle//
    headerTitle.classList.remove('inactive');
    //muestra el formulario de busquedas//
    searchForm.classList.remove('inactive');
    //muestra la seccion de trending//
    trendingPreviewSection.classList.remove('inactive');
    //muestra el previewCategory//
    categoriesPreviewSection.classList.remove('inactive');
    //borra el genericSection//
    genericSection.classList.add('inactive');
    //borra el detalle de las peliculas//
    movieDetailSection.classList.add('inactive');
    //muestra la seccion de favoritos//
    likedMoviesSection.classList.remove('inactive');
    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
};

function categoriesPage(){
      //quita una clase del headerSection ya q solo se usa solo para el movieDetails//
      headerSection.classList.remove('header-container--long');
      //vacia la imagen de fondo //
      headerSection.style.background = '';
      //muestra la flecha para retroceder//
      arrowBtn.classList.remove('inactive');
       //pone la flecha en el violeta
    arrowBtn.classList.remove('header-arrow--white');
      //muestra el categoryTitle//
      headerCategoryTitle.classList.remove('inactive');
      //esconde el headerTitle//
      headerTitle.classList.add('inactive');
      //esconde el formulario de busquedas//
      searchForm.classList.add('inactive');
      //esconde la seccion de trending//
      trendingPreviewSection.classList.add('inactive');
      //esconde el previewCategory//
      categoriesPreviewSection.classList.add('inactive');
      //muestra el genericSection//
      genericSection.classList.remove('inactive');
      //borra el detalle de las peliculas//
      movieDetailSection.classList.add('inactive');
      //sacar el id del url//
      //haremos un array y que cada elemento del array se separa por cada = que aparezca//
      const [_,categorydata] =location.hash.split('=');// devuelve [category, id-name]
      //haremos un array serapando por cada - que aparezca//
      const [categoryId,categoryName] =categorydata.split('-');
      //pone el nombre de la categoria en el titulo
      headerCategoryTitle.innerHTML = categoryName;
      getMoviesByCategory(categoryId);
      //ocultad la seccion de favoritos//
    likedMoviesSection.classList.add('inactive');
       //llama y ejecuta la funcion//
    infiniteScroll = getPaginatedMoviesByCategory(categoryId);
};

function moviesDetailsPage(){
    //muestra una clase del headerSection ya q solo se usa solo para el movieDetails//
    headerSection.classList.add('header-container--long');
    //vacia la imagen de fondo //
    headerSection.style.background = '';
    //muestra la flecha para retroceder//
    arrowBtn.classList.remove('inactive');
    //pone la flecha en blanco
    arrowBtn.classList.add('header-arrow--white');
    //muestra el categoryTitle//
    headerCategoryTitle.classList.remove('inactive');
    //esconde el headerTitle//
    headerTitle.classList.add('inactive');
    //esconde el formulario de busquedas//
    searchForm.classList.add('inactive');
    //esconde la seccion de trending//
    trendingPreviewSection.classList.add('inactive');
    //esconde el previewCategory//
    categoriesPreviewSection.classList.add('inactive');
    //esconde el genericSection//
    genericSection.classList.add('inactive');
    //borra el detalle de las peliculas//
    movieDetailSection.classList.remove('inactive');
    //ocultad la seccion de favoritos//
    likedMoviesSection.classList.add('inactive');
    //haremos un array y que cada elemento del array se separa por cada = que aparezca//
    const [_,movieId] =location.hash.split('=');// devuelve [movie, id-name]
    getMovieById(movieId);
};

function searchPage(){
     //quita una clase del headerSection ya q solo se usa solo para el movieDetails//
     headerSection.classList.remove('header-container--long');
     //vacia la imagen de fondo //
     headerSection.style.background = '';
     //muestra la flecha para retroceder//
     arrowBtn.classList.remove('inactive');
      //pone la flecha en el violeta
   arrowBtn.classList.remove('header-arrow--white');
     //esconde el categoryTitle//
     headerCategoryTitle.classList.add('inactive');
     //esconde el headerTitle//
     headerTitle.classList.add('inactive');
     //muestra el formulario de busquedas//
     searchForm.classList.remove('inactive');
     //esconde la seccion de trending//
     trendingPreviewSection.classList.add('inactive');
     //esconde el previewCategory//
     categoriesPreviewSection.classList.add('inactive');
     //muestra el genericSection//
     genericSection.classList.remove('inactive');
     //borra el detalle de las peliculas//
     movieDetailSection.classList.add('inactive');
     //ocultad la seccion de favoritos//
    likedMoviesSection.classList.add('inactive');
    //haremos un array y que cada elemento del array se separa por cada = que aparezca//
    const [_,query] =location.hash.split('=');// devuelve [search, palabrabuscada]
    getMoviesBySearch(query);
    //llama y ejecuta la funcion//
    infiniteScroll = getPaginatedMoviesBySearch(query);
};

function trendsPage(){
      //quita una clase del headerSection ya q solo se usa solo para el movieDetails//
      headerSection.classList.remove('header-container--long');
      //vacia la imagen de fondo //
      headerSection.style.background = '';
      //muestra la flecha para retroceder//
      arrowBtn.classList.remove('inactive');
       //pone la flecha en el violeta
    arrowBtn.classList.remove('header-arrow--white');
      //muestra el categoryTitle//
      headerCategoryTitle.classList.remove('inactive');
      //esconde el headerTitle//
      headerTitle.classList.add('inactive');
      //esconde el formulario de busquedas//
      searchForm.classList.add('inactive');
      //esconde la seccion de trending//
      trendingPreviewSection.classList.add('inactive');
      //esconde el previewCategory//
      categoriesPreviewSection.classList.add('inactive');
      //muestra el genericSection//
      genericSection.classList.remove('inactive');
      //borra el detalle de las peliculas//
      movieDetailSection.classList.add('inactive');
      //ocultad la seccion de favoritos//
    likedMoviesSection.classList.add('inactive');
      //pone el nombre de tendencias en el titulo
      headerCategoryTitle.innerHTML = 'Tendencias';  
      getTrendingMovies();
      infiniteScroll = getPaginatedTrendingMovies;
};