import { selectAuth } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import { Button, Stack, Group, Text, Divider, Paper } from '@mantine/core'
import { IconPrinter } from '@tabler/icons'
import { useRef } from 'react'
import Barcode from 'react-barcode'
import { useReactToPrint } from 'react-to-print'
import { formatDate } from '@/utils/formats'
import { BillPayResponse } from '@/entities/bill'
import { QRCodeSVG } from 'qrcode.react'

const PrintDetail = ({ data }: { data?: BillPayResponse }) => {
	const componentRef = useRef(null)
	const handlePrint = useReactToPrint({
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
				<Stack ref={componentRef} p="md">
					<Group position="apart" pt="md" align="start" px="xl">
						<Stack spacing={'xs'} align="center">
							<Text size="sm">SỞ Y TẾ TP. Hồ Chí Minh</Text>
							<Text size="sm" weight="bold">
								BỆNH VIỆN NHI ĐỒNG 2
							</Text>
							<Divider variant="dotted" color="dark" size="md" />
							<Text size="xs" weight="bold">
								Quầy thu ngân
							</Text>
							<Text size="xs">{authData.information?.name}</Text>
						</Stack>
						<Stack align="center" spacing={'sm'}>
							<Text size="xl" weight="bold">
								PHIẾU CHỈ ĐỊNH
							</Text>
							<Text size={24} weight="bold">
								Khám tổng quát
							</Text>
						</Stack>

						<Stack align="end" spacing={0}>
							<Barcode
								height={40}
								width={1}
								value={
									data?.checkupRecords?.[0]?.code?.split('_')?.[1] ?? '---'
								}
								displayValue={false}
							/>
							<Text size="xs">Mã số: {data?.checkupRecords?.[0]?.code}</Text>
						</Stack>
					</Group>

					<Group position="apart" pr="xl" align="start">
						<Stack spacing="xs" p="md">
							<Text>Họ tên: {data?.checkupRecords?.[0]?.patientData.name}</Text>
							<Text>
								Ngày sinh:{' '}
								{data?.checkupRecords?.[0]?.patientData.dateOfBirth
									? formatDate(
											data?.checkupRecords?.[0]?.patientData.dateOfBirth
									  )
									: '---'}
							</Text>
							<Text>
								Giới tính:{' '}
								{data?.checkupRecords?.[0]?.patientData.gender === 0
									? 'Nam'
									: 'Nữ'}
							</Text>
							<Text>
								SĐT: {data?.checkupRecords?.[0]?.patientData.phoneNumber}
							</Text>
							<Text>
								Triệu chứng: {data?.checkupRecords?.[0]?.clinicalSymptom}
							</Text>

							<Divider />
							<Text mt="sm" weight="bold">
								Khám tổng quát
							</Text>
							<Stack spacing={'xs'} mb="xl">
								<Text>
									Phòng {data?.checkupRecords?.[0]?.roomNumber} - Tầng{' '}
									{data?.checkupRecords?.[0]?.floor}
								</Text>
								<Text>
									Số khám bệnh: {data?.checkupRecords?.[0]?.numericalOrder}
								</Text>
								<Text>
									Bác sĩ phụ trách: {data?.checkupRecords?.[0]?.doctorName}
								</Text>
							</Stack>
							<Divider />
						</Stack>
						<Text>
							<QRCodeSVG
								value={data?.checkupRecords?.[0]?.qrCode ?? ''}
								size={200}
							/>
						</Text>
					</Group>
					<Stack p="xs">
						<Text>HƯỚNG DẪN THỰC HIỆN CẬN LÂM SÀNG</Text>
						<Group position="apart" align="baseline">
							<Stack sx={{ maxWidth: '45%' }}>
								<Text>
									Vui lòng cầm theo phiếu chỉ định và làm theo hướng dẫn của
									nhân viên
								</Text>
							</Stack>
							<Stack align="center">
								<Text size="xs">
									{formatDate(new Date().toString(), 'HH:mm, DD/MM/YYYY')}
								</Text>
								<Text mb="md" transform="uppercase">
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
								<Text mt="md" weight={'bold'} transform="uppercase">
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
