import { createStyles, Grid, Text, useMantineTheme } from '@mantine/core'

const useStyles = createStyles((theme) => ({
	label: {
		color: theme.colors.dark,
		fontWeight: 500,
		// borderRight: '1px solid lightgray',
	},
}))

const RowWithLabel = ({
	label,
	content,
	labelSpan = 3,
	isOdd = false,
}: {
	label: string
	content?: string
	labelSpan?: number
	isOdd?: boolean
}) => {
	const { classes } = useStyles()
	const theme = useMantineTheme()
	return (
		<Grid
			sx={{
				border: '1px solid transparent',
				borderRadius: 4,
				width: '100%',
				margin: 0,
				flex: 1,
				background: isOdd ? 'white' : theme.colors.gray[0],
			}}
		>
			<Grid.Col span={labelSpan} px="xs" className={classes.label}>
				<Text>{label}</Text>
			</Grid.Col>
			<Grid.Col span={12 - labelSpan} px="xs">
				<Text>{content}</Text>
			</Grid.Col>
		</Grid>
	)
}

export default RowWithLabel
