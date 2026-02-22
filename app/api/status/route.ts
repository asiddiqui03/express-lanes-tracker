import { NextResponse } from 'next/server';
import { fetchExpressLanesStatus } from '@/lib/api';

export const revalidate = 60;

export async function GET() {
    const data = await fetchExpressLanesStatus();
    if (data.status === 'error') {
        return NextResponse.json(data, { status: 500 });
    }
    return NextResponse.json(data);
}
