'use client'

import React from 'react'
import { Container, Text, useTheme } from '@nextui-org/react'
import { HeaderText } from '../text/headerText'

interface TextCardProps {
    children: React.ReactNode
    title: string
}

export const TextCard = (Props: TextCardProps) => {
    const { theme } = useTheme()
    return (
        <div className='w-full h-full backdrop-blur-md'>
            <div className='p-6'>

                 <HeaderText startOpen={true} endOpen={false}>
                    {Props.title}
                </HeaderText>
            </div>

            <Container css={{
                backgroundColor: "$background"
            }} className={`w-full h-fit p-6 flex flex-col gap-2 backdrop-blur-2xl min-h-[650px] rounded-[40px]`}>
           
                <Text h4 className='font-normal'>
                    {Props.children}
                </Text>
            </Container>
        </div>
    )
}