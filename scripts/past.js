//Declaracion de variables
let eventosPasados = [];
let allCategories = [];
let categories = [];
let checkSelected = []
let textFilter = '';
let dataFromAPI;
async function getData() {
    await fetch('https://amazing-events.herokuapp.com/api/events').then(response => response.json())
        .then(json => dataFromAPI = json)
    displayCategories()
    //Filtro por categorias
    let checkbox = document.querySelectorAll('input[type=checkbox]')
    checkbox.forEach(e => e.addEventListener('change', e => {
        let categ = e.target.value
        let checked = e.target.checked
        checkbox.forEach(e => {
            if (e.value === categ) {
                if (checked === true) {
                    e.checked = true
                }
                else {
                    e.checked = false
                }
            }
        }
        )
        if (checked) {
            checkSelected.push(categ)
            filtro()
        }
        else {
            checkSelected = checkSelected.filter(e => e !== categ)
            filtro()
        }
    }))
    filtro()
}
getData()
function displayCards(dataFiltrada) {
    var templateHtml = '';
    if (dataFiltrada == 0) {
        templateHtml += `
        <div class="card" style="width: 25rem;">    
        <img src="/images/oops.webp" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">Oops</h5>
                        <p class="card-text">It seems that we dont have any event like that at the moment, hope to have it soon.</p>
                        <p class="card-text">Try it again with another words.<p>
                    </div>
        </div>
        `
    }
    else {
        dataFiltrada.forEach(e => {
            templateHtml += `
        <div class="card" style="width: 18rem;">    
        <img src="${e.image}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${e.name}</h5>
                        <p class="card-text card-date">${e.date}</p>
                        <p class="card-text">Category : ${e.category}</p>
                        <p class="card-text card-place"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"/>
                        </svg>${e.place}</p>
                        <div class="price">
                            <p class="card-price">$${e.price}</p>
                            <a href="./details.html?id=${e._id}" class="btn btn-secondary btn-details">Details</a>
                        </div>
                    </div>
        </div>
            `
        })
    }
    document.querySelector('.main-section').innerHTML = templateHtml
}
function displayCategories() {
    eventosPasados = dataFromAPI.events.filter(e => {
        if (e.date < dataFromAPI.currentDate) {
            return e
        }
    }
    ).map(e => e)
    allCategories = eventosPasados.map(e => e.category)
    let setCategories = new Set(allCategories)
    categories = [...setCategories]
    var templateHtml = ''
    categories.forEach(
        e => {
            templateHtml += `
        <li><label><input type="checkbox" value="${e.toLowerCase()}"> ${e}</label></li>
        `
        }
    )
    document.querySelector('.checkbox').innerHTML = templateHtml;
    document.querySelector('.checkboxmd').innerHTML = templateHtml;
}
//Filtro por texto
let search = document.getElementById('search')
search.addEventListener('keyup', e => {
    textFilter = e.target.value
    filtro()
})
//Filtrando
function filtro() {
    let dataDisplay = [];
    if (checkSelected.length > 0 && textFilter !== '') {
        checkSelected.forEach(category => {
            dataDisplay.push(...eventosPasados.filter(eventos =>
                eventos.name.toLowerCase().includes(textFilter.trim().toLowerCase()) &&
                eventos.category.toLowerCase() == category))
        })
    }
    else if (checkSelected.length > 0 && textFilter === '') {
        checkSelected.forEach(category => {
            dataDisplay.push(...eventosPasados.filter(eventos => eventos.category.toLowerCase() == category))
        })
    }
    else if (checkSelected.length == 0 && textFilter !== '') {
        dataDisplay.push(...eventosPasados.filter(eventos => eventos.name.toLowerCase().includes(textFilter.trim().toLowerCase())))
    }
    else { dataDisplay.push(...eventosPasados) }
    displayCards(dataDisplay)
}


