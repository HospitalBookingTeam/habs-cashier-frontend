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
	title?: string
}

export type BillParams = {
	status?: number
	searchTerm?: string
	from?: string
	to?: string
	qrCode?: string
}

export type BillConfirmResponse = {
	doctorName: string
	numericalOrder: number
	floor: string
	roomNumber: string
	departmentName: string
	date: string
	patientName: string
	clinicalSymptom: string
	checkupRecordId: number
	bill: Bill
}

export interface PatientData {
	id: number
	phoneNumber: string
	name: string
	gender: number
	dateOfBirth: string
	address?: any
	provinceId?: any
	districtId?: any
	wardId?: any
	fullAddress: string
	bhyt: string
	accountPhoneNo?: any
	accountId?: any
}

export interface CheckupRecord {
	bill?: Bill[]
	patientData: PatientData
	testRecords: any[]
	prescription?: any
	id: number
	status: number
	numericalOrder: number
	estimatedStartTime: string
	estimatedDate: string
	date: string
	clinicalSymptom: string
	diagnosis?: any
	doctorAdvice?: any
	pulse?: any
	bloodPressure?: any
	temperature?: any
	doctorName: string
	patientName: string
	departmentName: string
	patientId: number
	doctorId: number
	departmentId: number
	icdDiseases: any[]
	isReExam: boolean
	roomId: number
	roomNumber: string
	floor: string
	roomType: string
	qrCode: string
	hasReExam: boolean
	reExamNote?: any
	address: string
	reExamTreeCode: string
	code?: string
}

export interface BillPayResponse {
	hasError: boolean
	errMessage: string
	checkupRecords: CheckupRecord[]
	testRecords: any[]
}
