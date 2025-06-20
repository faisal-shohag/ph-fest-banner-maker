import { Button } from '@/components/ui/button.tsx'
import { useMutation } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router'
import { toast } from 'sonner' // or your preferred toast library
import api from "@/lib/api.ts"
import { use } from 'react'
import { AuthContext } from '@/contexts-providers/auth-context'
import { newCanvas } from '@/lib/constants'
import { FaWandMagicSparkles } from "react-icons/fa6";


// Define the template creation payload type
interface CreateTemplatePayload {
  title: string
  description?: string
  photoURL?: string
  canvas: object
  isPublic?: boolean
  tags?: string[]
  categoryId?: number
  userId: number
}

// Define the response type from the API
interface TemplateResponse {
  id: number
  title: string
  description?: string
  photoURL: string
  canvas: object
  isPublic: boolean
  tags: string[]
  categoryId?: number
  userId: number
  createdAt: string
  user: {
    id: number
    username: string
    displayName: string
    photoURL?: string
  }
  category?: {
    id: number
    name: string
    description?: string
  }
}



const CreateNewCanvas = () => {
  const navigate = useNavigate()
  const { user } = use(AuthContext) as any

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: CreateTemplatePayload): Promise<TemplateResponse> => {
      const response = await api.post('/template', templateData)
      return response.data
    },
    onSuccess: (data: TemplateResponse) => {
      toast.success('Canvas created successfully!')
      // Navigate to editor with the new template ID
      navigate(`/editor/${data.id}`)
    },
    onError: (error: any) => {
      console.error('Error creating template:', error)
      toast.error(error.response?.data?.message || 'Failed to create canvas')
    }
  })

  const handleCreateCanvas = async () => {
    
    if(!user) {
      return <Navigate state={{ from: location.pathname }} to="/auth/login" />
    }
    const userId = user.id 
    
    const newTemplateData: CreateTemplatePayload = {
      title: 'Untitled Canvas',
      description: 'A new canvas project',
      canvas: newCanvas,
      isPublic: false,
      photoURL: 'https://ik.imagekit.io/anf/Others/new-canvas',
      userId: userId
    }

    createTemplateMutation.mutate(newTemplateData)
  }

  return (
    <div>
      <Button
      className='custom-glass dark:text-white mt-10 py-5 px-10 cursor-pointer' 
        onClick={handleCreateCanvas}
        disabled={createTemplateMutation.isPending}
      >
        <FaWandMagicSparkles />
        {createTemplateMutation.isPending ? 'Creating...' : 'Create New Canvas'}
      </Button>
    </div>
  )
}

export default CreateNewCanvas