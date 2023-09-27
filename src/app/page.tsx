"use client"

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Home() {
  const [theFile, setTheFile] = useState<File | undefined>();
  const [uploadedPreview, setUploadedPreview] = useState<string | undefined>()
  const [apiResponse, setApiResponse] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [theBase64, setTheBase64] = useState<string | undefined>()

  useEffect(() => {
    async function converter(){
      setApiResponse("")
      if (theFile){
      const base64 = await toBase64(theFile)
      setTheBase64(base64)
      }
    }
    if (theFile) {
      const blobUrl = URL.createObjectURL(theFile);
      setUploadedPreview(blobUrl);
      converter()
    }


  }, [theFile]);



  const toBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
  
      fileReader.readAsDataURL(file);
  
      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };
  
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const restoreFace = async () => {

    setIsLoading(true);
    if (!theFile) {
      setIsLoading(false);
      return;
    }
    // const formData = new FormData();
    // formData.set("theImage", theFile);
    
    try {
      const response = await fetch("/api", {
        method: "POST",
        body: JSON.stringify({theBase64:theBase64}),
      });

      if (response.ok) {
        
        console.log("File uploaded successfully");
        const theResponse = await response.json();
        setApiResponse(theResponse.body);
        setIsLoading(false);
      } else {
        console.error("Failed to upload file");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error occurred during API call:", error);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-900 flex-col items-center justify-between px-24 py-12">
      <h1 className=" text-5xl mb-4">Reface</h1>

      <input
        type="file"
        className="border p-2 rounded-sm border-gray-600"
        onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setTheFile(event.currentTarget.files?.[0])}
        accept=".jpg, .jpeg, .png"
      />
      <div>
        {uploadedPreview && (
          <div className='flex gap-12  text-center'>
          
          <div className='w-80'>
          Uploaded:
          <img src={uploadedPreview} className=" object-contain" />
          </div>
          {apiResponse?(          <div className=' w-80'>
          Restored:  
          <img src={apiResponse} className=" object-contain" />
          </div>
          ):""}
        </div>
        )}

      </div>
      {theFile ? (
        <button
          className="bg-blue-600 px-5 py-1 rounded-sm disabled:cursor-not-allowed disabled:bg-blue-900 transition-colors"
          onClick={restoreFace}
          disabled={isLoading}
        >
          {isLoading ? "loading..." : "Go!"}
          
        </button>
      ) : (
        ""
      )}
      
        <div className="mt-12 ">
          
        </div>
      
    </main>
   )
}
