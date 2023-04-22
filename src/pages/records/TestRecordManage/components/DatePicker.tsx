import { createStyles } from '@mantine/core'
import { DateRangePicker, DateRangePickerProps } from '@mantine/dates'
import 'dayjs/locale/vi'

const useStyles = createStyles((theme) => ({
	root: {
		position: 'relative',
	},

	input: {
		height: 'auto',
		paddingTop: 18,
		width: 320,
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

export const CustomDateRangePicker = ({
	...props
}: DateRangePickerProps &
	Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) => {
	const { classes } = useStyles()
	return <DateRangePicker locale="vi" classNames={classes} {...props} />
}
