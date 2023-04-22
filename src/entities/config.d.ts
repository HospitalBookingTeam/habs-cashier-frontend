import { CONFIG_TYPES } from '@/utils/renderEnums'

export type ConfigRequest = {
	searchTerm?: string
	type?: CONFIG_TYPES
	id?: number
}

export type ConfigItem = {
	id: number
	name: string
	key: string
	value: string
	description: string
	type: number
}
