import { PatientItemProps } from '@/entities/user'
import { forwardRef } from 'react'
import { Stack, Text } from '@mantine/core'
import { formatDate } from '@/utils/formats'

const PatientOption = forwardRef<HTMLDivElement, PatientItemProps>(
	({ name, gender, dateOfBirth, bhyt, ...others }: PatientItemProps, ref) => (
		<div ref={ref} {...others}>
			<Stack spacing={'xs'}>
				<Text>
					<Text span weight={500}>
						{name}
					</Text>{' '}
					- {gender === 0 ? 'Nam' : 'Nữ'}
				</Text>

				<Text size="sm">
					Ngày sinh: {formatDate(dateOfBirth, 'DD/MM/YYYY')} - BHYT:{' '}
					{bhyt ?? '---'}
				</Text>
			</Stack>
		</div>
	)
)

export default PatientOption
