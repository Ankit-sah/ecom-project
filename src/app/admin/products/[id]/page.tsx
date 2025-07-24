'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@headlessui/react'
import { ArrowPathIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Image from 'next/image'
import * as yup from 'yup'

// Validation schema
const productSchema = yup.object().shape({
  title: yup.string().required('Title is required').max(100, 'Title must be at most 100 characters'),
  description: yup.string().required('Description is required').max(500, 'Description must be at most 500 characters'),
  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be positive')
    .typeError('Price must be a number'),
  image: yup.string().required('Image URL is required').url('Must be a valid URL')
})

const EditProductPage = () => {
  const { id } = useParams()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: '',
    inStock: true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/products/${id}`)
        if (!response.ok) throw new Error('Failed to fetch product')
        
        const product = await response.json()
        setFormData({
          title: product.title,
          description: product.description,
          price: product.price.toString(),
          image: product.image,
          category: product.category || '',
          inStock: product.inStock
        })
      } catch (error) {
        toast.error('Failed to load product')
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = async () => {
    try {
      await productSchema.validate(formData, { abortEarly: false })
      setErrors({})
      return true
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors = err.inner.reduce((acc, current) => {
          return { ...acc, [current.path as string]: current.message }
        }, {})
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const isValid = await validateForm()
    if (!isValid) {
      setIsSubmitting(false)
      toast.error('Please fix the form errors')
      return
    }

    const toastId = toast.loading('Updating product...')

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      toast.success('Product updated successfully!', { id: toastId })
      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <Button
          as="a"
          href="/admin/products"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Back to Products
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="space-y-4">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={`w-full border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className={`w-full border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price Field */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="text"
                  id="price"
                  name="price"
                  className={`block w-full pl-7 pr-12 border ${errors.price ? 'border-red-300' : 'border-gray-300'} rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            {/* Category Field */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Image URL Field */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL *
            </label>
            <input
              type="url"
              id="image"
              name="image"
              className={`w-full border ${errors.image ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={formData.image}
              onChange={handleChange}
            />
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            {formData.image && (
              <div className="mt-2">
                <Image
                  src={formData.image}
                  alt="Product preview"
                  width={300}
                  height={200}
                  className="rounded-md border"
                />
              </div>
            )}
          </div>

          {/* In Stock Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="inStock"
              name="inStock"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={formData.inStock}
              onChange={handleChange}
            />
            <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
              This product is in stock
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            as="a"
            href="/admin/products"
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <XMarkIcon className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Update Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditProductPage