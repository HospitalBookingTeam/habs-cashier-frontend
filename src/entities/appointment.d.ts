export interface AppointmentForGuest {
	numericalOrder: number | string
	date: string
	doctorId: number | string
	clinicalSymptom: string
	name: string
	phoneNo: string
	bhyt: string
	// bhxh: string
	dateOfBirth: Date | string | undefined
	address: string
	gender: number | string
}

export interface AppointmentForUser {
	patientId: number
	numericalOrder: number
	date: string
	doctorId: number
	clinicalSymptom: string
}
