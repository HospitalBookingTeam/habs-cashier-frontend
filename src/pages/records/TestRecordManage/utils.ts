import { TestRecord } from '@/entities/record'
import { Room } from '@/entities/room'
import {
	TestRecordStatus,
	translateTestRecordStatus,
} from '@/utils/renderEnums'

export const sortData = (
	data: TestRecord[],
	payload: {
		sortBy: keyof TestRecord | null
		reversed: boolean
		search: string
	}
) => {
	const { sortBy } = payload

	if (!sortBy) {
		return data
	}

	return [...data].sort((a, b) => {
		if (typeof a[sortBy] === 'number' && typeof b[sortBy] === 'number') {
			const num_sort_a = a[sortBy] as number
			const num_sort_b = b[sortBy] as number

			if (payload.reversed) {
				return num_sort_a - num_sort_b
			}

			return num_sort_b - num_sort_a
		}
		const _a = a[sortBy]?.toString() ?? '---'
		const _b = b[sortBy]?.toString() ?? '---'

		if (payload.reversed) {
			return _b.localeCompare(_a)
		}
		return _a.localeCompare(_b)
	})
}

const hiddenStatus = [
	TestRecordStatus.DA_HUY,
	TestRecordStatus.DA_DAT_LICH,
	TestRecordStatus.CHUA_DAT_LICH,
	TestRecordStatus.DA_XOA,
]

// export const statusToExludeList = [
// {
// 	label: translateTestRecordStatus(TestRecordStatus.CHUA_DAT_LICH),
// 	value: TestRecordStatus.CHUA_DAT_LICH.toString(),
// },
// {
// 	label: translateTestRecordStatus(TestRecordStatus.DA_HUY),
// 	value: TestRecordStatus.DA_HUY.toString(),
// },
// {
// 	label: translateTestRecordStatus(TestRecordStatus.DA_XOA),
// 	value: TestRecordStatus.DA_XOA.toString(),
// },
// ]

// export const statusToExludeListDefaultValues = statusToExludeList.map(
// 	(item) => item.value
// )

export const statusToIncludeList = Object.keys(TestRecordStatus)
	.filter(
		(val) =>
			// !statusToExludeListDefaultValues.includes(val as string) &&
			!isNaN(Number(val)) && !hiddenStatus.includes(Number(val))
	)
	.map((value) => ({
		label: translateTestRecordStatus(Number(value)),
		value: value.toString(),
	}))

export const mapColorToStatus = (status: TestRecordStatus) => {
	switch (status) {
		case TestRecordStatus.CHECKED_IN:
			return 'green'
		case TestRecordStatus.DA_THANH_TOAN:
			return 'blue'
		case TestRecordStatus.DANG_TIEN_HANH:
			return 'orange'
		case TestRecordStatus.CHO_KET_QUA:
			return 'pink'
		case TestRecordStatus.HOAN_THANH:
			return 'indigo'
		default:
			return 'gray'
	}
}

export const formatRoomOptions = (roomData?: Room[]) =>
	roomData?.map((item) => ({
		...item,
		value: item.id.toString(),
		label: `${item.roomTypeName} ${item.roomNumber} - Tầng ${item.floor}`,
	})) ?? []
