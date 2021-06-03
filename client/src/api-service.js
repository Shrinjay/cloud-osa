import { BehaviorSubject, Subject } from 'rxjs'
const axios = require('axios')

export const graphData = new Subject()
export const queryResponse = new Subject()
const stopOrder = new BehaviorSubject(false)

export function timeout(number) {
    return new Promise(resolve => setTimeout(resolve, number))
}

export async function start() {
    stopOrder.next(false)
    let response = await axios.get('http://localhost:5000/start').then(response => response.data)
    
    if (response.status === "success") {
        console.log(stopOrder.value)
        while(!stopOrder.value) {
            let trace = await axios.get('http://localhost:5000/trace').then(response => response.data)

            if (trace.status === "success") {
                graphData.next(trace.data)
            }

            else {
                alert(`Something with wrong with your request, here's the output: ${response.data}`)
            }

            await timeout(1000)
        }
    }

    else {
        alert(`Something with wrong with your request, here's the output: ${response.data}`)
    }

}
export function stop() {
    setTimeout((_ => stopOrder.next(true)), 2000)
}

export async function single() {
    let response = await axios.get('http://localhost:5000/single').then(response => response.data)

    if (response.status === "success") {
        graphData.next(response.data)
    }

    else {
        alert(`Something with wrong with your request, here's the output: ${response.data}`)
    }
}

export async function setLimits(min, max) {
    let response = await axios.get(`http://localhost:5000/limits?limits=[${min}, ${max}]`).then(response => response.data)

    if (response.status === "success") {
        alert(`Updated x axis limits to: [${min}, ${max}]`)
    }

    else {
        alert(`Something went wrong, here's the output: ${response.data}`)
    }
}

export async function query(query) {
    let response = await axios.get(`http://localhost:5000/query?query=${query}`).then(response => response.data)

    if (response.status === "success") {
        queryResponse.next(response.data)
    }

    else {
        alert(`Something went wrong with that query, make sure its valid and try again.`)
    }
}