import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from './context';

export const guestbookRouter = createRouter()
	.query('getAllMessages', {
		async resolve({ ctx }) {
			try {
				return await ctx.prisma.guestbook.findMany({
					select: {
						name: true,
						message: true,
					},
					orderBy: {
						createdAt: 'desc',
					},
				});
			} catch (error) {
				console.log('error', error);
			}
		},
	})
	.middleware(async ({ ctx, next }) => {
		if (!ctx.session || !ctx.session.user) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
		return next({
			ctx: {
				...ctx,
				// infers that `session` is non-nullable to downstream resolvers
				session: { ...ctx.session, user: ctx.session.user },
			},
		});
	})
	.mutation('postMessage', {
		input: z.object({
			name: z.string(),
			message: z.string(),
		}),
		async resolve({ ctx, input }) {
			try {
				await ctx.prisma.guestbook.create({
					data: {
						name: input.name,
						message: input.message,
					},
				});
			} catch (error) {
				console.log(error);
			}
		},
	});
