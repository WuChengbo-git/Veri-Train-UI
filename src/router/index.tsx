/**
 * 路由配置
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Spin } from 'antd';

// 直接导入（临时禁用懒加载以调试缓存问题）
import Datasets from '@/pages/Datasets';
import Experiments from '@/pages/Experiments';
import Evaluation from '@/pages/Evaluation';

// 懒加载页面组件
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Models = lazy(() => import('@/pages/Models'));
const ModelDetail = lazy(() => import('@/pages/Models/ModelDetail'));
const DatasetDetail = lazy(() => import('@/pages/Datasets/DatasetDetail'));
const GenerateDataset = lazy(() => import('@/pages/Datasets/GenerateDataset'));
const ExperimentDetail = lazy(() => import('@/pages/Experiments/ExperimentDetail'));
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
            element: <Datasets />,
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
            element: <Experiments />,
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
        element: <Evaluation />,
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
