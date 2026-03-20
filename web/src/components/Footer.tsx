import React from 'react'

const Footer = () => {
  return (
    <div className=' relative  z-10 text-center py-6 bg-black text-zinc-500 text-sm border-b border-white/10'>
        &copy; {new Date().getFullYear()} BlindTalk | Anonymous Video/Voice Chat
    </div>
  )
}

export default Footer