import { Bill } from './bill'

export interface Patient {
	id: number
	phoneNumber: string
	name: string
	gender: number
	dateOfBirth: string
	address: string
	bhyt: string
}
export interface IcdDiseases {
	icdDiseaseId: number
	icdDiseaseName: string
	icdCode: string
}

export interface ReExamCheckup {
	date: string
	operationIds: number[]
	note: string
}
export interface HistoryCheckupRecord {
	bill: Bill[]
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
	icdDiseases?: IcdDiseases[]
	isReExam: boolean
	qrCode: string
	reExamTreeCode: string
	hasReExam: boolean
	reExamNote?: any
	address: string
	reExam?: ReExamCheckup
	roomNumber?: string
	floor?: string
	code?: string
}

export interface HistoryTestRecord {
	id: number
	date: string
	numericalOrder: number
	status: number
	resultFileLink: string
	patientName: string
	operationId: number
	operationName: string
	roomNumber: string
	floor: string
	roomId: number
	patientId: number
	checkupRecordId: number
	doctorId: number
	doctorName: string
	qrCode: string
	resultDescription?: any
	failReason?: string
	code?: string
	requestDoctor: string
	bill: Bill
	patient: Patient
}
