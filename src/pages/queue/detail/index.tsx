import BackButton from '@/components/Button/BackButton'
import {
	useConfirmBillMutation,
	useGetQueueByIdQuery,
	useInvalidateBillMutation,
} from '@/store/queue/api'
import { formatCurrency } from '@/utils/formats'
import { Badge } from '@mantine/core'
import {
	Paper,
	Stack,
	Divider,
	Group,
	Button,
	Text,
	LoadingOverlay,
} from '@mantine/core'
import { openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconTrash } from '@tabler/icons'
import { useNavigate, useParams } from 'react-router-dom'
import Details from './Details'
import Info from './Info'

const QueueDetail = () => {
	const { id: queueId } = useParams()
	const navigate = useNavigate()

	const { data } = useGetQueueByIdQuery(Number(queueId), {
		skip: !queueId,
	})
	const [invalidateBillMutation, { isLoading: isLoadingInvalidate }] =
		useInvalidateBillMutation()
	const [confirmBillMutation, { isLoading: isLoadingConfirm }] =
		useConfirmBillMutation()

	const openDeleteModal = () =>
		openConfirmModal({
			title: 'Hủy hóa đơn',
			centered: true,
			children: (
				<Text size="sm">
					Bạn có chắc chắn muốn hủy hóa đơn này? Thao tác này không thể hoàn
					tác.
				</Text>
			),
			labels: { confirm: 'Xác nhận hủy', cancel: 'Quay lại' },
			confirmProps: { color: 'red' },
			onConfirm: () =>
				invalidateBillMutation(Number(queueId))
					.unwrap()
					.then(() => {
						showNotification({
							title: 'Hủy thành công',
							message: <Text>Bạn đã hủy hóa đơn thành công</Text>,
							color: 'cyan',
						})
						navigate('/')
					})
					.catch(() => {
						showNotification({
							title: 'Lỗi',
							message: <Text>Hủy hóa đơn không thành công</Text>,
							color: 'red',
						})
					}),
		})

	const openModal = () =>
		openConfirmModal({
			title: 'Xác nhận hóa đơn',
			centered: true,
			children: (
				<Text size="sm">
					Bạn đang xác nhận hóa đơn của{' '}
					<Text span={true} weight={500}>
						{data?.patientName}
					</Text>{' '}
					với tổng tiền là{' '}
					<Text span={true} weight={500}>
						{data?.total ? formatCurrency(data.total) : '---'}
					</Text>{' '}
					<Text span={true} italic={true}>
						({data?.totalInWord || '---'})
					</Text>
					.
				</Text>
			),
			labels: { confirm: 'Xác nhận', cancel: 'Quay lại' },
			onConfirm: () =>
				confirmBillMutation(Number(queueId))
					.unwrap()
					.then(() => {
						showNotification({
							title: 'Xác nhận thành công',
							message: <Text>Bạn đã hủy hóa đơn thành công</Text>,
						})
						navigate('/')
					})
					.catch(() => {
						showNotification({
							title: 'Lỗi',
							message: <Text>Xác nhận hóa đơn không thành công</Text>,
							color: 'red',
						})
					}),
		})

	return (
		<Stack align={'start'}>
			<Stack
				sx={{ flexDirection: 'row', width: '100%' }}
				align="center"
				justify={'space-between'}
				mb="sm"
				spacing={40}
			>
				<BackButton />

				<Badge size="xl" radius="md">
					Thông tin hóa đơn
				</Badge>
			</Stack>
			<Paper p="md" sx={{ width: '100%', position: 'relative' }}>
				<LoadingOverlay visible={isLoadingInvalidate || isLoadingConfirm} />
				<Stack>
					<Info />
					<Divider my="sm" />
					<Details />
					<Divider my="sm" />
					<Group position="right">
						<Button
							color="red"
							variant="outline"
							size="lg"
							sx={{ width: 200 }}
							onClick={openDeleteModal}
							leftIcon={<IconTrash />}
						>
							Hủy hóa đơn
						</Button>
						<Button
							size="lg"
							sx={{ width: 200 }}
							leftIcon={<IconCheck />}
							onClick={openModal}
						>
							Xác nhận
						</Button>
					</Group>
				</Stack>
			</Paper>
		</Stack>
	)
}
export default QueueDetail
