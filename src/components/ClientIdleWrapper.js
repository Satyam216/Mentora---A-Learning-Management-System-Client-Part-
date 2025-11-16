// src/components/ClientIdleWrapper.js
'use client';

import React from 'react';
import useIdleLogout from '@/hooks/useIdleLogout';

/**
 * Client wrapper that activates idle-logout and simply renders children.
 * Use this inside server layout to run client-only hooks.
 */
export default function ClientIdleWrapper({ children }) {
  useIdleLogout(); // runs only in browser
  return <>{children}</>;
}
