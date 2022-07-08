import { getRealTickets, createTickets, checkNone, checkOne, checkTwo, checkThree, checkFiltered, radioChange, } from "./api"
const Main = async () => {

    const data = await getRealTickets()

    let filter = [0, 1, 2, 3];

    let i = 0;

    async function loadMoreTickets() {
        i = createTickets(data, i, filter)
    }

    loadMoreTickets()

    const loadMoreButton = document.querySelector('.loadMore');
    loadMoreButton.addEventListener('click', loadMoreTickets)

    const checkboxNone = document.querySelector('#box-1')
    checkboxNone.addEventListener('change', () =>{
        filter = checkNone(filter)

        if (filter.length === 0){
            filter = [0, 1, 2, 3]
        }
        checkFiltered(filter)
    })

    const checkboxOne = document.querySelector('#box-2')
    checkboxOne.addEventListener('change', () =>{
        filter = checkOne(filter)

        if (filter.length === 0){
            filter = [0, 1, 2, 3]
        }
        checkFiltered(filter)
    })

    const checkboxTwo = document.querySelector('#box-3')
    checkboxTwo.addEventListener('change', () =>{
        filter = checkTwo(filter)

        if (filter.length === 0){
            filter = [0, 1, 2, 3]
        }
        checkFiltered(filter)
    })

    const checkboxThree = document.querySelector('#box-4')
    checkboxThree.addEventListener('change', () =>{
        filter = checkThree(filter)

        if (filter.length === 0){
            filter = [0, 1, 2, 3]
        }
        checkFiltered(filter)
    })

    const radio = document.querySelector('.switch')
    radio.addEventListener('change', radioChange)
}


Main()