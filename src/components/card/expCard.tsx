'use client'

import React from 'react'

import { Text, useTheme, Container } from '@nextui-org/react';
import Image from 'next/image'

interface ExperienceCardProps {
    position: string
    company: string
    date: string
    level: string
    image: string
}

export const ExperienceCard = (Props: ExperienceCardProps) => {
    const { theme } = useTheme()
    return (
        <div className='w-full h-fit backdrop-blur-md'>
            <Container css={{
                backgroundColor: "$blurBox"
            }} className={`w-full h-fit p-2 flex backdrop-blur-2xl rounded-[40px]`}>

                <div className='flex w-full gap-6'>
                    <Container css={{
                        backgroundColor: "$blurHighlight",
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
                        <Text size={30} h2 className='mb-0 font-bold'>
                            {Props.position}
                        </Text>
                        <Text h4 className='mb-0 font-normal'>
                            {Props.company}
                        </Text>
                        <div className='flex justify-between flex-col md:flex-row'>
                            <Text h4 className='font-normal'>
                                {Props.level}
                            </Text>
                            <Text h4 className='font-normal'>
                                {Props.date}
                            </Text>
                        </div>
                    </div>
                </div>

            </Container>
        </div>

    )
}