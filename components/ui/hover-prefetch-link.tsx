'use client';

import Link from 'next/link';
import { useState } from 'react';

export function HoverPrefetchLink(props: React.ComponentProps<typeof Link>) {
  const [active, setActive] = useState(false);

  return <Link {...props} prefetch={active ? null : false} onMouseEnter={() => setActive(true)} />;
}
