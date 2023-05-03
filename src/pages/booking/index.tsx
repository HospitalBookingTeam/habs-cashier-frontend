import {
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
	Avatar,
	Indicator,
	Stepper,
	Skeleton,
	Divider,
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
	useBookForUserMutation,
	useGetDoctorsQuery,
	useGetSlotsQuery,
	useLazyGetSlotForAnonymousQuery,
	useLazyGetUserAccountQuery,
} from '@/store/booking/api'
import { AppointmentForGuest } from '@/entities/appointment'
import { Bill, BillConfirmResponse, BillPayResponse } from '@/entities/bill'
import { formatDate } from '@/utils/formats'
import { useConfirmBillMutation } from '@/store/queue/api'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import {
	IconBuilding,
	IconBuildingHospital,
	IconClock,
	IconPhone,
	IconSearch,
	IconUserCheck,
} from '@tabler/icons'
import { UserAccount } from '@/entities/user'
import useBookingStyles from './styles'
import PatientOption from './PatientOption'

const DATE = new Date().toISOString()

const schema = Yup.object().shape({
	name: Yup.string().required('Vui lòng nhập họ tên'),
	dateOfBirth: Yup.date().required('Vui lòng chọn ngày sinh'),
	clinicalSymptom: Yup.string().required('Vui lòng ghi rõ triệu chứng'),
	gender: Yup.string().required(),
	// doctorId: Yup.string().required('Vui lòng chọn bác sĩ'),
	// numericalOrder: Yup.string().required('Vui lòng chọn khung giờ khám'),
})

