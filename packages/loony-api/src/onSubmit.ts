import {
  AuthContextProps,
  AuthStatus,
  NotificationContextProps,
  NotificationState,
} from 'loony-types'
import { axiosInstance, handleError } from './index'
import { NavigateFunction } from 'react-router-dom'

export const onLogin = async ({
  formData,
  setFormError,
  authContext,
  notificationContext,
  navigate,
}: {
  formData: { username: string; password: string }
  setFormError: React.Dispatch<React.SetStateAction<string>>
  authContext: AuthContextProps
  notificationContext: NotificationContextProps
  navigate: NavigateFunction
}) => {
  if (!formData.username) {
    setFormError('email is required.')
    return
  }
  if (!formData.password) {
    setFormError('Password is required.')
    return
  }

  axiosInstance
    .post('/auth/login', {
      email: formData.username,
      password: formData.password,
    })
    .then(({ data }) => {
      authContext.setAuthContext({
        status: AuthStatus.AUTHORIZED,
        user: data,
      })
      navigate('/', {})
    })
    .catch((err) => {
      const __err = handleError(err)
      notificationContext.setNotificationContext(
        (prevState: NotificationState) => ({
          ...prevState,
          alert: {
            title: 'Error',
            content: __err,
            status: '',
          },
        })
      )
    })
}

export const onSignup = async ({
  formData,
  setState,
  notificationContext,
  navigate,
}: {
  formData: { fname: string; lname: string; username: string; password: string }
  setState: React.Dispatch<
    React.SetStateAction<{
      viewPassword: boolean
      formError: string
      state: number
    }>
  >
  notificationContext: NotificationContextProps
  navigate: NavigateFunction
}) => {
  if (!formData.fname) {
    setState((prevState) => ({
      ...prevState,
      formError: 'Please enter your first name.',
    }))
    return
  }
  if (!formData.username) {
    setState((prevState) => ({
      ...prevState,
      formError: 'Phone number is required.',
    }))
    return
  }
  if (!formData.password) {
    setState((prevState) => ({
      ...prevState,
      formError: 'Please enter password.',
    }))
    return
  }

  axiosInstance
    .post('/auth/signup', {
      fname: formData.fname,
      lname: formData.lname,
      email: formData.username,
      password: formData.password,
    })
    .then(() => {
      navigate('/login', {})
    })
    .catch((err) => {
      const __err = handleError(err)
      notificationContext.setNotificationContext(
        (prevState: NotificationState) => ({
          ...prevState,
          alert: {
            title: 'Error',
            content: __err,
            status: '',
          },
        })
      )
    })
}
