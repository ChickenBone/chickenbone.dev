'use client'

import { Dropdown } from '@nextui-org/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Stocking {
    stocking_id: number,
    body_of_water: string,
    water_id: number,
    region: string,
    report_date: string
}

interface FishingLocation {
    name: string,
    coordinates: [number, number]
}

export default function Fishing() {
    const [stocking, setStocking] = useState<Stocking[]>([])
    const [regionGroup, setRegionGroup] = useState(true)
    const [monthCount, setMonthCount] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [locations, setLocations] = useState<FishingLocation[]>([])

    useEffect(() => {
        setLoading(true)
        setError(null)
        axios.get("https://ndismaps.nrel.colostate.edu/arcgis/rest/services/FishingAtlas/FishingAtlas_Main_Map/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json")
            .then((response) => {
                const data = response.data.features.map((feature: any) => ({
                    name: feature.attributes.WATER_NAME,
                    coordinates: [feature.geometry.y, feature.geometry.x]
                }))
                setLocations(data)
                setLoading(false)
            })
            .catch((error) => {
                setError("Failed to fetch data from the API")
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        axios.get("https://ndismaps.nrel.colostate.edu/arcgis/rest/services/FishingAtlas/FishingAtlas_Main_Map/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json").then((data) => {

            // Cut out data from not the last month
            let lastMonth = new Date()
            lastMonth.setMonth(lastMonth.getMonth() - monthCount)
            let lastMonthString = lastMonth.toISOString().split('T')[0]
            let stockData:Stocking[] = data.data.features.map((feature: any) => ({
                stocking_id: feature.attributes.OBJECTID,
                body_of_water: feature.attributes.WATER_NAME,
                water_id: feature.attributes.WATER_ID,
                region: feature.attributes.REGION,
                report_date: feature.attributes.STOCK_DATE
            }))

            let filteredData = stockData.filter((stock: Stocking) => {
                return stock.report_date > lastMonthString
            })
            // Order by region
            let regionOrdered = filteredData.reverse().sort((a: Stocking, b: Stocking) => {
                if (a.region < b.region) {
                    return -1
                }
                if (a.region > b.region) {
                    return 1
                }
                return 0
            })

            if (regionGroup) {
                setStocking(regionOrdered)
            } else {
                setStocking(filteredData)
            }
        })
    }, [monthCount, regionGroup])


    return (
        <div className={'w-full h-full'}>
            <div className='col-span-1 md:col-span-2 place-self-start my-24'>
                <h1 className='text-4xl font-bold text-center'>Colorado Stocking Report</h1>
                <h2 className='text-2xl font-bold text-center'>Last {monthCount} month(s)</h2>
                <div className='flex flex-row gap-4 justify-center'>
                    <input type='range' min='1' max='12' value={monthCount} onChange={(e) => setMonthCount(parseInt(e.target.value))} className={`
                        w-1/2
                        bg-gray-300
                        appearance-none
                        rounded-full
                        h-2
                        outline-none
                        transition-all
                        duration-500
                        ease-in-out
                        hover:bg-gray-400
                        focus:bg-gray-400
                        active:bg-gray-400
                    `} />
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 place-items-center'>

                {
                    loading && <div className='col-span-1 md:col-span-2 place-self-start'>
                        <h1 className='text-4xl font-bold text-center'>Loading...</h1>
                    </div>
                }
                {
                    error && <div className='col-span-1 md:col-span-2 place-self-start'>
                        <h1 className='text-4xl font-bold text-center'>{error}</h1>
                    </div>
                }
                {
                    stocking.map((stock, index) => {
                        return (
                            <div key={index} className={`col-span-1 w-2/3 h-48 rounded-3xl shadow-lg p-4 bg-opacity-60
                                ${stock.region == 'northeast' && 'bg-blue-300'}
                                ${stock.region == 'northwest' && 'bg-green-300'}
                                ${stock.region == 'southeast' && 'bg-yellow-300'}
                                ${stock.region == 'southwest' && 'bg-red-300'}
                                `}>
                                <div className='flex flex-col gap-4 align-middle justify-center'>
                                    <div className='col-span-1 md:col-span-2 '>
                                        <h2 className='text-2xl font-bold text-center'>{stock.body_of_water}</h2>
                                        <h3 className='text-xl font-bold text-center'>{stock.region}</h3>
                                        <h4 className='text-lg font-bold text-center'>{stock.report_date}</h4>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <div className='col-span-1 md:col-span-2 place-self-start my-24'>
                <h1 className='text-4xl font-bold text-center'>Fishing Locations</h1>
                <div className='flex flex-row gap-4 justify-center'>
                    <div className='w-full h-96'>
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${locations.map(location => location.coordinates.join(',')).join('|')}`}
                            allowFullScreen>
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    )
}
