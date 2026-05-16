import { useEffect } from 'react'

function Toast({ message, type = 'success', onClose }) {

  useEffect(() => {

    const timer = setTimeout(onClose, 3000)

    return () => clearTimeout(timer)

  }, [onClose])


  const bgColor = {

    success: 'bg-green-500',

    error: 'bg-red-500',

    info: 'bg-blue-500',

  }[type]


  return (

    <div
      className={`fixed bottom-8 right-8 ${bgColor} text-white px-8 py-4 rounded-lg shadow-lg font-semibold animate-pulse`}
    >

      {message}

    </div>
  )
}

export default Toast
