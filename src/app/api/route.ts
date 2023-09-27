import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";


const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

export async function POST(req: NextRequest, res: NextResponse) {
  const request = await req.json()
  const theBase64 = request.theBase64




  if (REPLICATE_API_TOKEN) {
    const replicate = new Replicate({ 
      auth: REPLICATE_API_TOKEN,
    });
    
    const response = await replicate.run(
      "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
      {
        input: {
          img: theBase64,
        },
      }
    );


    return NextResponse.json({ body:response});


  }

}
