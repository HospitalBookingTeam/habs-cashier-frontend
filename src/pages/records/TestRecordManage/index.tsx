import { useEffect, useState } from 'react'
import {
	Table,
	ScrollArea,
	Center,
	Pagination,
	Group,
	Stack,
	Box,
	Text,
	ActionIcon,
	useMantineTheme,
	Badge,
} from '@mantine/core'
import { pageSize } from './items'
import {
	formatRoomOptions,
	mapColorToStatus,
	sortData,
	// statusToExludeListDefaultValues,
	statusToIncludeList,
} from './utils'
import {
	Th,
	CustomSelect,
	CustomDateRangePicker,
	Search,
	CustomMultiSelect,
} from './components'
import { useDebouncedState } from '@mantine/hooks'
import {
	useGetExamRoomListQuery,
	useGetTestRecordsQuery,
} from '@/store/record/api'
import { TestRecord } from '@/entities/record'
import { translateTestRecordStatus } from '@/utils/renderEnums'
import { formatDate } from '@/utils/formats'
import { IconChevronRight } from '@tabler/icons'
import { useAppSelector } from '@/store/hooks'
import { selectTime } from '@/store/configs/selectors'
import dayjs from 'dayjs'

const TestRecordManage = () => {
	const theme = useMantineTheme()
	const [search, setSearch] = useDebouncedState('', 200)
	const [sortedData, setSortedData] = useState<TestRecord[] | null>(null)
	const [sortBy, setSortBy] = useState<keyof TestRecord | null>(null)
	const [reverseSortDirection, setReverseSortDirection] = useState(false)
	const [statusToExclude, setStatusToExclude] = useState<string[]>()
	// statusToExludeListDefaultValues
	const [statusToInclude, setStatusToInclude] = useState<string[] | null>(null)
	const [totalPageSize, setTotalPageSize] = useState<string | null>(pageSize[0])
	const [page, setPage] = useState(1)

	const configTime = useAppSelector(selectTime)

	const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
		new Date(dayjs().valueOf() + (configTime ?? 0)),
		new Date(dayjs().valueOf() + (configTime ?? 0)),
	])
	const [roomsFilter, setRoomsFilter] = useState<string[] | null>(null)

	const { data: roomList } = useGetExamRoomListQuery()
	const { data, isLoading, isSuccess } = useGetTestRecordsQuery(
		{
			searchTerm: search,
			pageIndex: page,
			pageSize: Number(totalPageSize),
			statusToExclude: statusToExclude?.map((item) => Number(item)),
			statusToInclude: statusToInclude?.map((item) => Number(item)),
			from: dateRange[0]
				? `${formatDate(dateRange[0].toString(), 'YYYY-MM-DDT00:00:00')}Z`
				: undefined,
			to: dateRange[1]
				? `${formatDate(dateRange[1].toString(), 'YYYY-MM-DDT23:59:59')}Z`
				: undefined,
			roomIds: roomsFilter?.map((item) => Number(item)) ?? undefined,
		},
		{
			refetchOnFocus: true,
		}
	)

	const setSorting = (field: keyof TestRecord) => {
		if (!data) return
		const reversed = field === sortBy ? !reverseSortDirection : false
		setReverseSortDirection(reversed)
		setSortBy(field)
		setSortedData(sortData(data.data, { sortBy: field, reversed, search }))
	}

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget
		setPage(1)
		setSearch(value)
	}

	useEffect(() => {
		if (isSuccess) {
			setSortedData(data.data)
		}
	}, [isSuccess, data])

	useEffect(() => {
		setDateRange([
			new Date(dayjs().valueOf() + (configTime ?? 0)),
			new Date(dayjs().valueOf() + (configTime ?? 0)),
		])
	}, [configTime])

	const rows = sortedData?.map((row, index) => (
		<tr
			key={row.id}
			style={{
				background: index % 2 === 0 ? 'transparent' : theme.colors.gray[1],
			}}
			className="row-link"
			onClick={() => {
				window.open(`tests/${row.id}`, '_blank')
			}}
		>
			<td>
				<Text
					sx={{
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
					}}
				>
					{row.patientName}
				</Text>
			</td>
			<td>{row.operationName}</td>
			<td>{`${row.roomNumber} tầng ${row.floor}`}</td>
			<td>
				<Badge
					sx={{
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
					}}
					color={mapColorToStatus(row.status)}
				>
					{translateTestRecordStatus(row.status)}
				</Badge>
			</td>

			<td>
				<Text>
					{row?.date ? formatDate(row.date, 'DD/MM/YYYY, HH:mm') : '---'}
				</Text>
			</td>
		</tr>
	))

	return (
		<ScrollArea my="md">
			<Stack mb="md">
				<Group>
					<Search defaultValue={search} onChange={handleSearchChange} />
					<CustomDateRangePicker
						label="Thời gian xét nghiệm"
						allowSingleDateInRange={true}
						value={dateRange}
						onChange={setDateRange}
					/>
				</Group>
				<Group align="start">
					<Box sx={{ flex: 1 }}>
						<CustomMultiSelect
							data={formatRoomOptions(roomList)}
							value={roomsFilter ?? undefined}
							onChange={setRoomsFilter}
							label="Phòng xét nghiệm"
							placeholder="Tất cả"
						/>
					</Box>
					<Box sx={{ flex: 1 }}>
						<CustomMultiSelect
							data={statusToIncludeList}
							value={statusToInclude ?? undefined}
							onChange={setStatusToInclude}
							label="Tình trạng lọc"
							placeholder="Tất cả"
						/>
					</Box>
					<CustomMultiSelect
						data={statusToIncludeList}
						value={statusToExclude}
						onChange={setStatusToExclude}
						label="Tình trạng không lọc"
					/>
				</Group>
			</Stack>
			<Stack sx={{ minWidth: 700, minHeight: 300 }}>
				<Table horizontalSpacing="md" verticalSpacing="xs">
					<thead>
						<tr>
							<Th
								sorted={sortBy === 'patientName'}
								reversed={reverseSortDirection}
								onSort={() => setSorting('patientName')}
							>
								Người bệnh
							</Th>
							<Th
								sorted={sortBy === 'operationName'}
								reversed={reverseSortDirection}
								onSort={() => setSorting('operationName')}
							>
								Tên xét nghiệm
							</Th>
							<Th
								sorted={sortBy === 'roomNumber'}
								reversed={reverseSortDirection}
								onSort={() => setSorting('roomNumber')}
							>
								Phòng
							</Th>
							<Th
								sorted={sortBy === 'status'}
								reversed={reverseSortDirection}
								onSort={() => setSorting('status')}
								width={170}
							>
								Tình trạng
							</Th>

							<Th
								sorted={sortBy === 'date'}
								reversed={reverseSortDirection}
								onSort={() => setSorting('date')}
								width={200}
							>
								Thời gian
							</Th>
						</tr>
					</thead>
					<tbody>
						{rows?.length && rows?.length > 0 ? (
							rows
						) : (
							<tr>
								<td colSpan={8}>
									<Center my="md">
										<Text align="center">Không tìm thấy dữ liệu</Text>
									</Center>
								</td>
							</tr>
						)}
					</tbody>
				</Table>
			</Stack>
			<Group
				position="center"
				sx={{ position: 'relative' }}
				align="center"
				mt={'md'}
				py="md"
			>
				<Pagination
					total={data?.totalPage ?? 0}
					page={page}
					onChange={setPage}
					withEdges={true}
				/>
				<Box sx={{ position: 'absolute', top: '0', right: 0 }}>
					<CustomSelect
						// style={{ marginTop: 20, zIndex: 2 }}
						data={pageSize}
						placeholder="mặc định 5"
						value={totalPageSize}
						onChange={setTotalPageSize}
						label="Số hàng"
						dropdownPosition="top"
					/>
				</Box>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: 0,
						transform: 'translateY(-50%)',
					}}
				>
					<Text size="sm">{data?.totalItem ?? 0} kết quả</Text>
				</Box>
			</Group>
		</ScrollArea>
	)
}

export default TestRecordManage
