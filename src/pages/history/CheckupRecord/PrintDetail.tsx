import { selectAuth } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import { Button, Stack, Group, Text, Divider, Paper } from '@mantine/core'
import { IconPrinter } from '@tabler/icons'
import { useRef } from 'react'
import Barcode from 'react-barcode'
import { useReactToPrint } from 'react-to-print'
import { formatDate } from '@/utils/formats'
import { QRCodeSVG } from 'qrcode.react'
import { HistoryCheckupRecord } from '@/entities/history'
import BillDetails from '@/pages/booking/Details'

const PrintDetail = ({ data }: { data?: HistoryCheckupRecord }) => {
	const componentRef = useRef(null)
	const handlePrint = useReactToPrint({
		pageStyle: `@media print {
      @page {
        size: A5 portrait;
        margin: 0;
      }
    }`,
		content: () => componentRef.current,
	})
	const authData = useAppSelector(selectAuth)

	return (
		<>
			<Button
				fullWidth={true}
				variant="outline"
				onClick={handlePrint}
				leftIcon={<IconPrinter />}
			>
				In phiếu khám
			</Button>
			<Stack sx={{ overflow: 'hidden', height: 0 }}>
				<Stack ref={componentRef} p="sm">
					<Group position="apart" pt="md" align="start">
						<Stack spacing={1} align="center">
							<Text size="xs">SỞ Y TẾ TP. Hồ Chí Minh</Text>
							<Text size="xs" weight="bold">
								BỆNH VIỆN NHI ĐỒNG 2
							</Text>
							<Divider variant="dotted" color="dark" size="md" />
							<Text size={10} weight="bold">
								Quầy thu ngân
							</Text>
							<Text size={10}>{authData.information?.name}</Text>
						</Stack>
						<Stack align="center" spacing={'sm'}>
							<Text size="md" weight="bold">
								PHIẾU KHÁM BỆNH
							</Text>
							<Text size={'lg'} weight="bold">
								Khám tổng quát
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

					<Group position="apart" pr="md" align="start">
						<Stack spacing="xs" p="md">
							<Text size="sm">Họ tên: {data?.patientData.name}</Text>
							<Text size="sm">
								Ngày sinh:{' '}
								{data?.patientData.dateOfBirth
									? formatDate(data?.patientData.dateOfBirth)
									: '---'}
							</Text>
							<Text size="sm">
								Giới tính: {data?.patientData.gender === 0 ? 'Nam' : 'Nữ'}
							</Text>
							<Text size="sm">SĐT: {data?.patientData.phoneNumber}</Text>
							<Text size="sm">Triệu chứng: {data?.clinicalSymptom}</Text>

							<Divider />
						</Stack>
						<Text>
							<QRCodeSVG value={data?.qrCode ?? ''} size={120} />
						</Text>
					</Group>

					{data?.bill?.[0] && (
						<Stack p="xs">
							<BillDetails data={data?.bill?.[0]} />
						</Stack>
					)}
					<Stack p="xs">
						<Group position="apart" align="baseline">
							<Stack sx={{ maxWidth: '45%' }}>
								<Text mt="sm" size="xs" weight="bold">
									Khám tổng quát
								</Text>
								<Stack spacing={'xs'}>
									<Text size="sm">
										Phòng {data?.roomNumber} - Tầng {data?.floor}
									</Text>

									<Text size="sm">Bác sĩ phụ trách: {data?.doctorName}</Text>
									{data?.estimatedStartTime && (
										<Text size="sm">
											Giờ khám dự kiến:{' '}
											{formatDate(data?.estimatedStartTime, 'HH:mm')}
										</Text>
									)}
								</Stack>
							</Stack>
							<Stack align="center">
								<Text size="xs">
									{formatDate(new Date().toString(), 'HH:mm, DD/MM/YYYY')}
								</Text>
								<Text size="sm" transform="uppercase">
									Xác nhận đặt lịch
								</Text>
								<Paper withBorder p="sm" radius={0} color="green">
									<Stack>
										<Text color="red" size="xs">
											Signature Valid
										</Text>
										<Text color="red" size="xs">
											Ký bởi: BỆNH VIỆN NHI ĐỒNG 2
										</Text>
										<Text color="red" size="xs">
											Ký ngày: {formatDate(new Date().toString(), 'DD-MM-YYYY')}
										</Text>
									</Stack>
								</Paper>
								<Text size="sm" weight={'bold'} transform="uppercase">
									NVHC. {authData?.information?.name}
								</Text>
							</Stack>
						</Group>
					</Stack>
				</Stack>
			</Stack>
		</>
	)
}
export default PrintDetail
