import { Stack } from '@mantine/core'
import { useState } from 'react'
import 'dayjs/locale/vi'

type BookConfirmProps = {
	opened: boolean
	onClose: () => void
}
type PatientProfileProps = {
	name: string
	phone: string
	bhyt: string
	bhxh: string
	dob: string
	addr: string
	gender: 'male' | 'female'
}
type BookFormProps = {
	symptom: string
} & PatientProfileProps

const BookConfirm = ({ opened, onClose }: BookConfirmProps) => {
	const [isGuest, setIsGuest] = useState(true)
	const [userAcc, setUserAcc] = useState<string | null>('')

	const onSubmit = async (values: BookFormProps) => {
		console.log('values', values)
	}

	return <Stack sx={{ position: 'relative' }}></Stack>
}
export default BookConfirm
