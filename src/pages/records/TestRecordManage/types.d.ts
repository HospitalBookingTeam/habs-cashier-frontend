import { CheckupRecord } from '@/entities/record'

export interface ThProps {
	children: React.ReactNode
	reversed: boolean
	sorted: boolean
	onSort(): void
	width?: number
}

export interface StatusToExclude {
	label: string
	value: string
}
