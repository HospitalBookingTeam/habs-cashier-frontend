import { CONFIG_TYPES } from '@/utils/renderEnums'
import { Paper, Tabs, createStyles, TextInput } from '@mantine/core'
import { lazy, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const CheckupRecordManage = lazy(() => import('./CheckupRecordManage'))
const TestRecordManage = lazy(() => import('./TestRecordManage'))

const useStyles = createStyles((theme) => ({
	container: {
		position: 'relative',
	},

	tabs: {
		maxWidth: '100% !important',
	},
}))

const tabs = [
	{
		key: 'checkup_record',
		label: 'Danh sách bệnh án',
		type: CONFIG_TYPES.CHECKUP_RECORD,
		panel: <CheckupRecordManage />,
	},
	{
		key: 'test_record',
		label: 'Danh sách xét nghiệm',
		type: CONFIG_TYPES.TEST_RECORD,
		panel: <TestRecordManage />,
	},
]

const DEFAULT_TAB = tabs[0].key

const ConfigContainer = () => {
	const { classes } = useStyles()

	const [searchParams, setSearchParams] = useSearchParams()
	const [tabValue, setTabValue] = useState<string>(
		searchParams.get('tabs') ?? DEFAULT_TAB
	)

	const items = tabs.map((tab) => (
		<Tabs.Tab value={tab.key} key={tab.key}>
			{tab.label}
		</Tabs.Tab>
	))
	const panelItems = tabs.map((tab) => (
		<Tabs.Panel value={tab.key} key={tab.key}>
			{tab.panel}
		</Tabs.Panel>
	))

	useEffect(() => {
		const currentTabParam = searchParams.get('tabs') ?? DEFAULT_TAB
		if (tabValue !== currentTabParam) {
			setTabValue(currentTabParam)
		}
	}, [tabValue, searchParams])

	return (
		<Paper
			p="md"
			shadow="sm"
			sx={{ backgroundColor: 'white' }}
			className={classes.container}
		>
			<Tabs
				classNames={{ root: classes.tabs }}
				variant="outline"
				value={tabValue}
				onTabChange={(value: string) => {
					setTabValue(value)
					setSearchParams({ tabs: value })
				}}
			>
				<Tabs.List>{items}</Tabs.List>

				{panelItems}
			</Tabs>
		</Paper>
	)
}
export default ConfigContainer
