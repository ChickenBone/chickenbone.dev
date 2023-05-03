'use client'

import React from 'react'
import { Container, Text, useTheme } from '@nextui-org/react'
import Image from 'next/image'
import { TypeAnimation } from 'react-type-animation'

interface HeroProps {
    name: string
    position: string
}

export const Hero = (Props: HeroProps) => {
    const { isDark, type, theme } = useTheme();

    return (
        <div className='w-full h-full content-center grid grid-cols-1 md:grid-cols-2 justify-between my-36 items-center text-center'>
            <div className='w-full justify-center flex'>
                <Image src={"/profile.png"} alt="profile" className="rounded-full justify-center" width={400} height={400} />
            </div>
            <div className='flex flex-col'>
                <Container css={{
                    flexDirection: "row",
                    display: "flex",
                    gap: "0.5rem"
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
                    gap: "0.5rem",
                    color: "$accents0"

                }}>
                    <Text className={"lg:text-5xl text-4xl"} weight={"bold"} >
                        I'm a
                    </Text>

                    <TypeAnimation
                        sequence={[
                            'NodeJS', // Types 'One'
                            1000, // Waits 1s
                            'ReactJS', // Deletes 'One' and types 'Two'
                            1000, // Waits 1s
                            'React Native', // Deletes 'One' and types 'Two'
                            1000, // Waits 1s
                            'Typescript', // Deletes 'One' and types 'Two'
                            1000, // Waits 1s
                        ]}
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
