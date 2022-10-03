import { Bill, BillParams } from '@/entities/bill'
import { api } from '../api'

export const queueApi = api.injectEndpoints({
	endpoints: (build) => ({
		getQueue: build.query<Bill[], BillParams>({
			query: (params) => ({
				url: 'bills',
				params,
			}),
			providesTags: (result = []) => [
				...result.map(({ id }) => ({ type: 'Queue', id } as const)),
				{ type: 'Queue' as const, id: 'LIST' },
			],
		}),
		getQueueById: build.query<Bill, number | undefined>({
			query: (id) => ({
				url: `bills/${id}`,
			}),
			providesTags: (result) => [{ type: 'Queue' as const, id: result?.id }],
		}),
		confirmBill: build.mutation<void, number>({
			query: (queueId) => ({
				url: `bills/${queueId}/pay`,
				method: 'POST',
			}),
		}),
		invalidateBill: build.mutation<void, number>({
			query: (queueId) => ({
				url: `bills/${queueId}`,
				method: 'DELETE',
			}),
		}),
	}),
})

export const {
	useGetQueueQuery,
	useGetQueueByIdQuery,
	useConfirmBillMutation,
	useInvalidateBillMutation,
} = queueApi

export const {
	endpoints: { getQueue, getQueueById, confirmBill, invalidateBill },
} = queueApi
