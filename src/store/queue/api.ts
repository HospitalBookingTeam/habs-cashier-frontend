import { Bill, BillParams, BillPayResponse } from '@/entities/bill'
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
		getBillById: build.query<Bill, number | undefined>({
			query: (id) => ({
				url: `bills/${id}`,
			}),
			providesTags: (result) => [{ type: 'Queue' as const, id: result?.id }],
		}),
		getBillByQr: build.mutation<Bill, string>({
			query: (qr) => ({
				url: `bills/qr/${qr}`,
				type: 'GET',
			}),
		}),
		confirmBill: build.mutation<BillPayResponse, number>({
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
	useGetBillByIdQuery,
	useGetBillByQrMutation,
	useConfirmBillMutation,
	useInvalidateBillMutation,
} = queueApi

export const {
	endpoints: {
		getQueue,
		getBillById,
		getBillByQr,
		confirmBill,
		invalidateBill,
	},
} = queueApi
