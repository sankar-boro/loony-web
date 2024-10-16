import { createContext, useState, ReactNode } from 'react'
import { NotificationContextProps, NotificationState } from 'loony-types'

const NotificationContext = createContext<NotificationContextProps>({
  alert: null,
  setNotificationContext: () => {
    return
  },
})

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, setNotificationContext] = useState<NotificationState>({
    alert: null,
  })

  return (
    <NotificationContext.Provider value={{ ...state, setNotificationContext }}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
