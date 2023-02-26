import { useGetQueueQuery } from '@/store/queue/api'
import { formatCurrency, formatDate } from '@/utils/formats'
import {
	Stack,
	Title,
	TextInput,
	Paper,
	Table,
	Button,
	Group,
	Center,
} from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { IconCalendarPlus, IconSearch } from '@tabler/icons'
import { Link, useNavigate } from 'react-router-dom'
import QrCodeButton from './QrCodeButton'

const Queue = () => {
	const navigate = useNavigate()
	const [value, setValue] = useDebouncedState('', 200)

	const { data, isLoading } = useGetQueueQuery(
		{
			searchTerm: value,
		},
		{
			refetchOnFocus: true,
			refetchOnMountOrArgChange: true,
		}
	)

	const rows = data?.length ? (
		data?.map((item) => (
			<tr key={item.id}>
				<td>{item.patientName}</td>
				<td>{item?.title ?? '---'}</td>
				<td>{item?.dateOfBirth ? formatDate(item.dateOfBirth) : '---'}</td>
				<td>
					{item?.timeCreated
						? formatDate(item.timeCreated, 'DD/MM/YYYY, HH:mm:ss')
						: '---'}
				</td>
				<td className="right">
					{item?.total ? formatCurrency(item.total) : '---'}
				</td>
				<td className="right">
					<Button onClick={() => navigate(`/${item.id}`)}>Xem chi tiết</Button>
				</td>
			</tr>
		))
	) : (
		<tr>
			<td colSpan={5}>
				<Center my="md">Không tìm thấy dữ liệu</Center>
			</td>
		</tr>
	)

	return (
		<Stack>
			<Stack
				sx={{ flexDirection: 'row' }}
				align="center"
				justify={'space-between'}
				mb="xs"
			>
				<Title order={1} size="h3">
					Danh sách hóa đơn
				</Title>
				<Group>
					<TextInput
						placeholder="Tìm kiếm hóa đơn"
						size="md"
						sx={{ minWidth: 450 }}
						icon={<IconSearch size={16} stroke={1.5} />}
						defaultValue={value}
						onChange={(event) => setValue(event.currentTarget.value)}
					/>
					<QrCodeButton />
					<Button
						variant="gradient"
						gradient={{ from: 'teal', to: 'lime', deg: 105 }}
						leftIcon={<IconCalendarPlus />}
						component={Link}
						to="/book"
					>
						Hỗ trợ đặt lịch
					</Button>
				</Group>
			</Stack>
			<Paper p="md">
				<Table striped={true} highlightOnHover={true} verticalSpacing="md">
					<thead>
						<tr>
							<th>Tên người bệnh</th>
							<th>Tổng quát</th>
							<th>Ngày sinh</th>
							<th>Thời gian tạo</th>
							<th className="right">Thành tiền</th>
							<th></th>
						</tr>
					</thead>
					<tbody>{rows}</tbody>
				</Table>
			</Paper>
		</Stack>
	)
}
export default Queue
