/**
 * WebSocket client for real-time updates
 */

import { io, Socket } from 'socket.io-client';
import { WSMessage } from '@/types';

export type WSEventHandler<T = any> = (data: T) => void;

class WebSocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  connect() {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
    const token = localStorage.getItem('auth_token');

    this.socket = io(wsUrl, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.socket?.close();
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('WebSocket reconnected after', attemptNumber, 'attempts');
    });
  }

  // Subscribe to specific event
  on<T = any>(event: string, handler: WSEventHandler<T>) {
    if (!this.socket) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.on(event, handler);
  }

  // Unsubscribe from event
  off(event: string, handler?: WSEventHandler) {
    if (!this.socket) return;

    if (handler) {
      this.socket.off(event, handler);
    } else {
      this.socket.off(event);
    }
  }

  // Emit event to server
  emit(event: string, data?: any) {
    if (!this.socket) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.emit(event, data);
  }

  // Subscribe to experiment updates
  subscribeToExperiment(experimentId: string, handler: WSEventHandler<WSMessage>) {
    this.emit('subscribe', { type: 'experiment', id: experimentId });
    this.on(`experiment:${experimentId}`, handler);
  }

  // Unsubscribe from experiment updates
  unsubscribeFromExperiment(experimentId: string, handler?: WSEventHandler) {
    this.emit('unsubscribe', { type: 'experiment', id: experimentId });
    this.off(`experiment:${experimentId}`, handler);
  }

  // Subscribe to dataset updates
  subscribeToDataset(datasetId: string, handler: WSEventHandler<WSMessage>) {
    this.emit('subscribe', { type: 'dataset', id: datasetId });
    this.on(`dataset:${datasetId}`, handler);
  }

  // Unsubscribe from dataset updates
  unsubscribeFromDataset(datasetId: string, handler?: WSEventHandler) {
    this.emit('unsubscribe', { type: 'dataset', id: datasetId });
    this.off(`dataset:${datasetId}`, handler);
  }

  // Subscribe to global notifications
  subscribeToNotifications(handler: WSEventHandler<WSMessage>) {
    this.emit('subscribe', { type: 'notifications' });
    this.on('notification', handler);
  }

  // Unsubscribe from global notifications
  unsubscribeFromNotifications(handler?: WSEventHandler) {
    this.emit('unsubscribe', { type: 'notifications' });
    this.off('notification', handler);
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsClient = new WebSocketClient();
export default wsClient;
