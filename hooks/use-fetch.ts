"use client";
import { useState } from "react"
import { toast } from "sonner"

type UseFetchCallback<T, Args extends unknown[] = unknown[]> = (
  ...args: Args
) => Promise<T>

const useFetch = <T = unknown, Args extends unknown[] = unknown[]>(
  cb: UseFetchCallback<T, Args>
) => {
  const [data, setData] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const fn = async (...args: Args): Promise<T | undefined> => {
    setLoading(true)
    setError(null)

    try {
      const response = await cb(...args)
      setData(response)
      setError(null)
      return response
    } catch (error) {
      setError(error)
      toast.error("An error occurred while fetching data.")
      return undefined
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, fn, setData }
}

export default useFetch;
