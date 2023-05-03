'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { Circle } from './circles'

interface BackdropProps {
    children: React.ReactNode
}


export const Backdrop = (Props: BackdropProps) => {
    return (
        <>
            <div className='z-20 bg-none'>
                {Props.children}
            </div>
            <div className='overflow-hidden absolute -top-20 -left-20 -z-10 w-screen h-full blur-[200px] grid grid-cols-3 gap-24'>
                {
                    Array(12).fill(0).map((_, i) => {
                        return (
                            <Circle
                                key={i}
                                color={i % 2 == 0 ? "bg-purple-500" : "bg-blue-500"}
                            />
                        )
                    })
                }
            </div>

        </>
    )
}