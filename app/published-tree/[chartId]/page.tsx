"use client"

import { use } from 'react';
import FamilyTreeView from '@/components/tree/family-tree-view';
import DashboardNavbar from '@/components/dashboard-navbar';

interface PublishedTreePageProps {
  params: Promise<{
    chartId: string;
  }>;
}

export default function PublishedTreePage({ params }: PublishedTreePageProps) {
  const { chartId } = use(params);
  return (
    <>
      {/* Simple Navbar for Published Tree */}
      <DashboardNavbar />
      <FamilyTreeView chartId={chartId} readOnly={true} />
    </>
  );
}

