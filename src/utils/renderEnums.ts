export enum InsuranceSupportStatus {
	KHONG_HO_TRO,
	HO_TRO_MOT_PHAN,
	HO_TRO_TOAN_PHAN,
}

export const INSURANCE_TRANSLATION: {
	[key in keyof typeof InsuranceSupportStatus]: string
} = {
	KHONG_HO_TRO: 'Không hỗ trợ',
	HO_TRO_MOT_PHAN: 'Hỗ trợ một phần',
	HO_TRO_TOAN_PHAN: 'Hỗ trợ toàn phần',
}

export const translateEnumInsuranceStatus = (status: number) =>
	INSURANCE_TRANSLATION[
		InsuranceSupportStatus[status] as keyof typeof InsuranceSupportStatus
	]
