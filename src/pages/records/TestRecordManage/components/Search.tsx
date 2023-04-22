import { createStyles, TextInput, TextInputProps } from '@mantine/core'
import { IconSearch } from '@tabler/icons'
import React from 'react'

const useStyles = createStyles((theme) => ({
	input: {
		height: 'auto',
		paddingTop: 7,
		paddingBottom: 7,
		// width: 320,
	},
}))

export const Search = ({
	...props
}: TextInputProps & React.HTMLAttributes<HTMLInputElement>) => {
	const { classes } = useStyles()
	return (
		<TextInput
			placeholder="Tìm kiếm"
			sx={{ flex: 1 }}
			icon={<IconSearch size={14} stroke={1.5} />}
			size="md"
			classNames={classes}
			{...props}
		/>
	)
}
