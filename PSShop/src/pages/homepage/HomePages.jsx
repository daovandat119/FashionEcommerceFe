import React from 'react'
import Headers from '../../components/headers/Headers'
import Banner from '../../components/banners/Banner'
import Footers from '../../components/footers/Footers'
import Support from '../../components/support/Support'

const HomePages = () => {
  return (
    <div>
      <Headers/>
      <Banner/>
      
      <Support/>
      <Footers/>
    </div>
  )
}

export default HomePages
