import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { MedicineDetail } from '../entities/medicine'
dayjs.extend(utc)

export const formatDate = (date: string | number, format = 'DD/MM/YYYY') => {
	return dayjs(date).format(format)
}

export const formatCurrency = (amount: number | string) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(Number(amount))
}

export const getLocalTimeFromUTC = (date: number | string) => {
	return dayjs(date).utc().local().valueOf()
}

export const renderDoseContent = (med: MedicineDetail) => {
	let morning = ''
	let midday = ''
	let evening = ''
	let night = ''

	const { morningDose, middayDose, eveningDose, nightDose } = med

	if (!!morningDose && morningDose > 0) {
		morning = `Sáng: ${morningDose}`
	}
	if (!!middayDose && middayDose > 0) {
		midday = `Trưa: ${middayDose}`
	}
	if (!!eveningDose && eveningDose > 0) {
		evening = `Chiều: ${eveningDose}`
	}
	if (!!nightDose && nightDose > 0) {
		night = `Tối: ${nightDose}`
	}
	return [morning, midday, evening, night]
		.filter((day) => day !== '')
		.join('; ')
}
