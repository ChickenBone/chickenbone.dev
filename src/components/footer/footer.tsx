'use client'
import React from "react";
import { Container, Text, useTheme } from '@nextui-org/react'
import { HeaderText } from "../text/headerText"
import * as portfolio from "@/data/portfolio.json"

export const Footer = () => {
    return (
        <div className='w-full h-full backdrop-blur-md'>
            <Container css={{
                backgroundColor: "$background"
            }} className={`w-full h-fit p-6 flex gap-2 backdrop-blur-2xl  rounded-[40px]`}>
                <div className="flex px-8 align-middle h-full justify-start md:justify-between flex-col md:flex-row">
                    <div className="flex  align-middle mt-2">
                        <Text css={{
                            color: "$accents0"
                        }} className='font-bold text-2xl lg:text-3xl mr-2'>
                            {"</"}
                        </Text>
                        <Text className='font-bold text-2xl lg:text-3xl'>
                            {portfolio.siteName}
                        </Text>
                        <Text css={{
                            color: "$accents0"
                        }} className='font-bold text-2xl lg:text-3xl '>
                            {">"}
                        </Text>
                    </div>
                    <div className="flex flex-col">
                        <a href="https://github.com/chickenbone" target="_blank">
                            <Text className='font-bold text-2xl lg:text-3xl'>
                                View Source
                            </Text>
                        </a>
                        <Text h5 className='m-0'>
                            Made with ❤️ in Denver, CO
                        </Text>
                    </div>
                </div>

            </Container>
        </div>
    )
}