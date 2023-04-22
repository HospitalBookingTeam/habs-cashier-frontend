import { HistoryCheckupRecord, HistoryTestRecord } from '@/entities/history'
import {
	CheckupListGetRequest,
	CheckupRecordList,
	TestRecordList,
	TestListGetRequest,
} from '@/entities/record'
import { api } from '../api'
import { Room } from '@/entities/room'

export const recordApi = api.injectEndpoints({
	endpoints: (build) => ({
		getCheckupRecords: build.query<
			CheckupRecordList,
			Partial<CheckupListGetRequest>
		>({
			query: ({ statusToExclude, statusToInclude, roomIds, ...params }) => {
				let excludes = ''
				let includes = ''
				let roomIdList = ''
				statusToExclude?.forEach((status) => {
					excludes += `status-to-exclude=${status}&`
				})
				statusToInclude?.forEach((status) => {
					includes += `status-to-include=${status}&`
				})
				roomIds?.forEach((status) => {
					includes += `room-ids=${status}&`
				})
				return {
					url: `checkup-records?${excludes}${includes}${roomIdList}`,
					params: {
						...params,
					},
				}
			},
		}),
		getTestRecords: build.query<TestRecordList, Partial<TestListGetRequest>>({
			query: ({ statusToExclude, statusToInclude, roomIds, ...params }) => {
				let excludes = ''
				let includes = ''
				let roomIdList = ''
				statusToExclude?.forEach((status) => {
					excludes += `status-to-exclude=${status}&`
				})
				statusToInclude?.forEach((status) => {
					includes += `status-to-include=${status}&`
				})
				roomIds?.forEach((status) => {
					includes += `room-ids=${status}&`
				})
				return {
					url: `test-records?${excludes}${includes}${roomIdList}`,
					params: {
						...params,
					},
				}
			},
		}),
		getCheckupRecordById: build.query<HistoryCheckupRecord, { id?: number }>({
			query: (body) => ({
				url: `checkup-records/${body.id}`,
			}),
		}),
		getTestRecordById: build.query<HistoryTestRecord, { id?: number }>({
			query: (body) => ({
				url: `test-records/${body.id}`,
			}),
		}),
		getRoomList: build.query<Room[], void>({
			query: () => ({
				url: `rooms`,
			}),
		}),
		getExamRoomList: build.query<Room[], void>({
			query: () => ({
				url: `rooms/exam-room`,
			}),
		}),
	}),
})

export const {
	useGetCheckupRecordsQuery,
	useGetTestRecordsQuery,
	useGetCheckupRecordByIdQuery,
	useGetTestRecordByIdQuery,
	useGetExamRoomListQuery,
	useGetRoomListQuery,
} = recordApi

export const {
	endpoints: { getCheckupRecords, getCheckupRecordById },
} = recordApi
