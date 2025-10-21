'use client'
import { Button } from '@/components/ui/button';
import { FormFeedback } from '@/components/ui/formFeedBack';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from '@/components/ui/textarea';
import ApiFunction from '@/lib/api/apiFuntions';
import { handleError } from "@/lib/api/errorHandler";
import { uploadFile } from "@/lib/api/uploadFile";
import { yupResolver } from "@hookform/resolvers/yup";
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import toast from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object().shape({
  container1: yup.object().shape({
    image: yup.mixed().required("Image is required"),
    description: yup.string().required("Description is required"),
    _id: yup.string().optional(),
  }),
  container2: yup.object().shape({
    image: yup.mixed().required("Image is required"),
    description: yup.string().required("Description is required"),
    _id: yup.string().optional(),
  }),
  container3: yup.object().shape({
    image: yup.mixed().required("Image is required"),
    description: yup.string().required("Description is required"),
    _id: yup.string().optional(),
  }),
});

export function HomeSectioForm() {
  const { get, put, post } = ApiFunction()
  const [isLoading, setIsLoading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState({
    container1: false,
    container2: false,
    container3: false
  });
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      container1: { image: null, description: '', _id: null },
      container2: { image: null, description: '', _id: null },
      container3: { image: null, description: '', _id: null },
    }
  });
  const handleCKEditor = (event, editor, value) => {
    const data = editor.getData()
    setValue(value, data)
  }
  const container1 = watch('container1');
  const container2 = watch('container2');
  const container3 = watch('container3');

  const handleGet = async () => {
    setIsLoading(true)
    await get(`content/all`)
      .then((result) => {
        if (result && result.data) {
          if (result.data.length >= 3) {
            setValue('container1', {
              image: result.data[0]?.image || null,
              description: result.data[0]?.description || '',
              _id: result.data[0]?._id || ''
            });
            setValue('container2', {
              image: result.data[1]?.image || null,
              description: result.data[1]?.description || '',
              _id: result.data[1]?._id || ''
            });
            setValue('container3', {
              image: result.data[2]?.image || null,
              description: result.data[2]?.description || '',
              _id: result.data[2]?._id || ''
            });
          }
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setIsLoading(false)
      })
  }

  const handleUpload = async (e, containerName) => {
    const file = e.target.files[0]
    if (!file) return;

    setIsFileUploading(prev => ({
      ...prev,
      [containerName]: true
    }));

    await uploadFile(file, true)
      .then((result) => {
        setValue(`${containerName}.image`, result?.image)
      }).catch((err) => {
        handleError(err)
      }).finally(() => {
        e.target.value = ''
        setIsFileUploading(prev => ({
          ...prev,
          [containerName]: false
        }));
      })
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    const submitData = {
      generalContent: [
        { ...data.container1, },
        { ...data.container2, },
        { ...data.container3, },
      ]
    };

    await post(`content`, submitData)
      .then((result) => {
        if (result?.success) {
          toast.success(result?.message || 'Containers saved successfully')
          handleGet();
        }
      }).catch((err) => {
        handleError(err)
      }).finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    handleGet()
  }, []);

  const containers = [
    {
      name: 'container1',
      title: 'Container 1',
      data: container1
    },
    {
      name: 'container2',
      title: 'Container 2',
      data: container2
    },
    {
      name: 'container3',
      title: 'Container 3',
      data: container3
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between w-full flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Category Containers Management</h1>
          <p className="text-gray-600">Manage 3 category containers with images and descriptions</p>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="w-full md:w-auto" variant="primary">
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Containers
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6">
          {containers.map((container, index) => (
            <div key={container.name} className="bg-white rounded-lg border p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-start border-b pb-2">
                {container.title}
              </h3>

              <div className="space-y-4">
                <div>
                  <Label className="block">Image</Label>
                  <Input
                    disabled={isFileUploading[container.name]}
                    onChange={(e) => handleUpload(e, container.name)}
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                  />
                </div>

                {isFileUploading[container.name] ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : (
                  container.data?.image && (
                    <div className="mt-4">
                      <img
                        src={container.data.image}
                        alt={`${container.title} preview`}
                        className="w-full h-48 object-contain rounded-lg border"
                      />
                    </div>
                  )
                )}

                {/* Description Section */}

                <div>
                  <Label className="block">Description</Label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={container?.data?.description || ''}
                    config={{
                      toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'mediaEmbed', '|', 'undo', 'redo']
                    }}
                    onChange={(event, editor) => handleCKEditor(event, editor, `container${index + 1}.description`)}
                  />

                  {errors[container.name]?.description && (
                    <FormFeedback>
                      {errors[container.name].description.message}
                    </FormFeedback>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}