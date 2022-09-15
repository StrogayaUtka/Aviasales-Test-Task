import React, { useState, useEffect } from "react";

import './box.css'
import { Tickets } from "../tickets/tickets";

export default Box = ({ filter }) => {

    const [data, setData] = useState(null)
    const [tickets, setTickets] = useState(null)
    const [ticketCount, setTicketCount] = useState(5)
    const [filteredTickets, setFilteredTickets] = useState(null)
    const [hideButton, setHideButton] = useState(false)

    const MoreTicketsBtn = (
        <button type="button" className="loadMore"
            onClick={() => {
                setTicketCount(ticketCount + 5)
            }}>
            ещё билеты
        </button>)

    useEffect(() => {
        const url = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=HKT&destination=LED&token=" + process.env.API_TOKEN;
        fetch(url)
            .then(result => result.json())
            .then((actualData) => {
                setData(actualData.data)
                setFilteredTickets(actualData.data)
            });
    }, [])

    useEffect(() => {

        if (!data) {
            return
        }

        setTickets(filteredTickets.slice(0, ticketCount))

        if (ticketCount >= filteredTickets.length) {
            setHideButton(true)
        }

    }, [filteredTickets, ticketCount])

    useEffect(() => {

        if (!data) {
            return
        }

        let newData = []

        for (i in data) {
            if (filter.indexOf(data[i].transfers) !== -1) {
                newData.push(data[i])
            }
        }
        setFilteredTickets(newData)
        
    }, [filter])

    onLogFilter = () => {
        console.log(filter)
    }

    return (
        <div className="box">

            <div>switch</div>
            <button onClick={() => onLogFilter()}>log filter</button>

            <Tickets tickets={tickets} />

            {hideButton ? null : MoreTicketsBtn}
        </div>
    )
}
