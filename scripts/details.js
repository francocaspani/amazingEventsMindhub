let idEvento = (location.search.split('?id='))[1]
let evento = [] 
async function getData() {
    await fetch('https://amazing-events.herokuapp.com/api/events').then(response => response.json())
        .then(json => dataFromAPI = json)
        evento.push(...(dataFromAPI.events.filter(e=> e._id == idEvento)))
    displayDetails(evento[0])
}
getData()
function displayDetails(evento) {
    var templateHtml = '';
        templateHtml = `
                <div class="details">
                    <figure><img src="${evento.image}" alt=""></figure>
                    <div class="text-details">
                        <p id='date'>${evento.date}</p>
                        <p id='description' >${evento.description}</p>
                        <span class='span-details2'><p>Place: ${evento.place}</p><p id='price'>$${evento.price}</p></span>
                    </div>
                </div>
        `
    document.querySelector('.titulo').innerHTML = `<h1>${evento.name}</h1>`
    document.querySelector('.seccion-details').innerHTML = templateHtml
}



