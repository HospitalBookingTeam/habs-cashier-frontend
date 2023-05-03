import RowWithLabel from '@/components/Row'
import { Patient } from '@/entities/history'
import { formatDate } from '@/utils/formats'
import { Stack, Title, Group } from '@mantine/core'

const PatientInfo = ({ data }: { data?: Patient }) => {
	return (
		<Stack>
			<Title order={3} px="0" size="h4">
				Thông tin người bệnh
			</Title>
			<Stack sx={{ gap: 12 }}>
				<Group spacing={0}>
					<RowWithLabel
						label={'Họ và tên'}
						labelSpan={6}
						content={data?.name}
					/>
					<RowWithLabel
						label={'Ngày sinh'}
						content={
							data?.dateOfBirth
								? formatDate(data.dateOfBirth, 'DD/MM/YYYY')
								: '---'
						}
					/>
				</Group>
				<Group spacing={0}>
					<RowWithLabel
						label={'SĐT'}
						labelSpan={6}
						content={data?.phoneNumber}
						isOdd
					/>
					<RowWithLabel
						label={'Giới tính'}
						content={data?.gender === 0 ? 'Nam' : 'Nữ'}
						isOdd
					/>
				</Group>
				<RowWithLabel label={'BHYT'} content={data?.bhyt} />
			</Stack>
		</Stack>
	)
}

export default PatientInfo
