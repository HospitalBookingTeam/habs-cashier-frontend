import { useLazyClearCacheQuery } from '@/store/auth/api'
import { selectAuth } from '@/store/auth/selectors'
import { logout } from '@/store/auth/slice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
	createStyles,
	Container,
	Button,
	Group,
	Text,
	Box,
	Anchor,
	NavLink,
} from '@mantine/core'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Clock from '../Clock'

const useStyles = createStyles((theme) => ({
	header: {
		paddingTop: theme.spacing.sm,
		backgroundColor: theme.fn.variant({
			variant: 'filled',
			color: theme.primaryColor,
		}).background,
		borderBottom: `1px solid ${
			theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
				.background
		}`,
		marginBottom: 0,
		position: 'fixed',
		width: '100%',
		zIndex: 999,
	},

	mainSection: {
		paddingBottom: theme.spacing.sm,
	},
	searchInput: {
		minWidth: 250,
		height: 36,
		paddingLeft: theme.spacing.sm,
		paddingRight: 5,
		borderRadius: theme.radius.md,
		color:
			theme.colorScheme === 'dark'
				? theme.colors.dark[2]
				: theme.colors.gray[5],
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark'
					? theme.fn.rgba(theme.colors.dark[5], 0.85)
					: theme.fn.rgba(theme.colors.gray[0], 0.85),
		},
	},
}))

const SimpleHeader = () => {
	const { classes } = useStyles()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const authData = useAppSelector(selectAuth)
	const [triggerClearCache] = useLazyClearCacheQuery()

	useEffect(() => {
		if (!authData?.isAuthenticated) {
			navigate('/login')
		}
	}, [authData])

	return (
		<Box className={classes.header}>
			<Container size="xl" className={classes.mainSection}>
				<Group position="apart">
					<Group align="baseline">
						<Button
							variant="white"
							size="sm"
							onClick={async () => triggerClearCache()}
						>
							{authData?.information?.name}
						</Button>

						<Group>
							<Anchor href="/" sx={{ color: 'white' }}>
								Hóa đơn
							</Anchor>
							<Anchor href="/records" sx={{ color: 'white' }}>
								Quản lí
							</Anchor>
						</Group>
					</Group>

					<Group>
						<Clock />
						<Button
							variant="default"
							onClick={() => {
								dispatch(logout())
							}}
						>
							Đăng xuất
						</Button>
					</Group>
				</Group>
			</Container>
		</Box>
	)
}

export default SimpleHeader
