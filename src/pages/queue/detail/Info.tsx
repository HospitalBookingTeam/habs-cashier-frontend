import RowWithLabel from "@/components/Row";
import { useGetBillByIdQuery } from "@/store/queue/api";
import { formatDate } from "@/utils/formats";
import { Stack, Title, Group } from "@mantine/core";
import { useParams } from "react-router-dom";

const Info = () => {
	const { id } = useParams();
	const { data } = useGetBillByIdQuery(Number(id), {
		skip: !id,
	});

	return (
		<Stack>
			<Title order={3} px="0" size="h4">
				Thông tin người bệnh
			</Title>
			<Stack sx={{ gap: 12 }}>
				<RowWithLabel label={"Họ và tên"} content={data?.patientName} />
				<RowWithLabel label={"Mã số"} content={data?.patientId?.toString()} />
				<RowWithLabel label={"Giới tính"} content={data?.gender === 0 ? "Nam" : "Nữ"} />
				<RowWithLabel label={"Ngày sinh"} content={data?.dateOfBirth ? formatDate(data?.dateOfBirth) : "---"} />
				<RowWithLabel label={"Số điện thoại"} content={data?.phoneNo || "---"} />
				<RowWithLabel label={"Số điện thoại người thân"} content={data?.accountPhoneNo || "---"} />
				<RowWithLabel label={"Nội dung"} content={data?.content} />
			</Stack>
		</Stack>
	);
};

export default Info;
