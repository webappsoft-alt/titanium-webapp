'use client'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { Header2 } from '@/components/layout/header2'
import { store } from '@/lib/redux/store'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'

const Providers = ({ children }) => {
  const pathname = usePathname()
  const isWeightCal = pathname === '/weight-calculator'
  const isDashboardRoutes = pathname.startsWith('/dashboard')
  return (
    <>
      <Provider store={store}>
        <AntdRegistry>
          {isWeightCal ?
            <Header2 /> :
            <Header />}
          {children}
          {!isDashboardRoutes&& <Footer />}
          <Toaster />
        </AntdRegistry>
      </Provider>
    </>
  )
}

export default Providers