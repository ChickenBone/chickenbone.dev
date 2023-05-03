'use client'
import React from "react";

interface CircleProps {
    color: string
}

export const Circle = (Props: CircleProps) => {
    return (
        <div className={`min-w-96 min-h-96 rounded-full ${Props.color}`}>
        </div>
    )
}