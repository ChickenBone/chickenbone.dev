'use client'

import { useServerInsertedHTML } from 'next/navigation'
import { CssBaseline } from '@nextui-org/react'
import { createTheme, NextUIProvider } from '@nextui-org/react'
interface ProvidersProps {
    children: React.ReactNode
}
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import darkJSON from '../themes/dark.json'
import lightJSON from '../themes/light.json'


export default function Providers(Props: ProvidersProps) {
    useServerInsertedHTML(() => {
        return <>{CssBaseline.flush()}</>
    })

    const darkTheme = createTheme(darkJSON)

    const lightTheme = createTheme(lightJSON)
    return (
        <>
            <NextThemesProvider
                defaultTheme="light"
                attribute="class"
                value={{
                    light: lightTheme.className,
                    // dark: darkTheme.className
                }}
            >
                <NextUIProvider>
                    {Props.children}
                </NextUIProvider>
            </NextThemesProvider>
        </>
    )
}