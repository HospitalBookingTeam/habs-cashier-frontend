export interface Patient {
	id: number
	phoneNumber: string
	name: string
	gender: number
	dateOfBirth: string
	address: string
	provinceId: number
	districtId: number
	wardId: number
	fullAddress: string
	bhyt: string
	accountPhoneNo?: any
	accountId: number
}

export interface UserAccount {
	id: number
	phoneNumber: string
	email: string
	name: string
	patients: Patient[]
}

export interface PatientItemProps
	extends React.ComponentPropsWithoutRef<'div'>,
		Patient {}
