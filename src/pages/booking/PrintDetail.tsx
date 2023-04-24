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
import BillDetails from './Details'
import dayjs from 'dayjs'
import { selectTime } from '@/store/configs/selectors'

const PrintDetail = ({ data }: { data?: BillPayResponse }) => {
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
	const configTime = useAppSelector(selectTime)

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
				<Stack ref={componentRef} p="xs" spacing={'xs'}>
					<Group position="apart" pt="md" align="start">
						<Stack spacing={'xs'} align="center">
							<Text size="xs">SỞ Y TẾ TP. Hồ Chí Minh</Text>
							<Text size="xs" weight="bold">
								BỆNH VIỆN NHI ĐỒNG 2
							</Text>
							<Divider variant="dotted" color="dark" size="sm" />
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
								Khám đa khoa
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
							<Text size={10}>Mã số: {data?.checkupRecords?.[0]?.code}</Text>
						</Stack>
					</Group>

					<Group position="apart" align="start" mt="sm">
						<Stack spacing="xs">
							<Text size="sm">
								Họ tên: {data?.checkupRecords?.[0]?.patientData.name}
							</Text>
							<Text size="sm">
								Ngày sinh:{' '}
								{data?.checkupRecords?.[0]?.patientData.dateOfBirth
									? formatDate(
											data?.checkupRecords?.[0]?.patientData.dateOfBirth
									  )
									: '---'}
							</Text>
							<Text size="sm">
								Giới tính:{' '}
								{data?.checkupRecords?.[0]?.patientData.gender === 0
									? 'Nam'
									: 'Nữ'}
							</Text>
							<Text size="sm">
								SĐT: {data?.checkupRecords?.[0]?.patientData.phoneNumber}
							</Text>
							<Text size="sm">
								Triệu chứng: {data?.checkupRecords?.[0]?.clinicalSymptom}
							</Text>

							<Divider />
						</Stack>
						<Text>
							<QRCodeSVG
								value={data?.checkupRecords?.[0]?.qrCode ?? ''}
								size={120}
							/>
						</Text>
					</Group>
					{data?.checkupRecords?.[0]?.bill?.[0] && (
						<Stack p="xs">
							<BillDetails data={data?.checkupRecords?.[0]?.bill?.[0]} />
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
										Phòng {data?.checkupRecords?.[0]?.roomNumber} - Tầng{' '}
										{data?.checkupRecords?.[0]?.floor}
									</Text>

									<Text size="sm">
										Bác sĩ phụ trách: {data?.checkupRecords?.[0]?.doctorName}
									</Text>
									{data?.checkupRecords?.[0]?.estimatedStartTime && (
										<Text size="sm">
											Giờ khám dự kiến:{' '}
											{formatDate(
												data?.checkupRecords?.[0]?.estimatedStartTime,
												'HH:mm'
											)}
										</Text>
									)}
								</Stack>
							</Stack>
							<Stack align="center">
								<Text size="xs">
									{formatDate(
										new Date(dayjs().valueOf() + (configTime ?? 0)).toString(),
										'HH:mm, DD/MM/YYYY'
									)}
								</Text>
								<Text transform="uppercase">Xác nhận đặt lịch</Text>
								<Paper withBorder p="sm" radius={0} color="green">
									<Stack>
										<Text color="red" size="xs">
											Signature Valid
										</Text>
										<Text color="red" size="xs">
											Ký bởi: BỆNH VIỆN NHI ĐỒNG 2
										</Text>
										<Text color="red" size="xs">
											Ký ngày:{' '}
											{formatDate(
												new Date(
													dayjs().valueOf() + (configTime ?? 0)
												).toString(),
												'DD-MM-YYYY'
											)}
										</Text>
									</Stack>
								</Paper>
								<Text size="xs" weight={'bold'} transform="uppercase">
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
