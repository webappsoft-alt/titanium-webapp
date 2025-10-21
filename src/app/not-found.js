import { Button } from '@/components/ui/button'
import { Result } from 'antd'
import Link from 'next/link'
import React from 'react'

const NoMatch = () => {
  return (
    <div className='w-full min-h-screen grid justify-center items-center'  >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Link href={'/'} replace >
          <Button size='md' className='bg-[#0a1f3c] text-sm whitespace-nowrap  text-white shadow hover:bg-slate-900/90' >
            Back Home
          </Button>
        </Link>}
      />
    </div>
  )
}

export default NoMatch
