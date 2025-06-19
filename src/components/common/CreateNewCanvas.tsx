import { Button } from '@/components/ui/button.tsx'
import { useMutation } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router'
import { toast } from 'sonner' // or your preferred toast library
import api from "@/lib/api.ts"
import { use } from 'react'
import { AuthContext } from '@/contexts-providers/auth-context'

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

const newCnavs = {
    "version": "6.7.0",
    "objects": [
        {
            "fontSize": 20,
            "fontWeight": "normal",
            "fontFamily": "\"Inter\", sans-serif",
            "fontStyle": "normal",
            "lineHeight": 1.16,
            "text": "New Canvas",
            "charSpacing": 0,
            "textAlign": "center",
            "styles": [
                {
                    "start": 0,
                    "end": 10,
                    "style": {
                        "fill": "#080808",
                        "fontFamily": "\"Lexend\", sans-serif"
                    }
                }
            ],
            "pathStartOffset": 0,
            "pathSide": "left",
            "pathAlign": "baseline",
            "underline": false,
            "overline": false,
            "linethrough": false,
            "textBackgroundColor": "",
            "direction": "ltr",
            "textDecorationThickness": 66.667,
            "minWidth": 20,
            "splitByGrapheme": false,
            "type": "Textbox",
            "version": "6.7.0",
            "originX": "center",
            "originY": "center",
            "left": 416.8274,
            "top": 278.0226,
            "width": 159.0026,
            "height": 22.6,
            "fill": "#eeee",
            "stroke": null,
            "strokeWidth": 1,
            "strokeDashArray": null,
            "strokeLineCap": "butt",
            "strokeDashOffset": 0,
            "strokeLineJoin": "miter",
            "strokeUniform": false,
            "strokeMiterLimit": 4,
            "scaleX": 3.629,
            "scaleY": 3.629,
            "angle": 0,
            "flipX": false,
            "flipY": false,
            "opacity": 1,
            "shadow": null,
            "visible": true,
            "backgroundColor": "",
            "fillRule": "nonzero",
            "paintFirst": "fill",
            "globalCompositeOperation": "source-over",
            "skewX": 0,
            "skewY": 0
        }
    ],
    "background": "#f4f5f7"
}

const CreateNewCanvas = () => {
  const navigate = useNavigate()
  const { user } = use(AuthContext) as any

  console.log(user)

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
      canvas: newCnavs,
      isPublic: false,
      userId: userId
    }

    createTemplateMutation.mutate(newTemplateData)
  }

  return (
    <div>
      <Button 
        onClick={handleCreateCanvas}
        disabled={createTemplateMutation.isPending}
      >
        {createTemplateMutation.isPending ? 'Creating...' : 'Create New Canvas'}
      </Button>
    </div>
  )
}

export default CreateNewCanvas