import {
	Select,
	SelectProps,
	createStyles,
	MultiSelect,
	MultiSelectProps,
} from '@mantine/core'

const useStyles = createStyles((theme) => ({
	root: {
		position: 'relative',
	},

	input: {
		height: 'auto',
		paddingTop: 18,
	},

	label: {
		position: 'absolute',
		pointerEvents: 'none',
		fontSize: theme.fontSizes.xs,
		paddingLeft: theme.spacing.sm,
		paddingTop: theme.spacing.sm / 2,
		zIndex: 1,
	},
}))

export const CustomSelect = ({
	...props
}: SelectProps &
	Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) => {
	const { classes } = useStyles()
	return <Select {...props} classNames={classes} />
}

export const CustomMultiSelect = ({
	...props
}: Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> &
	MultiSelectProps) => {
	const { classes } = useStyles()
	return (
		<MultiSelect
			classNames={classes}
			clearButtonLabel="Clear selection"
			clearable
			{...props}
		/>
	)
}
