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
				'td.right': {
					textAlign: 'right',
				},
				'thead tr th, tfoot tr th': {
					'&.right': {
						textAlign: 'right',
					},
				},
				'tr.row-link:hover': {
					cursor: 'pointer',
					backgroundColor: `${theme.colors.green[0]} !important`,
				},
			})}
		/>
	)
}

export default GlobalStyles
