'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { getConsent, onConsentChange } from '@/lib/consent'

const ID = process.env.NEXT_PUBLIC_METRIKA_ID

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void
  }
}

function MetrikaPageview({ enabled }: { enabled: boolean }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!enabled || !ID || typeof window.ym !== 'function') return
    const url = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '')
    window.ym(Number(ID), 'hit', url)
  }, [enabled, pathname, searchParams])

  return null
}

export function YandexMetrika() {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    setAllowed(getConsent() === 'accepted')
    return onConsentChange((v) => setAllowed(v === 'accepted'))
  }, [])

  if (!ID || !allowed) return null

  return (
    <>
      <Script
        id="ym-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
            ym(${ID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
          `,
        }}
      />
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${ID}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
      <MetrikaPageview enabled={allowed} />
    </>
  )
}
