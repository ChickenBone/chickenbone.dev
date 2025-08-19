'use client'
import { HeaderText } from '../components/text/headerText'
import { Hero } from '@/components/hero/hero';
import { TextCard } from '@/components/card/textCard';
import { ExperienceCard } from '@/components/card/expCard';
import { ProjectCard } from '@/components/card/projectCard';
import { DepricatedCard } from '@/components/card/deprCard';
import portfolio from '@/data/portfolio'
import React from 'react';
import { Container, Text } from '@nextui-org/react'
import Link from 'next/link'

function NotePreview({ title, href, excerpt }: { title: string; href: string; excerpt?: string }) {
  return (
    <div className='w-full h-fit'>
      <Container css={{ backgroundColor: "$blurBox" }} className={`group w-full h-fit p-6 flex flex-col gap-2 rounded-[40px]
        min-h-[150px] max-h-[150px]
        `}>
        <Link href={href}>
          <Text
            css={{
              color: "$accents0"
            }}
            className='text-xl font-bold dark:text-zinc-100 no-underline group-hover:underline'>
            {title}
          </Text>
        </Link>
        {excerpt ? <Text className='text-sm opacity-80 text-zinc-700 dark:text-zinc-300'>{excerpt}</Text> : null}
      </Container>
    </div>
  )
}

export default function Home() {

  const [notes, setNotes] = React.useState<{ title: string; href: string; excerpt?: string }[]>([])
  React.useEffect(() => {
    fetch('/api/notes').then(r => r.json()).then((d) => {
      const items = (d.notes || []) as any[]
      setNotes(items.slice(0, 3))
    }).catch(() => { })
  }, [])

  return (
    <div className={'w-full h-full'}>
      {/* SEO: meaningful H1 for name/role, visually hidden to keep design intact */}
      <h1 className="sr-only">{`${portfolio.fullName} — ${portfolio.jobTitle} in ${portfolio.location.city}, ${portfolio.location.region}`}</h1>
      <Hero
        name={portfolio.name}
        skills={portfolio.skills}
        image={portfolio.profileImage}
        imageAlt={portfolio.profileImageAlt}
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
                )
              }
            })
          }

          {/* Notes section */}
          <div className='col-span-1 md:col-span-2 place-self-start'>
            <HeaderText startOpen endOpen={false}>notes</HeaderText>
          </div>
          {notes.length === 0 ? (
            <div className='col-span-1 md:col-span-2 w-full'>
              <div className={`w-full h-fit p-6 rounded-[40px] backdrop-blur-2xl bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-white/10`}>
                <p className='opacity-70 text-zinc-800 dark:text-zinc-300'>No notes found.</p>
              </div>
            </div>
          ) : (
            notes.map((n, idx) => (
              idx % 2 === 0 && idx === notes.length - 1 ? (
                <div key={n.href} className='col-span-1 md:col-span-2 w-full'>
                  <NotePreview title={n.title} href={n.href} excerpt={n.excerpt} />
                </div>
              ) : (
                <div key={n.href} className='col-span-1 w-full'>
                  <NotePreview title={n.title} href={n.href} excerpt={n.excerpt} />
                </div>
              )
            ))
          )}
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
