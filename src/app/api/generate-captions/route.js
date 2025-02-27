import { NextResponse } from 'next/server';


export async function POST(request) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      );
    }

    
    const captions = [
      "When you finally debug that error after 5 hours",
      "That moment when you realize it's only Tuesday",
      
      "Nobody:\nMe at 3am looking for snacks:",
      "Me: I'll just check one notification\nAlso me: *3 hours later*",
      
      "Mondays be like...",
      "Expectation vs. Reality",
      
      "This sparks joy",
      "Tell me you're a programmer without telling me you're a programmer"
    ];
    
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     model: "gpt-4-vision-preview",
    //     messages: [
    //       {
    //         role: "user",
    //         content: [
    //           { type: "text", text: "Generate 5 funny meme captions for this image." },
    //           { type: "image_url", image_url: { url: imageUrl } }
    //         ]
    //       }
    //     ]
    //   })
    // });
    // const data = await response.json();
    // const captions = data.choices[0].message.content.split('\n').filter(line => line.trim());

    return NextResponse.json({ captions });
  } catch (error) {
    console.error('Error generating captions:', error);
    return NextResponse.json(
      { error: 'Failed to generate captions' },
      { status: 500 }
    );
  }
}