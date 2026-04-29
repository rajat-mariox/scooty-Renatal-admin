import { ButtonHTMLAttributes, ReactNode } from "react"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode
}

const BASE =
    "inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FC4C02] to-[#FF7A45] text-white font-bold rounded-xl shadow-lg transition-all hover:opacity-95 active:opacity-90 disabled:opacity-55 disabled:cursor-not-allowed"

export default function PrimaryButton({ children, className = "", ...rest }: Props) {
    return (
        <button {...rest} className={`${BASE} ${className}`}>
            {children}
        </button>
    )
}
