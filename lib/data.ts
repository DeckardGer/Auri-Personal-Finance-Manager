import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export const getUser = cache(async () => prisma.user.findFirst());
