let dataFromAPI;
let eventosPasados = []
let eventHighest = []
let eventLowest = []
let eventLargerCap;
let dataEventos
let firstTable = []
let secondTable
let thirdTable
async function getData() {
    await fetch('https://amazing-events.herokuapp.com/api/events').then(response => response.json()).then(json => dataFromAPI = json);
    
    dataEventos = dataFromAPI.events.map(e => e.porcentage = Number((((e.assistance == undefined ? e.estimate : e.assistance)/ e.capacity) * 100).toFixed(2)))
    eventosPasados = dataFromAPI.events.filter(e => {
        if (e.date < dataFromAPI.currentDate) {
            return e
        }
    }
    ).map(e => e).sort((a,b)=>(b.porcentage - a.porcentage))
    eventosFuturos = dataFromAPI.events.filter(e => {
        if (e.date > dataFromAPI.currentDate) {
            return e
        }
    }
    ).map(e => e).sort((a,b)=>(b.porcentage - a.porcentage))
    porcentage()
    
    
    eventLowest = eventosPasados[eventosPasados.length-1]
    eventHighest = eventosPasados[0]
    
    firstTable.push(eventHighest,eventLowest,eventLargerCap)
    secondTable = statsByCategory(eventosFuturos)
    thirdTable = statsByCategory(eventosPasados)

    displayTable(firstTable,secondTable,thirdTable)

}
getData()




function porcentage() {
    let largerCap;

    dataFromAPI.events.forEach(e=>{
        let capacity = Number(e.capacity)
        if (largerCap == undefined) {
            largerCap = capacity
            eventLargerCap = e
        }
        else if (capacity > largerCap) {
            largerCap = capacity
            eventLargerCap = e
        }
    })
}

function statsByCategory(eventos) {
    let allCategories
    allCategories = eventos.map(e => e.category)
    let setCategories = new Set(allCategories)
    let categories = [...setCategories]
    let catMasRevenue = []
    let porcentageByCategory

    categories.forEach(categ => {
        let revenueByEvent;
        let contador = 0
        let categRevenue = 0
        let porcentageSummatory = 0
        eventos.filter(event=> event.category == categ).forEach(e => {
            let ppl = Number
            e.assistance == undefined ? ppl = e.estimate : ppl = e.assistance;
            revenueByEvent = e.price * ppl
            categRevenue += revenueByEvent
            porcentageSummatory += e.porcentage
            contador +=1
            porcentageByCategory = Number((porcentageSummatory/contador).toFixed(2))
        })
    catMasRevenue.push({categ,categRevenue,porcentageByCategory})
    }
    )
    return catMasRevenue
}

function displayTable(table1,table2,table3){
    let templateHtml = '';
    templateHtml +=`
                    <tr>
                        <td>${table1[0].name}: ${table1[0].porcentage}%</td>
                        <td>${table1[1].name}: ${table1[1].porcentage}%</td>
                        <td>${table1[2].name}: ${table1[2].capacity}</td>
                    </tr>
    `
    document.querySelector('#eventStats').innerHTML = templateHtml
let templateHtml2 = ''
    table2.forEach(e=>{
    ;
    templateHtml2 += `
    <tr>
        <td>${e.categ}</td>
        <td>$${e.categRevenue}</td>
        <td>${e.porcentageByCategory}%</td>
    </tr>
`
    document.querySelector('#upcomingStats').innerHTML = templateHtml2
})
templateHtml2 = ''
table3.forEach(e=>{
    ;
    templateHtml2 += `
    <tr>
        <td>${e.categ}</td>
        <td>$${e.categRevenue}</td>
        <td>${e.porcentageByCategory}%</td>
    </tr>
`
    document.querySelector('#pastStats').innerHTML = templateHtml2
})


}