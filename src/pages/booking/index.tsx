import {
	LoadingOverlay,
	Container,
	Stack,
	Radio,
	Textarea,
	TextInput,
	Group,
	Button,
	ActionIcon,
	Select,
	Paper,
	Text,
	SegmentedControl,
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { useState, useEffect } from 'react'
import 'dayjs/locale/vi'
import { DatePicker } from '@mantine/dates'
import Details from '../queue/detail/Details'
import { openModal } from '@mantine/modals'
import PrintDetail from './PrintDetail'
import {
	useBookForGuestMutation,
	useGetDoctorsQuery,
	useGetSlotsQuery,
	useLazyGetUserAccountQuery,
} from '@/store/booking/api'
import { AppointmentForGuest } from '@/entities/appointment'
import { Bill } from '@/entities/bill'
import { formatDate } from '@/utils/formats'
import { useConfirmBillMutation } from '@/store/queue/api'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { IconPhone, IconSearch } from '@tabler/icons'
import { Patient, UserAccount } from '@/entities/user'

const DATE = new Date().toISOString()

const schema = Yup.object().shape({
	name: Yup.string().required('Vui lòng nhập họ tên'),
	dateOfBirth: Yup.date().required('Vui lòng chọn ngày sinh'),
	clinicalSymptom: Yup.string().required('Vui lòng ghi rõ triệu chứng'),
	gender: Yup.string().required(),
	doctorId: Yup.string().required('Vui lòng chọn bác sĩ'),
	numericalOrder: Yup.string().required('Vui lòng chọn khung giờ khám'),
})

const BookFormModal = () => {
	const navigate = useNavigate()
	const form = useForm<AppointmentForGuest>({
		validate: yupResolver(schema),
		initialValues: {
			name: '',
			phoneNo: '',
			bhyt: '',
			bhxh: '',
			dateOfBirth: undefined,
			address: '',
			gender: '0',
			clinicalSymptom: '',
			numericalOrder: '',
			doctorId: '',
			date: DATE,
		},
		validateInputOnChange: true,
	})
	const [isGuest, setIsGuest] = useState('guest')
	const [phoneNo, setPhoneNo] = useState<string>('')
	const [userAcc, setUserAcc] = useState<UserAccount>()
	const [patientProfile, setPatientProfile] = useState<string | null>()
	const [isCreateNewProfile, setIsCreateNewProfile] = useState(false)
	const [showBill, setShowBill] = useState(false)
	const [billResponse, setBillResponse] = useState<Bill | undefined>(undefined)

	const { data: doctors, isLoading: isLoadingDoctors } = useGetDoctorsQuery({
		date: DATE,
	})
	const doctorOptions = doctors?.map((item) => ({
		value: item.id.toString(),
		label: item.name,
	}))

	const { data: slots, isLoading: isLoadingSlots } = useGetSlotsQuery(
		{
			doctorId: Number(form.values.doctorId),
			date: DATE,
		},
		{
			skip: !form.values.doctorId,
		}
	)
	const slotOptions = slots
		?.filter((item) => !!item.isAvailable)
		.map((item) => ({
			value: `${item.session}-${item.numericalOrder}`,
			label: formatDate(item.estimatedStartTime, 'HH:mm'),
		}))

	const [bookForGuestMutation, { isLoading: isLoadingBookingForGuest }] =
		useBookForGuestMutation()
	const [payBillMutation, { isLoading: isLoadingPayBill }] =
		useConfirmBillMutation()

	const onSubmit = async (values: AppointmentForGuest) => {
		await bookForGuestMutation({
			...values,
			gender: Number(values.gender),
			numericalOrder: Number(values.numericalOrder.toString().split('-')[0]),
			doctorId: Number(values.doctorId),
			date:
				slots?.find(
					(item) =>
						item.numericalOrder ===
						Number(values.numericalOrder.toString().split('-')[0])
				)?.estimatedStartTime ?? DATE,
		})
			.unwrap()
			.then((resp) => {
				setBillResponse(resp.bill)
				setShowBill(true)
			})
			.catch((error) => {})
	}

	const onCreatePatientProfile = (query: string) => {
		console.log('query', query)
		setIsCreateNewProfile(true)
	}

	const [getUserAcc, userAccResult] = useLazyGetUserAccountQuery()
	const onFindUserAcc = async () => {
		await getUserAcc(phoneNo)
			.unwrap()
			.then((resp) => setUserAcc(resp))
	}

	const onConfirmBill = async () => {
		if (!billResponse) return
		await payBillMutation(billResponse.id)
			.unwrap()
			.then((resp) =>
				openModal({
					title: 'Đặt lịch thành công',
					children: (
						<Stack sx={{ minHeight: 450 }}>
							<Group
								align="center"
								position="center"
								mx="auto"
								sx={{ width: 200 }}
							>
								<PrintDetail data={resp} />
							</Group>

							<Stack>
								<Text weight="bold">Khám tổng quát</Text>
								<Text>
									Họ tên: {resp.checkupRecords?.[0]?.patientData.name}
								</Text>
								<Text>
									Ngày sinh:{' '}
									{resp.checkupRecords?.[0]?.patientData.dateOfBirth
										? formatDate(
												resp?.checkupRecords?.[0]?.patientData.dateOfBirth
										  )
										: '---'}
								</Text>
								<Text>
									Giới tính:{' '}
									{resp?.checkupRecords?.[0]?.patientData.gender === 0
										? 'Nam'
										: 'Nữ'}
								</Text>
							</Stack>
							<Stack>
								<Text>
									Phòng {resp?.checkupRecords?.[0]?.roomNumber} - Tầng{' '}
									{resp?.checkupRecords?.[0]?.floor}
								</Text>
								<Text>
									Số khám bệnh: {resp?.checkupRecords?.[0]?.numericalOrder}
								</Text>
								<Text>
									Bác sĩ phụ trách: {resp?.checkupRecords?.[0]?.doctorName}
								</Text>
							</Stack>
						</Stack>
					),
					centered: true,
					size: '70%',
					onClose: () => {
						navigate('/')
					},
				})
			)
	}

	useEffect(() => {
		if (showBill) return
		if (form.isTouched('doctorId')) {
			form.resetTouched()
			form.setValues({ ...form.values, numericalOrder: '' })
		}
	}, [form.isTouched('doctorId'), showBill])

	console.log('dob', form.values.dateOfBirth)
	return (
		<Stack sx={{ paddingBottom: 100 }}>
			<Group align="start" position="center">
				<Paper shadow="xs" radius="md" p="md">
					<Stack sx={{ position: 'relative' }}>
						<LoadingOverlay visible={false} />

						<SegmentedControl
							color="green"
							value={isGuest}
							onChange={setIsGuest}
							data={[
								{ label: 'Khách vãng lai', value: 'guest' },
								{ label: 'Tài khoản có sẵn', value: 'user' },
							]}
						/>
						<form onSubmit={form.onSubmit(onSubmit)}>
							<Stack>
								{isGuest !== 'guest' && (
									<Group grow align="start">
										<Stack>
											<TextInput
												value={phoneNo}
												onChange={(event) =>
													setPhoneNo(event.currentTarget.value)
												}
												rightSection={
													<ActionIcon
														color="blue"
														onClick={onFindUserAcc}
														loading={userAccResult.isLoading}
													>
														<IconSearch size={16} />
													</ActionIcon>
												}
												onKeyDown={(e) => {
													if (e.key === 'Enter') {
														onFindUserAcc()
													}
												}}
												icon={<IconPhone size={14} />}
												label="Tài khoản"
												placeholder="Nhập số điện thoại"
												readOnly={showBill}
											/>
											{!!userAcc && (
												<Text>
													{userAcc.name} - {userAcc.email}
												</Text>
											)}
										</Stack>
										<Select
											label="Hồ sơ khám bệnh"
											placeholder="Chọn hồ sơ khám bệnh của bé"
											data={
												userAcc?.patients?.map((item) => ({
													value: item.accountId.toString(),
													label: item.name,
												})) ?? []
											}
											value={patientProfile}
											onChange={(val) => {
												setPatientProfile(val)
												const profile = userAcc?.patients?.find(
													(item) => item.accountId.toString() === val
												)
												if (!profile) return
												form.setValues({
													...form.values,
													dateOfBirth: new Date(profile.dateOfBirth),
													phoneNo: profile.phoneNumber,
													address: profile.address,
													bhyt: profile.bhyt,
													gender: profile.gender.toString(),
													name: profile.name,
												})
												form.resetDirty()
											}}
											disabled={!userAcc}
											searchable
											creatable
											readOnly={showBill}
										/>
									</Group>
								)}
								<TextInput
									withAsterisk
									required
									label="Họ tên"
									readOnly={showBill}
									{...form.getInputProps('name')}
								/>
								<Group grow align="start">
									<DatePicker
										withAsterisk
										required
										locale="vi"
										label="Ngày sinh"
										readOnly={showBill}
										{...form.getInputProps('dateOfBirth')}
									/>
									<Radio.Group
										required
										label="Giới tính"
										withAsterisk
										readOnly={showBill}
										{...form.getInputProps('gender')}
									>
										<Radio value="0" label="Nam" />
										<Radio value="1" label="Nữ" />
									</Radio.Group>
								</Group>
								<Textarea
									required
									label="Triệu chứng"
									placeholder="Vui lòng điền rõ triệu chứng của bé"
									withAsterisk
									readOnly={showBill}
									sx={{ minWidth: !showBill ? 500 : 'auto' }}
									{...form.getInputProps('clinicalSymptom')}
								/>

								<Select
									withAsterisk={true}
									label="Bác sĩ khám bệnh"
									placeholder="Chọn bác sĩ khám bệnh"
									data={doctorOptions ?? []}
									searchable
									readOnly={showBill}
									{...form.getInputProps('doctorId')}
								/>
								<Select
									label="Khung giờ khám"
									placeholder="Chọn khung giờ khám"
									data={slotOptions ?? []}
									searchable
									readOnly={showBill}
									disabled={!form.values.doctorId}
									{...form.getInputProps('numericalOrder')}
								/>
								<Group grow align="start">
									<TextInput
										// withAsterisk
										// required
										label="SĐT"
										readOnly={showBill}
										{...form.getInputProps('phoneNo')}
									/>
									<Textarea
										label="Địa chỉ"
										readOnly={showBill}
										{...form.getInputProps('address')}
									/>
								</Group>
								<Group grow>
									<TextInput
										label="BHXH"
										readOnly={showBill}
										{...form.getInputProps('bhxh')}
									/>
									<TextInput
										label="BHYT"
										readOnly={showBill}
										{...form.getInputProps('bhyt')}
									/>
								</Group>
								<Paper
									sx={{ position: 'fixed', bottom: 0, left: 0, width: '100%' }}
									p="md"
								>
									<Container size="xl">
										<Group position="right">
											{!showBill && (
												<Button
													type="submit"
													sx={{ width: 300 }}
													disabled={!form.isValid()}
													loading={isLoadingBookingForGuest}
												>
													Thanh toán
												</Button>
											)}
											{showBill && (
												<>
													<Button
														variant="outline"
														sx={{ width: 150 }}
														color="red"
														onClick={() => {
															form.reset()
															setShowBill(false)
															setBillResponse(undefined)
														}}
														type="button"
														disabled={isLoadingPayBill}
													>
														Hủy
													</Button>
													<Button
														sx={{ width: 300 }}
														type="button"
														onClick={onConfirmBill}
														loading={isLoadingPayBill}
													>
														Xác nhận
													</Button>
												</>
											)}
										</Group>
									</Container>
								</Paper>
							</Stack>
						</form>
					</Stack>
				</Paper>
				{showBill && (
					<Paper shadow="xs" radius="md" p="md">
						<Details data={billResponse} />
					</Paper>
				)}
			</Group>
		</Stack>
	)
}
export default BookFormModal
