import { Bill } from '@/entities/bill'
import { formatCurrency } from '@/utils/formats'
import { translateEnumInsuranceStatus } from '@/utils/renderEnums'
import { Stack, Title, Table, Text } from '@mantine/core'

const BillDetails = ({ data }: { data?: Bill }) => {
	const rows = data?.details?.map((item, index) => (
		<tr key={item.id}>
			<td>{index + 1}</td>
			<td>{item.operationName}</td>
			<td>{translateEnumInsuranceStatus(item.insuranceStatus)}</td>
			<td className="right">
				{item?.price ? formatCurrency(item.price) : '---'}
			</td>
			<td className="right">{item?.quantity ? item.quantity : '---'}</td>
			<td className="right">
				{item?.subTotal ? formatCurrency(item.subTotal) : '---'}
			</td>
		</tr>
	))

	const ths = (
		<>
			<tr>
				<th />
				<th />
				<th />
				<th />
				<th className="right">Tổng cộng</th>
				<th className="right">
					{data?.total ? formatCurrency(data.total) : '---'}
				</th>
			</tr>
		</>
	)

	return (
		<Stack sx={{ flex: 1 }}>
			<Text px="0" size="sm">
				Chi tiết hóa đơn
			</Text>
			<Stack sx={{ gap: 0 }}>
				<Table striped={true} fontSize={'xs'}>
					<thead>
						<tr>
							<th>STT</th>
							<th>Tên</th>
							<th>Tình trạng BHYT</th>
							<th className="right">ĐG</th>
							<th className="right">SL</th>
							<th className="right">T.Tiền</th>
						</tr>
					</thead>
					<tbody>{rows}</tbody>
					<tfoot>{ths}</tfoot>
				</Table>
				<Stack align={'end'} px="sm">
					<Text size="xs" italic={true}>
						{data?.totalInWord}
					</Text>
				</Stack>
			</Stack>
		</Stack>
	)
}

export default BillDetails
