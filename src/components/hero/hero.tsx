'use client'

import React from 'react'
import { Container, Text, useTheme } from '@nextui-org/react'
import Image from 'next/image'
import { TypeAnimation } from 'react-type-animation'

interface HeroProps {
    name: string
    image: string
    imageAlt: string
    skills: Array<string | number>
}

export const Hero = (Props: HeroProps) => {

    return (
        <div className='w-full h-full content-center grid grid-cols-1 md:grid-cols-2 gap-16 justify-between md:my-36 my-16 items-center text-center'>
            <div className='w-full justify-center flex'>
                <Image src={Props.image} alt={Props.imageAlt} className="rounded-full justify-center" width={400} height={400} priority />
            </div>
            <div className='flex flex-col'>
                <Container css={{
                    flexDirection: "row",
                    display: "flex",
                    marginLeft: "6px",
                    marginRight: "6px",
                }}>
                    <Text className={"lg:text-5xl text-4xl m-0"} weight={"bold"}>
                        Hi there, I'm
                    </Text>
                    <Text className={"lg:text-5xl text-4xl m-0"} css={{
                        color: "$accents0"
                    }}>
                        {Props.name}
                    </Text>
                    <Text className={"lg:text-5xl text-4xl m-0"} weight={"bold"}>
                        ,
                    </Text>
                </Container>
                <Container css={{
                    flexDirection: "row",
                    display: "flex",
                    color: "$accents0",
                    minHeight: "100px",
                    marginLeft: "6px",
                    marginRight: "6px",


                }}>
                    <Text className={"lg:text-5xl text-4xl m-0"} weight={"bold"} >
                        I'm a
                    </Text>
                    <div className={`lg:text-5xl text-4xl mx-2`}>
                        <TypeAnimation
                            sequence={Props.skills}
                            cursor={true}
                            repeat={Infinity}
                        />
                    </div>
                    <Text className={"lg:text-5xl text-4xl m-0"} weight={"bold"}>
                        developer
                    </Text>
                </Container>
            </div>
        </div>
    )
}
