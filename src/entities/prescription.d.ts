export interface Detail {
	id: number
	quantity: number
	usage: string
	unit: string
	morningDose: number
	middayDose: number
	eveningDose: number
	nightDose: number
	medicineName: string
	prescriptionId: number
	medicineId: number
}

export interface Prescription {
	id: number
	timeCreated: string
	note: string
	checkupRecordId: number
	details: Detail[]
	code?: string
}
