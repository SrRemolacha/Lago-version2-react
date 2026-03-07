// app/debug/page.tsx
'use client';
import { useAuth } from '@/context/AuthContext';

export default function DebugPage() {
  const auth = useAuth();
  return <pre>{JSON.stringify(auth, null, 2)}</pre>;
}
