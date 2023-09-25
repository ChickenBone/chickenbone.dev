'use client'

import React from "react"
import { Text, useTheme } from "@nextui-org/react"
import { useTheme as useNextTheme } from 'next-themes'
import Image from 'next/image'
import { BsSunFill, BsMoonFill } from 'react-icons/bs'

interface HeaderProps {
    siteName: string
    githubUrl: string
    contactUrl: string
}

export const Header = (Props: HeaderProps) => {
    const { setTheme } = useNextTheme();
    const { isDark, type, theme } = useTheme();
    return (
        <div className='w-full h-16 flex'>
            <Text css={{
                color: "$accents0"
            }} className='font-bold text-2xl lg:text-3xl'>
                {"<"}
            </Text>
            <Text className='font-bold text-2xl lg:text-3xl cursor-pointer' onClick={()=>{
                window.location.href = "/"
            }}>
                {Props.siteName}
            </Text>
            <Text css={{
                color: "$accents0"
            }} className='font-bold text-2xl lg:text-3xl'>
                {">"}
            </Text>
            <div className='flex-grow'></div>
            <a
                href={Props.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-white  rounded-full hover:bg-gray-200/70"
            >
                <Image src='/github.svg' alt='github' className="h-full w-12" width={10} height={10} />
            </a>
            <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="w-10 h-10 ml-6 md:w-14 md:h-14 flex items-center justify-center bg-white  rounded-full hover:bg-gray-200/70"
            >
                {
                    isDark ?
                        <BsMoonFill className="h-full w-10 text-[#24292F]" />
                        :
                        <BsSunFill className="h-full w-10 text-[#fdd835]" />
                }
            </button>

        </div>
    )
}
