import { useGetBillByQrMutation } from "@/store/queue/api";
import { Button, LoadingOverlay, Modal, Stack, Text, ThemeIcon } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconQrcode } from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const QrCodeButton = () => {
	const [opened, setOpened] = useState(false);
	const navigate = useNavigate();
	const [getBillByQrMutation, { isLoading }] = useGetBillByQrMutation();

	const form = useForm({
		initialValues: {
			qrCode: "",
		},
	});

	const onSubmit = async (values: { qrCode: string }) => {
		const { qrCode } = values;
		console.log("values", values);
		await getBillByQrMutation(qrCode)
			.unwrap()
			.then((payload) => {
				console.log("payload", payload);
				const { id } = payload;
				navigate(`/${id}`);
			})
			.catch(() => {
				showNotification({
					title: "Lỗi",
					message: <Text>Không tìm thấy QR. Vui lòng thử lại</Text>,
					color: "red",
				});
			})
			.finally(() => {
				form.reset();
			});
	};

	return (
		<>
			<Button variant="outline" leftIcon={<IconQrcode />} onClick={() => setOpened(true)}>
				Quét mã QR
			</Button>
			<Modal opened={opened} centered={true} onClose={() => setOpened(false)} title="Quét mã QR">
				<Stack align={"center"} sx={{ position: "relative" }}>
					<LoadingOverlay visible={isLoading} />
					<Text>Vui lòng quét mã QR</Text>

					<ThemeIcon variant="outline" color="gray" size={120}>
						<IconQrcode size={100} strokeWidth="1" />
					</ThemeIcon>

					<form style={{ opacity: 0, position: "fixed" }} onSubmit={form.onSubmit(onSubmit)}>
						<input
							{...form.getInputProps("qrCode")}
							onBlur={(e) => e.currentTarget.focus()}
							data-autofocus
							autoComplete="off"
						/>
						<button hidden type="submit" />
					</form>
				</Stack>
			</Modal>
		</>
	);
};
export default QrCodeButton;
