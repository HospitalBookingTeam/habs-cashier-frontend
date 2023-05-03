import { Button, Stack, Group, Text, Divider } from '@mantine/core'
import { IconPrinter } from '@tabler/icons'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { formatDate } from '@/utils/formats'
import { QRCodeSVG } from 'qrcode.react'
import Signature from '@/components/Signature'
import dayjs from 'dayjs'
import Barcode from 'react-barcode'
import { HistoryTestRecord } from '@/entities/history'
import BillDetails from '@/pages/booking/Details'
const DATE_FORMAT = 'DD/MM/YYYY, HH:mm'

const PrintOperationDetail = ({ data }: { data?: HistoryTestRecord }) => {
	const componentRef = useRef(null)
	const handlePrint = useReactToPrint({
		pageStyle: `@media print {
      @page {
        size: A5 landscape;
        margin: 0;
      }
    }`,
		content: () => componentRef.current,
	})

	return (
		<>
			<Button
				fullWidth={true}
				color="green"
				variant="default"
				onClick={handlePrint}
				leftIcon={<IconPrinter />}
			>
				In phiếu chỉ định
			</Button>
			<Stack sx={{ overflow: 'hidden', height: 0 }}>
				<Stack ref={componentRef}>
					<Stack p="md" py="lg" key={data?.operationId}>
						<Group position="apart" align="start">
							<Stack spacing={1} align="center">
								<Text size="xs">SỞ Y TẾ TP. Hồ Chí Minh</Text>
								<Text size="xs" weight="bold">
									BỆNH VIỆN NHI ĐỒNG 2
								</Text>
								<Divider variant="dotted" color="dark" size="md" />
							</Stack>
							<Stack align="center">
								<Text size="md" weight="bold">
									PHIẾU CHỈ ĐỊNH
								</Text>
								<Text
									size={'lg'}
									weight="bold"
									align="center"
									sx={{ maxWidth: 250 }}
								>
									{data?.operationName}
								</Text>
							</Stack>
							<Stack align="end" spacing={0}>
								<Barcode
									height={40}
									width={1}
									value={data?.code?.split('_')?.[1] ?? '---'}
									displayValue={false}
								/>
								<Text size={10}>Mã số: {data?.code}</Text>
							</Stack>
						</Group>

						<Stack spacing="xs" p="sm">
							<Group position="apart">
								<Stack>
									<Group>
										<Text size="sm">Họ tên: {data?.patientName}</Text>
										<Text size="sm">
											Ngày sinh:{' '}
											{data?.patient?.dateOfBirth
												? formatDate(data?.patient?.dateOfBirth)
												: '---'}
										</Text>
										<Text size="sm">
											Giới tính: {data?.patient?.gender === 0 ? 'Nam' : 'Nữ'}
										</Text>
									</Group>
									<Text size="sm">SĐT: {data?.patient?.phoneNumber}</Text>

									<Text size="sm" weight="bold">
										Yêu cầu xét nghiệm
									</Text>
									<Text size="sm">
										Phòng {data?.roomNumber} - Tầng {data?.floor}
									</Text>
								</Stack>
								<Stack spacing={'xs'} align="center">
									{!!data?.qrCode && (
										<QRCodeSVG value={data?.qrCode} size={120} />
									)}
								</Stack>
							</Group>
							<Divider />
							<BillDetails data={data?.bill} />
							<Divider />
							<Stack spacing="xs">
								<Group position="apart" align="start">
									<Stack sx={{ maxWidth: '45%' }} spacing="xs">
										<Text size="sm">HƯỚNG DẪN THỰC HIỆN CẬN LÂM SÀNG</Text>
										<Text size="sm">
											Bước 1: Đóng tiền qua app hoặc quầy thu ngân
										</Text>
										<Text size="sm">
											Bước 2: Nộp phiếu chỉ định và làm theo hướng dẫn của nhân
											viên
										</Text>
										<Text size="sm" weight={'bold'}>
											Bước 3: Sau khi có đầy đủ kết quả, đưa bệnh nhi quay lại
											phòng khám đã cho chỉ định để khám lại
										</Text>
									</Stack>
									<Stack align="center" spacing="xs">
										<Text size="xs">
											{formatDate(data?.date ?? '', DATE_FORMAT)}
										</Text>
										<Text size="sm" transform="uppercase">
											Bác sĩ khám bệnh
										</Text>
										<Signature date={data?.date} />
										<Text size="sm" weight={'bold'} transform="uppercase">
											BS {data?.requestDoctor}
										</Text>
									</Stack>
								</Group>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</>
	)
}
export default PrintOperationDetail
