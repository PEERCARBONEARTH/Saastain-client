import Image from 'next/image'
import React from 'react'

function Footer() {
  return (
    <footer className="flex justify-between mx-12">
    <p>© 2024 Peer Carbon. All rights reserved.</p>
    <div className="flex ">
        <Image
                        src="/images/linkedin.png"
                        width={30}
                        height={20}
                        alt=""
                        className="mr-4"
        />
        <Image
                        src="/images/twitter.png"
                        width={30}
                        height={20}
                        alt=""
                        />
    </div>			
</footer>
  )
}

export default Footer;