import React from 'react'
import Headers from '../../components/headers/Headers'
import Banners from '../../components/banners/Banners'
import Footers from '../../components/footers/Footers'
import Products_Trendy from '../../components/showproducts/Products_Trendy'
const HomePages = () => {
  return (
    <div>
      <Headers/>
      <Banners/>
      <Products_Trendy/>
      <Footers/>
      
    </div>
  )
}

export default HomePages
