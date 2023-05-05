'use client'

import React from 'react'
import { Container, Text, useTheme } from '@nextui-org/react'

interface projectCardProps {
    title: string
    role: string
    time: string
    srcUrl: string
}

export const ProjectCard = (Props: projectCardProps) => {
    return (
        <div className='w-full h-full backdrop-blur-md'>
            <Container css={{
                backgroundColor: "$blurBox"
            }} className={`w-full h-fit p-6 flex flex-col gap-2 backdrop-blur-2xl  rounded-[40px]`}>
                <iframe src={Props.srcUrl} className='w-full h-[300px] rounded-3xl' seamless />
                <div className='py-4'>
                    <Text h2 className='m-0 font-bold'
                     css={{
                        color: "$accents0"
                     }}
                    >
                        {Props.title}
                    </Text>
                    <Text h4 className='m-0 font-normal'>
                        {Props.role}
                    </Text>
                    <Text h5 className='m-0 font-normal'>
                        {Props.time}
                    </Text>
                    <a href={Props.srcUrl} target='_blank'>
                        View Site
                    </a>
                </div>
            </Container>
        </div>
    )
}