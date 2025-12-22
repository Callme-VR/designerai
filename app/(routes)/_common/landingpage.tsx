"use client"
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';
import Aipromptinput from '@/components/webcomponents/aipromptinput'
import React, { useState } from 'react'

export default function Landingpage() {

  const [promptText, setPromptText] = useState<string>("")
  const handleSubmitSuggestion = (val: string) => {
    setPromptText(val)
  }

  const suggestionsList = [
    {
      label: "Finance Tracker",
      icon: "💸",
      value: `Finance app statistics screen. Current balance at top with dollar amount, bar chart showing spending over months (Oct-Mar) with month selector pills below, transaction list with app icons, amounts, and categories. Bottom navigation bar. Mobile app, single screen. Style: Dark theme, chunky rounded cards, playful but professional, modern sans-serif typography, Gen Z fintech vibe. Fun and fresh, not corporate.`,
    },
    {
      label: "Fitness Activity",
      icon: "🔥",
      value: `Fitness tracker summary screen. Large central circular progress ring showing steps and calories with neon glow. Line graph showing heart rate over time. Bottom section with grid of health metrics (Sleep, Water, SpO2). Mobile app, single screen. Style: Deep Dark Mode (OLED friendly). Pitch black background with electric neon green and vibrant blue accents. High contrast, data-heavy but organized, sleek and sporty aesthetic.`,
    },
    {
      label: "Food Delivery",
      icon: "🍔",
      value: `Food delivery home feed. Top search bar with location pin. Horizontal scrolling hero carousel of daily deals. Vertical list of restaurants with large delicious food thumbnails, delivery time badges, and rating stars. Floating Action Button (FAB) for cart. Mobile app, single screen. Style: Vibrant and Appetizing. Warm colors (orange, red, yellow), rounded card corners, subtle drop shadows to create depth. Friendly and inviting UI.`,
    },
    {
      label: "Travel Booking",
      icon: "✈️",
      value: `Travel destination detail screen. Full-screen immersive photography of a tropical beach. Bottom sheet overlay with rounded top corners containing hotel title, star rating, price per night, and a large "Book Now" button. Horizontal scroll of amenity icons. Mobile app, single screen. Style: Minimalist Luxury. ample whitespace, elegant serif typography for headings, clean sans-serif for body text. Sophisticated, airy, high-end travel vibe.`,
    },
    {
      label: "E-Commerce",
      icon: "👟",
      value: `Sneaker product page. Large high-quality product image on a light gray background. Color selector swatches, size selector grid, and a sticky "Add to Cart" button at the bottom. Title and price in bold, oversized typography. Mobile app, single screen. Style: Neo-Brutalism. High contrast, thick black outlines on buttons and cards, hard shadows (no blur), unrefined geometry, bold solid colors (yellow and black). Trendy streetwear aesthetic.`,
    },
    {
      label: "Meditation",
      icon: "🧘",
      value: `Meditation player screen. Central focus is a soft, abstract breathing bubble animation. Play/Pause controls and a time slider below. Background is a soothing solid pastel sage green. Mobile app, single screen. Style: Soft Minimal. Rounded corners on everything, low contrast text for relaxation, pastel color palette, very little UI clutter. Zen, calming, and therapeutic atmosphere.`,
    },
  ];

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center px-4 py-8'>
      <div className='w-full max-w-4xl mx-auto flex flex-col items-center justify-center space-y-8'>
        
        {/* Header Section */}
        <div className='text-center space-y-6 w-full'>
          <div className='space-y-4'>
            <h1 className='font-semibold tracking-tight sm:text-5xl text-4xl text-center'>
              Design Mobile App <br className='md:hidden' />
              <span className='block mx-auto max-w-2xl text-center font-medium text-foreground leading-relaxed mt-2'>
                in minutes
              </span>
            </h1>
            <p className='mx-auto max-w-2xl text-center font-medium text-foreground leading-relaxed sm:text-lg text-base'>
              go from Idea to beautiful app in minutes by Prompting AI
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className='w-full max-w-3xl flex flex-col items-center space-y-6 relative z-50'>
          <div className='w-full'>
            <Aipromptinput 
              className="ring-2 ring-primary" 
              prompt={promptText} 
              setPromptText={setPromptText} 
              isLoading={false} 
              onSubmit={() => { }} 
              hiddenSubmitBtn={true} 
            />
          </div>

          {/* Suggestions */}
          <div className='w-full flex justify-center'>
            <Suggestions className="w-full">
              {suggestionsList.map((s) => (
                <Suggestion 
                  key={s.label} 
                  suggestion={s.value} 
                  className='text-xs h-7 px-2.5 py-1'
                  onClick={() => { handleSubmitSuggestion(s.value) }}
                >
                  {s.icon}
                  <span className="ml-1">{s.label}</span>
                </Suggestion>
              ))}
            </Suggestions>
          </div>
        </div>

        {/* Background Effect */}
        <div className="absolute -translate-x-1/2 left-1/2 w-312.5 h-187.5 top-[80%] -z-10">
          <div className="-translate-x-1/2 absolute bottom-[calc(100%-300px)] left-1/2 h-125 w-125 opacity-20 bg-radial-primary"></div>
          <div className="absolute -mt-2.5 size-full rounded-[50%] bg-primary/20 opacity-70 [box-shadow:0_-15px_24.8px_var(--primary)]"></div>
          <div className="absolute z-0 size-full rounded-[50%] bg-background"></div>
        </div>

        {/* Recent Projects Section */}
        <div className='w-full max-w-3xl pt-8 border-t border-border'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Recent Projects
            </h1>
            <p className='text-muted-foreground mt-2'>
              Your recently created app designs will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
