import React, { createContext, useContext, useState, useEffect } from 'react';
import { FiX, FiBell, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (notification) => {
        const id = Date.now();
        const newNotification = {
            id,
            ...notification,
            timestamp: new Date(),
        };

        setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Máximo 50 notificaciones

        // Auto-remove después de 10 segundos si es tipo toast
        if (notification.autoClose !== false) {
            setTimeout(() => {
                removeNotification(id);
            }, 10000);
        }
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    // Simular notificaciones push periódicas
    useEffect(() => {
        const interval = setInterval(() => {
            const tiposNotificaciones = [
                {
                    type: 'info',
                    title: 'Nuevo acceso registrado',
                    message: 'Entrada autorizada en puerta principal',
                },
                {
                    type: 'warning',
                    title: 'Recordatorio de pago',
                    message: 'Tu cuota mensual vence en 3 días',
                },
                {
                    type: 'success',
                    title: 'Pago recibido',
                    message: 'Se ha confirmado tu pago de $150.00',
                },
                {
                    type: 'error',
                    title: 'Incidente detectado',
                    message: 'Vehículo no autorizado detectado en zona de parqueo',
                },
            ];

            const random = tiposNotificaciones[Math.floor(Math.random() * tiposNotificaciones.length)];

            // Solo agregar si hay menos de 10 notificaciones
            if (notifications.length < 10) {
                addNotification(random);
            }
        }, 30000); // Cada 30 segundos

        return () => clearInterval(interval);
    }, [notifications.length]);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
            {children}
            <NotificationToast />
        </NotificationContext.Provider>
    );
};

const NotificationToast = () => {
    const { notifications, removeNotification } = useNotifications();

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <FiCheckCircle className="text-green-600" size={20} />;
            case 'error':
                return <FiAlertCircle className="text-red-600" size={20} />;
            case 'warning':
                return <FiAlertCircle className="text-yellow-600" size={20} />;
            default:
                return <FiInfo className="text-blue-600" size={20} />;
        }
    };

    const getStyles = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {notifications.slice(0, 5).map((notification) => (
                <div
                    key={notification.id}
                    className={`${getStyles(notification.type)} border rounded-lg shadow-lg p-4 animate-slide-in-right`}
                >
                    <div className="flex items-start gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">{notification.title}</p>
                            <p className="text-gray-700 text-xs mt-1">{notification.message}</p>
                            <p className="text-gray-500 text-xs mt-2">
                                {notification.timestamp.toLocaleTimeString()}
                            </p>
                        </div>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <FiX size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
