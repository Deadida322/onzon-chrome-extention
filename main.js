window.onload = ()=>{
    let k = setInterval(()=>{
            if (document.querySelector('#name_3')){
                main()
                clearInterval(k)
            }
        },
        100
    )
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
let data = {
    labels: [],
    datasets: []
};
let barChart = ''
let head = ''

let colors = ['#cdc5c2', '#332d2a', '#B22222', '#32CD32', '#FFD700', '#8B008B',
    '#000000', '#FF00FF', '#696969', '#191970', '#7FFFD4', '#BDB76B', '#2F4F4F', '#000080']
const config = {
    type: 'line',
    data: data,
    options: {
        animation: {
            duration: 0,
        },
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Изменение цены'
            },
        },
        interaction: {
            intersect: false,
        },
        radius: 0,
        scales: {
            x: {
                display: true,
                title: {
                    display: true
                },
                grid: {
                    display: true,
                    drawBorder: true,
                    drawOnChartArea: true,
                    drawTicks: true,
                }
            },
            y: {
                borderColor: 'rgba(0, 0, 0, 1)',
                display: true,
                grid: {
                    display: DISPLAY,
                    drawBorder: BORDER,
                    drawOnChartArea: CHART_AREA,
                    drawTicks: TICKS,
                },
                title: {
                    display: true,
                    text: 'Средняя цена',
                },
                suggestedMin: -1,
                suggestedMax: 2,

            }
        }
    },
};

