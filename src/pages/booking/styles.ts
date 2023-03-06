import { createStyles } from '@mantine/core'

const useBookingStyles = createStyles((theme) => ({
	root: {
		padding: theme.spacing.md,
		width: `900px`,
		margin: '0 auto',
	},

	separator: {
		height: '0.125px',
		borderTop: `0.125px dashed ${
			theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4]
		}`,
		borderRadius: theme.radius.xl,
		backgroundColor: 'transparent',
	},

	separatorActive: {
		borderWidth: 0,
		backgroundImage: theme.fn.linearGradient(
			45,
			theme.colors.blue[6],
			theme.colors.cyan[6]
		),
	},

	stepIcon: {
		borderColor: 'transparent',
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.white,
		borderWidth: 0,

		'&[data-completed]': {
			borderWidth: 0,
			backgroundColor: 'transparent',
			backgroundImage: theme.fn.linearGradient(
				45,
				theme.colors.green[6],
				theme.colors.teal[6]
			),
		},
		'&[data-progress]': {
			borderWidth: 2,
		},
	},

	step: {
		transition: 'transform 150ms ease',

		'&[data-progress]': {
			transform: 'scale(1.05)',
		},
	},
}))

export default useBookingStyles
