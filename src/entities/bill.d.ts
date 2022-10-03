export interface BillDetail {
	id: number
	price: number
	quantity: number
	subTotal: number
	insuranceStatus: number
	operationId: number
	operationName: string
}

export interface Bill {
	id: number
	timeCreated: string
	total: number
	totalInWord: string
	status: number
	content: string
	patientName: string
	phoneNo?: any
	accountPhoneNo?: any
	patientId: number
	gender: number
	dateOfBirth: string
	qrCode?: any
	cashierName: string
	cashierId: number
	details?: BillDetail[]
}

export type BillParams = {
	status?: number
	searchTerm?: string
	from?: string
	to?: string
	qrCode?: string
}
