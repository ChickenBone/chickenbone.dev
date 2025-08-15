'use client'
import React from "react";
import { Container, Text, useTheme } from '@nextui-org/react'
import { HeaderText } from "../text/headerText"
import portfolio from "@/data/portfolio"

export const Footer = () => {
    return (
        <div className='w-full h-full'>
            <Container css={{
                backgroundColor: "$blurBox"
            }} className={`w-full h-fit p-6 flex gap-2 backdrop-blur-2xl  rounded-[40px]`}>
                <div className="flex px-8 align-middle h-full justify-start md:justify-between flex-col md:flex-row">
                    <div className="flex  align-middle mt-2">
                        <Text css={{
                            color: "$accents0"
                        }} className='font-bold text-2xl lg:text-3xl mr-2'>
                            {"</"}
                        </Text>
                        <Text className='font-bold text-2xl lg:text-3xl cursor-pointer' onClick={() => window.location.href = "/"}>
                            {portfolio.siteName}
                        </Text>
                        <Text css={{
                            color: "$accents0"
                        }} className='font-bold text-2xl lg:text-3xl '>
                            {">"}
                        </Text>
                    </div>
                    <div className="flex flex-col">
                        <a href={portfolio.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Text className='font-bold text-2xl lg:text-3xl'>
                                View Source
                            </Text>
                        </a>
                        <Text h5 className='m-0'>
                            Made with ❤️ in {portfolio.location.city}, {portfolio.location.region}
                        </Text>
                    </div>
                </div>

            </Container>
        </div>
    )
}