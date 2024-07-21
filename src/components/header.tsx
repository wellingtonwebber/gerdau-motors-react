import { ChevronDown } from 'lucide-react'

import gerdauLogo from '../assets/GGB.png'

export function Header() {
  return (
    <div className="max-w-[1200px] mx-auto flex items-center justify-between mx-4">
      <div className="flex items-center gap-3">
        <div className="ml-8 flex items-center gap-2.5 max-w-16">
          <img src={gerdauLogo} alt="GGB.png" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-sm font-medium">Wellington Webber</span>
          <span className="text-xs text-zinc-400">wellington.webber@gerdau.com.br</span>
        </div>
        <img
          src="https://github.com/wellingtonwebber.png"
          className="size-8 rounded-full"
          alt=""
        />
        <ChevronDown className="size-4 text-zinc-600" />
      </div>
    </div>
  )
}
