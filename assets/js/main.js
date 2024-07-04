const resultado = document.querySelector('#resultado')
const grafico = document.querySelector('#grafico')


//FUNCIÓN PARA EJECUTAR EL CAMBIO
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#buscarBtn').addEventListener('click', buscarCambio)
})

//FUNCIÓN PARA SELECCIONAR Y CAPTURAR EL TIPO DE MONEDA, CALCULAR EL CAMBIO, MOSTRAR EL RESULTADO
async function buscarCambio() {
    const montoCLP = document.querySelector('#monto').value
    const moneda = document.querySelector('#moneda').value

    let apiURL
    if (moneda === 'dolar') {
        apiURL = 'https://mindicador.cl/api/dolar'
    } else if (moneda === 'euro') {
        apiURL = 'https://mindicador.cl/api/euro'
    } else {
        alert('Por favor selecciona una moneda válida')
        return;
    }

    try {
        const res = await fetch(apiURL)
        const data = await res.json()

        const valorMoneda = data.serie[0].valor
        const resultado = (montoCLP / valorMoneda).toFixed(2)

        document.querySelector('#resultado').textContent = `${montoCLP} CLP = ${resultado} ${moneda.toUpperCase()}`

        await renderGrafico(moneda)

    } catch (error) {
        console.error('Error para obtener el cambio:', error)
        resultado.innerHTML = 'Ocurrió un error para obtener cambio. Por favor, intenta nuevamente más tarde.'
    }
}


//FUNCIÓN PARA RENDERIZAR GRÁFICO
async function renderGrafico(moneda) {
    const apiURL = moneda === 'dolar' ? 'https://mindicador.cl/api/dolar' : 'https://mindicador.cl/api/euro'

    try {
        const res = await fetch(apiURL)
        const data = await res.json()

        const valores = data.serie.slice(0, 10).reverse().map(item => item.valor)
        const fechas = data.serie.slice(0, 10).reverse().map(item => item.fecha.slice(0, 10))

        const ctx = document.querySelector('#grafico').getContext('2d')
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: fechas,
                datasets: [{
                    label: `Valor ${moneda.toUpperCase()} últimos 10 días`,
                    data: valores,
                    borderColor: '#0dcaf0',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
    } catch (error) {
        console.error('Error al obtener datos para el gráfico:', error)
        alert('Error al obtener datos para el gráfico.')
    }
}



