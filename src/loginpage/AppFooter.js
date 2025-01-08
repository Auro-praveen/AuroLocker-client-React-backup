import React from 'react'
import './appFooter.css'
import { Link } from '@mui/material'

const AppFooter = () => {
  return (
    <div className='tuckit-footer'>
        <div className="foot-item-container">
            <label htmlFor="#"> Follow us on</label>
            <div className="foot-logo-container">
                <Link href='https://www.facebook.com/share/17ypJGWkuS/' className='foot-logo' target="_blank"><img src="/logos/fb.png" alt="*facebook" width={28} height={26} /></Link>
                <Link href='https://www.instagram.com/tuckit_lockers/profilecard/?igsh=Mjk2Mmg5MHZ4NjBr' className='foot-logo' target="_blank"><img src="/logos/instagram.png" alt="*facebook" width={28} height={26} /></Link>
                <Link href='https://www.linkedin.com/in/tuckit-lockers-38bba2324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' className='foot-logo' target="_blank"><img src="/logos/linkedin.png" alt="*facebook" width={28} height={26} /></Link>
                <Link href='https://youtube.com/@tuckitlockers?si=CnuuGp5ydq3nCPdW' className='foot-logo' target="_blank"><img src="/logos/youtubee.png" style={{marginTop: '-4.5px'}} alt="*facebook" width={28} height={34} /></Link>
            </div>
        </div>
    </div>
  )
}

export default AppFooter;
