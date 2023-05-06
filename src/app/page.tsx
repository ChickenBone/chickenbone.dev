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
import portfolio from '@/data/portfolio.json'
import React from 'react';


export default function Home() {

  return (
    <div className={'w-full h-full'}>
      <Hero
        name={portfolio.name}
        skills={portfolio.skills}
        image={portfolio.profileImage}
      />
      <div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 place-items-center'>
          <TextCard title="about">
            {portfolio.about}
          </TextCard>
          <div className='flex flex-col gap-6 align-middle justify-center'>
            <div className='col-span-1 md:col-span-2 '>
              <HeaderText startOpen endOpen={false}>experience</HeaderText>
            </div>
            {
              portfolio.experience.map((exp, index) => {
                return (
                  <ExperienceCard
                    key={index}
                    position={exp.position}
                    company={exp.company}
                    date={exp.time}
                    level={exp.level}
                    image={exp.image}
                  />
                )
              })
            }
          </div>
          <div className='col-span-1 md:col-span-2 place-self-start'>
            <HeaderText startOpen endOpen={false}>projects</HeaderText>
          </div>
          {
            portfolio.projects.map((project, index) => {
              if (index % 2 == 0 && index == portfolio.projects.length - 1) {
                return (
                  <div className='col-span-1 md:col-span-2 w-full '>
                    <ProjectCard
                      key={index}
                      title={project.name}
                      role={project.position}
                      time={project.time}
                      srcUrl={project.url}
                    />
                  </div>
                )
              } else {
                return (
                  <div className='col-span-1 w-full'>
                    <ProjectCard
                      key={index}
                      title={project.name}
                      role={project.position}
                      time={project.time}
                      srcUrl={project.url}
                    />
                  </div>
                )}
              })
          }
          <div className='col-span-1 md:col-span-2 place-self-start'>
            <HeaderText startOpen endOpen={false}>depricated</HeaderText>
          </div>
          {
            portfolio.depricatedProjects.map((project, index) => {
              return (
                <DepricatedCard
                  key={index}
                  position={project.position}
                  company={project.name}
                  date={project.time}
                  image={project.image}
                />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
