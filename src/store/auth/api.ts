import { AuthForm, AuthState } from '@/entities/auth'
import { retry } from '@reduxjs/toolkit/query/react'
import { api } from '../api'

export const authApi = api.injectEndpoints({
	endpoints: (build) => ({
		login: build.mutation<Omit<AuthState, 'isAuthenticated'>, any>({
			query: (credentials: AuthForm) => ({
				url: 'login',
				method: 'POST',
				body: credentials,
			}),
			extraOptions: {
				backoff: () => {
					// We intentionally error once on login, and this breaks out of retrying. The next login attempt will succeed.
					retry.fail({ fake: 'error' })
				},
			},
		}),
		clearCache: build.query<void, void>({
			query: () => ({
				url: 'test/clear-cache',
			}),
		}),
	}),
})

export const { useLoginMutation, useLazyClearCacheQuery } = authApi

export const {
	endpoints: { login },
} = authApi
