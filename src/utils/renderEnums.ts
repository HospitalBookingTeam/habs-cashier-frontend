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
export enum CONFIG_TYPES {
	DEV,
	HOSPITAL,
	SUPER,
	CHECKUP_RECORD,
	TEST_RECORD,
	DEMO_SCRIPT,
	SIMULATE_SCHEDULE,
}

export const convertConfigEnumValueToKey = (value: number) => {
	let key = 'DEV'

	for (const [_key, _value] of Object.entries(CONFIG_TYPES)) {
		if (Number(_value) === value) {
			key = _key
			break
		}
	}
	return key.toLowerCase()
}

export enum CheckupRecordStatus {
	CHO_TAI_KHAM,
	DA_DAT_LICH,
	DA_THANH_TOAN,
	CHECKED_IN,
	DANG_KHAM,
	CHO_THANH_TOAN_XN,
	CHECKED_IN_SAU_XN,
	CHO_KET_QUA_XN,
	DA_CO_KET_QUA_XN,
	KET_THUC,
	CHUYEN_KHOA,
	NHAP_VIEN,
	DA_HUY,
	DA_XOA,
}

export const CHECKUP_TRANSLATION: {
	[key in keyof typeof CheckupRecordStatus]: string
} = {
	CHO_TAI_KHAM: 'Chờ tái khám',
	DA_DAT_LICH: 'Đã đặt lịch',
	DA_THANH_TOAN: 'Đã đặt lịch',
	CHECKED_IN: 'Đã checkin',
	DANG_KHAM: 'Đang khám',
	CHO_THANH_TOAN_XN: 'Đã chỉ định xét nghiệm',
	CHECKED_IN_SAU_XN: 'Đã checkin sau xét nghiệm',
	CHO_KET_QUA_XN: 'Đợi xét nghiệm',
	DA_CO_KET_QUA_XN: 'Đã có KQXN',
	KET_THUC: 'Kết thúc',
	CHUYEN_KHOA: 'Chuyển khoa',
	NHAP_VIEN: 'Nhập viện',
	DA_HUY: 'Đã hủy',
	DA_XOA: 'Đã xóa',
}

export const CHECKUP_TRANSLATION_RE_EXAM: {
	[key in keyof typeof CheckupRecordStatus]: string
} = {
	DA_THANH_TOAN: 'Tái khám',
	CHO_TAI_KHAM: 'Chờ tái khám',
	DA_DAT_LICH: 'Đã đặt lịch',
	CHECKED_IN: 'Đã checkin',
	DANG_KHAM: 'Đang khám',
	CHO_THANH_TOAN_XN: 'Đã chỉ định xét nghiệm',
	CHECKED_IN_SAU_XN: 'Đã checkin sau xét nghiệm',
	CHO_KET_QUA_XN: 'Đang xét nghiệm',
	DA_CO_KET_QUA_XN: 'Đã có KQXN (tái khám)',
	KET_THUC: 'Kết thúc',
	CHUYEN_KHOA: 'Chuyển khoa',
	NHAP_VIEN: 'Nhập viện',
	DA_HUY: 'Đã hủy',
	DA_XOA: 'Đã xóa',
}

export const translateCheckupRecordStatus = (
	status: number,
	isReExam = false
) =>
	isReExam
		? CHECKUP_TRANSLATION_RE_EXAM[
				CheckupRecordStatus[status] as keyof typeof CheckupRecordStatus
		  ]
		: CHECKUP_TRANSLATION[
				CheckupRecordStatus[status] as keyof typeof CheckupRecordStatus
		  ]

export enum TestRecordStatus {
	CHUA_DAT_LICH,
	DA_DAT_LICH,
	DA_THANH_TOAN,
	CHECKED_IN,
	DANG_TIEN_HANH,
	CHO_KET_QUA,
	HOAN_THANH,
	DA_HUY,
	DA_XOA,
}

export const TEST_RECORD_TRANSLATION: {
	[key in keyof typeof TestRecordStatus]: string
} = {
	CHUA_DAT_LICH: 'Chưa đặt lịch',
	DA_DAT_LICH: 'Đã đặt lịch',
	DA_THANH_TOAN: 'Đã thanh toán',
	CHECKED_IN: 'Đã checkin',
	DANG_TIEN_HANH: 'Đang xét nghiệm',
	CHO_KET_QUA: 'Chờ kết quả',
	HOAN_THANH: 'Hoàn thành',
	DA_HUY: 'Đã hủy',
	DA_XOA: 'Đã xóa',
}

export const translateTestRecordStatus = (status: number) =>
	TEST_RECORD_TRANSLATION[
		TestRecordStatus[status] as keyof typeof TestRecordStatus
	]

export enum SessionType {
	SANG,
	CHIEU,
	TOI,
}

export const SESSION_TRANSLATION: {
	[key in keyof typeof SessionType]: string
} = {
	SANG: 'Sáng',
	CHIEU: 'Chiều',
	TOI: 'Tối',
}

export const translateSession = (status: number) =>
	SESSION_TRANSLATION[SessionType[status] as keyof typeof SessionType]
