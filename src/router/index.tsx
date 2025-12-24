/**
 * 路由配置
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Spin } from 'antd';

// 懒加载页面组件
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Models = lazy(() => import('@/pages/Models'));
const ModelDetail = lazy(() => import('@/pages/Models/ModelDetail'));
const Datasets = lazy(() => import('@/pages/Datasets'));
const DatasetDetail = lazy(() => import('@/pages/Datasets/DatasetDetail'));
const GenerateDataset = lazy(() => import('@/pages/Datasets/GenerateDataset'));
const Experiments = lazy(() => import('@/pages/Experiments'));
const ExperimentDetail = lazy(() => import('@/pages/Experiments/ExperimentDetail'));
const Evaluation = lazy(() => import('@/pages/Evaluation'));
const Reports = lazy(() => import('@/pages/Reports'));
const ReportDetail = lazy(() => import('@/pages/Reports/ReportDetail'));
const Settings = lazy(() => import('@/pages/Settings'));

// Loading组件
const PageLoading = () => (
  <div className="flex items-center justify-center h-screen">
    <Spin size="large" />
  </div>
);

// 路由配置
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoading />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'models',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoading />}>
                <Models />
              </Suspense>
            ),
          },
          {
            path: ':id',
            element: (
              <Suspense fallback={<PageLoading />}>
                <ModelDetail />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'datasets',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoading />}>
                <Datasets />
              </Suspense>
            ),
          },
          {
            path: 'generate',
            element: (
              <Suspense fallback={<PageLoading />}>
                <GenerateDataset />
              </Suspense>
            ),
          },
          {
            path: ':id',
            element: (
              <Suspense fallback={<PageLoading />}>
                <DatasetDetail />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'experiments',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoading />}>
                <Experiments />
              </Suspense>
            ),
          },
          {
            path: ':id',
            element: (
              <Suspense fallback={<PageLoading />}>
                <ExperimentDetail />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'evaluation',
        element: (
          <Suspense fallback={<PageLoading />}>
            <Evaluation />
          </Suspense>
        ),
      },
      {
        path: 'reports',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoading />}>
                <Reports />
              </Suspense>
            ),
          },
          {
            path: ':id',
            element: (
              <Suspense fallback={<PageLoading />}>
                <ReportDetail />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageLoading />}>
            <Settings />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
