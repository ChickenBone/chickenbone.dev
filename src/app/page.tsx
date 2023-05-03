'use client'

import { Inter } from 'next/font/google'
import { Card, Grid, Text, Button, Row } from "@nextui-org/react";
import { HeaderText } from '../components/text/headerText'
import { useTheme as useNextTheme } from 'next-themes'
import { Switch, useTheme } from '@nextui-org/react'
import { Hero } from '@/components/hero/hero';
import { TextCard } from '@/components/card/textCard';
import { ExperienceCard } from '@/components/card/expCard';
import { ProjectCard } from '@/components/card/projectCard';
import { DepricatedCard } from '@/components/card/deprCard';
import { Footer } from '@/components/footer/footer';
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { setTheme } = useNextTheme();
  const { isDark, type, theme } = useTheme();

  return (
    <div className={'w-full h-full'}>
      <Hero
        name="Wyatt"
        position="NodeJS"
      />
      <div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-24'>
          <TextCard title="about">
            I am a highly motivated and experienced software developer with a proven track record of delivering high-quality software solutions. With proficiency in languages such as ReactJS, TypeScript, and Node.js, I have a strong foundation in both front-end and back-end development.
            <br />
            <br />
            My previous positions have allowed me to work collaboratively with large development teams and lead other developers on projects. I am skilled in project management, database administration, and UI/UX design. My attention to detail, persistence, and problem-solving abilities have enabled me to develop software quickly and efficiently.
            <br />
            <br />
            In my free time, I enjoy exploring new technologies and staying up-to-date on industry trends. I am passionate about leveraging technology to solve real-world problems and am always eager to take on new challenges.
          </TextCard>
          <div className='flex flex-col gap-6 align-middle justify-center'>
            <div className='col-span-1 md:col-span-2'>
              <HeaderText startOpen endOpen={false}>experience</HeaderText>
            </div>
            <ExperienceCard
              position='Code Tutor'
              company='Code Ninjas'
              date='Jan 2019 - Jul 2019'
              level='Part Time'
              image='/code_ninjas.png'
            />
            <ExperienceCard
              position='Solutions Architect'
              company='Denver Public Schools'
              date='Jal 2019 - Jul 2022'
              level='Apprenticeship'
              image='/dps.png'
            />
            <ExperienceCard
              position='Lead Developer'
              company='Herd of Zebras'
              date='Sept 2022 - Mar 2023'
              level='Full Time'
              image='/hoz.png'
            />
            <ExperienceCard
              position='Software Developer'
              company='Whoopeek'
              date='May 2023 - Present'
              level='Part Time'
              image='/whoopeek.png'
            />
          </div>
          <div className='col-span-1 md:col-span-2'>
            <HeaderText startOpen endOpen={false}>projects</HeaderText>
          </div>
          <ProjectCard
            title='Revvy'
            role='Lead Developer'
            time='2019 - Present'
            srcUrl='https://revvy.dev'
          />
          <ProjectCard
            title='Pacakger'
            role='NodeJS Developer'
            time='2019 - Present'
            srcUrl='https://revvy.dev'
          />

          <div className='col-span-1 md:col-span-2'>
            <HeaderText startOpen endOpen={false}>depricated</HeaderText>
          </div>
          <DepricatedCard
            position='Laravel Developer'
            company='Denver vARTCC'
            date='Nov 2018'
            image='/denartcc.png'
          />
          <DepricatedCard
            position='Vue Developer'
            company='Mint Development'
            date='Jan 2019'
            image='/mint.png'
          />
          <DepricatedCard
            position='NodeJS Developer'
            company='Hermes'
            date='Sept 2020'
            image='/hermes.png'
          />

        </div>

        The current theme is: {type}
        <Switch
          checked={isDark}
          onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
        />
      </div>
    </div>
  )
}
