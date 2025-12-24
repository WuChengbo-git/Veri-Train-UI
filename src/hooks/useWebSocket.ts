/**
 * useWebSocket - WebSocket订阅的自定义Hook
 */

import { useEffect } from 'react';
import { wsClient, WSEventHandler } from '@/services/websocket';
import { useGlobalStore } from '@/stores';

/**
 * 订阅实验实时更新
 */
export function useExperimentWebSocket(experimentId: string | null, handler: WSEventHandler) {
  const setWSConnected = useGlobalStore((state) => state.setWSConnected);

  useEffect(() => {
    if (!experimentId) return;

    // 确保WebSocket已连接
    if (!wsClient.isConnected()) {
      wsClient.connect();
    }

    // 订阅实验更新
    wsClient.subscribeToExperiment(experimentId, handler);

    // 更新连接状态
    setWSConnected(wsClient.isConnected());

    // 清理订阅
    return () => {
      wsClient.unsubscribeFromExperiment(experimentId, handler);
    };
  }, [experimentId, handler, setWSConnected]);
}

/**
 * 订阅数据集实时更新
 */
export function useDatasetWebSocket(datasetId: string | null, handler: WSEventHandler) {
  const setWSConnected = useGlobalStore((state) => state.setWSConnected);

  useEffect(() => {
    if (!datasetId) return;

    if (!wsClient.isConnected()) {
      wsClient.connect();
    }

    wsClient.subscribeToDataset(datasetId, handler);
    setWSConnected(wsClient.isConnected());

    return () => {
      wsClient.unsubscribeFromDataset(datasetId, handler);
    };
  }, [datasetId, handler, setWSConnected]);
}

/**
 * 订阅全局通知
 */
export function useNotificationWebSocket(handler: WSEventHandler) {
  const setWSConnected = useGlobalStore((state) => state.setWSConnected);

  useEffect(() => {
    if (!wsClient.isConnected()) {
      wsClient.connect();
    }

    wsClient.subscribeToNotifications(handler);
    setWSConnected(wsClient.isConnected());

    return () => {
      wsClient.unsubscribeFromNotifications(handler);
    };
  }, [handler, setWSConnected]);
}

/**
 * WebSocket连接管理Hook
 */
export function useWebSocketConnection() {
  const setWSConnected = useGlobalStore((state) => state.setWSConnected);

  useEffect(() => {
    if (!wsClient.isConnected()) {
      wsClient.connect();
    }

    setWSConnected(wsClient.isConnected());

    // 组件卸载时断开连接
    return () => {
      // 注意:不要在这里断开连接,因为其他组件可能还在使用
      // wsClient.disconnect();
    };
  }, [setWSConnected]);

  return {
    isConnected: wsClient.isConnected(),
    connect: () => wsClient.connect(),
    disconnect: () => wsClient.disconnect(),
  };
}
