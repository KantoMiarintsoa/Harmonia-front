"use client"

import { useState, useRef, useCallback } from "react"

interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "primary"
}

interface ConfirmState extends ConfirmOptions {
  open: boolean
}

export function useConfirm() {
  const [state, setState] = useState<ConfirmState>({ open: false, title: "" })
  const resolveRef = useRef<(value: boolean) => void>()

  const ask = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      resolveRef.current = resolve
      setState({ ...options, open: true })
    })
  }, [])

  const handleConfirm = useCallback(() => {
    setState(s => ({ ...s, open: false }))
    resolveRef.current?.(true)
  }, [])

  const handleCancel = useCallback(() => {
    setState(s => ({ ...s, open: false }))
    resolveRef.current?.(false)
  }, [])

  return { ask, confirmState: state, handleConfirm, handleCancel }
}
