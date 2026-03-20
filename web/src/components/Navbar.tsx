"use client"
import React from 'react'
import {motion} from 'framer-motion'
import { Sparkle } from 'lucide-react'

const Navbar = ({show}:{show: boolean}) => {
  if (!show) {
    return null;
  }
  return (
    <motion.div
    initial={{y:-40,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{duration:0.5}}
    className=' w-full fixed top-0 left-0 right-0 z-30 bg-black/50 backdrop-blur border-b border-white/10'
    >
        <div className=' max-w-7xl mx-auto px-6 py-4 flex items-center gap-3'>
            <span className=' w-9 h-9 flex items-center justify-center bg-white/10 rounded-xl'>
            <Sparkle color='white' size={18} />
            </span>
            <span className=' text-white font-semibold text-lg tracking-tight'>
                BlindTalk
            </span>
        </div>
        
    </motion.div>
  )
}

export default Navbar