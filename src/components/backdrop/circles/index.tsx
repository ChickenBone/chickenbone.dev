'use client'
import React from "react";

interface CircleProps {
    color: string
}

export const Circle = (Props: CircleProps) => {
    // Randomly move the circles around the screen continuously picking an initial position, speed, and direction
    // bounce off the edges of the screen ensuring the transition is smooth
    const [x, setX] = React.useState(Math.random() * 100)
    const [y, setY] = React.useState(Math.random() * 100)
    const [speed, setSpeed] = React.useState(Math.random() * 0.25)
    const [direction, setDirection] = React.useState(Math.random() * 360)

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (x > 100 || x < 0) {
                setDirection(Math.random() * 360)
            }
            if (y > 100 || y < 0) {
                setDirection(Math.random() * 360)
            }
            setX(x + speed * Math.cos(direction))
            setY(y + speed * Math.sin(direction))
        }, 10)
        return () => clearInterval(interval)
    }, [x, y, speed, direction])




    return (
        <div className={`w-[1100px] h-[900px] rounded-full ${Props.color}`} 
            style={{
                transform: `translate(${x}vw, ${y}vh)`,
                transition: 'all 0.1s ease-in-out'
            }}
        >
        </div>
    )
}
