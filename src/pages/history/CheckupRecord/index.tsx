import { useState } from 'react'
import TestRecordList from '@/components/Record/TestRecordList'
import {
	useGetCheckupRecordByIdQuery,
	// useGetReExamTreeQuery,
} from '@/store/record/api'
import { formatDate } from '@/utils/formats'
import {
	Paper,
	Stack,
	Divider,
	Text,
	Tabs,
	Title,
	LoadingOverlay,
	Group,
	Box,
} from '@mantine/core'
import { useParams } from 'react-router-dom'
import PatientInfo from './PatientInfo'
import HistoryRecord from './HistoryRecord'
import MedicationList from './MedicationList'
import PrintDetail from './PrintDetail'
// import PatientRecordTree from '@/components/Record/PatientRecordTree'

const RecordHistory = () => {
	const [activeTab, setActiveTab] = useState<string | null>('record')
	const { id: recordId } = useParams()
	const { data: recordData, isLoading } = useGetCheckupRecordByIdQuery(
		{ id: Number(recordId) },
		{
			skip: !recordId,
		}
	)

	// const { data: reExamTree, isLoading: isLoadingReExamTree } =
	// 	useGetReExamTreeQuery(recordData?.reExamTreeCode?.toString() as string, {
	// 		skip: !recordData?.reExamTreeCode || activeTab !== 'reExamTree',
	// 	})

	return (
		<Stack>
			<Group position="apart">
				<Title order={3}>Khám bệnh</Title>
				<Box sx={{ maxWidth: 160 }}>
					<PrintDetail data={recordData} />
				</Box>
			</Group>
			<Paper p="md" sx={{ backgroundColor: 'white' }}>
				{/* <Tabs value={activeTab} onTabChange={setActiveTab}>
					<Tabs.List grow>
						<Tabs.Tab value="record">Thông tin chi tiết</Tabs.Tab> */}
				{/* <Tabs.Tab value="reExamTree">Chuỗi khám</Tabs.Tab> */}
				{/* </Tabs.List>
					<Tabs.Panel value="record" pt="xs"> */}
				<Stack>
					<Group position="apart">
						<Text>
							Thời gian:{' '}
							<Text span color="green" weight={'bolder'}>
								{recordData?.date ? formatDate(recordData.date) : '---'}
							</Text>
						</Text>
					</Group>
					<Divider />
					<PatientInfo data={recordData?.patientData} />
					<Divider />
					<HistoryRecord data={recordData} />

					{recordData?.testRecords?.length ? (
						<>
							<Divider />
							<TestRecordList data={recordData?.testRecords} />
						</>
					) : (
						<></>
					)}
					{recordData?.prescription ? (
						<>
							<Divider />
							<MedicationList data={recordData?.prescription} />
						</>
					) : (
						<></>
					)}
				</Stack>
				{/* </Tabs.Panel> */}
				{/* <Tabs.Panel value="reExamTree" pt="xs" sx={{ position: 'relative' }}>
						<LoadingOverlay visible={isLoading || isLoadingReExamTree} />
						<Stack sx={{ minHeight: 200 }}>
							<PatientRecordTree data={reExamTree} />
						</Stack>
					</Tabs.Panel> */}
				{/* </Tabs> */}
			</Paper>
		</Stack>
	)
}
export default RecordHistory