const BookFormModal = () => {
	const navigate = useNavigate()
	const form = useForm<
		Omit<AppointmentForGuest, 'doctorId' | 'numericalOrder' | 'date'>
	>({
		validate: yupResolver(schema),
		initialValues: {
			name: '',
			phoneNo: '',
			bhyt: '',
			// bhxh: '',
			dateOfBirth: undefined,
			address: '',
			gender: '0',
			clinicalSymptom: '',
			// numericalOrder: '',
			// doctorId: '',
			// date: DATE,
		},
		validateInputOnChange: true,
	})
	const [isGuest, setIsGuest] = useState('guest')
	const [phoneNo, setPhoneNo] = useState<string>('')
	const [userAcc, setUserAcc] = useState<UserAccount>()
	const [patientProfile, setPatientProfile] = useState<string | null>()
	const [active, setActive] = useState(0)

	const { classes } = useBookingStyles()
	const nextStep = () =>
		setActive((current) => (current < 3 ? current + 1 : current))
	const prevStep = () =>
		setActive((current) => (current > 0 ? current - 1 : current))

	const [isCreateNewProfile, setIsCreateNewProfile] = useState(false)
	const [showBill, setShowBill] = useState(false)
	const [billResponse, setBillResponse] = useState<Bill | undefined>(undefined)
	const [confirmBillResponse, setConfirmBillResponse] = useState<
		BillPayResponse | undefined
	>(undefined)
	const [
		triggerGetSlotForAnonyous,
		{ isLoading: isLoadingGetSlotForAnonyous, data: slotForAnonymous },
	] = useLazyGetSlotForAnonymousQuery()

	const { data: doctors, isLoading: isLoadingDoctors } = useGetDoctorsQuery({
		date: DATE,
	})
	const doctorOptions = doctors?.map((item) => ({
		value: item.id.toString(),
		label: item.name,
	}))

	// const { data: slots, isLoading: isLoadingSlots } = useGetSlotsQuery(
	// 	{
	// 		doctorId: Number(form.values.doctorId),
	// 		date: DATE,
	// 	},
	// 	{
	// 		skip: !form.values.doctorId,
	// 	}
	// )
	// const slotOptions = slots
	// 	?.filter((item) => !!item.isAvailable)
	// 	.map((item) => ({
	// 		value: `${item.numericalOrder}-${item.session}`,
	// 		label: formatDate(item.estimatedStartTime, 'HH:mm'),
	// 	}))

	const [bookForGuestMutation, { isLoading: isLoadingBookingForGuest }] =
		useBookForGuestMutation()
	const [bookForUserMutation, { isLoading: isLoadingBookingForUser }] =
		useBookForUserMutation()
	const [payBillMutation, { isLoading: isLoadingPayBill }] =
		useConfirmBillMutation()

	const onSubmit = async (
		values: Omit<AppointmentForGuest, 'doctorId' | 'numericalOrder' | 'date'>
	) => {
		// const _slotMeta = values.numericalOrder.toString().split('-')
		// const _slot = slots?.find(
		// 	(item) =>
		// 		item.numericalOrder === Number(_slotMeta[0]) &&
		// 		item.session === Number(_slotMeta[1])
		// )
		if (!slotForAnonymous?.length) return
		if (isGuest === 'guest') {
			await bookForGuestMutation({
				...values,
				gender: Number(values.gender),
				numericalOrder: slotForAnonymous[0].numericalOrder,
				doctorId: slotForAnonymous[0].doctorId,
				date: slotForAnonymous[0].estimatedStartTime,
			})
				.unwrap()
				.then((resp) => {
					if (!resp?.data?.bill) {
						openModal({
							children: (
								<>
									<Text color="red" weight={'bold'}>
										Đã hết lịch khám hôm nay
									</Text>
								</>
							),
							color: 'red',
							withCloseButton: false,
							centered: true,
							onClose: () => {
								navigate('/')
							},
						})
						return
					}
					setBillResponse(resp.data.bill)
					setShowBill(true)
					nextStep()
				})
				.catch(({ data: { message } }) => {
					openModal({
						children: (
							<>
								<Text color="red" weight={'bold'}>
									{message}
								</Text>
							</>
						),
						color: 'red',
						withCloseButton: false,
						centered: true,
						onClose: () => {
							form.reset()
							setShowBill(false)
							setBillResponse(undefined)
							setActive(0)
						},
					})
				})
		} else {
			await bookForUserMutation({
				clinicalSymptom: values.clinicalSymptom,
				patientId: Number(patientProfile),
				numericalOrder: slotForAnonymous[0].numericalOrder,
				doctorId: slotForAnonymous[0].doctorId,
				date: slotForAnonymous[0].estimatedStartTime,
			})
				.unwrap()
				.then((resp) => {
					if (!resp?.data?.bill) {
						openModal({
							children: (
								<>
									<Text color="red" weight={'bold'}>
										Đã hết lịch khám hôm nay
									</Text>
								</>
							),
							color: 'red',
							withCloseButton: false,
							centered: true,
							onClose: () => {
								navigate('/')
							},
						})
						return
					}
					setBillResponse(resp.data.bill)
					setShowBill(true)
					nextStep()
				})
				.catch(({ data: { message } }) => {
					openModal({
						children: (
							<>
								<Text color="red" weight={'bold'}>
									{message}
								</Text>
							</>
						),
						color: 'red',
						withCloseButton: false,
						centered: true,
						onClose: () => {
							form.reset()
							setShowBill(false)
							setBillResponse(undefined)
							setActive(0)
						},
					})
				})
		}
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
			.then((resp) => {
				nextStep()
				setConfirmBillResponse(resp)
			})
	}

	// useEffect(() => {
	// 	if (showBill) return
	// 	if (form.isTouched('doctorId')) {
	// 		form.resetTouched()
	// 		form.setValues({ ...form.values, numericalOrder: '' })
	// 	}
	// }, [form.isTouched('doctorId'), showBill])

	return (
		<Stack sx={{ paddingBottom: 100 }}>
			<form id="pay-form" onSubmit={form.onSubmit(onSubmit)}>
				<Stepper
					active={active}
					onStepClick={setActive}
					breakpoint="sm"
					classNames={classes}
					size="lg"
				>
					<Stepper.Step label="Thông tin khám bệnh">
						<Group align="start" position="center">
							<Paper shadow="xs" radius="md" p="md">
								<Stack sx={{ position: 'relative' }}>
									<SegmentedControl
										color="green"
										value={isGuest}
										onChange={setIsGuest}
										data={[
											{ label: 'Khách vãng lai', value: 'guest' },
											{ label: 'Tài khoản có sẵn', value: 'user' },
										]}
									/>
									<Stack>
										{isGuest !== 'guest' && (
											<Group grow align="end">
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
												</Stack>
												{!!userAcc && (
													<Stack spacing={0}>
														<Text size="sm">{userAcc.name}</Text>
														<Text size="sm">{userAcc.email}</Text>
													</Stack>
												)}
											</Group>
										)}
										{isGuest !== 'guest' && (
											<Select
												label="Hồ sơ khám bệnh"
												placeholder="Chọn hồ sơ khám bệnh của bé"
												data={
													userAcc?.patients?.map((item) => ({
														value: item.id.toString(),
														label: item.name,
														...item,
													})) ?? []
												}
												itemComponent={PatientOption}
												value={patientProfile}
												onChange={(val) => {
													setPatientProfile(val)
													const profile = userAcc?.patients?.find(
														(item) => item.id.toString() === val
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
												filter={(value, item) =>
													!!item?.label
														?.toLowerCase()
														.includes(value.toLowerCase().trim())
												}
											/>
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

										{/* <Select
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
								/> */}
										<Group grow align="start">
											<TextInput
												// withAsterisk
												// required
												label="SĐT"
												readOnly={showBill}
												{...form.getInputProps('phoneNo')}
											/>
											<TextInput
												label="BHYT"
												readOnly={showBill}
												{...form.getInputProps('bhyt')}
											/>
										</Group>
										<Group grow>
											<Textarea
												label="Địa chỉ"
												readOnly={showBill}
												{...form.getInputProps('address')}
											/>
										</Group>
									</Stack>
								</Stack>
							</Paper>
						</Group>
					</Stepper.Step>
					<Stepper.Step
						label="Bác sĩ phụ trách"
						allowStepSelect={form.isValid()}
					>
						{!!slotForAnonymous?.length ? (
							<Stack align="center">
								<Paper p="md" sx={{ minWidth: 500 }}>
									<Stack spacing="lg">
										<Text>
											Dưới đây là thông tin bác sĩ khám bệnh và khung giờ dự
											kiến
										</Text>
										<Divider />
										<Group spacing="xl">
											<Indicator>
												<Avatar variant="outline">
													<IconUserCheck size="1.5rem" />
												</Avatar>
											</Indicator>
											<Text>BS. {slotForAnonymous[0].doctor}</Text>
										</Group>
										<Group spacing="xl">
											<Indicator>
												<Avatar variant="outline">
													<IconClock size="1.5rem" />
												</Avatar>
											</Indicator>
											<Text>
												{formatDate(
													slotForAnonymous[0].estimatedStartTime,
													'HH:mm'
												)}{' '}
												(Dự kiến)
											</Text>
										</Group>
										<Group spacing="xl">
											<Avatar variant="outline">
												<IconBuildingHospital size="1.5rem" />
											</Avatar>
											<Text>
												Phòng {slotForAnonymous[0].roomNumber} - Tầng{' '}
												{slotForAnonymous[0].floor}
											</Text>
										</Group>
									</Stack>
								</Paper>
							</Stack>
						) : (
							<Stack align="center" p="md">
								<Stack sx={{ minWidth: 500 }}>
									<Skeleton height={40} radius="xl" />
									<Skeleton height={40} radius="xl" />
								</Stack>
							</Stack>
						)}
					</Stepper.Step>
					<Stepper.Step
						label="Xác nhận thanh toán"
						allowStepSelect={!!showBill}
					>
						<Stack align="center">
							<Paper shadow="xs" radius="md" p="md" sx={{ minWidth: 700 }}>
								<Details data={billResponse} />
							</Paper>
						</Stack>
					</Stepper.Step>
					<Stepper.Completed>
						<Stack sx={{ minHeight: 450 }} align="center">
							<Paper shadow="xs" radius="md" p="md" sx={{ minWidth: 500 }}>
								<Stack align="center">
									<Text>Bạn đã đặt lịch thành công</Text>
									<Group
										align="center"
										position="center"
										mx="auto"
										sx={{ width: 200 }}
									>
										<PrintDetail data={confirmBillResponse} />
									</Group>
									{/*
									<Text weight="bold">Khám tổng quát</Text>
									<Text>
										Họ tên:{' '}
										{confirmBillResponse?.checkupRecords?.[0]?.patientData.name}
									</Text>
									<Text>
										Ngày sinh:{' '}
										{confirmBillResponse?.checkupRecords?.[0]?.patientData
											.dateOfBirth
											? formatDate(
													confirmBillResponse?.checkupRecords?.[0]?.patientData
														.dateOfBirth
											  )
											: '---'}
									</Text>
									<Text>
										Giới tính:{' '}
										{confirmBillResponse?.checkupRecords?.[0]?.patientData
											.gender === 0
											? 'Nam'
											: 'Nữ'}
									</Text>
									<Text>
										Phòng {confirmBillResponse?.checkupRecords?.[0]?.roomNumber}{' '}
										- Tầng {confirmBillResponse?.checkupRecords?.[0]?.floor}
									</Text>
									<Text>
										Số khám bệnh:{' '}
										{confirmBillResponse?.checkupRecords?.[0]?.numericalOrder}
									</Text>
									<Text>
										Bác sĩ phụ trách:{' '}
										{confirmBillResponse?.checkupRecords?.[0]?.doctorName}
									</Text> */}
								</Stack>
							</Paper>
						</Stack>
					</Stepper.Completed>
				</Stepper>
			</form>

			<Paper
				sx={{
					position: 'fixed',
					bottom: 0,
					left: 0,
					width: '100%',
				}}
				p="md"
			>
				<Container size="xl">
					<Group position="right">
						{active === 0 && (
							<Button
								type="button"
								sx={{ width: 300 }}
								disabled={!form.isValid()}
								onClick={() => {
									nextStep()
									triggerGetSlotForAnonyous()
								}}
							>
								Tiếp tục
							</Button>
						)}
						{active === 1 && (
							<Button
								form="pay-form"
								type="submit"
								sx={{ width: 300 }}
								disabled={!form.isValid() || !slotForAnonymous?.length}
								loading={isLoadingBookingForGuest || isLoadingBookingForUser}
							>
								Thanh toán
							</Button>
						)}
						{active === 2 && (
							<>
								<Button
									variant="outline"
									sx={{ width: 150 }}
									color="red"
									onClick={() => {
										form.reset()
										setShowBill(false)
										setBillResponse(undefined)
										setActive(0)
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
						{active === 3 && (
							<>
								<Button
									variant="outline"
									sx={{ width: 150 }}
									onClick={() => {
										form.reset()
										setShowBill(false)
										setBillResponse(undefined)
										setActive(0)
									}}
									type="button"
								>
									Tiếp tục đặt
								</Button>
								<Button
									sx={{ width: 300 }}
									type="button"
									component={Link}
									to="/"
								>
									Quay về trang chủ
								</Button>
							</>
						)}
					</Group>
				</Container>
			</Paper>
		</Stack>
	)
}
export default BookFormModal
