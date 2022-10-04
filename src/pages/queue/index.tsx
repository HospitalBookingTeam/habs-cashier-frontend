import { selectAuth } from "@/store/auth/selectors";
import { useAppSelector } from "@/store/hooks";
import { useGetQueueQuery } from "@/store/queue/api";
import { formatCurrency, formatDate } from "@/utils/formats";
import { Stack, Title, TextInput, Paper, Table, Button, Group, Center } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import QrCodeButton from "./QrCodeButton";

const Queue = () => {
	const authData = useAppSelector(selectAuth);
	const navigate = useNavigate();
	const [value, setValue] = useDebouncedState("", 200);

	const { data, isLoading } = useGetQueueQuery(
		{
			searchTerm: value,
		},
		{
			refetchOnFocus: true,
			skip: !authData?.information,
		},
	);

	const rows = data?.length ? (
		data?.map(
			(item) => (
				<tr key={item.id}>
					<td>{item.patientName}</td>
					<td>{item?.dateOfBirth ? formatDate(item.dateOfBirth) : "---"}</td>
					<td>{item?.timeCreated ? formatDate(item.timeCreated, "DD/MM/YYYY, HH:mm:ss") : "---"}</td>
					<td className="right">{item?.total ? formatCurrency(item.total) : "---"}</td>
					<td className="right">
						<Button onClick={() => navigate(`/${item.id}`)}>Xem chi tiết</Button>
					</td>
				</tr>
			),
		)
	) : (
		<tr>
			<td colSpan={5}>
				<Center my="md">Không tìm thấy dữ liệu</Center>
			</td>
		</tr>
	);

	return (
		<Stack>
			<Stack sx={{ flexDirection: "row" }} align="center" justify={"space-between"} mb="sm">
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
				</Group>
			</Stack>
			<Paper p="md">
				<Table striped={true} highlightOnHover={true} verticalSpacing="md">
					<thead>
						<tr>
							<th>Tên người bệnh</th>
							<th>Ngày sinh</th>
							<th>Thời gian</th>
							<th className="right">Thành tiền</th>
							<th></th>
						</tr>
					</thead>
					<tbody>{rows}</tbody>
				</Table>
			</Paper>
		</Stack>
	);
};
export default Queue;
