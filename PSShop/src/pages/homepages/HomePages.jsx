// eslint-disable-next-line no-unused-vars
import React from 'react'
import Headers from '../../components/headers/Headers'
import Banners from '../../components/banners/Banners'
import Footers from '../../components/footers/Footers'
import Products_Limited from '../../components/showproducts/Products_Limited'
import Support from '../../components/supports/Support'
import Products_Trendy from '../../components/showproducts/Products_Trendy'
import BlogCards from '../../components/blogcards/BlogCards'
import CountDown from '../../components/cowndown/CountDown'
const HomePages = () => {
  return (
    <div>
      <Headers />
      <Banners />
      <BlogCards />
      
      <Products_Trendy />
      <CountDown />
      <br /><br />
      <Products_Limited />
      <Support />
      <Footers />

    </div>
  )
}

export default HomePages
