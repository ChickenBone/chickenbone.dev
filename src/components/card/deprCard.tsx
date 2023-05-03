'use client'

import React from 'react'

import { Text, useTheme, Container } from '@nextui-org/react';
import Image from 'next/image'

interface DepricatedCardProps {
    position: string
    company: string
    date: string
    image: string
}

export const DepricatedCard = (Props: DepricatedCardProps) => {
    const { theme } = useTheme()
    return (
        <div className='w-full h-fit backdrop-blur-md'>
            <Container css={{
                backgroundColor: "$background"
            }} className={`w-full h-fit p-2 flex backdrop-blur-2xl rounded-[40px]`}>

                <div className='flex w-full gap-6'>
                    <Container css={{
                        backgroundColor: "$background",
                        width: "140px",
                        alignSelf: "center",
                        height: "110px",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                    }} className='flex align-middle rounded-3xl'>
                        <Image src={Props.image} alt="company" width={'100'} height={100} />
                    </Container>
                    <div className='flex flex-col w-full flex-grow'>
                        <Text h2 className='mb-0 font-bold'>
                            {Props.company}
                        </Text>
                        <Text h4 className='mb-0 font-normal'>
                            {Props.position}
                        </Text>
                        <Text h4 className='font-normal'>
                            {Props.date}
                        </Text>
                    </div>
                </div>

            </Container>
        </div>

    )
}