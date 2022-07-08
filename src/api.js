months = {
    '01': 'янв',
    '02': 'фев',
    '03': 'мар',
    '04': 'апр',
    '05': 'май',
    '06': 'июн',
    '07': 'июл',
    '08': 'авг',
    '09': 'сен',
    '10': 'окт',
    '11': 'ноя',
    '12': 'дек',
}

async function getRealTickets() {
    let url = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=HKT&destination=LED&token=" + process.env.API_TOKEN;
    const result = await fetch(url).
        then(response => response.json());
    return result;
}

function createTickets(data, i, filter) {

    let currency = 'Р';

    let j = 0


    while (j < 5) {
        if (i < data.data.length) {
            const field = document.querySelector('.tickets')
            let div = document.createElement("div")
            div.classList.add('ticket', 'unfiltered');

            let price = document.createElement("div")
            price.classList.add('price');
            price.textContent = data.data[i].price.toString().slice(0,-3) + ' ' + data.data[i].price.toString().slice(-3) + `  ${currency}`

            let carrier = document.createElement("div")
            carrier.classList.add('carrier');
            let carrierLogoUrl = 'https://pics.avs.io/180/50/' + data.data[i].airline.toString() +'.png'
            let carrierLogo = document.createElement("img")
            carrierLogo.src = carrierLogoUrl
            carrierLogo.title = data.data[i].airline
            carrier.append(carrierLogo)

            let duration = document.createElement("div")
            duration.classList.add('duration');
            duration.textContent = 'В пути: ' + timeCalc(data.data[i].duration)

            let departure = document.createElement("div")
            departure.classList.add('departure')
            dateInfo = dateCalc(data.data[i].departure_at)
            let date = document.createElement("div")
            date.classList.add('date')
            date.textContent = dateInfo[1] + ' ' + dateInfo[2]
            let time = document.createElement("div")
            time.classList.add('time')
            time.textContent = dateInfo[0]
            departure.append(time)
            departure.append(date)

            let destination = document.createElement("div")
            destination.classList.add('destination');
            destination.textContent = data.data[i].destination

            let origin = document.createElement("div")
            origin.classList.add('origin');
            origin.textContent = data.data[i].origin

            let transfers = document.createElement("div")
            transfers.classList.add('transfers');
            switch (data.data[i].transfers){
                case 0:
                    transfers.textContent = 'Без пересадок'
                    break
                case 1:
                    transfers.textContent = data.data[i].transfers + ' пересадка'
                    break
                case 2:
                    transfers.textContent = data.data[i].transfers + ' пересадки'
                    break
                case 3:
                    transfers.textContent = data.data[i].transfers + ' пересадки'
                    break
            }

            let planeOne = document.createElement("div")
            planeOne.classList.add('planeOne');
            let planeTwo = document.createElement("div")
            planeTwo.classList.add('planeTwo');
            let flightLine = document.createElement("div")
            flightLine.classList.add('flightLine')

            if (!isFiltered(data.data[i].transfers, filter, div)) {
                j++
            } else {
                setTicketFiltered(div)
            }

            field.append(div)
            div.append(price)
            div.append(carrier)
            div.append(departure)
            div.append(duration)
            div.append(destination)
            div.append(origin)
            div.append(transfers)
            div.append(planeOne)
            div.append(planeTwo)
            div.append(flightLine)

            i++
        } else { break }
    }
    return i
}

function isFiltered(transfers, filter) {

    if (filter.includes(transfers)) {
        return false
    } else {
        
        return true
    }
}

function setTicketFiltered(currentTicket){
    currentTicket.classList.replace('unfiltered', 'filtered')
}

function timeCalc(data) {
    let days = Math.floor(data / 1440)
    let hours = Math.floor(data % 1440 / 60)
    let minutes = '' + Math.floor(data % 60) + 'м'

    result = ''

    if (days >= 1) {
        result += days + 'д'
    }

    if (hours >= 1) {
        if (result != '') {
            result += ' '
        }
        result += hours + 'ч'
    }

    if (result != '') {
        result += ' '
    }

    result += minutes
    return result
}

function dateCalc(data) {

    let time = data.slice(11, 16)
    let date = data.slice(8, 10);
    let month = months[data.slice(5, 7)]

    if (date[0] == 0) {
        date = date.slice(1, 2)
    }

    return ([time, date, month])
}

function checkNone(filter) {
    if (document.querySelector('#box-1').checked) {
        if (document.querySelector('#box-2').checked ||
            document.querySelector('#box-3').checked ||
            document.querySelector('#box-4').checked) {
            filter.push(0)
            return filter
        } else {
            return [0]
        }
    } else {
        let index = filter.indexOf(0)
        filter.splice(index, 1)
        return filter
    }
}

function checkOne(filter) {
    if (document.querySelector('#box-2').checked) {
        if (document.querySelector('#box-1').checked ||
            document.querySelector('#box-3').checked ||
            document.querySelector('#box-4').checked) {
            filter.push(1)
            return filter
        } else {
            return [1]
        }
    } else {
        let index = filter.indexOf(1)
        filter.splice(index, 1)
        return filter
    }
}

function checkTwo(filter) {
    if (document.querySelector('#box-3').checked) {
        if (document.querySelector('#box-1').checked ||
            document.querySelector('#box-2').checked ||
            document.querySelector('#box-4').checked) {
            filter.push(2)
            return filter
        } else {
            return [2]
        }
    } else {
        let index = filter.indexOf(2)
        filter.splice(index, 1)
        return filter
    }
}

function checkThree(filter) {
    if (document.querySelector('#box-4').checked) {
        if (document.querySelector('#box-1').checked ||
            document.querySelector('#box-2').checked ||
            document.querySelector('#box-3').checked) {
            filter.push(3)
            return filter
        } else {
            return [3]
        }
    } else {
        let index = filter.indexOf(3)
        filter.splice(index, 1)
        return filter
    }
}

function checkFiltered(filter) {
    const target = document.querySelectorAll('.ticket')
    for (let k = 0; k < target.length; k++) {
        //const value = target[k].querySelector('.transfers').textContent.slice(-1)
        const value = target[k].querySelector('.transfers').textContent[0]
        if (filter.indexOf(Number(value)) === -1){
            target[k].classList.replace('unfiltered', 'filtered')
        } else {
            target[k].classList.replace('filtered', 'unfiltered')
        }
    }
}

function radioChange() {
    const btns = document.getElementsByName('switch')
    for (i in btns) {
        if (btns[i].checked){
            switch (btns[i].value){
                case '1':
                    console.log('дешевый')
                    url = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=HKT&destination=LED&token=" + process.env.API_TOKEN;
                    break
                case '2':
                    console.log('быстрый')
                    url = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=HKT&destination=LED&token=" + process.env.API_TOKEN;
                    break
                case '3':
                    console.log('оптимальный')
                    url = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=HKT&destination=LED&token=" + process.env.API_TOKEN;
                    break
            }
        }
    }
}

export { getRealTickets, createTickets, checkNone, checkOne, checkTwo, checkThree, checkFiltered, radioChange, }

