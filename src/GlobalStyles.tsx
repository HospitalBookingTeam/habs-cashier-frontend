import { Global } from '@mantine/core'

const GlobalStyles = () => {
	return (
		<Global
			styles={(theme) => ({
				'*, *::before, *::after': {
					boxSizing: 'border-box',
				},
				'#root': {
					height: '100vh',
					display: 'flex',
				},
				body: {
					...theme.fn.fontStyles(),
					backgroundColor:
						theme.colorScheme === 'dark'
							? theme.colors.dark[7]
							: theme.colors.gray[2],
					color:
						theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
					lineHeight: theme.lineHeight,
					margin: 0,
				},
				'.mantine-Modal-title': {
					fontWeight: 700,
				},
				'tr:nth-of-type(even):not(.ignore)': {
					backgroundColor: theme.colors.gray[2],
				},
				'th.right, td.right': {
					textAlign: 'right !important',
				},
			})}
		/>
	)
}

export default GlobalStyles
