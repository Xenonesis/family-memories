'use client'

import React from 'react'
import { Button } from './button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Log network-related errors specifically
    if (error.message?.includes('fetch failed') || 
        error.message?.includes('SocketError') ||
        error.message?.includes('other side closed')) {
      console.error('🚨 Network connectivity issue detected. Please check:')
      console.error('1. Internet connection')
      console.error('2. Supabase service status')
      console.error('3. Environment variables')
    }
    
    this.setState({
      error,
      errorInfo
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Something went wrong</CardTitle>
              <CardDescription>
                {this.state.error?.message?.includes('fetch failed') || 
                 this.state.error?.message?.includes('SocketError') ? (
                  <>
                    We're having trouble connecting to our services. This might be due to:
                    <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                      <li>Network connectivity issues</li>
                      <li>Temporary service outage</li>
                      <li>Configuration problems</li>
                    </ul>
                  </>
                ) : (
                  'An unexpected error occurred. Please try again.'
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && (
                <details className="text-xs text-gray-600">
                  <summary className="cursor-pointer">Error details</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}
              <div className="flex gap-2">
                <Button onClick={this.handleRetry} className="flex-1">
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()} 
                  className="flex-1"
                >
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for functional components
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, errorInfo?: string) => {
    console.error('Error caught by useErrorHandler:', error)
    
    // Check if it's a network error
    if (error.message?.includes('fetch failed') || 
        error.message?.includes('SocketError') ||
        error.message?.includes('other side closed')) {
      
      // Show user-friendly message for network errors
      alert('Connection issue detected. Please check your internet connection and try again.')
      return
    }
    
    // For other errors, you might want to show a different message
    console.error('Unexpected error:', error)
  }, [])

  return { handleError }
}