import { BillConfirmResponse } from '@/entities/bill'
import { api } from '../api'
import { UserAccount } from '@/entities/user'
import { Slot } from '@/entities/slot'
import { AppointmentForGuest, AppointmentForUser } from '@/entities/appointment'
import { Doctor } from '@/entities/doctor'

export const bookingApi = api.injectEndpoints({
	endpoints: (build) => ({
		getUserAccount: build.query<UserAccount, string>({
			query: (params) => ({
				url: 'users',
				params: {
					'phone-number': params,
				},
			}),
		}),
		getDoctors: build.query<Doctor[], { date: string }>({
			query: (params) => ({
				url: `doctors`,
				params,
			}),
			providesTags: (result = []) => [
				...result.map(
					({ id }) => ({ type: 'Record', id: `doctor_${id}` } as const)
				),
				{ type: 'Record' as const, id: 'DOCTORS' },
			],
		}),
		getSlots: build.query<Slot[], { date: string; doctorId: number }>({
			query: (params) => ({
				url: `slots`,
				params,
			}),
			providesTags: (result = []) => [
				...result.map(
					({ numericalOrder }) =>
						({ type: 'Record', id: `slot_${numericalOrder}` } as const)
				),
				{ type: 'Record' as const, id: 'SLOTS' },
			],
		}),

		bookForGuest: build.mutation<BillConfirmResponse, AppointmentForGuest>({
			query: (body) => ({
				url: `appointments/guest`,
				method: 'POST',
				body,
			}),
		}),
		bookForUser: build.mutation<BillConfirmResponse, AppointmentForUser>({
			query: (body) => ({
				url: `appointments`,
				method: 'POST',
				body,
			}),
		}),
	}),
})

export const {
	useGetSlotsQuery,
	useGetDoctorsQuery,
	useLazyGetUserAccountQuery,
	useGetUserAccountQuery,
	useBookForGuestMutation,
	useBookForUserMutation,
} = bookingApi
