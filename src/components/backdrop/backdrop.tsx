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
            <div className='overflow-hidden absolute -top-20 -z-10 w-screen h-full blur-3xl'
            style={
                {
                    transform: "translate3d(0, 0, 0)" // Dirty hack to force the backdrop to render on GPU on Safari
                }
            }>
                <div className='w-full h-full grid  grid-cols-1 md:grid-cols-3 justify-center items-center place-items-center'>
                {
                    Array(32).fill(0).map((_, i) => {
                        return (
                            <Circle
                                key={i}
                                color={['bg-blue-500', 'bg-purple-500', 'bg-cyan-500'][Math.floor(Math.random() * 3)]}
                            />
                        )
                    })
                }
                </div>
            </div>
            <div className='z-20 bg-none'>
                {Props.children}
            </div>
        </>
    )
}