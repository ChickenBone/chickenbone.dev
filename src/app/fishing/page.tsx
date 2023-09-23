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


//Example fishing data
// [{"stocking_id":1,"body_of_water":"Evergreen Lake","water_id":548,"region":"northeast","report_date":"2014-04-29"},{"stocking_id":2,"body_of_water":"Georgetown Lake","water_id":469,"region":"northeast","report_date":"2014-04-29"},{"stocking_id":3,"body_of_water":"Dowdy Lake","water_id":229,"region":"northeast","report_date":"2014-04-22"},{"stocking_id":4,"body_of_water":"West Lake","water_id":463,"region":"northeast","report_date":"2014-04-22"},{"stocking_id":5,"body_of_water":"Blue River (Section 2)","water_id":664,"region":"northeast","report_date":"2014-04-22"},]
// Get body of water location from water_id
// 


export default function Fishing() {
    const [stocking, setStocking] = useState<Stocking[]>([])
    const [regionGroup, setRegionGroup] = useState(true)
    const [monthCount, setMonthCount] = useState(1)


    useEffect(() => {
        axios.get("https://cpw.crestonedigital.com/fishing/api/v1/stocking").then((data) => {

            // Cut out data from not the last month
            let lastMonth = new Date()
            lastMonth.setMonth(lastMonth.getMonth() - monthCount)
            let lastMonthString = lastMonth.toISOString().split('T')[0]

            let filteredData = data.data.filter((stock: Stocking) => {
                return stock.report_date > lastMonthString
            })
            // Order by region
            let regionOrdered = filteredData.sort((a: Stocking, b: Stocking) => {
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
                    stocking.length == 0 && <div className='col-span-1 md:col-span-2 place-self-start'>
                        <h1 className='text-4xl font-bold text-center'>Loading...</h1>
                    </div>
                }
                {
                    stocking.map((stock, index) => {
                        return (
                            <div className={`col-span-1 w-2/3 h-48 rounded-3xl shadow-lg p-4 bg-opacity-30
                                ${stock.region == 'northeast' && 'bg-blue-200'}
                                ${stock.region == 'northwest' && 'bg-green-200'}
                                ${stock.region == 'southeast' && 'bg-yellow-200'}
                                ${stock.region == 'southwest' && 'bg-red-200'}
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
        </div>


    )
}