function showGraphics(){
    console.clear()
        document.getElementById('popChart')?.remove()
        document.getElementById('popChartCart')?.remove()
        document.getElementById('popChartSearch')?.remove()
    let priceData
    if(category){
        fetch(`https://itech.mrexpen.duckdns.org/Ozon/Price?categoryName=${category}`)
            .then(response => response.json())
            .then(json => {
                config.data = {
                    labels: [],
                    datasets: []
                };

                priceData = json.result.slice(0,10)
                if (priceData.length!=0) {
                    for (let i in priceData) {
                        config.data.datasets.push({
                            data: [],
                            label: '',
                            borderColor: colors[i % colors.length],
                            borderWidth: 2
                        })

                        for (let j in priceData[i]) {
                            if (i == 1) {
                                config.data.labels.push(priceData[i][j].date.split('T')[0])
                            }
                            if (j == 1) config.data.datasets[i].label = priceData[i][j].query
                            config.data.datasets[i].data.push(priceData[i][j].averagePrice)
                        }
                    }
                    let chartPrice = document.createElement('div')
                    chartPrice.innerHTML = `<canvas id="popChart" width="600" height="400"></canvas>`

                    let categoryInput = document.querySelector('#form-input-5')
                    categoryInput.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                        .insertBefore(chartPrice, categoryInput.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);

                    let popCanvas = document.getElementById("popChart");
                    popCanvas = document.getElementById("popChart").getContext("2d");
                    config.options.plugins.title.text = 'Изменение цены'
                    config.options.scales.y.title.text = 'Средняя цена'
                    barChart = new Chart(popCanvas, {...config});
                }
                else{
                    let info = document.createElement('div')
                    info.classList.add('onzon-noInfo')
                    info.innerHTML = 'Нет информации по данной категории'
                    let categoryInput = document.querySelector('#form-input-5')
                    categoryInput.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                        .insertBefore(info, categoryInput.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
                    data.datasets = []
                }

            })
        fetch(`https://itech.mrexpen.duckdns.org/Ozon/Dumps?category=${category}`)
            .then(response => response.json())
            .then(json => {
                let searchCountDataSet = {
                    labels: [],
                    datasets: []
                };
                config.data = {
                    labels: [],
                    datasets: []
                };

                let cartData = json.result.slice(0,10)
                console.log(cartData)
                if (cartData.length!=0) {
                    for (let i in cartData) {
                        config.data.datasets.push({
                            data: [],
                            label: '',
                            borderColor: colors[i % colors.length],
                            borderWidth: 2
                        })
                        searchCountDataSet.datasets.push({
                            data: [],
                            label: '',
                            borderColor: colors[i % colors.length],
                            borderWidth: 2
                        })

                        for (let j in cartData[i].data) {
                            if(j==0) {
                                config.data.datasets[i].label = cartData[i].query
                                searchCountDataSet.datasets[i].label = cartData[i].query
                            }

                            if (i==0) {
                                searchCountDataSet.labels.push(cartData[i].data[j].date.split('T')[0])
                                config.data.labels.push(cartData[i].data[j].date.split('T')[0])
                            }
                            config.data.datasets[i].data.push(cartData[i].data[j].addedToCard)
                            console.log(cartData[i].data[j].searchCount)
                            searchCountDataSet.datasets[i].data.push(cartData[i].data[j].searchCount)
                        }
                    }
                    let chartCart = document.createElement('div')
                    chartCart.innerHTML = `<canvas id="popChartCart" width="600" height="400"></canvas>`

                    let categoryInput = document.querySelector('#form-input-5')
                    categoryInput.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                        .insertBefore(chartCart, categoryInput.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
                    let popCanvas = document.getElementById("popChartCart");
                    popCanvas = popCanvas.getContext("2d");
                    config.options.plugins.title.text = 'Добавлено в корзину'
                    config.options.scales.y.title.text = 'Количество раз'
                    barChart = new Chart(popCanvas, {...config});


                    let chartSearch = document.createElement('div')
                    chartSearch.innerHTML = `<canvas id="popChartSearch" width="600" height="400"></canvas>`
                    categoryInput.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                        .insertBefore(chartSearch, categoryInput.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
                    let popCanvasSearch = document.getElementById("popChartSearch");
                    popCanvas = popCanvasSearch.getContext("2d");
                    config.options.plugins.title.text = 'Запрошено в поиске'
                    config.options.scales.y.title.text = 'Количество раз'
                    let newConfig = JSON.parse(JSON.stringify({...config}))
                    newConfig['data'] = searchCountDataSet
                    console.log(newConfig)
                    barChart = new Chart(popCanvas, {...newConfig});
                }
            })
    }
}
let namesResult = ''
let category = ''
function main(){
    let nameInput = document.querySelector('#name_3')
    let categoryInput = document.querySelector('#form-input-5')
    let inputTip = document.createElement('div')

    // Задаём стиль советов для имени
    inputTip.classList.add('onzon-inputTip')
    ///////////////////////////////////////////


    let categoryTip = document.createElement('div')

    // Задаём стиль кнопки для графиков
    categoryTip.classList.add('onzon-btn')
    categoryTip.innerHTML = 'Графики'

    ///////////////////////////////////////////

    nameInput.addEventListener('input', (e)=>{
        if (e.target.value.length>2){
            fetch(`https://itech.mrexpen.duckdns.org/Ozon/Name?query=${e.target.value}`)
                .then(response => response.json())
                .then(json => {
                    inputTip.style.display = 'block'
                    let toDraw = []
                    for(let i in json.result){
                        toDraw[i] = `<span class="nameTip">${json.result[i]}</span>`
                    }
                    if (toDraw.length){
                        inputTip.innerHTML = '<div class="caption">Предлагаемые названия: </div>'+'<br/>' + toDraw.slice(0, 5).join(', ') + '<br/>'
                    }
                    else {
                        inputTip.innerHTML = '<div class="caption">Предлагаемые названия: </div>'+'<br/>'+ '<span class="onzon-red">Не нашлось совпадений</span>' + '<br/>'
                    }
                    nameInput.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                        .insertBefore(inputTip, nameInput.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling);
                    for(let item of document.querySelectorAll('.nameTip')){
                        item.addEventListener('click', (e)=>{
                            document.querySelector('#name_3').value = e.target.textContent
                        })
                    }
                })

        }
        else {
            inputTip.style.display = 'none'
            nameInput.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                .insertBefore(inputTip, nameInput.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling);

        }


    })

    document.addEventListener('mousemove', (e)=>{
        category = categoryInput.value
        categoryTip.onclick = showGraphics
        if(category) {
            categoryInput.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                .insertBefore(categoryTip, categoryInput.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling);
        }
    })


}


