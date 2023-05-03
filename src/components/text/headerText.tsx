'use client';

import React from 'react';

import { Text, useTheme } from '@nextui-org/react';
interface HeaderTextProps {
    children: React.ReactNode
    startOpen: boolean
    endOpen: boolean
}

export const HeaderText = (Props: HeaderTextProps) => {
    const { theme } = useTheme()
    return (
        <div className='w-full h-fit flex'>
            <Text h2 css={{
                color: "$accents0"
            }} className={'font-bold ' + Props.startOpen ? "mr-0" : "mr-2"}>
                {Props.startOpen ? "<" : "</"}
            </Text>
            <Text h2 className='font-bold'>
                {Props.children}
            </Text>
            <Text h2 css={{
                color: "$accents0"
            }} className={'font-bold' + Props.endOpen ? "ml-2" : "ml-0"}>
                {Props.endOpen ? ">" : "/>"}
            </Text>
        </div>
    )
}