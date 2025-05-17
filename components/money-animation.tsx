"use client"

import type React from "react"

import { useEffect, useState } from "react"
import "../styles/money-animation.css"

interface MoneyAnimationProps {
  count?: number
  speed?: "slow" | "normal" | "fast"
  density?: "low" | "medium" | "high"
}

export function MoneyAnimation({ count = 20, speed = "normal", density = "medium" }: MoneyAnimationProps) {
  const [moneyElements, setMoneyElements] = useState<React.ReactNode[]>([])

  useEffect(() => {
    const elements = []

    // Calculate actual count based on density
    const actualCount = density === "low" ? count * 0.7 : density === "high" ? count * 1.3 : count

    // Calculate speed multiplier
    const speedMultiplier = speed === "slow" ? 1.5 : speed === "fast" ? 0.7 : 1

    // Create money bills
    for (let i = 0; i < actualCount; i++) {
      const left = Math.random() * 100
      const delay = Math.random() * 5
      const duration = (7 + Math.random() * 10) * speedMultiplier
      const size = 30 + Math.random() * 20
      const rotation = Math.random() * 360

      elements.push(
        <div
          key={`money-${i}`}
          className="money"
          style={{
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            width: `${size}px`,
            height: `${size / 2}px`,
            transform: `rotate(${rotation}deg)`,
          }}
        />,
      )
    }

    // Create coins
    for (let i = 0; i < actualCount; i++) {
      const left = Math.random() * 100
      const delay = Math.random() * 5
      const duration = (5 + Math.random() * 8) * speedMultiplier
      const size = 20 + Math.random() * 15

      elements.push(
        <div
          key={`coin-${i}`}
          className="coin"
          style={{
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            width: `${size}px`,
            height: `${size}px`,
          }}
        />,
      )
    }

    setMoneyElements(elements)
  }, [count, speed, density])

  return <div className="money-animation-container">{moneyElements}</div>
}
