'use client'

import React from 'react'
import { Container, Text, useTheme } from '@nextui-org/react'
import Image from 'next/image'
import { TypeAnimation } from 'react-type-animation'

interface HeroProps {
    name: string
    image: string
    skills: Array<string | number>
}

export const Hero = (Props: HeroProps) => {

    return (
        <div className='w-full h-full content-center grid grid-cols-1 md:grid-cols-2 gap-16 justify-between md:my-36 my-16 items-center text-center'>
            <div className='w-full justify-center flex'>
                <Image src={Props.image} alt="profile" className="rounded-full justify-center" width={400} height={400} />
            </div>
            <div className='flex flex-col'>
                <Container css={{
                    flexDirection: "row",
                    display: "flex",
                }}>
                    <Text className={"lg:text-5xl text-4xl"} weight={"bold"}>
                        Hi there, I'm
                    </Text>
                    <Text className={"lg:text-5xl text-4xl"} css={{
                        color: "$accents0"
                    }}>
                        {Props.name}
                    </Text>
                    <Text className={"lg:text-5xl text-4xl"} weight={"bold"}>
                        ,
                    </Text>
                </Container>
                <Container css={{
                    flexDirection: "row",
                    display: "flex",
                    color: "$accents0",
                    minHeight: "100px"

                }}>
                    <Text className={"lg:text-5xl text-4xl"} weight={"bold"} >
                        I'm a
                    </Text>
                    <TypeAnimation
                        sequence={Props.skills}
                        wrapper="div"
                        cursor={true}
                        repeat={Infinity}
                        className={`lg:text-5xl text-4xl`}
                    />
                    <Text className={"lg:text-5xl text-4xl"} weight={"bold"}>
                        developer
                    </Text>
                </Container>
            </div>
        </div>
    )
}
