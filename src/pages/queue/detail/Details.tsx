import { useGetBillByIdQuery } from "@/store/queue/api";
import { formatCurrency } from "@/utils/formats";
import { translateEnumInsuranceStatus } from "@/utils/renderEnums";
import { Stack, Title, Table, Text } from "@mantine/core";
import { useParams } from "react-router-dom";

const Details = () => {
	const { id } = useParams();
	const { data } = useGetBillByIdQuery(Number(id), {
		skip: !id,
	});

	const rows = data?.details?.map(
		(item, index) => (
			<tr key={item.id}>
				<td>{index + 1}</td>
				<td>{item.operationName}</td>
				<td>{translateEnumInsuranceStatus(item.insuranceStatus)}</td>
				<td className="right">{item?.price ? formatCurrency(item.price) : "---"}</td>
				<td className="right">{item?.quantity ? item.quantity : "---"}</td>
				<td className="right">{item?.subTotal ? formatCurrency(item.subTotal) : "---"}</td>
			</tr>
		),
	);

	const ths = (
		<>
			<tr>
				<th />
				<th />
				<th />
				<th />
				<th className="right">Tổng cộng</th>
				<th className="right">{data?.total ? formatCurrency(data.total) : "---"}</th>
			</tr>
		</>
	);

	return (
		<Stack>
			<Title order={3} px="0" size="h4">
				Chi tiết hóa đơn
			</Title>
			<Stack sx={{ gap: 0 }}>
				<Table striped={true} verticalSpacing="md">
					<thead>
						<tr>
							<th>STT</th>
							<th>Tên dịch vụ</th>
							<th>Tình trạng BHYT</th>
							<th className="right">Đơn giá</th>
							<th className="right">Số lượng</th>
							<th className="right">Thành tiền</th>
						</tr>
					</thead>
					<tbody>{rows}</tbody>
					<tfoot>{ths}</tfoot>
				</Table>
				<Stack align={"end"} px="sm">
					<Text size="sm" italic={true}>
						{data?.totalInWord}
					</Text>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Details;
