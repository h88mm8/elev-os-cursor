import './LoadingSpinner.css'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  fullScreen?: boolean
  message?: string
}

export function LoadingSpinner({
  size = 'medium',
  fullScreen = false,
  message,
}: LoadingSpinnerProps) {
  const className = `loading-spinner spinner-${size} ${
    fullScreen ? 'fullscreen' : ''
  }`

  return (
    <div className={className}>
      <div className="spinner"></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  )
}

