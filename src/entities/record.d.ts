import { PaginationMeta } from './pagination'

export interface CheckupRecord {
	id: number
	status: number
	numericalOrder: number
	date: string
	doctorName: string
	patientName: string
	departmentName: string
	isReExam: boolean
	qrCode: string
	floor: string
	roomNumber: string
}

export interface CheckupRecordList extends PaginationMeta {
	data: CheckupRecord[]
}

export interface CheckupListGetRequest {
	from: string
	to: string
	searchTerm: string
	roomIds: number[]
	statusToInclude: number[]
	statusToExclude: number[]
	pageIndex: number
	pageSize: number
}

export interface TestRecord {
	id: number
	date: string
	numericalOrder?: number
	doctor: string
	status: number
	patientName: string
	operationName: string
	floor: string
	roomNumber: string
}

export interface TestRecordList extends PaginationMeta {
	data: TestRecord[]
}

export interface TestListGetRequest {
	from: string
	to: string
	searchTerm: string
	roomIds: number[]
	statusToInclude: number[]
	statusToExclude: number[]
	pageIndex: number
	pageSize: number
}
