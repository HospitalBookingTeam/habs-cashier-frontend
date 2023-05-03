import { Stack, Box, Paper, Group, Divider, Title, Button } from '@mantine/core'

import { useParams } from 'react-router-dom'

import { useGetTestRecordByIdQuery } from '@/store/record/api'
import PatientInfo from './PatientInfo'
import TestRecordItem from '@/components/Record/TestRecordItem'
import PrintOperationDetail from './PrintOperationDetail'
import { IconExternalLink, IconLink } from '@tabler/icons'

const FinishQueueDetail = () => {
	const { id } = useParams()
	const { data } = useGetTestRecordByIdQuery(
		{ id: Number(id) },
		{
			skip: !id,
		}
	)

	return (
		<Stack align={'start'}>
			<Box sx={{ width: '100%' }}>
				<Group position="apart">
					<Title order={3} mb="md">
						Xét nghiệm
					</Title>
					<Group>
						<Button
							component="a"
							variant="white"
							target="_blank"
							href={`/records/${data?.checkupRecordId}`}
							rightIcon={<IconExternalLink />}
						>
							Xem bệnh án gốc
						</Button>
						<Box sx={{ maxWidth: 200 }}>
							<PrintOperationDetail data={data} />
						</Box>
					</Group>
				</Group>
				<Paper p="md" sx={{ backgroundColor: 'white' }}>
					<Stack>
						<PatientInfo data={data?.patient} />
						<Divider />
						<TestRecordItem data={data} />
					</Stack>
				</Paper>
			</Box>
		</Stack>
	)
}
export default FinishQueueDetail
