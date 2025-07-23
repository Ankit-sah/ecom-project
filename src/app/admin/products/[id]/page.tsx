'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'

const EditProductPage = () => {
  const { id } = useParams()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`/api/products/${id}`)
        const { title, description, price, image } = res.data
        setTitle(title)
        setDescription(description)
        setPrice(price.toString())
        setImage(image)
      } catch (err) {
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !price) {
      setError('All fields are required.')
      return
    }

    try {
      setLoading(true)
      setError('')
      await axios.put(`/api/products/${id}`, {
        title,
        description,
        price: parseFloat(price),
        image
      })
      setSuccess(true)
      setTimeout(() => router.push('/admin/products'), 1000)
    } catch (err) {
      setError('Failed to update product.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>

      {loading && <p className="text-blue-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">Product updated successfully!</p>}

      <form onSubmit={handleUpdate} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 rounded"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border p-2 rounded"
          />
          {image && (
            <Image
              src={image}
              alt="Product Image"
              width={300}
              height={200}
              className="mt-2 rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  )
}

export default EditProductPage
