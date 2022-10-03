import { lazy, Suspense, useLayoutEffect } from 'react'
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { Box, LoadingOverlay } from '@mantine/core'
import { selectIsAuthenticated } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import LayoutAppShell from '@/components/Layout'
import SimpleVerticalLayout from '@/components/Layout/SimpleVerticalLayout'

const Login = lazy(() => import('@/pages/auth'))

const Queue = lazy(() => import('@/pages/queue'))
const QueueDetail = lazy(() => import('@/pages/queue/detail'))
const NotFound = lazy(() => import('@/components/NotFound/NotFoundPage'))

function App() {
	return (
		<Suspense fallback={<LoadingOverlay visible={true} />}>
			<Box
				sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
			>
				<Routes>
					<Route path="/" element={<Outlet />}>
						<Route element={<RequireAuth />}>
							<Route index element={<Queue />} />
							<Route path=":id" element={<QueueDetail />} />
						</Route>

						<Route path="/login" element={<IsUserRedirect />}>
							<Route index element={<Login />} />
						</Route>
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Box>
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
	return !isAuthenticated ? <Outlet /> : <Navigate to={'/'} />
}

export default App
