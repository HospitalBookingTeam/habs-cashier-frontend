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
	Title,
} from '@mantine/core'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
						<Text weight={'bolder'} color="white" component={Link} to="/">
							{location.pathname === '/book' ? 'Hỗ trợ đặt lịch' : 'Trang chủ'}
						</Text>
						<Text color="white">|</Text>
						<Text color="white" size="sm">
							{authData?.information?.name}
						</Text>
					</Group>

					<Group>
						<Button
							variant="white"
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
