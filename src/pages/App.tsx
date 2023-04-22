import { lazy, Suspense, useLayoutEffect } from 'react'
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { Box, Center, Container, LoadingOverlay } from '@mantine/core'
import { selectIsAuthenticated } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import LayoutAppShell from '@/components/Layout'
import SimpleVerticalLayout from '@/components/Layout/SimpleVerticalLayout'

const Login = lazy(() => import('@/pages/auth'))

const Queue = lazy(() => import('@/pages/queue'))
const QueueDetail = lazy(() => import('@/pages/queue/detail'))
const BookAppointment = lazy(() => import('@/pages/booking'))
const NotFound = lazy(() => import('@/components/NotFound/NotFoundPage'))
const ManageRecords = lazy(() => import('@/pages/records'))
const CheckupRecordHistory = lazy(() => import('@/pages/history/CheckupRecord'))
const TestRecordHistory = lazy(() => import('@/pages/history/TestRecord'))

function App() {
	return (
		<Suspense fallback={<LoadingOverlay visible={true} />}>
			<Routes>
				<Route element={<RequireAuth />}>
					<Route path="/" element={<Outlet />}>
						<Route index element={<Queue />} />
						<Route path=":id" element={<QueueDetail />} />
						<Route path="book" element={<BookAppointment />} />
						<Route path="records" element={<Outlet />}>
							<Route index element={<ManageRecords />} />
							<Route path=":id" element={<CheckupRecordHistory />} />
						</Route>
						<Route path="tests" element={<Outlet />}>
							<Route path=":id" element={<TestRecordHistory />} />
						</Route>
					</Route>
				</Route>
				<Route element={<IsUserRedirect />}>
					<Route path="/login" element={<Login />} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	)
}

const RequireAuth = () => {
	const isAuthenticated = useAppSelector(selectIsAuthenticated)

	const navigate = useNavigate()
	useLayoutEffect(() => {
		if (isAuthenticated) return
		navigate('/login')
	}, [isAuthenticated, navigate])

	return isAuthenticated ? (
		<SimpleVerticalLayout>
			<Outlet />
		</SimpleVerticalLayout>
	) : (
		<Navigate to={'/login'} />
	)
}
const IsUserRedirect = () => {
	const isAuthenticated = useAppSelector(selectIsAuthenticated)
	return !isAuthenticated ? (
		<Container
			size="xl"
			sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
		>
			<Outlet />
		</Container>
	) : (
		<Navigate to={'/'} />
	)
}

export default App
